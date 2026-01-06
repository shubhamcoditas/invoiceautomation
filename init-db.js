// Simple script to initialize SQLite database
const Database = require('better-sqlite3');
const { randomUUID } = require('crypto');

// Initialize SQLite database
const db = new Database('./invoice_automation.db');

console.log('Creating database tables...');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'business_user',
    entity_id TEXT NOT NULL DEFAULT 'hsbc',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS qr_data (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL DEFAULT 'hsbc',
    irn TEXT NOT NULL,
    gstin TEXT NOT NULL,
    invoice_no TEXT NOT NULL,
    date TEXT NOT NULL,
    total_amount TEXT NOT NULL,
    buyer_gstin TEXT NOT NULL,
    seller_gstin TEXT NOT NULL,
    invoice_type TEXT NOT NULL,
    qr_string TEXT NOT NULL,
    processed_by TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'success',
    extracted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS pdf_data (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL DEFAULT 'hsbc',
    file_name TEXT NOT NULL,
    invoice_no TEXT NOT NULL,
    date TEXT NOT NULL,
    irn TEXT NOT NULL,
    gstin TEXT NOT NULL,
    amount TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processed',
    extracted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS egam_repository (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL DEFAULT 'hsbc',
    irn TEXT UNIQUE NOT NULL,
    invoice_no TEXT NOT NULL,
    date TEXT NOT NULL,
    vendor_gstin TEXT NOT NULL,
    amount TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processed',
    fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS egam_audit_logs (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL DEFAULT 'hsbc',
    pull_type TEXT NOT NULL,
    status TEXT NOT NULL,
    records_count INTEGER,
    started_at DATETIME NOT NULL,
    completed_at DATETIME,
    error_message TEXT,
    next_scheduled_at DATETIME
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS pdf_processing_history (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL DEFAULT 'hsbc',
    file_name TEXT NOT NULL,
    document_type TEXT NOT NULL,
    processed_by TEXT NOT NULL,
    ewb_status TEXT NOT NULL,
    processed_at DATETIME NOT NULL,
    invoice_no TEXT,
    amount TEXT,
    vendor_name TEXT,
    buyer_name TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS system_logs (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL DEFAULT 'hsbc',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    level TEXT NOT NULL,
    module TEXT NOT NULL,
    message TEXT NOT NULL,
    details TEXT,
    user TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS api_logs (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL DEFAULT 'hsbc',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    api_name TEXT NOT NULL,
    api_type TEXT NOT NULL,
    parameters TEXT,
    response TEXT,
    status TEXT NOT NULL,
    response_time INTEGER,
    endpoint TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS bulk_qr_batches (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL DEFAULT 'hsbc',
    file_name TEXT NOT NULL,
    total_records INTEGER NOT NULL,
    processed_records INTEGER DEFAULT 0,
    success_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'processing',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS bulk_qr_processing (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL DEFAULT 'hsbc',
    batch_id TEXT NOT NULL,
    qr_string TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    processed_at DATETIME,
    extracted_data TEXT,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Inserting sample data...');

// Check if admin user already exists before inserting
const checkUser = db.prepare('SELECT COUNT(*) as count FROM users WHERE username = ?');
const userExists = checkUser.get('admin');

if (userExists.count === 0) {
  // Insert sample data only if admin user doesn't exist
  const adminUser = {
    id: randomUUID(),
    username: 'admin',
    password: 'password',
    role: 'admin',
    entity_id: 'hsbc'
  };

  const insertUser = db.prepare(`
    INSERT INTO users (id, username, password, role, entity_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertUser.run(adminUser.id, adminUser.username, adminUser.password, adminUser.role, adminUser.entity_id);
  console.log('Admin user created successfully');
} else {
  console.log('Admin user already exists, skipping user creation');
}

// Insert sample QR data (only if no QR data exists)
const checkQRData = db.prepare('SELECT COUNT(*) as count FROM qr_data');
const qrDataExists = checkQRData.get();

if (qrDataExists.count === 0) {
  const qrData = [
    {
      id: randomUUID(),
      irn: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n",
      gstin: "27ABCDE1234F1Z5",
      invoice_no: "INV-2024-001",
      date: "2024-01-15",
      total_amount: "₹125,000.00",
      buyer_gstin: "29XYZAB5678P1Q2",
      seller_gstin: "27ABCDE1234F1Z5",
      invoice_type: "B2B",
      qr_string: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
      processed_by: "admin",
      status: "success"
    },
    {
      id: randomUUID(),
      irn: "2b3c4d5e6f7g8h9i0j1k2l3m4n5o",
      gstin: "29XYZAB5678P1Q2",
      invoice_no: "INV-2024-002",
      date: "2024-01-16",
      total_amount: "₹89,500.00",
      buyer_gstin: "27ABCDE1234F1Z5",
      seller_gstin: "29XYZAB5678P1Q2",
      invoice_type: "B2B",
      qr_string: "2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
      processed_by: "admin",
      status: "success"
    }
  ];

  const insertQR = db.prepare(`
    INSERT INTO qr_data (id, entity_id, irn, gstin, invoice_no, date, total_amount, 
                        buyer_gstin, seller_gstin, invoice_type, qr_string, processed_by, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  qrData.forEach(data => {
    insertQR.run(
      data.id, 'hsbc', data.irn, data.gstin, data.invoice_no, data.date,
      data.total_amount, data.buyer_gstin, data.seller_gstin, data.invoice_type,
      data.qr_string, data.processed_by, data.status
    );
  });
  console.log(`${qrData.length} QR data records inserted`);
} else {
  console.log('QR data already exists, skipping QR data insertion');
}

// Insert sample EGAM data (only if no EGAM data exists)
const checkEGAMData = db.prepare('SELECT COUNT(*) as count FROM egam_repository');
const egamDataExists = checkEGAMData.get();

if (egamDataExists.count === 0) {
  const egamData = [
    {
      id: randomUUID(),
      irn: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n",
      invoice_no: "INV-2024-001",
      date: "2024-01-15",
      vendor_gstin: "27ABCDE1234F1Z5",
      amount: "₹125,000.00",
      status: "processed"
    }
  ];

  const insertEGAM = db.prepare(`
    INSERT INTO egam_repository (id, entity_id, irn, invoice_no, date, vendor_gstin, amount, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  egamData.forEach(data => {
    insertEGAM.run(
      data.id, 'hsbc', data.irn, data.invoice_no, data.date,
      data.vendor_gstin, data.amount, data.status
    );
  });
  console.log(`${egamData.length} EGAM data records inserted`);
} else {
  console.log('EGAM data already exists, skipping EGAM data insertion');
}

// Insert sample system logs (only if no system logs exist)
const checkSystemLogs = db.prepare('SELECT COUNT(*) as count FROM system_logs');
const systemLogsExist = checkSystemLogs.get();

if (systemLogsExist.count === 0) {
  const systemLogs = [
    {
      id: randomUUID(),
      level: "SUCCESS",
      module: "QR Scanner",
      message: "QR code processed successfully",
      details: "IRN: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n extracted",
      user: "admin"
    },
    {
      id: randomUUID(),
      level: "INFO",
      module: "System",
      message: "Database initialized",
      details: "All tables created successfully",
      user: "system"
    }
  ];

  const insertSystemLog = db.prepare(`
    INSERT INTO system_logs (id, entity_id, level, module, message, details, user)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  systemLogs.forEach(data => {
    insertSystemLog.run(
      data.id, 'hsbc', data.level, data.module, data.message, 
      data.details, data.user
    );
  });
  console.log(`${systemLogs.length} system log records inserted`);
} else {
  console.log('System logs already exist, skipping system logs insertion');
}

console.log('Database initialized successfully!');
console.log('Database file: invoice_automation.db');
console.log('You can now connect to this database in DBeaver.');

db.close();
