const Database = require('better-sqlite3');
const { randomUUID } = require('crypto');

// Connect to the database
const db = new Database('C:/Users/Coditas-Admin/Downloads/EGAM/invoiceautomation/DB/invoice_automation.db');

console.log('📄 Adding PDF Processing History Data...');
console.log('=====================================\n');

try {
  // Check if table exists and get current count
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM pdf_processing_history');
  const currentCount = countStmt.get().count;
  console.log(`Current records in pdf_processing_history: ${currentCount}`);

  // Sample data for PDF processing history
  const sampleData = [
    {
      id: randomUUID(),
      entityId: 'hsbc',
      fileName: 'invoice_001.pdf',
      documentType: 'invoice',
      processedBy: 'admin',
      ewbStatus: 'success',
      processedAt: new Date('2024-01-15T10:30:00Z').toISOString(),
      invoiceNo: 'INV-2024-001',
      amount: '₹125,000.00',
      vendorName: 'ABC Technologies Pvt Ltd',
      buyerName: 'XYZ Corporation Ltd'
    },
    {
      id: randomUUID(),
      entityId: 'hsbc',
      fileName: 'delivery_challan_002.pdf',
      documentType: 'delivery-challan',
      processedBy: 'admin',
      ewbStatus: 'failed',
      processedAt: new Date('2024-01-16T14:20:00Z').toISOString(),
      invoiceNo: 'DC-2024-002',
      amount: '₹75,500.00',
      vendorName: 'DEF Logistics Ltd',
      buyerName: 'GHI Industries Ltd'
    },
    {
      id: randomUUID(),
      entityId: 'hsbc',
      fileName: 'boe_003.pdf',
      documentType: 'boe',
      processedBy: 'admin',
      ewbStatus: 'not_attempted',
      processedAt: new Date('2024-01-17T09:15:00Z').toISOString(),
      invoiceNo: 'BOE-2024-003',
      amount: '₹200,000.00',
      vendorName: 'JKL Exports Ltd',
      buyerName: 'MNO Imports Ltd'
    },
    {
      id: randomUUID(),
      entityId: 'hsbc',
      fileName: 'shipping_bill_004.pdf',
      documentType: 'shipping-bill',
      processedBy: 'admin',
      ewbStatus: 'success',
      processedAt: new Date('2024-01-18T16:45:00Z').toISOString(),
      invoiceNo: 'SB-2024-004',
      amount: '₹300,000.00',
      vendorName: 'PQR Shipping Ltd',
      buyerName: 'STU Trading Ltd'
    },
    {
      id: randomUUID(),
      entityId: 'hsbc',
      fileName: 'invoice_005.pdf',
      documentType: 'invoice',
      processedBy: 'admin',
      ewbStatus: 'success',
      processedAt: new Date('2024-01-19T11:30:00Z').toISOString(),
      invoiceNo: 'INV-2024-005',
      amount: '₹85,000.00',
      vendorName: 'VWX Services Ltd',
      buyerName: 'YZA Enterprises Ltd'
    },
    {
      id: randomUUID(),
      entityId: 'hsbc',
      fileName: 'invoice_006.pdf',
      documentType: 'invoice',
      processedBy: 'admin',
      ewbStatus: 'failed',
      processedAt: new Date('2024-01-20T13:45:00Z').toISOString(),
      invoiceNo: 'INV-2024-006',
      amount: '₹150,000.00',
      vendorName: 'BCD Manufacturing Ltd',
      buyerName: 'EFG Retail Ltd'
    },
    {
      id: randomUUID(),
      entityId: 'hsbc',
      fileName: 'delivery_challan_007.pdf',
      documentType: 'delivery-challan',
      processedBy: 'admin',
      ewbStatus: 'success',
      processedAt: new Date('2024-01-21T08:30:00Z').toISOString(),
      invoiceNo: 'DC-2024-007',
      amount: '₹95,000.00',
      vendorName: 'HIJ Transport Ltd',
      buyerName: 'KLM Distribution Ltd'
    },
    {
      id: randomUUID(),
      entityId: 'hsbc',
      fileName: 'boe_008.pdf',
      documentType: 'boe',
      processedBy: 'admin',
      ewbStatus: 'success',
      processedAt: new Date('2024-01-22T15:20:00Z').toISOString(),
      invoiceNo: 'BOE-2024-008',
      amount: '₹500,000.00',
      vendorName: 'NOP International Ltd',
      buyerName: 'QRS Global Ltd'
    },
    {
      id: randomUUID(),
      entityId: 'hsbc',
      fileName: 'shipping_bill_009.pdf',
      documentType: 'shipping-bill',
      processedBy: 'admin',
      ewbStatus: 'not_attempted',
      processedAt: new Date('2024-01-23T12:10:00Z').toISOString(),
      invoiceNo: 'SB-2024-009',
      amount: '₹750,000.00',
      vendorName: 'TUV Maritime Ltd',
      buyerName: 'WXY Trading Ltd'
    },
    {
      id: randomUUID(),
      entityId: 'hsbc',
      fileName: 'invoice_010.pdf',
      documentType: 'invoice',
      processedBy: 'admin',
      ewbStatus: 'success',
      processedAt: new Date('2024-01-24T09:45:00Z').toISOString(),
      invoiceNo: 'INV-2024-010',
      amount: '₹45,000.00',
      vendorName: 'ZAB Services Ltd',
      buyerName: 'CDE Enterprises Ltd'
    }
  ];

  // Prepare insert statement
  const insertStmt = db.prepare(`
    INSERT INTO pdf_processing_history (
      id, entity_id, file_name, document_type, processed_by, 
      ewb_status, processed_at, invoice_no, amount, vendor_name, buyer_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Insert sample data
  console.log('Inserting sample data...');
  sampleData.forEach((data, index) => {
    try {
      insertStmt.run(
        data.id,
        data.entityId,
        data.fileName,
        data.documentType,
        data.processedBy,
        data.ewbStatus,
        data.processedAt,
        data.invoiceNo,
        data.amount,
        data.vendorName,
        data.buyerName
      );
      console.log(`✅ ${index + 1}. ${data.fileName} - ${data.documentType} - ${data.ewbStatus}`);
    } catch (error) {
      console.log(`❌ ${index + 1}. Failed to insert ${data.fileName}: ${error.message}`);
    }
  });

  // Verify the data was inserted
  const finalCount = countStmt.get().count;
  console.log(`\n📊 Final records in pdf_processing_history: ${finalCount}`);

  // Show summary by document type
  const typeStats = db.prepare(`
    SELECT document_type, COUNT(*) as count 
    FROM pdf_processing_history 
    GROUP BY document_type 
    ORDER BY count DESC
  `).all();

  console.log('\n📋 Summary by Document Type:');
  typeStats.forEach(stat => {
    console.log(`   ${stat.document_type}: ${stat.count} records`);
  });

  // Show summary by EWB status
  const statusStats = db.prepare(`
    SELECT ewb_status, COUNT(*) as count 
    FROM pdf_processing_history 
    GROUP BY ewb_status 
    ORDER BY count DESC
  `).all();

  console.log('\n🎯 Summary by EWB Status:');
  statusStats.forEach(stat => {
    console.log(`   ${stat.ewb_status}: ${stat.count} records`);
  });

  // Show recent records
  const recentStmt = db.prepare(`
    SELECT file_name, document_type, ewb_status, processed_at 
    FROM pdf_processing_history 
    ORDER BY processed_at DESC 
    LIMIT 5
  `);
  const recentRecords = recentStmt.all();

  console.log('\n🕒 Recent Records:');
  recentRecords.forEach((record, index) => {
    console.log(`   ${index + 1}. ${record.file_name} (${record.document_type}) - ${record.ewb_status} - ${record.processed_at}`);
  });

  console.log('\n✅ PDF Processing History data added successfully!');
  console.log('🚀 You can now test the API endpoint: GET /api/pdf-processing-history');

} catch (error) {
  console.error('❌ Error:', error);
} finally {
  db.close();
}