import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.join(__dirname, 'DB', 'invoice_automation.db');

const db = new Database(dbPath);

// Helper function to generate sequential unique IDs
function generateSequentialId(entityType, parentId = null) {
  // Map entity types to short prefixes
  const prefixMap = {
    'vertical': 'V',
    'asset-class': 'AC',
    'asset-type': 'AT',
    'asset': 'A',
    'service-group': 'SG',
    'service': 'S',
    'cost-group': 'CG',
    'budget-line': 'BL',
    'cost-element': 'CE',
  };
  
  const prefix = prefixMap[entityType] || entityType.substring(0, 2).toUpperCase();
  
  let countStmt;
  if (parentId) {
    const parentFieldMap = {
      'asset-type': 'asset_class_id',
      'asset': 'asset_type_id',
      'service': 'service_group_id',
      'service-group': 'vertical_id',
      'cost-group': 'vertical_id',
      'budget-line': 'cost_group_id',
      'cost-element': 'budget_line_id',
    };
    const parentField = parentFieldMap[entityType];
    if (parentField) {
      const tableMap = {
        'asset-type': 'asset_type',
        'asset': 'assets',
        'service': 'services',
        'service-group': 'service_groups',
        'cost-group': 'cost_groups',
        'budget-line': 'budget_lines',
        'cost-element': 'cost_elements',
      };
      const table = tableMap[entityType];
      if (table) {
        countStmt = db.prepare(`SELECT COUNT(*) as count FROM ${table} WHERE ${parentField} = ?`);
        const result = countStmt.get(parentId);
        const count = (result?.count || 0) + 1;
        return `${prefix}${String(count).padStart(4, '0')}`;
      }
    }
  }
  
  const tableMap = {
    'vertical': 'verticals',
    'asset-class': 'asset_class',
    'asset-type': 'asset_type',
    'asset': 'assets',
    'service-group': 'service_groups',
    'service': 'services',
    'cost-group': 'cost_groups',
    'budget-line': 'budget_lines',
    'cost-element': 'cost_elements',
  };
  const table = tableMap[entityType];
  if (table) {
    countStmt = db.prepare(`SELECT COUNT(*) as count FROM ${table}`);
    const result = countStmt.get();
    const count = (result?.count || 0) + 1;
    return `${prefix}${String(count).padStart(4, '0')}`;
  }
  
  return null;
}

console.log('Starting ID reassignment...\n');

try {
  // 1. Reassign Vertical IDs
  console.log('Reassigning Vertical IDs...');
  const verticals = db.prepare('SELECT * FROM verticals ORDER BY created_at ASC').all();
  let verticalCounter = 1;
  const verticalIdMap = new Map();
  
  for (const vertical of verticals) {
    const newId = `V${String(verticalCounter).padStart(4, '0')}`;
    verticalIdMap.set(vertical.id, newId);
    db.prepare('UPDATE verticals SET vertical_id = ? WHERE id = ?').run(newId, vertical.id);
    verticalCounter++;
  }
  console.log(`  ✓ Updated ${verticals.length} verticals\n`);

  // 2. Reassign Asset Class IDs
  console.log('Reassigning Asset Class IDs...');
  const assetClasses = db.prepare('SELECT * FROM asset_class ORDER BY created_at ASC').all();
  let assetClassCounter = 1;
  
  for (const assetClass of assetClasses) {
    const newId = `AC${String(assetClassCounter).padStart(4, '0')}`;
    db.prepare('UPDATE asset_class SET class_id = ? WHERE id = ?').run(newId, assetClass.id);
    assetClassCounter++;
  }
  console.log(`  ✓ Updated ${assetClasses.length} asset classes\n`);

  // 3. Reassign Asset Type IDs (grouped by asset class)
  console.log('Reassigning Asset Type IDs...');
  const assetTypes = db.prepare('SELECT * FROM asset_type ORDER BY asset_class_id, created_at ASC').all();
  const assetTypeCounters = new Map();
  let assetTypeTotal = 0;
  
  for (const assetType of assetTypes) {
    if (!assetTypeCounters.has(assetType.asset_class_id)) {
      assetTypeCounters.set(assetType.asset_class_id, 1);
    }
    const counter = assetTypeCounters.get(assetType.asset_class_id);
    const newId = `AT${String(counter).padStart(4, '0')}`;
    db.prepare('UPDATE asset_type SET type_id = ? WHERE id = ?').run(newId, assetType.id);
    assetTypeCounters.set(assetType.asset_class_id, counter + 1);
    assetTypeTotal++;
  }
  console.log(`  ✓ Updated ${assetTypeTotal} asset types\n`);

  // 4. Reassign Asset Codes (grouped by entity_id and asset_type_id to respect unique constraint)
  console.log('Reassigning Asset Codes...');
  const assets = db.prepare('SELECT * FROM assets ORDER BY entity_id, asset_type_id, created_at ASC').all();
  const assetCounters = new Map();
  let assetTotal = 0;
  
  for (const asset of assets) {
    // Create a unique key combining entity_id and asset_type_id to ensure uniqueness per entity
    const entityId = asset.entity_id || 'hsbc';
    const counterKey = `${entityId}_${asset.asset_type_id}`;
    
    if (!assetCounters.has(counterKey)) {
      assetCounters.set(counterKey, 1);
    }
    
    const counter = assetCounters.get(counterKey);
    let newId = `A${String(counter).padStart(4, '0')}`;
    
    // Check if this asset_code already exists for this entity_id (to handle edge cases)
    const checkStmt = db.prepare('SELECT COUNT(*) as count FROM assets WHERE entity_id = ? AND asset_code = ? AND id != ?');
    let exists = checkStmt.get(entityId, newId, asset.id);
    
    // If it exists, find the next available number for this entity_id
    let attempt = counter;
    while (exists && exists.count > 0) {
      attempt++;
      newId = `A${String(attempt).padStart(4, '0')}`;
      exists = checkStmt.get(entityId, newId, asset.id);
    }
    
    // Update the counter to the value we used
    assetCounters.set(counterKey, attempt + 1);
    
    db.prepare('UPDATE assets SET asset_code = ? WHERE id = ?').run(newId, asset.id);
    assetTotal++;
  }
  console.log(`  ✓ Updated ${assetTotal} assets\n`);

  // 5. Reassign Service Group IDs (grouped by vertical)
  console.log('Reassigning Service Group IDs...');
  const serviceGroups = db.prepare('SELECT * FROM service_groups ORDER BY vertical_id, created_at ASC').all();
  const serviceGroupCounters = new Map();
  let serviceGroupTotal = 0;
  
  for (const serviceGroup of serviceGroups) {
    if (!serviceGroupCounters.has(serviceGroup.vertical_id)) {
      serviceGroupCounters.set(serviceGroup.vertical_id, 1);
    }
    const counter = serviceGroupCounters.get(serviceGroup.vertical_id);
    const newId = `SG${String(counter).padStart(4, '0')}`;
    db.prepare('UPDATE service_groups SET group_id = ? WHERE id = ?').run(newId, serviceGroup.id);
    serviceGroupCounters.set(serviceGroup.vertical_id, counter + 1);
    serviceGroupTotal++;
  }
  console.log(`  ✓ Updated ${serviceGroupTotal} service groups\n`);

  // 6. Reassign Service IDs (grouped by service group)
  console.log('Reassigning Service IDs...');
  const services = db.prepare('SELECT * FROM services ORDER BY service_group_id, created_at ASC').all();
  const serviceCounters = new Map();
  let serviceTotal = 0;
  
  for (const service of services) {
    if (!serviceCounters.has(service.service_group_id)) {
      serviceCounters.set(service.service_group_id, 1);
    }
    const counter = serviceCounters.get(service.service_group_id);
    const newId = `S${String(counter).padStart(4, '0')}`;
    db.prepare('UPDATE services SET service_id = ? WHERE id = ?').run(newId, service.id);
    serviceCounters.set(service.service_group_id, counter + 1);
    serviceTotal++;
  }
  console.log(`  ✓ Updated ${serviceTotal} services\n`);

  // 7. Reassign Cost Group IDs (grouped by vertical)
  console.log('Reassigning Cost Group IDs...');
  const costGroups = db.prepare('SELECT * FROM cost_groups ORDER BY vertical_id, created_at ASC').all();
  const costGroupCounters = new Map();
  let costGroupTotal = 0;
  
  for (const costGroup of costGroups) {
    if (!costGroupCounters.has(costGroup.vertical_id)) {
      costGroupCounters.set(costGroup.vertical_id, 1);
    }
    const counter = costGroupCounters.get(costGroup.vertical_id);
    const newId = `CG${String(counter).padStart(4, '0')}`;
    db.prepare('UPDATE cost_groups SET cost_group_id = ? WHERE id = ?').run(newId, costGroup.id);
    costGroupCounters.set(costGroup.vertical_id, counter + 1);
    costGroupTotal++;
  }
  console.log(`  ✓ Updated ${costGroupTotal} cost groups\n`);

  // 8. Reassign Budget Line IDs (grouped by cost group)
  console.log('Reassigning Budget Line IDs...');
  const budgetLines = db.prepare('SELECT * FROM budget_lines ORDER BY cost_group_id, created_at ASC').all();
  const budgetLineCounters = new Map();
  let budgetLineTotal = 0;
  
  for (const budgetLine of budgetLines) {
    if (!budgetLineCounters.has(budgetLine.cost_group_id)) {
      budgetLineCounters.set(budgetLine.cost_group_id, 1);
    }
    const counter = budgetLineCounters.get(budgetLine.cost_group_id);
    const newId = `BL${String(counter).padStart(4, '0')}`;
    db.prepare('UPDATE budget_lines SET budget_line_id = ? WHERE id = ?').run(newId, budgetLine.id);
    budgetLineCounters.set(budgetLine.cost_group_id, counter + 1);
    budgetLineTotal++;
  }
  console.log(`  ✓ Updated ${budgetLineTotal} budget lines\n`);

  // 9. Reassign Cost Element IDs (grouped by budget line)
  console.log('Reassigning Cost Element IDs...');
  const costElements = db.prepare('SELECT * FROM cost_elements ORDER BY budget_line_id, created_at ASC').all();
  const costElementCounters = new Map();
  let costElementTotal = 0;
  
  for (const costElement of costElements) {
    if (!costElementCounters.has(costElement.budget_line_id)) {
      costElementCounters.set(costElement.budget_line_id, 1);
    }
    const counter = costElementCounters.get(costElement.budget_line_id);
    const newId = `CE${String(counter).padStart(4, '0')}`;
    db.prepare('UPDATE cost_elements SET cost_element_id = ? WHERE id = ?').run(newId, costElement.id);
    costElementCounters.set(costElement.budget_line_id, counter + 1);
    costElementTotal++;
  }
  console.log(`  ✓ Updated ${costElementTotal} cost elements\n`);

  console.log('✅ ID reassignment completed successfully!');
  console.log('\nSummary:');
  console.log(`  - Verticals: ${verticals.length}`);
  console.log(`  - Asset Classes: ${assetClasses.length}`);
  console.log(`  - Asset Types: ${assetTypeTotal}`);
  console.log(`  - Assets: ${assetTotal}`);
  console.log(`  - Service Groups: ${serviceGroupTotal}`);
  console.log(`  - Services: ${serviceTotal}`);
  console.log(`  - Cost Groups: ${costGroupTotal}`);
  console.log(`  - Budget Lines: ${budgetLineTotal}`);
  console.log(`  - Cost Elements: ${costElementTotal}`);
  console.log(`\nTotal entities updated: ${verticals.length + assetClasses.length + assetTypeTotal + assetTotal + serviceGroupTotal + serviceTotal + costGroupTotal + budgetLineTotal + costElementTotal}`);

} catch (error) {
  console.error('❌ Error during ID reassignment:', error);
  process.exit(1);
} finally {
  db.close();
}

