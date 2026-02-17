/**
 * Query logs by Request ID directly from the database
 * Usage: node query-request-id-db.js <request-id>
 * Example: node query-request-id-db.js 56aaa918-8fe9-4091-ab75-e6964f41ebb3
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.join(__dirname, 'DB', 'invoice_automation.db');

const requestId = process.argv[2] || '56aaa918-8fe9-4091-ab75-e6964f41ebb3';

try {
  const db = new Database(dbPath, { readonly: true });
  
  console.log(`\n🔍 Querying database logs for Request ID: ${requestId}\n`);
  console.log('='.repeat(80));

  // Query System Logs
  console.log('\n📋 SYSTEM LOGS:');
  console.log('-'.repeat(80));
  
  let stmt;
  try {
    stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        timestamp,
        level,
        module,
        message,
        details,
        user,
        request_id as requestId
      FROM system_logs 
      WHERE request_id = ?
      ORDER BY timestamp DESC
    `);
  } catch (e) {
    // Fallback if request_id column doesn't exist
    console.log('   ⚠️  request_id column not found in system_logs table.');
    console.log('   This might be an older database schema.');
    process.exit(0);
  }

  const systemLogs = stmt.all(requestId);
  
  if (systemLogs.length === 0) {
    console.log('   No system logs found for this Request ID.');
  } else {
    console.log(`   Found ${systemLogs.length} system log(s):\n`);
    systemLogs.forEach((log, index) => {
      console.log(`   ${index + 1}. [${log.level}] ${log.module}`);
      console.log(`      Message: ${log.message}`);
      if (log.details) {
        console.log(`      Details: ${log.details}`);
      }
      console.log(`      Timestamp: ${new Date(log.timestamp).toLocaleString()}`);
      console.log(`      Request ID: ${log.requestId}`);
      if (log.user) {
        console.log(`      User: ${log.user}`);
      }
      console.log('');
    });
  }

  // Query API Logs
  console.log('\n📡 API LOGS:');
  console.log('-'.repeat(80));
  
  try {
    stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        timestamp,
        method,
        endpoint,
        status,
        response_time as responseTime,
        parameters,
        response,
        request_id as requestId
      FROM api_logs 
      WHERE request_id = ?
      ORDER BY timestamp DESC
    `);
  } catch (e) {
    console.log('   ⚠️  request_id column not found in api_logs table or table does not exist.');
    console.log('   This might be an older database schema.');
    db.close();
    process.exit(0);
  }

  const apiLogs = stmt.all(requestId);
  
  if (apiLogs.length === 0) {
    console.log('   No API logs found for this Request ID.');
  } else {
    console.log(`   Found ${apiLogs.length} API log(s):\n`);
    apiLogs.forEach((log, index) => {
      console.log(`   ${index + 1}. [${log.status}] ${log.method} ${log.endpoint}`);
      console.log(`      Response Time: ${log.responseTime || 'N/A'}ms`);
      if (log.parameters) {
        try {
          const params = typeof log.parameters === 'string' ? JSON.parse(log.parameters) : log.parameters;
          if (Object.keys(params).length > 0) {
            console.log(`      Parameters: ${JSON.stringify(params, null, 2)}`);
          }
        } catch (e) {
          // Ignore JSON parse errors
        }
      }
      if (log.response) {
        try {
          const response = typeof log.response === 'string' ? JSON.parse(log.response) : log.response;
          const responseStr = JSON.stringify(response);
          const responsePreview = responseStr.substring(0, 200);
          console.log(`      Response: ${responsePreview}${responseStr.length > 200 ? '...' : ''}`);
        } catch (e) {
          console.log(`      Response: ${log.response}`);
        }
      }
      console.log(`      Timestamp: ${new Date(log.timestamp).toLocaleString()}`);
      console.log(`      Request ID: ${log.requestId}`);
      console.log('');
    });
  }

  console.log('='.repeat(80));
  console.log('\n✅ Query completed!\n');
  
  db.close();
} catch (error) {
  console.error('\n❌ Error querying database:');
  console.error(error.message);
  if (error.code === 'SQLITE_CANTOPEN') {
    console.error('\n💡 Tip: Make sure the database file exists at:', dbPath);
  }
  process.exit(1);
}

