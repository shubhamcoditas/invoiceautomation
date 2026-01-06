// Database analysis script
import Database from 'better-sqlite3';

// Initialize SQLite database
const db = new Database('./invoice_automation.db');

console.log('📊 Database Analysis Report');
console.log('==========================\n');

// Function to get table statistics
function getTableStats(tableName) {
  const countStmt = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`);
  const count = countStmt.get().count;
  
  // Get sample data
  const sampleStmt = db.prepare(`SELECT * FROM ${tableName} LIMIT 3`);
  const samples = sampleStmt.all();
  
  return { count, samples };
}

// Analyze each table
const tables = [
  'users',
  'qr_data', 
  'pdf_data',
  'egam_repository',
  'egam_audit_logs',
  'system_logs',
  'api_logs',
  'pdf_processing_history',
  'bulk_qr_batches',
  'bulk_qr_processing'
];

let totalRecords = 0;

tables.forEach(table => {
  try {
    const stats = getTableStats(table);
    totalRecords += stats.count;
    
    console.log(`📋 ${table.toUpperCase()}`);
    console.log(`   Records: ${stats.count}`);
    
    if (stats.samples.length > 0) {
      console.log(`   Sample data:`);
      stats.samples.forEach((sample, index) => {
        const keys = Object.keys(sample).slice(0, 3); // Show first 3 fields
        const sampleData = keys.map(key => `${key}: ${sample[key]}`).join(', ');
        console.log(`     ${index + 1}. ${sampleData}...`);
      });
    }
    console.log('');
  } catch (error) {
    console.log(`❌ Error analyzing ${table}: ${error.message}`);
  }
});

// Get some interesting statistics
console.log('📈 Interesting Statistics');
console.log('========================\n');

// User roles distribution
try {
  const roleStats = db.prepare(`
    SELECT role, COUNT(*) as count 
    FROM users 
    GROUP BY role 
    ORDER BY count DESC
  `).all();
  
  console.log('👥 User Roles:');
  roleStats.forEach(stat => {
    console.log(`   ${stat.role}: ${stat.count} users`);
  });
  console.log('');
} catch (error) {
  console.log('❌ Could not analyze user roles');
}

// QR Data status distribution
try {
  const qrStatusStats = db.prepare(`
    SELECT status, COUNT(*) as count 
    FROM qr_data 
    GROUP BY status 
    ORDER BY count DESC
  `).all();
  
  console.log('📱 QR Data Status:');
  qrStatusStats.forEach(stat => {
    console.log(`   ${stat.status}: ${stat.count} records`);
  });
  console.log('');
} catch (error) {
  console.log('❌ Could not analyze QR data status');
}

// System logs by level
try {
  const logLevelStats = db.prepare(`
    SELECT level, COUNT(*) as count 
    FROM system_logs 
    GROUP BY level 
    ORDER BY count DESC
  `).all();
  
  console.log('📝 System Log Levels:');
  logLevelStats.forEach(stat => {
    console.log(`   ${stat.level}: ${stat.count} logs`);
  });
  console.log('');
} catch (error) {
  console.log('❌ Could not analyze system log levels');
}

// Recent activity (last 7 days)
try {
  const recentActivity = db.prepare(`
    SELECT 
      'qr_data' as table_name, 
      COUNT(*) as count 
    FROM qr_data 
    WHERE extracted_at > datetime('now', '-7 days')
    UNION ALL
    SELECT 
      'pdf_data' as table_name, 
      COUNT(*) as count 
    FROM pdf_data 
    WHERE extracted_at > datetime('now', '-7 days')
    UNION ALL
    SELECT 
      'system_logs' as table_name, 
      COUNT(*) as count 
    FROM system_logs 
    WHERE timestamp > datetime('now', '-7 days')
  `).all();
  
  console.log('📅 Recent Activity (Last 7 Days):');
  recentActivity.forEach(stat => {
    console.log(`   ${stat.table_name}: ${stat.count} records`);
  });
  console.log('');
} catch (error) {
  console.log('❌ Could not analyze recent activity');
}

// Database size
try {
  const dbSize = db.prepare('PRAGMA page_count').get();
  const pageSize = db.prepare('PRAGMA page_size').get();
  const sizeInMB = (dbSize.page_count * pageSize.page_size) / (1024 * 1024);
  
  console.log('💾 Database Size:');
  console.log(`   ${sizeInMB.toFixed(2)} MB`);
  console.log('');
} catch (error) {
  console.log('❌ Could not get database size');
}

console.log('🎯 Summary');
console.log('==========');
console.log(`Total Records: ${totalRecords.toLocaleString()}`);
console.log(`Tables: ${tables.length}`);
console.log('\n✅ Database analysis complete!');

db.close();
