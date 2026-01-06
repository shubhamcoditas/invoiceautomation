import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
  let checkStmt;
  
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
        'asset-type': { table: 'asset_type', idField: 'type_id', uniqueField: 'asset_class_id' },
        'asset': { table: 'assets', idField: 'asset_code', uniqueField: 'entity_id' },
        'service': { table: 'services', idField: 'service_id', uniqueField: 'service_group_id' },
        'service-group': { table: 'service_groups', idField: 'group_id', uniqueField: 'vertical_id' },
        'cost-group': { table: 'cost_groups', idField: 'cost_group_id', uniqueField: 'vertical_id' },
        'budget-line': { table: 'budget_lines', idField: 'budget_line_id', uniqueField: 'cost_group_id' },
        'cost-element': { table: 'cost_elements', idField: 'cost_element_id', uniqueField: 'budget_line_id' },
      };
      const config = tableMap[entityType];
      if (config) {
        // For assets, check uniqueness by entity_id + asset_code
        if (entityType === 'asset') {
          countStmt = db.prepare(`SELECT COUNT(*) as count FROM ${config.table} WHERE ${config.uniqueField} = ?`);
          const result = countStmt.get('hsbc');
          let count = (result?.count || 0) + 1;
          let newId = `${prefix}${String(count).padStart(3, '0')}`;
          
          // Check if this ID already exists
          checkStmt = db.prepare(`SELECT COUNT(*) as count FROM ${config.table} WHERE ${config.uniqueField} = ? AND ${config.idField} = ?`);
          while (checkStmt.get('hsbc', newId).count > 0) {
            count++;
            newId = `${prefix}${String(count).padStart(3, '0')}`;
          }
          return newId;
        } else {
          countStmt = db.prepare(`SELECT COUNT(*) as count FROM ${config.table} WHERE ${config.uniqueField} = ?`);
          const result = countStmt.get(parentId);
          const count = (result?.count || 0) + 1;
          return `${prefix}${String(count).padStart(3, '0')}`;
        }
      }
    }
  }
  
  // Handle top-level entities (no parent)
  if (entityType === 'vertical') {
    countStmt = db.prepare(`SELECT COUNT(*) as count FROM verticals`);
    const result = countStmt.get();
    const count = (result?.count || 0) + 1;
    return `V${String(count).padStart(3, '0')}`;
  }
  
  if (entityType === 'asset-class') {
    countStmt = db.prepare(`SELECT COUNT(*) as count FROM asset_class`);
    const result = countStmt.get();
    const count = (result?.count || 0) + 1;
    return `AC${String(count).padStart(3, '0')}`;
  }
  
  // If we get here and parentId is null, something is wrong
  if (!parentId) {
    throw new Error(`Cannot generate ID for ${entityType} without parentId`);
  }
  
  return null;
}

console.log('Starting Cost Model data population...\n');

try {
  // 1. Create Verticals
  console.log('Creating Verticals...');
  const verticalsData = [
    { name: 'Information Technology', description: 'IT department managing technology infrastructure and systems', status: 'active' },
    { name: 'Human Resources', description: 'HR department managing workforce, recruitment, and employee relations', status: 'active' },
    { name: 'Operations', description: 'Operations department managing day-to-day business activities', status: 'active' },
    { name: 'Finance', description: 'Finance department managing financial planning, accounting, and budgeting', status: 'active' },
    { name: 'Marketing', description: 'Marketing department managing brand, campaigns, and customer acquisition', status: 'active' },
  ];

  const verticalIds = [];
  for (const vertical of verticalsData) {
    const id = randomUUID();
    const verticalId = generateSequentialId('vertical');
    db.prepare(`
      INSERT INTO verticals (id, entity_id, vertical_id, name, description, status, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, 'hsbc', verticalId, vertical.name, vertical.description, vertical.status, 'system', 'system');
    verticalIds.push(id);
    console.log(`  ✓ Created vertical: ${vertical.name} (${verticalId})`);
  }
  console.log(`\nCreated ${verticalsData.length} verticals\n`);

  // 2. Create Asset Classes
  console.log('Creating Asset Classes...');
  const assetClassesData = [
    { name: 'Furniture and Fixtures', description: 'Office furniture, desks, chairs, and fixtures', status: 'active' },
    { name: 'Computer Equipment', description: 'Laptops, desktops, servers, and related hardware', status: 'active' },
    { name: 'Vehicles', description: 'Company vehicles for transportation', status: 'active' },
    { name: 'Machinery and Equipment', description: 'Industrial machinery and production equipment', status: 'active' },
    { name: 'Office Equipment', description: 'Printers, scanners, projectors, and other office equipment', status: 'active' },
  ];

  const assetClassIds = [];
  for (const assetClass of assetClassesData) {
    const id = randomUUID();
    const classId = generateSequentialId('asset-class');
    db.prepare(`
      INSERT INTO asset_class (id, entity_id, class_id, name, description, status, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, 'hsbc', classId, assetClass.name, assetClass.description, assetClass.status, 'system', 'system');
    assetClassIds.push(id);
    console.log(`  ✓ Created asset class: ${assetClass.name} (${classId})`);
  }
  console.log(`\nCreated ${assetClassesData.length} asset classes\n`);

  // 3. Create Asset Types
  console.log('Creating Asset Types...');
  const assetTypesData = [
    { assetClassId: assetClassIds[0], name: 'Office Desk', description: 'Standard office desks', status: 'active' },
    { assetClassId: assetClassIds[0], name: 'Office Chair', description: 'Ergonomic office chairs', status: 'active' },
    { assetClassId: assetClassIds[0], name: 'Conference Table', description: 'Meeting room tables', status: 'active' },
    { assetClassId: assetClassIds[1], name: 'Laptop', description: 'Business laptops for employees', status: 'active' },
    { assetClassId: assetClassIds[1], name: 'Desktop Computer', description: 'Desktop workstations', status: 'active' },
    { assetClassId: assetClassIds[1], name: 'Server', description: 'Data center servers', status: 'active' },
    { assetClassId: assetClassIds[2], name: 'Sedan', description: 'Company sedans for executives', status: 'active' },
    { assetClassId: assetClassIds[2], name: 'SUV', description: 'Utility vehicles for operations', status: 'active' },
    { assetClassId: assetClassIds[3], name: 'Production Machine', description: 'Manufacturing equipment', status: 'active' },
    { assetClassId: assetClassIds[4], name: 'Printer', description: 'Office printers and copiers', status: 'active' },
    { assetClassId: assetClassIds[4], name: 'Projector', description: 'Presentation projectors', status: 'active' },
  ];

  const assetTypeIds = [];
  for (const assetType of assetTypesData) {
    const id = randomUUID();
    const typeId = generateSequentialId('asset-type', assetType.assetClassId);
    db.prepare(`
      INSERT INTO asset_type (id, entity_id, asset_class_id, type_id, name, description, status, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, 'hsbc', assetType.assetClassId, typeId, assetType.name, assetType.description, assetType.status, 'system', 'system');
    assetTypeIds.push(id);
    console.log(`  ✓ Created asset type: ${assetType.name} (${typeId})`);
  }
  console.log(`\nCreated ${assetTypesData.length} asset types\n`);

  // 4. Create Assets
  console.log('Creating Assets...');
  const assetsData = [
    { assetTypeId: assetTypeIds[3], name: 'Dell Latitude 7420', description: 'Business laptop for IT team', costOfAcquisition: 85000, dateOfAcquisition: '2024-01-15', assetLife: 3, notes: 'Assigned to IT Manager', status: 'active' },
    { assetTypeId: assetTypeIds[3], name: 'HP EliteBook 840', description: 'Business laptop for developer', costOfAcquisition: 75000, dateOfAcquisition: '2024-02-20', assetLife: 3, notes: 'Assigned to Senior Developer', status: 'active' },
    { assetTypeId: assetTypeIds[3], name: 'Lenovo ThinkPad X1', description: 'Business laptop for manager', costOfAcquisition: 90000, dateOfAcquisition: '2024-03-05', assetLife: 3, notes: 'Assigned to Project Manager', status: 'active' },
    { assetTypeId: assetTypeIds[4], name: 'Dell OptiPlex 7090', description: 'Desktop workstation', costOfAcquisition: 55000, dateOfAcquisition: '2024-03-10', assetLife: 4, notes: 'Reception area', status: 'active' },
    { assetTypeId: assetTypeIds[0], name: 'Executive Desk - Mahogany', description: 'Premium executive desk', costOfAcquisition: 45000, dateOfAcquisition: '2024-01-05', assetLife: 10, notes: 'CEO office', status: 'active' },
    { assetTypeId: assetTypeIds[1], name: 'Herman Miller Aeron Chair', description: 'Ergonomic office chair', costOfAcquisition: 35000, dateOfAcquisition: '2024-01-10', assetLife: 7, notes: 'Executive seating', status: 'active' },
    { assetTypeId: assetTypeIds[6], name: 'Toyota Camry 2024', description: 'Company sedan', costOfAcquisition: 2500000, dateOfAcquisition: '2024-02-01', assetLife: 5, notes: 'Fleet vehicle', status: 'active' },
    { assetTypeId: assetTypeIds[9], name: 'HP LaserJet Pro M404dn', description: 'Office printer', costOfAcquisition: 25000, dateOfAcquisition: '2024-01-20', assetLife: 5, notes: 'Main office printer', status: 'active' },
  ];

  const assetIds = [];
  for (const asset of assetsData) {
    const id = randomUUID();
    const assetCode = generateSequentialId('asset', asset.assetTypeId);
    
    // Generate depreciation schedule
    const startYear = new Date(asset.dateOfAcquisition).getFullYear();
    const depreciationSchedule = [];
    let openingValue = asset.costOfAcquisition;
    const annualDepreciation = asset.costOfAcquisition / asset.assetLife;
    
    for (let i = 0; i < asset.assetLife; i++) {
      const year = startYear + i;
      const depreciation = Math.round(annualDepreciation * 100) / 100;
      const closingValue = Math.round((openingValue - depreciation) * 100) / 100;
      depreciationSchedule.push({
        year,
        openingValue: Math.round(openingValue * 100) / 100,
        depreciation,
        closingValue,
      });
      openingValue = closingValue;
    }

    db.prepare(`
      INSERT INTO assets (id, entity_id, asset_type_id, asset_code, name, description, cost_of_acquisition, date_of_acquisition, asset_life, depreciation_schedule, notes, status, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      'hsbc',
      asset.assetTypeId,
      assetCode,
      asset.name,
      asset.description,
      asset.costOfAcquisition,
      asset.dateOfAcquisition,
      asset.assetLife,
      JSON.stringify(depreciationSchedule),
      asset.notes,
      asset.status,
      'system',
      'system'
    );
    assetIds.push(id);
    console.log(`  ✓ Created asset: ${asset.name} (${assetCode})`);
  }
  console.log(`\nCreated ${assetsData.length} assets\n`);

  // 5. Create Service Groups
  console.log('Creating Service Groups...');
  const serviceGroupsData = [
    { verticalId: verticalIds[0], name: 'IT Infrastructure Services', description: 'Core IT infrastructure and support services', status: 'active' },
    { verticalId: verticalIds[0], name: 'Application Development', description: 'Software development and maintenance services', status: 'active' },
    { verticalId: verticalIds[1], name: 'Recruitment Services', description: 'Talent acquisition and recruitment services', status: 'active' },
    { verticalId: verticalIds[1], name: 'Employee Relations', description: 'HR support and employee management services', status: 'active' },
    { verticalId: verticalIds[2], name: 'Logistics Services', description: 'Supply chain and logistics management', status: 'active' },
    { verticalId: verticalIds[2], name: 'Facility Management', description: 'Office and facility maintenance services', status: 'active' },
    { verticalId: verticalIds[3], name: 'Accounting Services', description: 'Financial accounting and bookkeeping', status: 'active' },
    { verticalId: verticalIds[3], name: 'Financial Planning', description: 'Budget planning and financial analysis', status: 'active' },
  ];

  const serviceGroupIds = [];
  for (const serviceGroup of serviceGroupsData) {
    const id = randomUUID();
    const groupId = generateSequentialId('service-group', serviceGroup.verticalId);
    db.prepare(`
      INSERT INTO service_groups (id, entity_id, vertical_id, group_id, name, description, status, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, 'hsbc', serviceGroup.verticalId, groupId, serviceGroup.name, serviceGroup.description, serviceGroup.status, 'system', 'system');
    serviceGroupIds.push(id);
    console.log(`  ✓ Created service group: ${serviceGroup.name} (${groupId})`);
  }
  console.log(`\nCreated ${serviceGroupsData.length} service groups\n`);

  // 6. Create Services
  console.log('Creating Services...');
  const servicesData = [
    { serviceGroupId: serviceGroupIds[0], name: 'Server Maintenance', description: 'Regular server maintenance and updates', uom: 10, status: 'active' },
    { serviceGroupId: serviceGroupIds[0], name: 'Network Support', description: 'Network infrastructure support', uom: 15, status: 'active' },
    { serviceGroupId: serviceGroupIds[0], name: 'Help Desk Support', description: 'IT help desk and user support', uom: 20, status: 'active' },
    { serviceGroupId: serviceGroupIds[1], name: 'Web Application Development', description: 'Custom web application development', uom: 8, status: 'active' },
    { serviceGroupId: serviceGroupIds[1], name: 'Mobile App Development', description: 'Mobile application development', uom: 6, status: 'active' },
    { serviceGroupId: serviceGroupIds[2], name: 'Executive Recruitment', description: 'Senior level recruitment services', uom: 5, status: 'active' },
    { serviceGroupId: serviceGroupIds[2], name: 'Bulk Recruitment', description: 'Mass recruitment for operations', uom: 50, status: 'active' },
    { serviceGroupId: serviceGroupIds[3], name: 'Employee Onboarding', description: 'New employee onboarding process', uom: 30, status: 'active' },
    { serviceGroupId: serviceGroupIds[4], name: 'Warehouse Management', description: 'Warehouse operations and management', uom: 12, status: 'active' },
    { serviceGroupId: serviceGroupIds[5], name: 'Cleaning Services', description: 'Office cleaning and maintenance', uom: 25, status: 'active' },
    { serviceGroupId: serviceGroupIds[6], name: 'Monthly Bookkeeping', description: 'Monthly accounting and bookkeeping', uom: 1, status: 'active' },
    { serviceGroupId: serviceGroupIds[7], name: 'Budget Analysis', description: 'Financial budget analysis and reporting', uom: 4, status: 'active' },
  ];

  const serviceIds = [];
  for (const service of servicesData) {
    const id = randomUUID();
    const serviceId = generateSequentialId('service', service.serviceGroupId);
    db.prepare(`
      INSERT INTO services (id, entity_id, service_group_id, service_id, name, description, uom, status, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, 'hsbc', service.serviceGroupId, serviceId, service.name, service.description, service.uom, service.status, 'system', 'system');
    serviceIds.push(id);
    console.log(`  ✓ Created service: ${service.name} (${serviceId})`);
  }
  console.log(`\nCreated ${servicesData.length} services\n`);

  // 7. Create Cost Groups
  console.log('Creating Cost Groups...');
  const costGroupsData = [
    { verticalId: verticalIds[0], name: 'IT Infrastructure Costs', description: 'Costs related to IT infrastructure', status: 'active' },
    { verticalId: verticalIds[0], name: 'Software Licensing', description: 'Software licenses and subscriptions', status: 'active' },
    { verticalId: verticalIds[1], name: 'Recruitment Costs', description: 'Costs related to hiring and recruitment', status: 'active' },
    { verticalId: verticalIds[1], name: 'Training and Development', description: 'Employee training costs', status: 'active' },
    { verticalId: verticalIds[2], name: 'Operational Expenses', description: 'Day-to-day operational costs', status: 'active' },
    { verticalId: verticalIds[2], name: 'Facility Costs', description: 'Office and facility related costs', status: 'active' },
    { verticalId: verticalIds[3], name: 'Personnel Costs', description: 'Employee salaries and benefits', status: 'active' },
    { verticalId: verticalIds[3], name: 'Financial Services Costs', description: 'Banking and financial service costs', status: 'active' },
  ];

  const costGroupIds = [];
  for (const costGroup of costGroupsData) {
    const id = randomUUID();
    const costGroupId = generateSequentialId('cost-group', costGroup.verticalId);
    db.prepare(`
      INSERT INTO cost_groups (id, entity_id, vertical_id, cost_group_id, name, description, status, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, 'hsbc', costGroup.verticalId, costGroupId, costGroup.name, costGroup.description, costGroup.status, 'system', 'system');
    costGroupIds.push(id);
    console.log(`  ✓ Created cost group: ${costGroup.name} (${costGroupId})`);
  }
  console.log(`\nCreated ${costGroupsData.length} cost groups\n`);

  // 8. Create Budget Lines
  console.log('Creating Budget Lines...');
  const budgetLinesData = [
    { costGroupId: costGroupIds[0], name: 'Server Hardware', description: 'Server equipment and hardware costs', status: 'active' },
    { costGroupId: costGroupIds[0], name: 'Network Equipment', description: 'Networking hardware and equipment', status: 'active' },
    { costGroupId: costGroupIds[1], name: 'Cloud Services', description: 'Cloud infrastructure and services', status: 'active' },
    { costGroupId: costGroupIds[1], name: 'Enterprise Software', description: 'Enterprise software licenses', status: 'active' },
    { costGroupId: costGroupIds[2], name: 'Agency Fees', description: 'Recruitment agency fees', status: 'active' },
    { costGroupId: costGroupIds[2], name: 'Job Portal Subscriptions', description: 'Online job portal subscriptions', status: 'active' },
    { costGroupId: costGroupIds[3], name: 'Training Programs', description: 'Employee training program costs', status: 'active' },
    { costGroupId: costGroupIds[4], name: 'Office Supplies', description: 'Day-to-day office supplies', status: 'active' },
    { costGroupId: costGroupIds[5], name: 'Office Rent', description: 'Office space rental costs', status: 'active' },
    { costGroupId: costGroupIds[5], name: 'Utilities', description: 'Electricity, water, and other utilities', status: 'active' },
    { costGroupId: costGroupIds[6], name: 'Salaries', description: 'Employee salary costs', status: 'active' },
    { costGroupId: costGroupIds[6], name: 'Benefits', description: 'Employee benefits and perks', status: 'active' },
    { costGroupId: costGroupIds[7], name: 'Banking Fees', description: 'Banking and transaction fees', status: 'active' },
  ];

  const budgetLineIds = [];
  for (const budgetLine of budgetLinesData) {
    const id = randomUUID();
    const budgetLineId = generateSequentialId('budget-line', budgetLine.costGroupId);
    db.prepare(`
      INSERT INTO budget_lines (id, entity_id, cost_group_id, budget_line_id, name, description, status, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, 'hsbc', budgetLine.costGroupId, budgetLineId, budgetLine.name, budgetLine.description, budgetLine.status, 'system', 'system');
    budgetLineIds.push(id);
    console.log(`  ✓ Created budget line: ${budgetLine.name} (${budgetLineId})`);
  }
  console.log(`\nCreated ${budgetLinesData.length} budget lines\n`);

  // 9. Create Cost Elements
  console.log('Creating Cost Elements...');
  const costElementsData = [
    { budgetLineId: budgetLineIds[0], name: 'Dell Server Purchase', description: 'Purchase of new Dell servers', costType: 'Direct', serviceId: serviceIds[0], isBudgeted: true, financialYear: '2024-25', amount: 500000, status: 'active' },
    { budgetLineId: budgetLineIds[1], name: 'Cisco Switch Purchase', description: 'Network switch equipment', costType: 'Direct', serviceId: serviceIds[1], isBudgeted: true, financialYear: '2024-25', amount: 250000, status: 'active' },
    { budgetLineId: budgetLineIds[2], name: 'AWS Cloud Services', description: 'Amazon Web Services subscription', costType: 'Indirect', isBudgeted: true, financialYear: '2024-25', amount: 300000, status: 'active' },
    { budgetLineId: budgetLineIds[3], name: 'Microsoft Office 365', description: 'Office 365 enterprise license', costType: 'Indirect', isBudgeted: true, financialYear: '2024-25', amount: 150000, status: 'active' },
    { budgetLineId: budgetLineIds[4], name: 'Recruitment Agency Fee', description: 'Fee paid to recruitment agency', costType: 'Direct', serviceId: serviceIds[5], isBudgeted: false, amount: 50000, status: 'active' },
    { budgetLineId: budgetLineIds[5], name: 'Naukri.com Subscription', description: 'Job portal subscription', costType: 'Common', isBudgeted: true, financialYear: '2024-25', amount: 75000, status: 'active' },
    { budgetLineId: budgetLineIds[6], name: 'Leadership Training Program', description: 'Executive training program', costType: 'Direct', serviceId: serviceIds[7], isBudgeted: true, financialYear: '2024-25', amount: 200000, status: 'active' },
    { budgetLineId: budgetLineIds[7], name: 'Stationery Purchase', description: 'Office stationery and supplies', costType: 'Common', isBudgeted: false, amount: 25000, status: 'active' },
    { budgetLineId: budgetLineIds[8], name: 'Office Rent - Main Building', description: 'Monthly office rent', costType: 'Indirect', isBudgeted: true, financialYear: '2024-25', amount: 1200000, status: 'active' },
    { budgetLineId: budgetLineIds[9], name: 'Electricity Bill', description: 'Monthly electricity charges', costType: 'Indirect', isBudgeted: false, amount: 50000, status: 'active' },
    { budgetLineId: budgetLineIds[10], name: 'IT Team Salaries', description: 'Salaries for IT department', costType: 'Direct', serviceId: serviceIds[0], isBudgeted: true, financialYear: '2024-25', amount: 2000000, status: 'active' },
    { budgetLineId: budgetLineIds[11], name: 'Health Insurance', description: 'Employee health insurance', costType: 'Common', isBudgeted: true, financialYear: '2024-25', amount: 500000, status: 'active' },
  ];

  for (const costElement of costElementsData) {
    const id = randomUUID();
    const costElementId = generateSequentialId('cost-element', costElement.budgetLineId);
    db.prepare(`
      INSERT INTO cost_elements (id, entity_id, budget_line_id, cost_element_id, name, description, cost_type, service_id, is_budgeted, financial_year, amount, status, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      'hsbc',
      costElement.budgetLineId,
      costElementId,
      costElement.name,
      costElement.description,
      costElement.costType,
      costElement.serviceId || null,
      costElement.isBudgeted ? 1 : 0,
      costElement.financialYear || null,
      costElement.amount,
      costElement.status,
      'system',
      'system'
    );
    console.log(`  ✓ Created cost element: ${costElement.name} (${costElementId})`);
  }
  console.log(`\nCreated ${costElementsData.length} cost elements\n`);

  console.log('✅ Cost Model data population completed successfully!');
  console.log('\nSummary:');
  console.log(`  - Verticals: ${verticalsData.length}`);
  console.log(`  - Asset Classes: ${assetClassesData.length}`);
  console.log(`  - Asset Types: ${assetTypesData.length}`);
  console.log(`  - Assets: ${assetsData.length}`);
  console.log(`  - Service Groups: ${serviceGroupsData.length}`);
  console.log(`  - Services: ${servicesData.length}`);
  console.log(`  - Cost Groups: ${costGroupsData.length}`);
  console.log(`  - Budget Lines: ${budgetLinesData.length}`);
  console.log(`  - Cost Elements: ${costElementsData.length}`);
  console.log(`\nTotal entities created: ${verticalsData.length + assetClassesData.length + assetTypesData.length + assetsData.length + serviceGroupsData.length + servicesData.length + costGroupsData.length + budgetLinesData.length + costElementsData.length}`);

} catch (error) {
  console.error('❌ Error during data population:', error);
  process.exit(1);
} finally {
  db.close();
}

