const Database = require('better-sqlite3');

// Connect to the database
const db = new Database('C:/Users/Coditas-Admin/Downloads/EGAM/invoiceautomation/DB/invoice_automation.db');

console.log('Testing PDF Processing History API...');

try {
  // Check if table exists
  const tableCheck = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='pdf_processing_history'
  `);
  const tableExists = tableCheck.get();
  console.log('Table exists:', !!tableExists);

  // Check row count
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM pdf_processing_history');
  const count = countStmt.get();
  console.log('Row count:', count.count);

  // Get sample data
  const sampleStmt = db.prepare('SELECT * FROM pdf_processing_history LIMIT 5');
  const sampleData = sampleStmt.all();
  console.log('Sample data:', sampleData);

  // Test the exact query used by the API
  const apiStmt = db.prepare(`
    SELECT 
      id,
      entity_id as entityId,
      file_name as fileName,
      document_type as documentType,
      processed_by as processedBy,
      ewb_status as ewbStatus,
      processed_at as processedAt,
      invoice_no as invoiceNo,
      amount,
      vendor_name as vendorName,
      buyer_name as buyerName
    FROM pdf_processing_history 
    ORDER BY processed_at DESC
  `);
  const apiData = apiStmt.all();
  console.log('API query result:', apiData);

} catch (error) {
  console.error('Error:', error);
} finally {
  db.close();
}
