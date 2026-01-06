// Comprehensive database population script
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

// Initialize SQLite database
const db = new Database('./invoice_automation.db');

console.log('🚀 Starting comprehensive database population...\n');

// Helper functions
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomAmount(min = 1000, max = 500000) {
  const amount = Math.floor(Math.random() * (max - min + 1)) + min;
  return `₹${amount.toLocaleString()}.00`;
}

function generateGSTIN() {
  const states = ['27', '29', '33', '07', '19', '06', '24', '12', '35', '09'];
  const state = randomChoice(states);
  const pan = Math.random().toString(36).substring(2, 7).toUpperCase();
  const entity = Math.random().toString(36).substring(2, 4).toUpperCase();
  const checkDigit = Math.floor(Math.random() * 10);
  const z = Math.random().toString(36).substring(2, 3).toUpperCase();
  return `${state}${pan}${entity}${checkDigit}${z}`;
}

function generateIRN() {
  return Math.random().toString(36).substring(2, 34);
}

function generateInvoiceNo(prefix = 'INV') {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const number = Math.floor(Math.random() * 9999) + 1;
  return `${prefix}-${year}-${month}-${String(number).padStart(4, '0')}`;
}

// Data arrays
const roles = ['admin', 'business_user', 'auditor', 'manager'];
const statuses = ['success', 'failed', 'pending', 'processing'];
const invoiceTypes = ['B2B', 'B2C', 'Export', 'Import'];
const documentTypes = ['Invoice', 'Delivery Challan', 'BOE', 'Shipping Bill', 'Credit Note', 'Debit Note'];
const modules = ['QR Scanner', 'PDF Upload', 'EGAM Repository', 'Reconciliation', 'EWB Generation', 'API Validation', 'System'];
const levels = ['SUCCESS', 'ERROR', 'INFO', 'WARNING'];
const apiTypes = ['search-taxpayer', 'pan-to-gstin', 'view-track-returns', 'get-preference', 'msme-validation', 'cin-validation'];
const ewbStatuses = ['success', 'failed', 'not_attempted', 'pending'];

const companyNames = [
  'ABC Technologies Pvt Ltd', 'XYZ Corporation Ltd', 'DEF Logistics Ltd', 'GHI Industries',
  'JKL Trading Co', 'MNO Enterprises', 'PQR Solutions Inc', 'STU Manufacturing',
  'VWX Services Ltd', 'YZA Trading House', 'BCD Electronics', 'EFG Pharmaceuticals',
  'HIJ Construction', 'KLM Textiles', 'NOP Food Products', 'QRS Automobiles',
  'TUV Chemicals', 'WXY Steel Works', 'ZAB Software', 'CDE Consultancy'
];

const vendorNames = [
  'Tech Solutions Inc', 'Global Enterprises', 'Digital Services Ltd', 'Retail Corp',
  'Manufacturing Co', 'Distribution Ltd', 'Service Provider', 'Client Company',
  'Shipping Solutions', 'Import Export Ltd', 'Consulting Firm', 'Business Solutions',
  'Financial Services', 'Banking Corp', 'Trading Company', 'Retail Chain',
  'Healthcare Services', 'Medical Center', 'Construction Ltd', 'Real Estate Co'
];

// Clear existing data (optional - uncomment if you want fresh data)
console.log('📋 Clearing existing data...');
db.exec('DELETE FROM system_logs');
db.exec('DELETE FROM api_logs');
db.exec('DELETE FROM pdf_processing_history');
db.exec('DELETE FROM bulk_qr_processing');
db.exec('DELETE FROM bulk_qr_batches');
db.exec('DELETE FROM egam_audit_logs');
db.exec('DELETE FROM egam_repository');
db.exec('DELETE FROM pdf_data');
db.exec('DELETE FROM qr_data');
db.exec('DELETE FROM users WHERE username != "admin"');
console.log('✅ Existing data cleared\n');

// 1. Create additional users
console.log('👥 Creating users...');
const users = [];
for (let i = 0; i < 20; i++) {
  const user = {
    id: randomUUID(),
    username: `user_${i + 1}`,
    password: 'password123',
    role: randomChoice(roles),
    entity_id: 'hsbc',
    created_at: randomDate(new Date(2024, 0, 1), new Date())
  };
  users.push(user);
}

const insertUser = db.prepare(`
  INSERT INTO users (id, username, password, role, entity_id, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

users.forEach(user => {
  insertUser.run(user.id, user.username, user.password, user.role, user.entity_id, user.created_at);
});
console.log(`✅ Created ${users.length} users`);

// 2. Create QR Data
console.log('📱 Creating QR data...');
const qrData = [];
for (let i = 0; i < 150; i++) {
  const sellerGstin = generateGSTIN();
  const buyerGstin = generateGSTIN();
  const irn = generateIRN();
  const invoiceNo = generateInvoiceNo();
  const date = randomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0];
  const amount = randomAmount();
  
  const qr = {
    id: randomUUID(),
    entity_id: 'hsbc',
    irn: irn,
    gstin: sellerGstin,
    invoice_no: invoiceNo,
    date: date,
    total_amount: amount,
    buyer_gstin: buyerGstin,
    seller_gstin: sellerGstin,
    invoice_type: randomChoice(invoiceTypes),
    qr_string: `QR:${irn}:${sellerGstin}:${buyerGstin}:${invoiceNo}:${date}:${amount.replace('₹', '').replace(',', '')}`,
    processed_by: randomChoice(users).username,
    status: randomChoice(['success', 'success', 'success', 'failed']), // 75% success rate
    extracted_at: randomDate(new Date(2024, 0, 1), new Date())
  };
  qrData.push(qr);
}

const insertQR = db.prepare(`
  INSERT INTO qr_data (id, entity_id, irn, gstin, invoice_no, date, total_amount, 
                      buyer_gstin, seller_gstin, invoice_type, qr_string, processed_by, status, extracted_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

qrData.forEach(data => {
  insertQR.run(
    data.id, data.entity_id, data.irn, data.gstin, data.invoice_no, data.date,
    data.total_amount, data.buyer_gstin, data.seller_gstin, data.invoice_type,
    data.qr_string, data.processed_by, data.status, data.extracted_at
  );
});
console.log(`✅ Created ${qrData.length} QR data records`);

// 3. Create PDF Data
console.log('📄 Creating PDF data...');
const pdfData = [];
for (let i = 0; i < 100; i++) {
  const gstin = generateGSTIN();
  const irn = generateIRN();
  const invoiceNo = generateInvoiceNo();
  const date = randomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0];
  const amount = randomAmount();
  
  const pdf = {
    id: randomUUID(),
    entity_id: 'hsbc',
    file_name: `invoice_${String(i + 1).padStart(4, '0')}_${date.replace(/-/g, '')}.pdf`,
    invoice_no: invoiceNo,
    date: date,
    irn: irn,
    gstin: gstin,
    amount: amount,
    status: randomChoice(['processed', 'processed', 'processed', 'failed']), // 75% success rate
    extracted_at: randomDate(new Date(2024, 0, 1), new Date())
  };
  pdfData.push(pdf);
}

const insertPDF = db.prepare(`
  INSERT INTO pdf_data (id, entity_id, file_name, invoice_no, date, irn, gstin, amount, status, extracted_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

pdfData.forEach(data => {
  insertPDF.run(
    data.id, data.entity_id, data.file_name, data.invoice_no, data.date,
    data.irn, data.gstin, data.amount, data.status, data.extracted_at
  );
});
console.log(`✅ Created ${pdfData.length} PDF data records`);

// 4. Create EGAM Repository Data
console.log('🏢 Creating EGAM repository data...');
const egamData = [];
for (let i = 0; i < 200; i++) {
  const vendorGstin = generateGSTIN();
  const irn = generateIRN();
  const invoiceNo = generateInvoiceNo();
  const date = randomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0];
  const amount = randomAmount();
  
  const egam = {
    id: randomUUID(),
    entity_id: 'hsbc',
    irn: irn,
    invoice_no: invoiceNo,
    date: date,
    vendor_gstin: vendorGstin,
    amount: amount,
    status: randomChoice(['processed', 'processed', 'processed', 'pending']), // 75% processed
    fetched_at: randomDate(new Date(2024, 0, 1), new Date())
  };
  egamData.push(egam);
}

const insertEGAM = db.prepare(`
  INSERT INTO egam_repository (id, entity_id, irn, invoice_no, date, vendor_gstin, amount, status, fetched_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

egamData.forEach(data => {
  insertEGAM.run(
    data.id, data.entity_id, data.irn, data.invoice_no, data.date,
    data.vendor_gstin, data.amount, data.status, data.fetched_at
  );
});
console.log(`✅ Created ${egamData.length} EGAM repository records`);

// 5. Create EGAM Audit Logs
console.log('📊 Creating EGAM audit logs...');
const auditLogs = [];
for (let i = 0; i < 50; i++) {
  const log = {
    id: randomUUID(),
    entity_id: 'hsbc',
    pull_type: randomChoice(['scheduled', 'manual']),
    status: randomChoice(['success', 'error', 'in_progress']),
    records_count: Math.floor(Math.random() * 100) + 1,
    started_at: randomDate(new Date(2024, 0, 1), new Date()),
    completed_at: randomChoice([null, randomDate(new Date(2024, 0, 1), new Date())]),
    error_message: randomChoice([null, 'Connection timeout', 'Invalid response', 'Network error']),
    next_scheduled_at: randomChoice([null, randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))])
  };
  auditLogs.push(log);
}

const insertAuditLog = db.prepare(`
  INSERT INTO egam_audit_logs (id, entity_id, pull_type, status, records_count, 
                               started_at, completed_at, error_message, next_scheduled_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

auditLogs.forEach(data => {
  insertAuditLog.run(
    data.id, data.entity_id, data.pull_type, data.status, data.records_count,
    data.started_at, data.completed_at, data.error_message, data.next_scheduled_at
  );
});
console.log(`✅ Created ${auditLogs.length} EGAM audit log records`);

// 6. Create System Logs
console.log('📝 Creating system logs...');
const systemLogs = [];
const logMessages = [
  'QR code scanned successfully',
  'PDF document uploaded and processed',
  'EGAM data synchronization completed',
  'Invoice reconciliation finished',
  'EWB generation successful',
  'API validation completed',
  'User login successful',
  'Database backup completed',
  'System maintenance started',
  'Error occurred during processing',
  'Data export completed',
  'Report generated successfully',
  'User session expired',
  'Configuration updated',
  'Audit trail created'
];

for (let i = 0; i < 300; i++) {
  const module = randomChoice(modules);
  const message = randomChoice(logMessages);
  const user = randomChoice(users).username;
  
  const log = {
    id: randomUUID(),
    entity_id: 'hsbc',
    level: randomChoice(levels),
    module: module,
    message: message,
    details: `${message} by ${user} at ${new Date().toISOString()}`,
    user: user,
    timestamp: randomDate(new Date(2024, 0, 1), new Date())
  };
  systemLogs.push(log);
}

const insertSystemLog = db.prepare(`
  INSERT INTO system_logs (id, entity_id, level, module, message, details, user, timestamp)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

systemLogs.forEach(data => {
  insertSystemLog.run(
    data.id, data.entity_id, data.level, data.module, data.message, 
    data.details, data.user, data.timestamp
  );
});
console.log(`✅ Created ${systemLogs.length} system log records`);

// 7. Create API Logs
console.log('🔌 Creating API logs...');
const apiLogs = [];
for (let i = 0; i < 200; i++) {
  const apiType = randomChoice(apiTypes);
  const gstin = generateGSTIN();
  const status = randomChoice(['success', 'success', 'success', 'error']); // 75% success rate
  const responseTime = Math.floor(Math.random() * 1000) + 100;
  const requestId = randomUUID(); // Generate request ID for each API log
  
  const log = {
    id: randomUUID(),
    entity_id: 'hsbc',
    api_name: apiType.replace('-', ' ').toUpperCase(),
    api_type: apiType,
    parameters: JSON.stringify({ 
      gstin: gstin, 
      action: 'TP', 
      fy: '2024-25',
      pan: gstin.substring(2, 7),
      msmeId: `MSME${Math.random().toString().substr(2, 8)}`,
      cin: `U${gstin.substring(2, 7)}${Math.random().toString().substr(2, 4)}${Math.random().toString().substr(2, 2)}`
    }),
    response: JSON.stringify({ 
      status: status, 
      data: status === 'success' ? {
        gstin: gstin,
        tradeName: randomChoice(companyNames),
        status: 'Active',
        registrationDate: '2020-04-15'
      } : { error: 'Invalid GSTIN format' }
    }),
    status: status,
    response_time: responseTime,
    endpoint: `/api/validation/${apiType}`,
    request_id: requestId, // Include request ID for tracing
    timestamp: randomDate(new Date(2024, 0, 1), new Date())
  };
  apiLogs.push(log);
}

// Try to insert with request_id, fallback if column doesn't exist
let insertAPILog;
try {
  insertAPILog = db.prepare(`
    INSERT INTO api_logs (id, entity_id, api_name, api_type, parameters, response, 
                         status, response_time, endpoint, request_id, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
} catch (e) {
  // Fallback if request_id column doesn't exist
  insertAPILog = db.prepare(`
    INSERT INTO api_logs (id, entity_id, api_name, api_type, parameters, response, 
                         status, response_time, endpoint, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
}

apiLogs.forEach(data => {
  try {
    if (data.request_id) {
      // Try with request_id
      const stmt = db.prepare(`
        INSERT INTO api_logs (id, entity_id, api_name, api_type, parameters, response, 
                             status, response_time, endpoint, request_id, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        data.id, data.entity_id, data.api_name, data.api_type, data.parameters,
        data.response, data.status, data.response_time, data.endpoint, data.request_id, data.timestamp
      );
    } else {
      // Fallback without request_id
      const stmt = db.prepare(`
        INSERT INTO api_logs (id, entity_id, api_name, api_type, parameters, response, 
                             status, response_time, endpoint, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        data.id, data.entity_id, data.api_name, data.api_type, data.parameters,
        data.response, data.status, data.response_time, data.endpoint, data.timestamp
      );
    }
  } catch (e) {
    // If request_id column doesn't exist, insert without it
    const stmt = db.prepare(`
      INSERT INTO api_logs (id, entity_id, api_name, api_type, parameters, response, 
                           status, response_time, endpoint, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      data.id, data.entity_id, data.api_name, data.api_type, data.parameters,
      data.response, data.status, data.response_time, data.endpoint, data.timestamp
    );
  }
});
console.log(`✅ Created ${apiLogs.length} API log records`);

// 8. Create PDF Processing History
console.log('📋 Creating PDF processing history...');
const pdfHistory = [];
for (let i = 0; i < 250; i++) {
  const invoiceNo = generateInvoiceNo();
  const amount = randomAmount();
  const vendorName = randomChoice(vendorNames);
  const buyerName = randomChoice(companyNames);
  const processedBy = randomChoice(users).username;
  const documentType = randomChoice(documentTypes);
  const ewbStatus = randomChoice(['success', 'success', 'success', 'failed']); // 75% success rate
  
  const history = {
    id: randomUUID(),
    entity_id: 'hsbc',
    file_name: `invoice_${String(i + 1).padStart(4, '0')}_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.pdf`,
    document_type: documentType,
    processed_by: processedBy,
    ewb_status: ewbStatus,
    processed_at: randomDate(new Date(2024, 0, 1), new Date()),
    invoice_no: invoiceNo,
    amount: amount,
    vendor_name: vendorName,
    buyer_name: buyerName
  };
  pdfHistory.push(history);
}

const insertPDFHistory = db.prepare(`
  INSERT INTO pdf_processing_history (id, entity_id, file_name, document_type, 
                                    processed_by, ewb_status, processed_at, 
                                    invoice_no, amount, vendor_name, buyer_name)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

pdfHistory.forEach(data => {
  insertPDFHistory.run(
    data.id, data.entity_id, data.file_name, data.document_type, data.processed_by,
    data.ewb_status, data.processed_at, data.invoice_no, data.amount, 
    data.vendor_name, data.buyer_name
  );
});
console.log(`✅ Created ${pdfHistory.length} PDF processing history records`);

// 9. Create Bulk QR Batches
console.log('📦 Creating bulk QR batches...');
const bulkBatches = [];
for (let i = 0; i < 15; i++) {
  const batch = {
    id: randomUUID(),
    entity_id: 'hsbc',
    file_name: `qr_batch_${i + 1}_${new Date().getFullYear()}_${String(new Date().getMonth() + 1).padStart(2, '0')}.xlsx`,
    total_records: Math.floor(Math.random() * 50) + 10,
    processed_records: Math.floor(Math.random() * 50) + 10,
    success_records: Math.floor(Math.random() * 40) + 5,
    failed_records: Math.floor(Math.random() * 10),
    status: randomChoice(['completed', 'processing', 'failed']),
    created_at: randomDate(new Date(2024, 0, 1), new Date()),
    completed_at: randomChoice([null, randomDate(new Date(2024, 0, 1), new Date())])
  };
  bulkBatches.push(batch);
}

const insertBulkBatch = db.prepare(`
  INSERT INTO bulk_qr_batches (id, entity_id, file_name, total_records, 
                              processed_records, success_records, failed_records, status, created_at, completed_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

bulkBatches.forEach(data => {
  insertBulkBatch.run(
    data.id, data.entity_id, data.file_name, data.total_records,
    data.processed_records, data.success_records, data.failed_records,
    data.status, data.created_at, data.completed_at
  );
});
console.log(`✅ Created ${bulkBatches.length} bulk QR batch records`);

// 10. Create Bulk QR Processing
console.log('⚙️ Creating bulk QR processing records...');
const bulkProcessing = [];
for (let i = 0; i < 500; i++) {
  const processing = {
    id: randomUUID(),
    entity_id: 'hsbc',
    batch_id: randomChoice(bulkBatches).id,
    qr_string: generateIRN() + generateIRN(),
    status: randomChoice(['queued', 'processing', 'success', 'failed']),
    processed_at: randomChoice([null, randomDate(new Date(2024, 0, 1), new Date())]),
    extracted_data: JSON.stringify({ irn: generateIRN(), invoiceNo: generateInvoiceNo() }),
    error_message: randomChoice([null, 'Invalid QR format', 'Processing timeout', 'Data extraction failed']),
    created_at: randomDate(new Date(2024, 0, 1), new Date())
  };
  bulkProcessing.push(processing);
}

const insertBulkProcessing = db.prepare(`
  INSERT INTO bulk_qr_processing (id, entity_id, batch_id, qr_string, status, 
                                 processed_at, extracted_data, error_message, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

bulkProcessing.forEach(data => {
  insertBulkProcessing.run(
    data.id, data.entity_id, data.batch_id, data.qr_string, data.status,
    data.processed_at, data.extracted_data, data.error_message, data.created_at
  );
});
console.log(`✅ Created ${bulkProcessing.length} bulk QR processing records`);

// Summary
console.log('\n🎉 Database population completed successfully!');
console.log('📊 Summary of created data:');
console.log(`   👥 Users: ${users.length}`);
console.log(`   📱 QR Data: ${qrData.length}`);
console.log(`   📄 PDF Data: ${pdfData.length}`);
console.log(`   🏢 EGAM Repository: ${egamData.length}`);
console.log(`   📊 EGAM Audit Logs: ${auditLogs.length}`);
console.log(`   📝 System Logs: ${systemLogs.length}`);
console.log(`   🔌 API Logs: ${apiLogs.length}`);
console.log(`   📋 PDF Processing History: ${pdfHistory.length}`);
console.log(`   📦 Bulk QR Batches: ${bulkBatches.length}`);
console.log(`   ⚙️ Bulk QR Processing: ${bulkProcessing.length}`);
console.log('\n💾 Total records created: ' + 
  (users.length + qrData.length + pdfData.length + egamData.length + 
   auditLogs.length + systemLogs.length + apiLogs.length + 
   pdfHistory.length + bulkBatches.length + bulkProcessing.length));

console.log('\n🚀 Your database is now populated with comprehensive test data!');
console.log('📖 You can now test all features of your invoice automation system.');

db.close();
