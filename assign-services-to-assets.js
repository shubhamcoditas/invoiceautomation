import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'DB', 'invoice_automation.db');
const db = new Database(dbPath);

console.log('Assigning services to existing assets...\n');

// Check if service_id column exists, if not add it
try {
  db.prepare('SELECT service_id FROM assets LIMIT 1').get();
} catch (e) {
  console.log('Adding service_id column to assets table...');
  db.prepare('ALTER TABLE assets ADD COLUMN service_id TEXT').run();
  console.log('✓ Column added successfully\n');
}

// Get all active services
const services = db.prepare('SELECT * FROM services WHERE status = ? ORDER BY created_at ASC').all('active');
console.log(`Found ${services.length} active services`);

if (services.length === 0) {
  console.log('No services found. Please create services first.');
  db.close();
  process.exit(0);
}

// Get all assets without service assignments
const assets = db.prepare('SELECT * FROM assets WHERE (service_id IS NULL OR service_id = \'\') AND status = ? ORDER BY created_at ASC').all('active');
console.log(`Found ${assets.length} assets without service assignments\n`);

if (assets.length === 0) {
  console.log('All assets already have service assignments.');
  db.close();
  process.exit(0);
}

// Assign services to assets in a round-robin fashion
let serviceIndex = 0;
let assignedCount = 0;

const updateStmt = db.prepare('UPDATE assets SET service_id = ?, updated_at = ? WHERE id = ?');

for (const asset of assets) {
  const service = services[serviceIndex % services.length];
  const now = new Date().toISOString();
  
  updateStmt.run(service.id, now, asset.id);
  assignedCount++;
  serviceIndex++;
  
  console.log(`  ✓ Assigned "${service.name}" (${service.service_id}) to asset "${asset.name}" (${asset.asset_code})`);
}

console.log(`\n✓ Successfully assigned services to ${assignedCount} assets`);
db.close();

