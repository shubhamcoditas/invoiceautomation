// Script to clear the database data
const Database = require('better-sqlite3');

const dbPath = './invoice_automation.db';

console.log('Database Clear Utility');
console.log('=====================\n');

try {
  const db = new Database(dbPath);
  
  console.log('Clearing all data from database...');
  
  // Clear all tables
  console.log('Clearing QR data...');
  db.prepare('DELETE FROM qr_data').run();
  
  console.log('Clearing PDF data...');
  db.prepare('DELETE FROM pdf_data').run();
  
  console.log('Clearing EGAM data...');
  db.prepare('DELETE FROM egam_repository').run();
  
  console.log('Clearing system logs...');
  db.prepare('DELETE FROM system_logs').run();
  
  console.log('Clearing API logs...');
  db.prepare('DELETE FROM api_logs').run();
  
  console.log('Clearing PDF processing history...');
  db.prepare('DELETE FROM pdf_processing_history').run();
  
  console.log('Clearing EGAM audit logs...');
  db.prepare('DELETE FROM egam_audit_logs').run();
  
  console.log('Clearing bulk QR batches...');
  db.prepare('DELETE FROM bulk_qr_batches').run();
  
  console.log('Clearing bulk QR processing...');
  db.prepare('DELETE FROM bulk_qr_processing').run();
  
  // Verify empty
  const count = db.prepare('SELECT COUNT(*) as count FROM qr_data').get().count;
  console.log(`✓ Database cleared! QR records remaining: ${count}`);
  
  db.close();
  console.log('\n✅ Database is now completely empty!');
  console.log('Restart your server to see the empty database.');
  
} catch (error) {
  console.error('❌ Error clearing database:', error.message);
}

