const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing and Starting Server...');
console.log('================================\n');

try {
  // Check if dist directory exists
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.log('📦 Building the project...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!\n');
  } else {
    console.log('✅ Dist directory already exists\n');
  }

  // Check if dist/index.js exists
  const indexPath = path.join(distPath, 'index.js');
  if (!fs.existsSync(indexPath)) {
    console.log('📦 Rebuilding the project...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!\n');
  } else {
    console.log('✅ dist/index.js exists\n');
  }

  // Add PDF processing history data
  console.log('📄 Adding PDF processing history data...');
  execSync('node add-pdf-history-data.js', { stdio: 'inherit' });
  console.log('✅ PDF data added successfully!\n');

  // Start the server
  console.log('🚀 Starting the server...');
  console.log('Server will be available at: http://localhost:5000');
  console.log('API endpoint: http://localhost:5000/api/pdf-processing-history');
  console.log('\nPress Ctrl+C to stop the server\n');
  
  execSync('npm start', { stdio: 'inherit' });

} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\n🔧 Manual steps to fix:');
  console.log('1. Run: npm run build');
  console.log('2. Run: node add-pdf-history-data.js');
  console.log('3. Run: npm start');
}
