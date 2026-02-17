// Test script to verify database service returns camelCase field names
import { databaseService } from './server/database.ts';

async function testDatabaseService() {
  console.log('Testing database service...\n');
  
  try {
    const qrData = await databaseService.getAllQRData();
    console.log('✅ QR Data fetched successfully');
    console.log('First record:', JSON.stringify(qrData[0], null, 2));
    
    // Check if field names are camelCase
    const firstRecord = qrData[0];
    if (firstRecord) {
      console.log('\n🔍 Checking field name format:');
      console.log('Has entityId (camelCase):', 'entityId' in firstRecord);
      console.log('Has entity_id (snake_case):', 'entity_id' in firstRecord);
      console.log('Has invoiceNo (camelCase):', 'invoiceNo' in firstRecord);
      console.log('Has invoice_no (snake_case):', 'invoice_no' in firstRecord);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testDatabaseService();

