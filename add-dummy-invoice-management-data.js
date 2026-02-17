import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try DB directory first, then root directory
const dbPath1 = path.join(__dirname, 'DB', 'invoice_automation.db');
const dbPath2 = path.join(__dirname, 'invoice_automation.db');
const dbPath = existsSync(dbPath1) ? dbPath1 : dbPath2;
const db = new Database(dbPath);

console.log('Adding dummy data for Invoice Management...\n');

// Add more dummy agents
const additionalAgents = [
  {
    username: 'agent_miller',
    password: 'temp_' + randomUUID().substring(0, 8),
    role: 'agent',
    entity_id: 'hsbc',
    company_name: 'Miller & Co. Financial Services',
    email: 'miller@millerco.com',
    phone: '+1-555-0201',
    department: 'Invoice Processing',
    status: 'active',
    notes: 'Experienced in handling complex invoice scenarios. Available during business hours.',
  },
  {
    username: 'agent_wilson',
    password: 'temp_' + randomUUID().substring(0, 8),
    role: 'agent',
    entity_id: 'hsbc',
    company_name: 'Wilson Accounting Solutions',
    email: 'wilson@wasolutions.com',
    phone: '+1-555-0202',
    department: 'Data Validation',
    status: 'active',
    notes: 'Specializes in GST compliance and tax validation. Quick turnaround time.',
  },
  {
    username: 'agent_moore',
    password: 'temp_' + randomUUID().substring(0, 8),
    role: 'agent',
    entity_id: 'hsbc',
    company_name: 'Moore Invoice Processing',
    email: 'moore@mooreip.com',
    phone: '+1-555-0203',
    department: 'Tax Compliance',
    status: 'active',
    notes: 'Handles high-volume invoice processing. Works on weekends.',
  },
  {
    username: 'agent_taylor',
    password: 'temp_' + randomUUID().substring(0, 8),
    role: 'agent',
    entity_id: 'hsbc',
    company_name: 'Taylor Business Services',
    email: 'taylor@tbservices.com',
    phone: '+1-555-0204',
    department: 'Accounts Payable',
    status: 'invited',
    notes: 'New agent onboarding. Background check in progress.',
  },
  {
    username: 'agent_anderson',
    password: 'temp_' + randomUUID().substring(0, 8),
    role: 'agent',
    entity_id: 'hsbc',
    company_name: 'Anderson Financial Group',
    email: 'anderson@afgroup.com',
    phone: '+1-555-0205',
    department: 'Invoice Processing',
    status: 'inactive',
    notes: 'Temporarily inactive. On leave until further notice.',
  },
  {
    username: 'agent_thomas',
    password: 'temp_' + randomUUID().substring(0, 8),
    role: 'agent',
    entity_id: 'hsbc',
    company_name: 'Thomas & Partners',
    email: 'thomas@tpartners.com',
    phone: '+1-555-0206',
    department: 'Data Validation',
    status: 'active',
    notes: 'Expert in OCR and PDF extraction validation. Handles technical issues.',
  },
  {
    username: 'agent_jackson',
    password: 'temp_' + randomUUID().substring(0, 8),
    role: 'agent',
    entity_id: 'hsbc',
    company_name: 'Jackson Invoice Solutions',
    email: 'jackson@jisolutions.com',
    phone: '+1-555-0207',
    department: 'Tax Compliance',
    status: 'active',
    notes: 'Focuses on tax-related invoice validation. Certified tax professional.',
  },
  {
    username: 'agent_white',
    password: 'temp_' + randomUUID().substring(0, 8),
    role: 'agent',
    entity_id: 'hsbc',
    company_name: 'White Accounting Services',
    email: 'white@waservices.com',
    phone: '+1-555-0208',
    department: 'Invoice Processing',
    status: 'active',
    notes: 'Handles international invoices and multi-currency transactions.',
  },
];

// Add more dummy tickets
const additionalTickets = [
  {
    ticket_id: 'TKT-2024-002001',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-101',
    invoice_source: 'qr',
    raised_by: 'agent_miller',
    raised_by_role: 'agent',
    comments: 'QR code scan failed multiple times. The QR code appears to be damaged or corrupted. Requesting manual entry or new invoice copy.',
    status: 'open',
    priority: 'high',
  },
  {
    ticket_id: 'TKT-2024-002002',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-102',
    invoice_source: 'pdf',
    raised_by: 'agent_wilson',
    raised_by_role: 'agent',
    comments: 'Invoice number format is non-standard. The invoice number contains special characters that our system does not recognize. Need clarification on correct format.',
    status: 'in_progress',
    priority: 'medium',
  },
  {
    ticket_id: 'TKT-2024-002003',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-103',
    invoice_source: 'egam',
    raised_by: 'user_robert',
    raised_by_role: 'user',
    comments: 'Vendor address is incomplete. The invoice only shows city name but missing street address and pin code. This is required for tax compliance.',
    status: 'open',
    priority: 'medium',
  },
  {
    ticket_id: 'TKT-2024-002004',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-104',
    invoice_source: 'qr',
    raised_by: 'agent_moore',
    raised_by_role: 'agent',
    comments: 'IRN validation error. The IRN provided in the QR code does not match the IRN in EGAM repository. Possible data sync issue or incorrect IRN.',
    status: 'open',
    priority: 'urgent',
  },
  {
    ticket_id: 'TKT-2024-002005',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-105',
    invoice_source: 'email',
    raised_by: 'user_jennifer',
    raised_by_role: 'user',
    comments: 'Email attachment is password protected. Cannot extract invoice data without password. Need to contact vendor for password or unencrypted copy.',
    status: 'in_progress',
    priority: 'high',
  },
  {
    ticket_id: 'TKT-2024-002006',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-106',
    invoice_source: 'pdf',
    raised_by: 'agent_taylor',
    raised_by_role: 'agent',
    comments: 'HSN code validation failed. The HSN code mentioned in the invoice does not match the product description. Need to verify correct HSN code.',
    status: 'open',
    priority: 'medium',
  },
  {
    ticket_id: 'TKT-2024-002007',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-107',
    invoice_source: 'qr',
    raised_by: 'agent_anderson',
    raised_by_role: 'agent',
    comments: 'Invoice date is older than 6 months. This invoice is from 8 months ago. Need approval from finance team to process such old invoices.',
    status: 'open',
    priority: 'low',
  },
  {
    ticket_id: 'TKT-2024-002008',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-108',
    invoice_source: 'egam',
    raised_by: 'user_emily',
    raised_by_role: 'user',
    comments: 'GSTIN format is incorrect. The GSTIN has 14 characters instead of 15. This is likely a data entry error. Please verify correct GSTIN.',
    status: 'resolved',
    priority: 'medium',
    resolved_by: 'admin',
    resolved_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    ticket_id: 'TKT-2024-002009',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-109',
    invoice_source: 'pdf',
    raised_by: 'agent_thomas',
    raised_by_role: 'agent',
    comments: 'Multiple line items have same HSN code but different tax rates. This is unusual. Need to verify if this is correct or if there is an error in tax calculation.',
    status: 'in_progress',
    priority: 'high',
  },
  {
    ticket_id: 'TKT-2024-002010',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-110',
    invoice_source: 'qr',
    raised_by: 'user_chris',
    raised_by_role: 'user',
    comments: 'Reverse charge mechanism not mentioned. The invoice is for services but does not mention if reverse charge applies. Need clarification.',
    status: 'open',
    priority: 'medium',
  },
  {
    ticket_id: 'TKT-2024-002011',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-111',
    invoice_source: 'email',
    raised_by: 'agent_jackson',
    raised_by_role: 'agent',
    comments: 'Invoice is in foreign language. The invoice is in Spanish and our OCR is not extracting data correctly. Need translation or manual entry.',
    status: 'open',
    priority: 'low',
  },
  {
    ticket_id: 'TKT-2024-002012',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-112',
    invoice_source: 'egam',
    raised_by: 'agent_white',
    raised_by_role: 'agent',
    comments: 'Credit note reference missing. This appears to be a credit note but the original invoice reference is not mentioned. Need to link with original invoice.',
    status: 'open',
    priority: 'high',
  },
  {
    ticket_id: 'TKT-2024-002013',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-113',
    invoice_source: 'pdf',
    raised_by: 'user_amanda',
    raised_by_role: 'user',
    comments: 'Invoice amount exceeds approval limit. The invoice amount is $50,000 which requires senior management approval. Please route to appropriate approver.',
    status: 'in_progress',
    priority: 'urgent',
  },
  {
    ticket_id: 'TKT-2024-002014',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-114',
    invoice_source: 'qr',
    raised_by: 'agent_miller',
    raised_by_role: 'agent',
    comments: 'Place of supply is different from shipping address. The place of supply shows Delhi but shipping address is Mumbai. This affects tax calculation (IGST vs CGST+SGST).',
    status: 'open',
    priority: 'high',
  },
  {
    ticket_id: 'TKT-2024-002015',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-115',
    invoice_source: 'egam',
    raised_by: 'user_kevin',
    raised_by_role: 'user',
    comments: 'Vendor bank details missing. The invoice does not have bank account number and IFSC code. This is required for payment processing.',
    status: 'resolved',
    priority: 'medium',
    resolved_by: 'admin',
    resolved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    ticket_id: 'TKT-2024-002016',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-116',
    invoice_source: 'pdf',
    raised_by: 'agent_wilson',
    raised_by_role: 'agent',
    comments: 'Invoice has multiple pages but only first page was scanned. The invoice has 5 pages but only page 1 is available. Need complete invoice for processing.',
    status: 'open',
    priority: 'medium',
  },
  {
    ticket_id: 'TKT-2024-002017',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-117',
    invoice_source: 'qr',
    raised_by: 'user_natalie',
    raised_by_role: 'user',
    comments: 'E-way bill number not mentioned. The invoice is for goods worth more than ₹50,000 but e-way bill number is missing. This is mandatory for transportation.',
    status: 'open',
    priority: 'high',
  },
  {
    ticket_id: 'TKT-2024-002018',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-118',
    invoice_source: 'email',
    raised_by: 'agent_moore',
    raised_by_role: 'agent',
    comments: 'Invoice is a proforma invoice. This is a proforma invoice, not a tax invoice. Need actual tax invoice for processing. Proforma invoices cannot be used for tax credit.',
    status: 'open',
    priority: 'low',
  },
  {
    ticket_id: 'TKT-2024-002019',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-119',
    invoice_source: 'egam',
    raised_by: 'agent_taylor',
    raised_by_role: 'agent',
    comments: 'Invoice cancellation request. The vendor has requested cancellation of this invoice. Need to verify if goods/services were received and process cancellation accordingly.',
    status: 'in_progress',
    priority: 'medium',
  },
  {
    ticket_id: 'TKT-2024-002020',
    entity_id: 'hsbc',
    invoice_no: 'INV-2024-120',
    invoice_source: 'pdf',
    raised_by: 'user_brian',
    raised_by_role: 'user',
    comments: 'Discount amount calculation error. The invoice shows a discount of 10% but the discounted amount does not match. Manual calculation shows different amount.',
    status: 'open',
    priority: 'medium',
  },
];

try {
  // Insert additional agents
  const agentStmt = db.prepare(`
    INSERT INTO users (id, username, password, role, entity_id, company_name, email, phone, department, status, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  let agentsAdded = 0;
  for (const agent of additionalAgents) {
    try {
      // Check if agent already exists
      const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(agent.username);
      if (existing) {
        console.log(`Agent ${agent.username} already exists, skipping...`);
        continue;
      }

      const id = randomUUID();
      agentStmt.run(
        id,
        agent.username,
        agent.password,
        agent.role,
        agent.entity_id,
        agent.company_name,
        agent.email,
        agent.phone,
        agent.department,
        agent.status,
        agent.notes
      );
      agentsAdded++;
    } catch (error) {
      console.warn(`Error adding agent ${agent.username}:`, error.message);
    }
  }

  console.log(`✓ Added ${agentsAdded} new agents\n`);

  // Insert additional tickets
  const ticketStmt = db.prepare(`
    INSERT INTO tickets (id, ticket_id, entity_id, invoice_no, invoice_source, raised_by, raised_by_role, comments, status, priority, created_at, updated_at, resolved_at, resolved_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?)
  `);

  let ticketsAdded = 0;
  for (const ticket of additionalTickets) {
    try {
      // Check if ticket already exists
      const existing = db.prepare('SELECT id FROM tickets WHERE ticket_id = ?').get(ticket.ticket_id);
      if (existing) {
        console.log(`Ticket ${ticket.ticket_id} already exists, skipping...`);
        continue;
      }

      const id = randomUUID();
      ticketStmt.run(
        id,
        ticket.ticket_id,
        ticket.entity_id,
        ticket.invoice_no,
        ticket.invoice_source,
        ticket.raised_by,
        ticket.raised_by_role,
        ticket.comments,
        ticket.status,
        ticket.priority,
        ticket.resolved_at || null,
        ticket.resolved_by || null
      );
      ticketsAdded++;
    } catch (error) {
      console.warn(`Error adding ticket ${ticket.ticket_id}:`, error.message);
    }
  }

  console.log(`✓ Added ${ticketsAdded} new tickets\n`);

  // Show summary
  const totalAgents = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('agent');
  const totalTickets = db.prepare('SELECT COUNT(*) as count FROM tickets').get();
  const totalInvoicesWithTickets = db.prepare('SELECT COUNT(DISTINCT invoice_no) as count FROM tickets').get();

  console.log('Summary:');
  console.log(`  Total Agents: ${totalAgents.count}`);
  console.log(`  Total Tickets: ${totalTickets.count}`);
  console.log(`  Unique Invoices with Tickets: ${totalInvoicesWithTickets.count}`);
  console.log('\n✓ Dummy data added successfully!');

} catch (error) {
  console.error('Error adding dummy data:', error);
  process.exit(1);
} finally {
  db.close();
}

