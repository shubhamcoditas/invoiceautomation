/**
 * Query logs by Request ID
 * Usage: node query-request-id.js <request-id>
 * Example: node query-request-id.js 56aaa918-8fe9-4091-ab75-e6964f41ebb3
 */

const requestId = process.argv[2] || '56aaa918-8fe9-4091-ab75-e6964f41ebb3';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function queryLogs() {
  console.log(`\n🔍 Querying logs for Request ID: ${requestId}\n`);
  console.log('='.repeat(80));

  try {
    // Query System Logs
    console.log('\n📋 SYSTEM LOGS:');
    console.log('-'.repeat(80));
    const systemLogsResponse = await fetch(`${API_BASE_URL}/api/system-logs?requestId=${requestId}`);
    
    if (!systemLogsResponse.ok) {
      console.error(`❌ Error fetching system logs: ${systemLogsResponse.status} ${systemLogsResponse.statusText}`);
    } else {
      const systemLogs = await systemLogsResponse.json();
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
          console.log('');
        });
      }
    }

    // Query API Logs
    console.log('\n📡 API LOGS:');
    console.log('-'.repeat(80));
    const apiLogsResponse = await fetch(`${API_BASE_URL}/api/api-logs?requestId=${requestId}`);
    
    if (!apiLogsResponse.ok) {
      console.error(`❌ Error fetching API logs: ${apiLogsResponse.status} ${apiLogsResponse.statusText}`);
    } else {
      const apiLogs = await apiLogsResponse.json();
      if (apiLogs.length === 0) {
        console.log('   No API logs found for this Request ID.');
      } else {
        console.log(`   Found ${apiLogs.length} API log(s):\n`);
        apiLogs.forEach((log, index) => {
          console.log(`   ${index + 1}. [${log.status}] ${log.method} ${log.endpoint}`);
          console.log(`      Response Time: ${log.responseTime || 'N/A'}ms`);
          if (log.parameters && Object.keys(log.parameters).length > 0) {
            console.log(`      Parameters: ${JSON.stringify(log.parameters, null, 2)}`);
          }
          if (log.response && Object.keys(log.response).length > 0) {
            const responsePreview = JSON.stringify(log.response).substring(0, 200);
            console.log(`      Response: ${responsePreview}${JSON.stringify(log.response).length > 200 ? '...' : ''}`);
          }
          console.log(`      Timestamp: ${new Date(log.timestamp).toLocaleString()}`);
          console.log(`      Request ID: ${log.requestId}`);
          console.log('');
        });
      }
    }

    console.log('='.repeat(80));
    console.log('\n✅ Query completed!\n');

  } catch (error) {
    console.error('\n❌ Error querying logs:');
    console.error(error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Tip: Make sure the server is running on', API_BASE_URL);
      console.error('   Start the server with: npm run dev');
    }
    process.exit(1);
  }
}

// Run the query
queryLogs();

