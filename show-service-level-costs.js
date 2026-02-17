import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'DB', 'invoice_automation.db');
const db = new Database(dbPath);

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

// Get current year
const currentYear = new Date().getFullYear();

console.log('='.repeat(80));
console.log(`SERVICE LEVEL COSTS CALCULATION FOR YEAR ${currentYear}`);
console.log('='.repeat(80));
console.log('');

// Get a few sample services (first 5 active services)
const services = db.prepare('SELECT * FROM services WHERE status = ? ORDER BY created_at ASC LIMIT 5').all('active');

if (services.length === 0) {
  console.log('No active services found in the database.');
  db.close();
  process.exit(0);
}

console.log(`Calculating costs for ${services.length} sample services...\n`);

for (const service of services) {
  console.log('─'.repeat(80));
  console.log(`SERVICE: ${service.name} (${service.service_id})`);
  console.log(`UOM: ${service.uom || 'N/A'}`);
  console.log('─'.repeat(80));
  
  let directCosts = 0;
  let depreciation = 0;
  let indirectCosts = 0;
  let commonCosts = 0;
  
  // 1. Direct Costs
  const directCostElements = db.prepare(`
    SELECT * FROM cost_elements 
    WHERE service_id = ? AND cost_type = 'Direct' AND status = 'active'
  `).all(service.id);
  
  console.log(`\n1. DIRECT COSTS:`);
  if (directCostElements.length === 0) {
    console.log('   No direct costs found');
  } else {
    directCostElements.forEach((ce) => {
      const amount = ce.amount || 0;
      directCosts += amount;
      console.log(`   • ${ce.name} (${ce.cost_element_id}): ${formatCurrency(amount)}`);
    });
  }
  console.log(`   Total Direct Costs: ${formatCurrency(directCosts)}`);
  
  // 2. Depreciation
  const assets = db.prepare(`
    SELECT * FROM assets 
    WHERE service_id = ? AND status = 'active'
  `).all(service.id);
  
  console.log(`\n2. DEPRECIATION (Year ${currentYear}):`);
  if (assets.length === 0) {
    console.log('   No assets tagged to this service');
  } else {
    assets.forEach((asset) => {
      if (asset.depreciation_schedule) {
        try {
          const schedule = JSON.parse(asset.depreciation_schedule);
          const yearData = schedule.find((y) => y.year === currentYear);
          if (yearData && yearData.depreciation) {
            depreciation += yearData.depreciation;
            console.log(`   • ${asset.name} (${asset.asset_code}): ${formatCurrency(yearData.depreciation)}`);
          }
        } catch (e) {
          // Skip invalid schedules
        }
      }
    });
  }
  console.log(`   Total Depreciation: ${formatCurrency(depreciation)}`);
  
  // 3. Indirect Costs
  const indirectCostElements = db.prepare(`
    SELECT * FROM cost_elements 
    WHERE cost_type = 'Indirect' AND status = 'active'
  `).all();
  
  console.log(`\n3. INDIRECT COSTS:`);
  let indirectCount = 0;
  indirectCostElements.forEach((ce) => {
    const costRule = db.prepare(`
      SELECT * FROM cost_rules 
      WHERE cost_element_id = ? AND service_id = ? AND status = 'active'
    `).get(ce.id, service.id);
    
    if (costRule && costRule.percentage) {
      const allocatedAmount = (ce.amount || 0) * (costRule.percentage / 100);
      indirectCosts += allocatedAmount;
      indirectCount++;
      console.log(`   • ${ce.name} (${ce.cost_element_id}): ${formatCurrency(ce.amount || 0)} × ${costRule.percentage}% = ${formatCurrency(allocatedAmount)}`);
    }
  });
  if (indirectCount === 0) {
    console.log('   No indirect costs allocated to this service');
  }
  console.log(`   Total Indirect Costs: ${formatCurrency(indirectCosts)}`);
  
  // 4. Common Costs
  const commonCostElements = db.prepare(`
    SELECT * FROM cost_elements 
    WHERE cost_type = 'Common' AND status = 'active'
  `).all();
  
  console.log(`\n4. COMMON COSTS:`);
  let commonCount = 0;
  commonCostElements.forEach((ce) => {
    const costRule = db.prepare(`
      SELECT * FROM cost_rules 
      WHERE cost_element_id = ? AND service_id = ? AND status = 'active'
    `).get(ce.id, service.id);
    
    if (costRule && costRule.percentage) {
      const allocatedAmount = (ce.amount || 0) * (costRule.percentage / 100);
      commonCosts += allocatedAmount;
      commonCount++;
      console.log(`   • ${ce.name} (${ce.cost_element_id}): ${formatCurrency(ce.amount || 0)} × ${costRule.percentage}% = ${formatCurrency(allocatedAmount)}`);
    }
  });
  if (commonCount === 0) {
    console.log('   No common costs allocated to this service');
  }
  console.log(`   Total Common Costs: ${formatCurrency(commonCosts)}`);
  
  // Total Calculation
  const totalCost = directCosts + depreciation + indirectCosts + commonCosts;
  const costPerUnit = service.uom && parseFloat(service.uom) > 0 
    ? totalCost / parseFloat(service.uom) 
    : 0;
  
  console.log('\n' + '═'.repeat(80));
  console.log('SUMMARY:');
  console.log('═'.repeat(80));
  console.log(`Direct Costs:      ${formatCurrency(directCosts)}`);
  console.log(`Depreciation:      ${formatCurrency(depreciation)}`);
  console.log(`Indirect Costs:    ${formatCurrency(indirectCosts)}`);
  console.log(`Common Costs:      ${formatCurrency(commonCosts)}`);
  console.log('─'.repeat(80));
  console.log(`TOTAL COST:        ${formatCurrency(totalCost)}`);
  if (costPerUnit > 0) {
    console.log(`COST PER UNIT:     ${formatCurrency(costPerUnit)} (UOM: ${service.uom})`);
  } else {
    console.log(`COST PER UNIT:     N/A (UOM not set or is 0)`);
  }
  console.log('═'.repeat(80));
  console.log('\n');
}

db.close();
console.log('Calculation complete!');







