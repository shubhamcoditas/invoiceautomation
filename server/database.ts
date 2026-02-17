import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize SQLite database
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'DB', 'invoice_automation.db');

// Ensure DB directory exists
import { existsSync, mkdirSync } from 'fs';
const dbDir = path.dirname(dbPath);
if (!existsSync(dbDir)) {
  console.log('[Database] Creating DB directory:', dbDir);
  mkdirSync(dbDir, { recursive: true });
}

console.log('[Database] Initializing database at:', dbPath);
const db = new Database(dbPath);
console.log('[Database] Database connection established');

// Enable foreign keys (SQLite requires this to be enabled)
db.pragma('foreign_keys = ON');

// Seed dummy agents
function seedDummyAgents() {
  try {
    // Check if agents already exist - we'll add more if less than 10 exist
    const existingAgents = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('agent') as any;
    if (existingAgents && existingAgents.count >= 15) {
      return; // Enough agents already exist, skip seeding
    }

    const dummyAgents = [
      {
        username: 'agent_smith',
        password: 'temp_' + randomUUID().substring(0, 8),
        role: 'agent',
        entity_id: 'hsbc',
        company_name: 'Smith & Associates',
        email: 'agent.smith@example.com',
        phone: '+1-555-0101',
        department: 'Invoice Processing',
        status: 'active',
        notes: 'Primary agent for invoice processing. Experienced with PDF extraction.',
        metadata: JSON.stringify({ firstName: 'John', lastName: 'Smith', comments: 'Primary agent for invoice processing. Experienced with PDF extraction.' }),
      },
      {
        username: 'agent_johnson',
        password: 'temp_' + randomUUID().substring(0, 8),
        role: 'agent',
        entity_id: 'hsbc',
        company_name: 'Johnson Financial Services',
        email: 'johnson@jfs.com',
        phone: '+1-555-0102',
        department: 'Data Validation',
        status: 'active',
        notes: 'Specializes in data validation and quality assurance.',
      },
      {
        username: 'agent_williams',
        password: 'temp_' + randomUUID().substring(0, 8),
        role: 'agent',
        entity_id: 'hsbc',
        company_name: 'Williams Tax Solutions',
        email: 'williams@wtsolutions.com',
        phone: '+1-555-0103',
        department: 'Tax Compliance',
        status: 'active',
        notes: 'Handles tax-related invoice processing and compliance checks.',
      },
      {
        username: 'agent_brown',
        password: 'temp_' + randomUUID().substring(0, 8),
        role: 'agent',
        entity_id: 'hsbc',
        company_name: 'Brown Accounting Group',
        email: 'brown@bagroup.com',
        phone: '+1-555-0104',
        department: 'Accounts Payable',
        status: 'invited',
        notes: 'New agent, pending activation. Background in accounting.',
      },
      {
        username: 'agent_davis',
        password: 'temp_' + randomUUID().substring(0, 8),
        role: 'agent',
        entity_id: 'hsbc',
        company_name: 'Davis Invoice Services',
        email: 'davis@diservices.com',
        phone: '+1-555-0105',
        department: 'Invoice Processing',
        status: 'active',
        notes: 'Handles bulk invoice processing. Available 24/7.',
      },
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

    const stmt = db.prepare(`
      INSERT INTO users (id, username, password, role, entity_id, company_name, email, phone, department, status, notes, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    let agentsAdded = 0;
    for (const agent of dummyAgents) {
      // Check if agent already exists
      const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(agent.username) as any;
      if (existing) {
        continue; // Skip if already exists
      }
      const id = randomUUID();
      // Extract first and last name from username for metadata if not provided
      const nameParts = agent.username.replace('agent_', '').split('_');
      const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'Agent';
      const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : '';
      const metadata = agent.metadata || JSON.stringify({ 
        firstName, 
        lastName, 
        comments: agent.notes || '' 
      });
      
      stmt.run(
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
        agent.notes,
        metadata
      );
      agentsAdded++;
    }

    console.log(`[Database] Seeded ${agentsAdded} dummy agents`);
  } catch (error: any) {
    // Ignore errors during seeding (e.g., if agents already exist)
    console.warn('[Database] Could not seed dummy agents:', error.message);
  }
}

// Seed dummy tickets
function seedDummyTickets() {
  try {
    // Check if tickets already exist - we'll add more if less than 30 exist
    const existingTickets = db.prepare('SELECT COUNT(*) as count FROM tickets').get() as any;
    if (existingTickets && existingTickets.count >= 40) {
      return; // Enough tickets already exist, skip seeding
    }

    const dummyTickets = [
      {
        ticket_id: 'TKT-2024-001234',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-001',
        invoice_source: 'qr',
        raised_by: 'agent_smith',
        raised_by_role: 'agent',
        comments: 'Invoice amount mismatch detected. The total amount in the invoice does not match the QR code data. Please verify the calculations.',
        status: 'open',
        priority: 'high',
      },
      {
        ticket_id: 'TKT-2024-001235',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-002',
        invoice_source: 'pdf',
        raised_by: 'user_john',
        raised_by_role: 'user',
        comments: 'Unable to extract invoice number from PDF. The document appears to be scanned and the OCR is not recognizing the invoice number field.',
        status: 'in_progress',
        priority: 'medium',
      },
      {
        ticket_id: 'TKT-2024-001236',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-003',
        invoice_source: 'egam',
        raised_by: 'agent_johnson',
        raised_by_role: 'agent',
        comments: 'GSTIN validation failed. The vendor GSTIN in the invoice does not match the records in EGAM repository. Need manual verification.',
        status: 'open',
        priority: 'urgent',
      },
      {
        ticket_id: 'TKT-2024-001237',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-004',
        invoice_source: 'email',
        raised_by: 'user_mary',
        raised_by_role: 'user',
        comments: 'Invoice date is in the future. The invoice date shows 2025-01-15 but current date is 2024-12-10. This seems incorrect.',
        status: 'resolved',
        priority: 'low',
        resolved_by: 'admin',
        resolved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        ticket_id: 'TKT-2024-001238',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-005',
        invoice_source: 'qr',
        raised_by: 'agent_williams',
        raised_by_role: 'agent',
        comments: 'IRN not found in EGAM. The invoice has a valid IRN but it is not present in the EGAM repository. Please check if this is a new invoice that needs to be synced.',
        status: 'open',
        priority: 'high',
      },
      {
        ticket_id: 'TKT-2024-001239',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-006',
        invoice_source: 'pdf',
        raised_by: 'agent_brown',
        raised_by_role: 'agent',
        comments: 'Tax calculation error. The CGST and SGST amounts do not add up correctly. CGST shows 9% but SGST shows 8%. Both should be equal.',
        status: 'in_progress',
        priority: 'medium',
      },
      {
        ticket_id: 'TKT-2024-001240',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-007',
        invoice_source: 'qr',
        raised_by: 'user_david',
        raised_by_role: 'user',
        comments: 'Duplicate invoice detected. This invoice number already exists in the system with a different IRN. Please verify if this is a duplicate or a corrected invoice.',
        status: 'open',
        priority: 'high',
      },
      {
        ticket_id: 'TKT-2024-001241',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-008',
        invoice_source: 'egam',
        raised_by: 'agent_davis',
        raised_by_role: 'agent',
        comments: 'Vendor name mismatch. The vendor name in the invoice does not match the vendor name associated with the GSTIN in our records.',
        status: 'resolved',
        priority: 'medium',
        resolved_by: 'admin',
        resolved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        ticket_id: 'TKT-2024-001242',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-009',
        invoice_source: 'pdf',
        raised_by: 'user_sarah',
        raised_by_role: 'user',
        comments: 'Missing HSN code. The invoice items do not have HSN codes mentioned. This is required for tax compliance.',
        status: 'open',
        priority: 'medium',
      },
      {
        ticket_id: 'TKT-2024-001243',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-010',
        invoice_source: 'qr',
        raised_by: 'agent_smith',
        raised_by_role: 'agent',
        comments: 'Invoice type mismatch. The invoice is marked as B2B but the buyer GSTIN is missing. B2B invoices must have buyer GSTIN.',
        status: 'in_progress',
        priority: 'high',
      },
      {
        ticket_id: 'TKT-2024-001244',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-011',
        invoice_source: 'email',
        raised_by: 'user_mike',
        raised_by_role: 'user',
        comments: 'Attachment corrupted. The PDF file attached to the email cannot be opened. Please request a new copy from the vendor.',
        status: 'open',
        priority: 'low',
      },
      {
        ticket_id: 'TKT-2024-001245',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-012',
        invoice_source: 'egam',
        raised_by: 'agent_johnson',
        raised_by_role: 'agent',
        comments: 'Payment terms not clear. The invoice mentions "Net 30" but the due date calculation seems incorrect. Please verify the payment terms.',
        status: 'closed',
        priority: 'low',
        resolved_by: 'admin',
        resolved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        ticket_id: 'TKT-2024-001246',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-013',
        invoice_source: 'qr',
        raised_by: 'agent_williams',
        raised_by_role: 'agent',
        comments: 'Currency mismatch. The invoice amount is in USD but our system expects INR. Need currency conversion or clarification.',
        status: 'open',
        priority: 'urgent',
      },
      {
        ticket_id: 'TKT-2024-001247',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-014',
        invoice_source: 'pdf',
        raised_by: 'user_lisa',
        raised_by_role: 'user',
        comments: 'Signature missing. The invoice does not have a digital signature or authorized signatory. This may not be valid for processing.',
        status: 'in_progress',
        priority: 'medium',
      },
      {
        ticket_id: 'TKT-2024-001248',
        entity_id: 'hsbc',
        invoice_no: 'INV-2024-015',
        invoice_source: 'qr',
        raised_by: 'agent_brown',
        raised_by_role: 'agent',
        comments: 'Place of supply incorrect. The place of supply mentioned does not match the buyer address. This affects IGST vs CGST+SGST calculation.',
        status: 'open',
        priority: 'high',
      },
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

    const stmt = db.prepare(`
      INSERT INTO tickets (id, ticket_id, entity_id, invoice_no, invoice_source, raised_by, raised_by_role, comments, status, priority, created_at, updated_at, resolved_at, resolved_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?)
    `);

    let ticketsAdded = 0;
    for (const ticket of dummyTickets) {
      // Check if ticket already exists
      const existing = db.prepare('SELECT id FROM tickets WHERE ticket_id = ?').get(ticket.ticket_id) as any;
      if (existing) {
        continue; // Skip if already exists
      }
      const id = randomUUID();
      stmt.run(
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
    }

    console.log(`[Database] Seeded ${ticketsAdded} dummy tickets`);
  } catch (error: any) {
    // Ignore errors during seeding (e.g., if tickets already exist)
    console.warn('[Database] Could not seed dummy tickets:', error.message);
  }
}

// Create tables
export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'business_user',
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      company_name TEXT,
      email TEXT,
      phone TEXT,
      department TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      notes TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add new columns to existing users table if they don't exist (migration)
  try {
    db.exec(`ALTER TABLE users ADD COLUMN company_name TEXT`);
  } catch (e: any) {
    // Column already exists, ignore
  }
  try {
    db.exec(`ALTER TABLE users ADD COLUMN email TEXT`);
  } catch (e: any) {
    // Column already exists, ignore
  }
  try {
    db.exec(`ALTER TABLE users ADD COLUMN phone TEXT`);
  } catch (e: any) {
    // Column already exists, ignore
  }
  try {
    db.exec(`ALTER TABLE users ADD COLUMN department TEXT`);
  } catch (e: any) {
    // Column already exists, ignore
  }
  try {
    db.exec(`ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'`);
  } catch (e: any) {
    // Column already exists, ignore
  }
  try {
    db.exec(`ALTER TABLE users ADD COLUMN notes TEXT`);
  } catch (e: any) {
    // Column already exists, ignore
  }
  try {
    db.exec(`ALTER TABLE users ADD COLUMN metadata TEXT`);
  } catch (e: any) {
    // Column already exists, ignore
  }
  try {
    db.exec(`ALTER TABLE users ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`);
  } catch (e: any) {
    // Column already exists, ignore
  }

  // Seed dummy agents if none exist
  seedDummyAgents();

  // Seed dummy tickets if none exist
  seedDummyTickets();

  // QR Data table
  db.exec(`
    CREATE TABLE IF NOT EXISTS qr_data (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      irn TEXT NOT NULL,
      gstin TEXT NOT NULL,
      invoice_no TEXT NOT NULL,
      date TEXT NOT NULL,
      total_amount TEXT NOT NULL,
      buyer_gstin TEXT NOT NULL,
      seller_gstin TEXT NOT NULL,
      invoice_type TEXT NOT NULL,
      qr_string TEXT NOT NULL,
      processed_by TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'success',
      extracted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // PDF Data table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pdf_data (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      file_name TEXT NOT NULL,
      file_path TEXT,
      invoice_no TEXT NOT NULL,
      date TEXT NOT NULL,
      irn TEXT NOT NULL,
      gstin TEXT NOT NULL,
      amount TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'processed',
      extracted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Add file_path column if it doesn't exist (for existing databases)
  try {
    db.exec(`ALTER TABLE pdf_data ADD COLUMN file_path TEXT`);
  } catch (e) {
    // Column already exists, ignore
  }

  // EGAM Repository table
  db.exec(`
    CREATE TABLE IF NOT EXISTS egam_repository (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      irn TEXT UNIQUE NOT NULL,
      invoice_no TEXT NOT NULL,
      date TEXT NOT NULL,
      vendor_gstin TEXT NOT NULL,
      amount TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'processed',
      fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // EGAM Audit Logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS egam_audit_logs (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      pull_type TEXT NOT NULL,
      status TEXT NOT NULL,
      records_count INTEGER,
      started_at DATETIME NOT NULL,
      completed_at DATETIME,
      error_message TEXT,
      next_scheduled_at DATETIME
    )
  `);

  // PDF Processing History table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pdf_processing_history (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      file_name TEXT NOT NULL,
      document_type TEXT NOT NULL,
      processed_by TEXT NOT NULL,
      ewb_status TEXT NOT NULL,
      processed_at DATETIME NOT NULL,
      invoice_no TEXT,
      amount TEXT,
      vendor_name TEXT,
      buyer_name TEXT
    )
  `);

  // Tickets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      ticket_id TEXT UNIQUE NOT NULL,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      invoice_no TEXT NOT NULL,
      invoice_id TEXT,
      invoice_source TEXT,
      raised_by TEXT NOT NULL,
      raised_by_role TEXT NOT NULL,
      comments TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      priority TEXT NOT NULL DEFAULT 'medium',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_at DATETIME,
      resolved_by TEXT
    )
  `);

  // System Logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_logs (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      level TEXT NOT NULL,
      module TEXT NOT NULL,
      message TEXT NOT NULL,
      details TEXT,
      user TEXT
    )
  `);

  // API Logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_logs (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      api_name TEXT NOT NULL,
      api_type TEXT NOT NULL,
      parameters TEXT,
      response TEXT,
      status TEXT NOT NULL,
      response_time INTEGER,
      endpoint TEXT
    )
  `);

  // Bulk QR Batches table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bulk_qr_batches (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      file_name TEXT NOT NULL,
      total_records INTEGER NOT NULL,
      processed_records INTEGER DEFAULT 0,
      success_records INTEGER DEFAULT 0,
      failed_records INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'processing',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    )
  `);

  // Bulk QR Processing table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bulk_qr_processing (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      batch_id TEXT NOT NULL,
      qr_string TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      processed_at DATETIME,
      extracted_data TEXT,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Email Data table
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_data (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      sender TEXT NOT NULL,
      subject TEXT NOT NULL,
      received_at DATETIME NOT NULL,
      attachments TEXT,
      processing_status TEXT NOT NULL DEFAULT 'queued',
      invoice_type TEXT,
      has_qr_in_egam INTEGER DEFAULT 0,
      invoice_no TEXT,
      amount TEXT,
      vendor_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Verticals table for Cost Model
  db.exec(`
    CREATE TABLE IF NOT EXISTS verticals (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      vertical_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT
    )
  `);

  // Asset Class table for Cost Model
  db.exec(`
    CREATE TABLE IF NOT EXISTS asset_class (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      class_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT
    )
  `);

  // Asset Type table for Cost Model
  db.exec(`
    CREATE TABLE IF NOT EXISTS asset_type (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      asset_class_id TEXT NOT NULL,
      type_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE(asset_class_id, type_id)
    )
  `);

  // Asset table for Cost Model
  db.exec(`
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      asset_type_id TEXT NOT NULL,
      asset_code TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      cost_of_acquisition REAL NOT NULL,
      date_of_acquisition DATE NOT NULL,
      asset_life INTEGER NOT NULL,
      depreciation_schedule TEXT,
      notes TEXT,
      service_id TEXT,
      service_mapping_type TEXT CHECK(service_mapping_type IN ('Direct', 'Indirect')),
      status TEXT NOT NULL DEFAULT 'active',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE(entity_id, asset_code)
    )
  `);

  // Asset Service Allocations table for Indirect mapping
  db.exec(`
    CREATE TABLE IF NOT EXISTS asset_service_allocations (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      asset_id TEXT NOT NULL,
      service_id TEXT NOT NULL,
      percentage REAL NOT NULL CHECK(percentage >= 0 AND percentage <= 100),
      status TEXT NOT NULL DEFAULT 'active',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE(asset_id, service_id),
      FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
    )
  `);

  // Service Group table for Cost Model
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_groups (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      vertical_id TEXT NOT NULL,
      group_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE(vertical_id, group_id)
    )
  `);

  // Service table for Cost Model
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      service_group_id TEXT NOT NULL,
      service_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      uom TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE(service_group_id, service_id)
    )
  `);

  // Cost Group table for Cost Model
  db.exec(`
    CREATE TABLE IF NOT EXISTS cost_groups (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      vertical_id TEXT NOT NULL,
      cost_group_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE(vertical_id, cost_group_id)
    )
  `);

  // Budget Line table for Cost Model
  db.exec(`
    CREATE TABLE IF NOT EXISTS budget_lines (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      cost_group_id TEXT NOT NULL,
      budget_line_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE(cost_group_id, budget_line_id)
    )
  `);

  // Budget Line Budgets table for storing budgets per financial year
  db.exec(`
    CREATE TABLE IF NOT EXISTS budget_line_budgets (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      budget_line_id TEXT NOT NULL,
      financial_year TEXT NOT NULL,
      budget_amount REAL NOT NULL CHECK(budget_amount >= 0),
      status TEXT NOT NULL DEFAULT 'active',
      notes TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE(budget_line_id, financial_year),
      FOREIGN KEY (budget_line_id) REFERENCES budget_lines(id) ON DELETE CASCADE
    )
  `);

  // Service Group Budgets table for storing budgets per financial year
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_group_budgets (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      service_group_id TEXT NOT NULL,
      financial_year TEXT NOT NULL,
      budget_amount REAL NOT NULL CHECK(budget_amount >= 0),
      status TEXT NOT NULL DEFAULT 'active',
      notes TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE(service_group_id, financial_year),
      FOREIGN KEY (service_group_id) REFERENCES service_groups(id) ON DELETE CASCADE
    )
  `);

  // Cost Element table for Cost Model
  db.exec(`
    CREATE TABLE IF NOT EXISTS cost_elements (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      budget_line_id TEXT NOT NULL,
      cost_element_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      cost_type TEXT NOT NULL CHECK(cost_type IN ('Direct', 'Indirect', 'Common')),
      service_id TEXT,
      is_budgeted INTEGER NOT NULL DEFAULT 0,
      financial_year TEXT,
      amount REAL,
      status TEXT NOT NULL DEFAULT 'active',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE(budget_line_id, cost_element_id)
    )
  `);

  // Cost Rules table for Cost Model (for Indirect and Common costs)
  db.exec(`
    CREATE TABLE IF NOT EXISTS cost_rules (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      cost_element_id TEXT NOT NULL,
      service_id TEXT NOT NULL,
      percentage REAL NOT NULL CHECK(percentage >= 0 AND percentage <= 100),
      status TEXT NOT NULL DEFAULT 'active',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE(cost_element_id, service_id)
    )
  `);

  // BOM: Parts (PRT list) - master list of parts that can be consumed in a BOM
  db.exec(`
    CREATE TABLE IF NOT EXISTS parts (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      part_id TEXT NOT NULL,
      description TEXT NOT NULL,
      uom TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(entity_id, part_id)
    )
  `);

  // BOM: Finished goods (FG list) - each FG can have one BOM
  db.exec(`
    CREATE TABLE IF NOT EXISTS finished_goods (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      fg_id TEXT NOT NULL,
      description TEXT NOT NULL,
      uom TEXT NOT NULL,
      hsn TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(entity_id, fg_id)
    )
  `);
  try {
    db.exec(`ALTER TABLE finished_goods ADD COLUMN hsn TEXT`);
  } catch (_) {
    // Column may already exist
  }

  // BOM: Bill of materials header - one per finished good
  db.exec(`
    CREATE TABLE IF NOT EXISTS bom (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL DEFAULT 'hsbc',
      finished_good_id TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(entity_id, finished_good_id),
      FOREIGN KEY (finished_good_id) REFERENCES finished_goods(id) ON DELETE CASCADE
    )
  `);

  // BOM: Bill of materials lines - parts consumed per FG with qty and UOM conversion
  db.exec(`
    CREATE TABLE IF NOT EXISTS bom_lines (
      id TEXT PRIMARY KEY,
      bom_id TEXT NOT NULL,
      part_id TEXT NOT NULL,
      quantity REAL NOT NULL CHECK(quantity > 0),
      consumption_uom TEXT NOT NULL,
      uom_conversion_factor REAL NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(bom_id, part_id),
      FOREIGN KEY (bom_id) REFERENCES bom(id) ON DELETE CASCADE,
      FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE RESTRICT
    )
  `);

  // Seed dummy finished goods (FG) if table is empty
  const fgIds: { fg_id: string; id: string }[] = [];
  try {
    const fgCount = (db.prepare('SELECT COUNT(*) as count FROM finished_goods').get() as { count: number }).count;
    if (fgCount === 0) {
      const dummyFGs = [
        { fg_id: 'FG-1001', description: 'Assembly Unit A', uom: 'NOS', hsn: '8471' },
        { fg_id: 'FG-1002', description: 'Assembly Unit B', uom: 'NOS', hsn: '8471' },
        { fg_id: 'FG-1003', description: 'Finished Good C - Electronic Module', uom: 'NOS', hsn: '8504' },
        { fg_id: 'FG-1004', description: 'Packaged Consumer Product', uom: 'CTN', hsn: '4819' },
        { fg_id: 'FG-1005', description: 'Machinery Assembly - Type X', uom: 'NOS', hsn: '8479' },
      ];
      const insertFg = db.prepare(`
        INSERT INTO finished_goods (id, entity_id, fg_id, description, uom, hsn, status)
        VALUES (?, ?, ?, ?, ?, ?, 'active')
      `);
      for (const fg of dummyFGs) {
        const id = randomUUID();
        insertFg.run(id, 'hsbc', fg.fg_id, fg.description, fg.uom, fg.hsn ?? null);
        fgIds.push({ fg_id: fg.fg_id, id });
      }
      console.log(`[Database] Seeded ${dummyFGs.length} dummy finished goods`);
    }
  } catch (e: any) {
    console.warn('[Database] Could not seed dummy finished goods:', e?.message);
  }

  // Seed dummy parts (PRT) if table is empty
  const partIdsByCode: Record<string, string> = {};
  try {
    const partCount = (db.prepare('SELECT COUNT(*) as count FROM parts').get() as { count: number }).count;
    if (partCount === 0) {
      const dummyParts = [
        { part_id: 'PT-1001', description: 'Industrial machinery parts - Category A', uom: 'NOS' },
        { part_id: 'PT-1002', description: 'Electronic components - PCB assembly', uom: 'NOS' },
        { part_id: 'PT-1003', description: 'Raw materials - Steel grade 304', uom: 'KG' },
        { part_id: 'PT-1004', description: 'Packaging materials - Cartons', uom: 'CTN' },
        { part_id: 'PT-1005', description: 'Spare parts - Conveyor system', uom: 'NOS' },
      ];
      const insertPart = db.prepare(`
        INSERT INTO parts (id, entity_id, part_id, description, uom, status)
        VALUES (?, ?, ?, ?, ?, 'active')
      `);
      for (const p of dummyParts) {
        const id = randomUUID();
        insertPart.run(id, 'hsbc', p.part_id, p.description, p.uom);
        partIdsByCode[p.part_id] = id;
      }
      console.log(`[Database] Seeded ${dummyParts.length} dummy parts`);
    }
  } catch (e: any) {
    console.warn('[Database] Could not seed dummy parts:', e?.message);
  }

  // Seed 1–2 dummy configured BOMs (if BOM table is empty and we have FGs + parts)
  try {
    const bomCount = (db.prepare('SELECT COUNT(*) as count FROM bom').get() as { count: number }).count;
    if (bomCount === 0) {
      let fg1 = fgIds.find((f) => f.fg_id === 'FG-1001');
      let fg2 = fgIds.find((f) => f.fg_id === 'FG-1002');
      if (!fg1 || !fg2) {
        const rows = db.prepare("SELECT id, fg_id FROM finished_goods WHERE entity_id = 'hsbc' ORDER BY fg_id LIMIT 2").all() as { id: string; fg_id: string }[];
        if (!fg1 && rows[0]) fg1 = { fg_id: rows[0].fg_id, id: rows[0].id };
        if (!fg2 && rows[1]) fg2 = { fg_id: rows[1].fg_id, id: rows[1].id };
      }
      let p1 = partIdsByCode['PT-1001'], p2 = partIdsByCode['PT-1002'], p3 = partIdsByCode['PT-1003'];
      if (!p1 || !p2 || !p3) {
        const partRows = db.prepare("SELECT id FROM parts WHERE entity_id = 'hsbc' ORDER BY part_id LIMIT 3").all() as { id: string }[];
        if (partRows.length >= 3) {
          p1 = p1 || partRows[0].id;
          p2 = p2 || partRows[1].id;
          p3 = p3 || partRows[2].id;
        }
      }
      if (fg1 && fg2 && p1 && p2 && p3) {
        const insertBom = db.prepare(`
          INSERT INTO bom (id, entity_id, finished_good_id, version, status)
          VALUES (?, ?, ?, 1, 'active')
        `);
        const insertLine = db.prepare(`
          INSERT INTO bom_lines (id, bom_id, part_id, quantity, consumption_uom, uom_conversion_factor)
          VALUES (?, ?, ?, ?, ?, 1)
        `);
        const bom1Id = randomUUID();
        insertBom.run(bom1Id, 'hsbc', fg1.id);
        insertLine.run(randomUUID(), bom1Id, p1, 2, 'NOS', 1);
        insertLine.run(randomUUID(), bom1Id, p2, 1, 'NOS', 1);
        const bom2Id = randomUUID();
        insertBom.run(bom2Id, 'hsbc', fg2.id);
        insertLine.run(randomUUID(), bom2Id, p2, 3, 'NOS', 1);
        insertLine.run(randomUUID(), bom2Id, p3, 0.5, 'KG', 1);
        console.log('[Database] Seeded 2 dummy configured BOMs');
      }
    }
  } catch (e: any) {
    console.warn('[Database] Could not seed dummy BOMs:', e?.message);
  }

  // Add sample data for PDF processing history if table is empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM pdf_processing_history');
  const countResult = countStmt.get() as { count: number } | undefined;
  const count = countResult?.count ?? 0;
  
  if (count === 0) {
    console.log('Adding sample PDF processing history data...');
    
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
      }
    ];

    const insertStmt = db.prepare(`
      INSERT INTO pdf_processing_history (
        id, entity_id, file_name, document_type, processed_by, 
        ewb_status, processed_at, invoice_no, amount, vendor_name, buyer_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    sampleData.forEach(data => {
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
    });

    console.log(`Added ${sampleData.length} sample PDF processing history records`);
  }

  // Add sample data for email_data if table is empty
  const emailCountStmt = db.prepare('SELECT COUNT(*) as count FROM email_data');
  const emailCountResult = emailCountStmt.get() as { count: number } | undefined;
  const emailCount = emailCountResult?.count ?? 0;
  
  if (emailCount === 0) {
    console.log('Adding sample email data...');
    
    const sampleEmailData = [
      {
        id: randomUUID(),
        entityId: 'hsbc',
        sender: 'vendor@abctech.com',
        subject: 'Invoice #INV-2024-001 - ABC Technologies Pvt Ltd',
        receivedAt: new Date('2024-01-20T09:15:00Z').toISOString(),
        attachments: JSON.stringify(['invoice_001.pdf', 'receipt_001.pdf']),
        processingStatus: 'ready_for_review',
        invoiceType: 'with_qr',
        hasQrInEgam: 1,
        invoiceNo: 'INV-2024-001',
        amount: '₹125,000.00',
        vendorName: 'ABC Technologies Pvt Ltd'
      },
      {
        id: randomUUID(),
        entityId: 'hsbc',
        sender: 'invoices@defservices.com',
        subject: 'Monthly Invoice - DEF Services Limited',
        receivedAt: new Date('2024-01-21T10:30:00Z').toISOString(),
        attachments: JSON.stringify(['invoice_def_202401.pdf']),
        processingStatus: 'in_progress',
        invoiceType: 'without_qr',
        hasQrInEgam: 0,
        invoiceNo: 'INV-DEF-2024-002',
        amount: '₹89,500.00',
        vendorName: 'DEF Services Limited'
      },
      {
        id: randomUUID(),
        entityId: 'hsbc',
        sender: 'accounts@glogic.com',
        subject: 'Invoice INV-2024-003 - GHI Logistics Corp',
        receivedAt: new Date('2024-01-22T11:45:00Z').toISOString(),
        attachments: JSON.stringify(['invoice_ghi_003.pdf', 'delivery_challan_003.pdf']),
        processingStatus: 'ready_for_review',
        invoiceType: 'with_qr',
        hasQrInEgam: 0,
        invoiceNo: 'INV-2024-003',
        amount: '₹156,750.00',
        vendorName: 'GHI Logistics Corp'
      },
      {
        id: randomUUID(),
        entityId: 'hsbc',
        sender: 'billing@jklind.com',
        subject: 'Q4 2024 Invoice - JKL Industries Ltd',
        receivedAt: new Date('2024-01-23T14:20:00Z').toISOString(),
        attachments: JSON.stringify(['invoice_q4_jkl.pdf']),
        processingStatus: 'queued',
        invoiceType: 'without_qr',
        hasQrInEgam: 0,
        vendorName: 'JKL Industries Ltd'
      },
      {
        id: randomUUID(),
        entityId: 'hsbc',
        sender: 'finance@mnocorp.com',
        subject: 'Invoice INV-2024-004 - MNO Corporation',
        receivedAt: new Date('2024-01-24T08:00:00Z').toISOString(),
        attachments: JSON.stringify(['invoice_mno_004.pdf']),
        processingStatus: 'ready_for_review',
        invoiceType: 'with_qr',
        hasQrInEgam: 1,
        invoiceNo: 'INV-2024-004',
        amount: '₹203,400.00',
        vendorName: 'MNO Corporation'
      },
      {
        id: randomUUID(),
        entityId: 'hsbc',
        sender: 'accounts@pqrtrade.com',
        subject: 'Invoice #INV-2024-005 - January 2024',
        receivedAt: new Date('2024-01-25T13:30:00Z').toISOString(),
        attachments: JSON.stringify(['january_invoice_pqr.pdf', 'tax_invoice_pqr.pdf']),
        processingStatus: 'queued',
        invoiceType: 'without_qr',
        hasQrInEgam: 0,
        vendorName: 'PQR Trading Ltd'
      },
      {
        id: randomUUID(),
        entityId: 'hsbc',
        sender: 'billing@stulog.com',
        subject: 'Invoice INV-2024-006 - STU Logistics',
        receivedAt: new Date('2024-01-26T09:15:00Z').toISOString(),
        attachments: JSON.stringify(['invoice_stu_006.pdf']),
        processingStatus: 'in_progress',
        invoiceType: 'with_qr',
        hasQrInEgam: 1,
        invoiceNo: 'INV-2024-006',
        amount: '₹189,200.00',
        vendorName: 'STU Logistics'
      },
      {
        id: randomUUID(),
        entityId: 'hsbc',
        sender: 'invoices@vwxeng.com',
        subject: 'Service Invoice - VWX Engineering Services',
        receivedAt: new Date('2024-01-27T15:45:00Z').toISOString(),
        attachments: JSON.stringify(['service_invoice_vwx.pdf']),
        processingStatus: 'ready_for_review',
        invoiceType: 'without_qr',
        hasQrInEgam: 0,
        invoiceNo: 'INV-VWX-007',
        amount: '₹95,800.00',
        vendorName: 'VWX Engineering Services'
      }
    ];

    const insertEmailStmt = db.prepare(`
      INSERT INTO email_data (
        id, entity_id, sender, subject, received_at, attachments,
        processing_status, invoice_type, has_qr_in_egam, invoice_no, amount, vendor_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    sampleEmailData.forEach(data => {
      insertEmailStmt.run(
        data.id,
        data.entityId,
        data.sender,
        data.subject,
        data.receivedAt,
        data.attachments,
        data.processingStatus,
        data.invoiceType,
        data.hasQrInEgam,
        data.invoiceNo || null,
        data.amount || null,
        data.vendorName || null
      );
    });

    console.log(`Added ${sampleEmailData.length} sample email records`);
  }

  // Migration: Add service_mapping_type column to assets table if it doesn't exist
  try {
    const result = db.prepare("PRAGMA table_info(assets)").all() as Array<{ name: string }>;
    const hasColumn = result.some(col => col.name === 'service_mapping_type');
    if (!hasColumn) {
      console.log('Adding service_mapping_type column to assets table...');
      // SQLite doesn't support CHECK constraints in ALTER TABLE ADD COLUMN
      // Validation will be handled at application level
      db.prepare('ALTER TABLE assets ADD COLUMN service_mapping_type TEXT').run();
      console.log('✓ Column added successfully');
    }
  } catch (e: any) {
    console.error('Error checking/adding service_mapping_type column:', e.message);
    // Don't throw - allow database to continue initializing
  }

  // Note: asset_service_allocations table is already created above in the CREATE TABLE section
  // This migration section is just for column additions to existing tables

  // Migration: Create budget_line_budgets table if it doesn't exist
  try {
    db.prepare('SELECT * FROM budget_line_budgets LIMIT 1').get();
  } catch (e: any) {
    console.log('Creating budget_line_budgets table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS budget_line_budgets (
        id TEXT PRIMARY KEY,
        entity_id TEXT NOT NULL DEFAULT 'hsbc',
        budget_line_id TEXT NOT NULL,
        financial_year TEXT NOT NULL,
        budget_amount REAL NOT NULL CHECK(budget_amount >= 0),
        status TEXT NOT NULL DEFAULT 'active',
        notes TEXT,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        updated_by TEXT,
        UNIQUE(budget_line_id, financial_year),
        FOREIGN KEY (budget_line_id) REFERENCES budget_lines(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Table created successfully');
  }

  // Migration: Create service_group_budgets table if it doesn't exist
  try {
    db.prepare('SELECT * FROM service_group_budgets LIMIT 1').get();
  } catch (e: any) {
    console.log('Creating service_group_budgets table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS service_group_budgets (
        id TEXT PRIMARY KEY,
        entity_id TEXT NOT NULL DEFAULT 'hsbc',
        service_group_id TEXT NOT NULL,
        financial_year TEXT NOT NULL,
        budget_amount REAL NOT NULL CHECK(budget_amount >= 0),
        status TEXT NOT NULL DEFAULT 'active',
        notes TEXT,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        updated_by TEXT,
        UNIQUE(service_group_id, financial_year),
        FOREIGN KEY (service_group_id) REFERENCES service_groups(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Table created successfully');
  }

  // ============================================================================
  // CREATE INDEXES FOR PERFORMANCE OPTIMIZATION
  // ============================================================================
  console.log('[Database] Creating indexes for performance optimization...');
  
  try {
    // Users table indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_entity_id ON users(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
    
    // Tickets table indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_tickets_entity_id ON tickets(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_tickets_invoice_id ON tickets(invoice_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_tickets_invoice_no ON tickets(invoice_no)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_tickets_raised_by ON tickets(raised_by)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_tickets_ticket_id ON tickets(ticket_id)`);
    // Composite index for common query pattern
    db.exec(`CREATE INDEX IF NOT EXISTS idx_tickets_entity_status ON tickets(entity_id, status)`);
    
    // QR Data table indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_qr_data_entity_id ON qr_data(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_qr_data_invoice_no ON qr_data(invoice_no)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_qr_data_irn ON qr_data(irn)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_qr_data_status ON qr_data(status)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_qr_data_entity_date ON qr_data(entity_id, date)`);
    
    // PDF Data table indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_pdf_data_entity_id ON pdf_data(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_pdf_data_invoice_no ON pdf_data(invoice_no)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_pdf_data_status ON pdf_data(status)`);
    
    // EGAM Repository table indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_egam_repository_entity_id ON egam_repository(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_egam_repository_irn ON egam_repository(irn)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_egam_repository_invoice_no ON egam_repository(invoice_no)`);
    
    // Email Data table indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_email_data_entity_id ON email_data(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_email_data_processing_status ON email_data(processing_status)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_email_data_invoice_no ON email_data(invoice_no)`);
    
    // System Logs table indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_system_logs_entity_id ON system_logs(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_system_logs_module ON system_logs(module)`);
    
    // API Logs table indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_api_logs_entity_id ON api_logs(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_api_logs_timestamp ON api_logs(timestamp)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_api_logs_api_name ON api_logs(api_name)`);
    
    // Cost Model indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_verticals_entity_id ON verticals(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_asset_class_entity_id ON asset_class(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_asset_type_entity_id ON asset_type(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_asset_type_asset_class_id ON asset_type(asset_class_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_assets_entity_id ON assets(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_assets_asset_type_id ON assets(asset_type_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_service_groups_entity_id ON service_groups(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_service_groups_vertical_id ON service_groups(vertical_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_services_entity_id ON services(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_services_service_group_id ON services(service_group_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_cost_groups_entity_id ON cost_groups(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_cost_groups_vertical_id ON cost_groups(vertical_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_budget_lines_entity_id ON budget_lines(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_budget_lines_cost_group_id ON budget_lines(cost_group_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_cost_elements_entity_id ON cost_elements(entity_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_cost_elements_budget_line_id ON cost_elements(budget_line_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_cost_rules_cost_element_id ON cost_rules(cost_element_id)`);
    
    console.log('[Database] ✓ Indexes created successfully');
  } catch (error: any) {
    console.warn('[Database] Warning: Some indexes may already exist:', error.message);
  }

  console.log('Database initialized successfully');
}

// Helper function to generate sequential unique IDs
function generateSequentialId(entityType: string, parentId?: string): string {
  // Map entity types to short prefixes
  const prefixMap: Record<string, string> = {
    'vertical': 'V',
    'asset-class': 'AC',
    'asset-type': 'AT',
    'asset': 'A',
    'service-group': 'SG',
    'service': 'S',
    'cost-group': 'CG',
    'budget-line': 'BL',
    'cost-element': 'CE',
  };
  
  const prefix = prefixMap[entityType] || entityType.substring(0, 2).toUpperCase();
  
  // Get the count of existing records for this entity type
  let countStmt;
  if (parentId) {
    // For child entities, count within parent scope
    const parentFieldMap: Record<string, string> = {
      'asset-type': 'asset_class_id',
      'asset': 'asset_type_id',
      'service': 'service_group_id',
      'service-group': 'vertical_id',
      'budget-line': 'cost_group_id',
      'cost-element': 'budget_line_id',
    };
    const parentField = parentFieldMap[entityType];
    if (parentField) {
      const tableMap: Record<string, string> = {
        'asset-type': 'asset_type',
        'asset': 'assets',
        'service': 'services',
        'service-group': 'service_groups',
        'budget-line': 'budget_lines',
        'cost-element': 'cost_elements',
      };
      const table = tableMap[entityType];
      if (table) {
        countStmt = db.prepare(`SELECT COUNT(*) as count FROM ${table} WHERE ${parentField} = ?`);
        const result = countStmt.get(parentId) as { count: number };
        const count = (result?.count || 0) + 1;
        return `${prefix}${String(count).padStart(4, '0')}`;
      }
    }
  }
  
  // For top-level entities or if parent mapping not found
  const tableMap: Record<string, string> = {
    'vertical': 'verticals',
    'asset-class': 'asset_class',
    'asset-type': 'asset_type',
    'asset': 'assets',
    'service-group': 'service_groups',
    'service': 'services',
    'cost-group': 'cost_groups',
    'budget-line': 'budget_lines',
    'cost-element': 'cost_elements',
  };
  const table = tableMap[entityType];
  if (table) {
    countStmt = db.prepare(`SELECT COUNT(*) as count FROM ${table}`);
    const result = countStmt.get() as { count: number };
    const count = (result?.count || 0) + 1;
    return `${prefix}${String(count).padStart(4, '0')}`;
  }
  
  // Fallback to UUID if entity type not recognized
  return randomUUID();
}

// Database service class
export class DatabaseService {
  // User operations
  async createUser(user: { 
    username: string; 
    password?: string; 
    role?: string; 
    entityId?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    department?: string;
    status?: string;
    notes?: string;
    metadata?: any;
  }) {
    // Check if user already exists
    const existingUser = await this.getUserByUsername(user.username);
    if (existingUser) {
      throw new Error(`User with username '${user.username}' already exists`);
    }

    // Generate default password if not provided (for agents)
    const password = user.password || `temp_${randomUUID().substring(0, 8)}`;

    const id = randomUUID();
    try {
      const metadataJson = user.metadata ? JSON.stringify(user.metadata) : null;
      const stmt = db.prepare(`
        INSERT INTO users (id, username, password, role, entity_id, company_name, email, phone, department, status, notes, metadata, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      stmt.run(
        id, 
        user.username, 
        password, 
        user.role || 'business_user', 
        user.entityId || 'hsbc',
        user.companyName || null,
        user.email || null,
        user.phone || null,
        user.department || null,
        user.status || 'active',
        user.notes || null,
        metadataJson
      );
      return await this.getUserById(id);
    } catch (error: any) {
      // Handle UNIQUE constraint violation
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        throw new Error(`User with username '${user.username}' already exists`);
      }
      throw error;
    }
  }

  async getUserByUsername(username: string) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const row: any = stmt.get(username);
    if (row && row.metadata) {
      try {
        row.metadata = JSON.parse(row.metadata);
      } catch (e) {
        row.metadata = null;
      }
    }
    return this.mapUserRow(row);
  }

  async getUserById(id: string) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const row: any = stmt.get(id);
    if (row && row.metadata) {
      try {
        row.metadata = JSON.parse(row.metadata);
      } catch (e) {
        row.metadata = null;
      }
    }
    return this.mapUserRow(row);
  }

  async getAllUsers(entityId?: string) {
    let query = 'SELECT * FROM users';
    const params: any[] = [];
    if (entityId) {
      query += ' WHERE entity_id = ?';
      params.push(entityId);
    }
    query += ' ORDER BY created_at DESC';
    const stmt = db.prepare(query);
    const rows: any[] = stmt.all(...params);
    return rows.map(row => {
      if (row.metadata) {
        try {
          row.metadata = JSON.parse(row.metadata);
        } catch (e) {
          row.metadata = null;
        }
      }
      return this.mapUserRow(row);
    });
  }

  async getUsersByRole(role: string, entityId?: string) {
    let query = 'SELECT * FROM users WHERE role = ?';
    const params: any[] = [role];
    if (entityId) {
      query += ' AND entity_id = ?';
      params.push(entityId);
    }
    query += ' ORDER BY created_at DESC';
    const stmt = db.prepare(query);
    const rows: any[] = stmt.all(...params);
    return rows.map(row => {
      if (row.metadata) {
        try {
          row.metadata = JSON.parse(row.metadata);
        } catch (e) {
          row.metadata = null;
        }
      }
      return this.mapUserRow(row);
    });
  }

  async updateUser(id: string, updates: {
    username?: string;
    password?: string;
    role?: string;
    entityId?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    department?: string;
    status?: string;
    notes?: string;
    metadata?: any;
  }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.username !== undefined) {
      fields.push('username = ?');
      values.push(updates.username);
    }
    if (updates.password !== undefined) {
      fields.push('password = ?');
      values.push(updates.password);
    }
    if (updates.role !== undefined) {
      fields.push('role = ?');
      values.push(updates.role);
    }
    if (updates.entityId !== undefined) {
      fields.push('entity_id = ?');
      values.push(updates.entityId);
    }
    if (updates.companyName !== undefined) {
      fields.push('company_name = ?');
      values.push(updates.companyName);
    }
    if (updates.email !== undefined) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.phone !== undefined) {
      fields.push('phone = ?');
      values.push(updates.phone);
    }
    if (updates.department !== undefined) {
      fields.push('department = ?');
      values.push(updates.department);
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }
    if (updates.metadata !== undefined) {
      fields.push('metadata = ?');
      values.push(updates.metadata ? JSON.stringify(updates.metadata) : null);
    }

    if (fields.length === 0) {
      return await this.getUserById(id);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return await this.getUserById(id);
  }

  async deleteUser(id: string) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Helper method to map database row to user object
  private mapUserRow(row: any) {
    if (!row) return null;
    if (row.metadata) {
      try {
        row.metadata = JSON.parse(row.metadata);
      } catch (e) {
        row.metadata = null;
      }
    }
    return {
      id: row.id,
      username: row.username,
      password: row.password,
      role: row.role,
      entityId: row.entity_id,
      companyName: row.company_name,
      email: row.email,
      phone: row.phone,
      department: row.department,
      status: row.status || 'active',
      notes: row.notes,
      metadata: row.metadata,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Ticket operations
  async getAllTickets(entityId?: string) {
    let query = 'SELECT * FROM tickets';
    const params: any[] = [];
    if (entityId) {
      query += ' WHERE entity_id = ?';
      params.push(entityId);
    }
    query += ' ORDER BY created_at DESC';
    const stmt = db.prepare(query);
    const rows: any[] = stmt.all(...params);
    return rows.map(row => this.mapTicketRow(row));
  }

  async getTicketByTicketId(ticketId: string) {
    const stmt = db.prepare('SELECT * FROM tickets WHERE ticket_id = ?');
    const row: any = stmt.get(ticketId);
    return this.mapTicketRow(row);
  }

  async getTicketsByInvoiceId(invoiceId: string, entityId?: string) {
    let query = 'SELECT * FROM tickets WHERE (invoice_id = ? OR invoice_no = ?)';
    const params: any[] = [invoiceId, invoiceId];
    if (entityId) {
      query += ' AND entity_id = ?';
      params.push(entityId);
    }
    query += ' ORDER BY created_at DESC';
    const stmt = db.prepare(query);
    const rows: any[] = stmt.all(...params);
    return rows.map(row => this.mapTicketRow(row));
  }

  async getTotalInvoicesWithTickets(entityId?: string) {
    let query = 'SELECT COUNT(DISTINCT invoice_no) as count FROM tickets';
    const params: any[] = [];
    if (entityId) {
      query += ' WHERE entity_id = ?';
      params.push(entityId);
    }
    const stmt = db.prepare(query);
    const result: any = stmt.get(...params);
    return result?.count || 0;
  }

  // Helper method to map database row to ticket object
  private mapTicketRow(row: any) {
    if (!row) return null;
    return {
      id: row.id,
      ticketId: row.ticket_id,
      entityId: row.entity_id,
      invoiceNo: row.invoice_no,
      invoiceId: row.invoice_id,
      invoiceSource: row.invoice_source,
      raisedBy: row.raised_by,
      raisedByRole: row.raised_by_role,
      comments: row.comments,
      status: row.status || 'open',
      priority: row.priority || 'medium',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      resolvedAt: row.resolved_at,
      resolvedBy: row.resolved_by,
    };
  }

  // QR Data operations
  async createQRData(data: any) {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO qr_data (id, entity_id, irn, gstin, invoice_no, date, total_amount, 
                          buyer_gstin, seller_gstin, invoice_type, qr_string, processed_by, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id, data.entityId || 'hsbc', data.irn, data.gstin, data.invoiceNo, data.date,
      data.totalAmount, data.buyerGstin, data.sellerGstin, data.invoiceType,
      data.qrString, data.processedBy, data.status || 'success'
    );
    return { id, ...data };
  }

  async getAllQRData() {
    const stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        irn,
        gstin,
        invoice_no as invoiceNo,
        date,
        total_amount as totalAmount,
        buyer_gstin as buyerGstin,
        seller_gstin as sellerGstin,
        invoice_type as invoiceType,
        qr_string as qrString,
        processed_by as processedBy,
        status,
        extracted_at as extractedAt
      FROM qr_data 
      ORDER BY extracted_at DESC
    `);
    return stmt.all();
  }

  async updateQRData(id: string, data: any) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    const stmt = db.prepare(`UPDATE qr_data SET ${fields} WHERE id = ?`);
    stmt.run(...values, id);
    return this.getQRDataById(id);
  }

  async getQRDataById(id: string) {
    const stmt = db.prepare('SELECT * FROM qr_data WHERE id = ?');
    return stmt.get(id);
  }

  // PDF Data operations
  async createPDFData(data: any) {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO pdf_data (id, entity_id, file_name, file_path, invoice_no, date, irn, gstin, amount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id, data.entityId || 'hsbc', data.fileName, data.filePath || null, data.invoiceNo, data.date,
      data.irn, data.gstin, data.amount, data.status || 'processed'
    );
    return { id, ...data };
  }

  async getAllPDFData() {
    const stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        file_name as fileName,
        file_path as filePath,
        invoice_no as invoiceNo,
        date,
        irn,
        gstin,
        amount,
        status,
        extracted_at as extractedAt
      FROM pdf_data 
      ORDER BY extracted_at DESC
    `);
    return stmt.all();
  }
  
  // Get default EA PDF (always available from static file)
  async getDefaultEAPDF() {
    // Import the default PDF helper
    const { getDefaultPDFMetadata } = await import('./ea-default-pdf.js');
    return getDefaultPDFMetadata();
  }

  // Search PDFs for Emirates Airlines by document ID or PNR
  // Always includes the default PDF as the first result, regardless of search criteria
  async searchEAPDFs(documentId?: string, pnr?: string) {
    // Always get the default PDF from static file (not database)
    const { getDefaultPDFMetadata } = await import('./ea-default-pdf.js');
    const defaultPDF = getDefaultPDFMetadata();
    
    // Optionally search database for other matching PDFs
    let query = `
      SELECT 
        id,
        entity_id as entityId,
        file_name as fileName,
        file_path as filePath,
        invoice_no as invoiceNo,
        date,
        irn,
        gstin,
        amount,
        status,
        extracted_at as extractedAt
      FROM pdf_data 
      WHERE entity_id = 'emirates'
    `;
    const params: any[] = [];
    
    if (documentId) {
      query += ` AND (invoice_no LIKE ? OR invoice_no = ? OR file_name LIKE ?)`;
      const searchTerm = `%${documentId}%`;
      params.push(searchTerm, documentId, searchTerm);
    }
    
    if (pnr) {
      query += ` AND (invoice_no LIKE ? OR file_name LIKE ?)`;
      const searchTerm = `%${pnr}%`;
      params.push(searchTerm, searchTerm);
    }
    
    query += ` ORDER BY extracted_at DESC LIMIT 10`;
    
    const stmt = db.prepare(query);
    const results = stmt.all(...params);
    
    // ALWAYS include default PDF as the first result, regardless of search criteria
    // Check if default PDF is already in results
    const defaultInResults = results.some((r: any) => r.id === defaultPDF.id);
    if (!defaultInResults) {
      // Add default PDF as first result (even if search doesn't match)
      return [defaultPDF, ...results];
    } else {
      // If default is in results, move it to first position
      const filtered = results.filter((r: any) => r.id !== defaultPDF.id);
      return [defaultPDF, ...filtered];
    }
  }
  
  // Get PDF by ID
  async getPDFById(id: string) {
    const stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        file_name as fileName,
        file_path as filePath,
        invoice_no as invoiceNo,
        date,
        irn,
        gstin,
        amount,
        status,
        extracted_at as extractedAt
      FROM pdf_data 
      WHERE id = ?
    `);
    return stmt.get(id);
  }

  // EGAM Repository operations
  async createEGAMData(data: any) {
    // Check if EGAM data with this IRN already exists
    const existingData = await this.getEGAMDataByIRN(data.irn);
    if (existingData) {
      console.log(`EGAM data with IRN '${data.irn}' already exists, skipping insertion`);
      return existingData;
    }

    const id = randomUUID();
    try {
      const stmt = db.prepare(`
        INSERT INTO egam_repository (id, entity_id, irn, invoice_no, date, vendor_gstin, amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id, data.entityId || 'hsbc', data.irn, data.invoiceNo, data.date,
        data.vendorGstin, data.amount, data.status || 'processed'
      );
      return { id, ...data };
    } catch (error: any) {
      // Handle UNIQUE constraint violation for IRN
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        console.log(`Duplicate IRN detected: ${data.irn}`);
        const existing = await this.getEGAMDataByIRN(data.irn);
        return existing || { id, ...data };
      }
      throw error;
    }
  }

  async getAllEGAMData() {
    const stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        irn,
        invoice_no as invoiceNo,
        date,
        vendor_gstin as vendorGstin,
        amount,
        status,
        fetched_at as fetchedAt
      FROM egam_repository 
      ORDER BY fetched_at DESC
    `);
    return stmt.all();
  }

  async getEGAMDataByIRN(irn: string) {
    const stmt = db.prepare('SELECT * FROM egam_repository WHERE irn = ?');
    return stmt.get(irn);
  }

  // EGAM Audit Logs operations
  async createEGAMAuditLog(data: any) {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO egam_audit_logs (id, entity_id, pull_type, status, records_count, 
                                 started_at, completed_at, error_message, next_scheduled_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id, 
      data.entityId || 'hsbc', 
      data.pullType, 
      data.status, 
      data.recordsCount,
      data.startedAt ? data.startedAt.toISOString() : null,
      data.completedAt ? data.completedAt.toISOString() : null,
      data.errorMessage,
      data.nextScheduledAt ? data.nextScheduledAt.toISOString() : null
    );
    return { id, ...data };
  }

  async getAllEGAMAuditLogs() {
    const stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        pull_type as pullType,
        status,
        records_count as recordsCount,
        started_at as startedAt,
        completed_at as completedAt,
        error_message as errorMessage,
        next_scheduled_at as nextScheduledAt
      FROM egam_audit_logs 
      ORDER BY started_at DESC
    `);
    return stmt.all();
  }

  async getNextScheduledPull() {
    const stmt = db.prepare(`
      SELECT next_scheduled_at FROM egam_audit_logs 
      WHERE next_scheduled_at IS NOT NULL AND pull_type = 'scheduled'
      ORDER BY next_scheduled_at ASC LIMIT 1
    `);
    const result = stmt.get() as { next_scheduled_at: string } | undefined;
    return result ? new Date(result.next_scheduled_at) : null;
  }

  // System Logs operations
  async createSystemLog(data: any) {
    const id = randomUUID();
    // Check if request_id column exists, if not, insert without it
    try {
      const stmt = db.prepare(`
        INSERT INTO system_logs (id, entity_id, level, module, message, details, user, request_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id, data.entityId || 'hsbc', data.level, data.module, data.message, 
        data.details, data.user, data.requestId || null
      );
    } catch (e) {
      // Fallback if request_id column doesn't exist
      const stmt = db.prepare(`
        INSERT INTO system_logs (id, entity_id, level, module, message, details, user)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id, data.entityId || 'hsbc', data.level, data.module, data.message, 
        data.details, data.user
      );
    }
    return { id, ...data };
  }

  async getAllSystemLogs() {
    const stmt = db.prepare(`
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
      ORDER BY timestamp DESC
    `);
    return stmt.all();
  }

  async getSystemLogsByLevel(level: string) {
    const stmt = db.prepare('SELECT * FROM system_logs WHERE level = ? ORDER BY timestamp DESC');
    return stmt.all(level);
  }

  async getSystemLogsByRequestId(requestId: string) {
    const stmt = db.prepare(`
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
    return stmt.all(requestId);
  }

  // API Logs operations
  async createAPILog(data: any) {
    const id = randomUUID();
    // Check if request_id column exists, if not, insert without it
    try {
      const stmt = db.prepare(`
        INSERT INTO api_logs (id, entity_id, api_name, api_type, parameters, response, 
                             status, response_time, endpoint, request_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id, data.entityId || 'hsbc', data.apiName, data.apiType, 
        JSON.stringify(data.parameters), JSON.stringify(data.response),
        data.status, data.responseTime, data.endpoint, data.requestId || null
      );
    } catch (e) {
      // Fallback if request_id column doesn't exist
      const stmt = db.prepare(`
        INSERT INTO api_logs (id, entity_id, api_name, api_type, parameters, response, 
                             status, response_time, endpoint)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id, data.entityId || 'hsbc', data.apiName, data.apiType, 
        JSON.stringify(data.parameters), JSON.stringify(data.response),
        data.status, data.responseTime, data.endpoint
      );
    }
    return { id, ...data };
  }

  async getAllAPILogs() {
    const stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        timestamp,
        api_name as apiName,
        api_type as apiType,
        parameters,
        response,
        status,
        response_time as responseTime,
        endpoint,
        request_id as requestId
      FROM api_logs 
      ORDER BY timestamp DESC
    `);
    return stmt.all();
  }

  async getAPILogsByStatus(status: string) {
    const stmt = db.prepare('SELECT * FROM api_logs WHERE status = ? ORDER BY timestamp DESC');
    return stmt.all(status);
  }

  async getAPILogsByRequestId(requestId: string) {
    const stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        timestamp,
        api_name as apiName,
        api_type as apiType,
        parameters,
        response,
        status,
        response_time as responseTime,
        endpoint,
        request_id as requestId
      FROM api_logs 
      WHERE request_id = ? 
      ORDER BY timestamp DESC
    `);
    return stmt.all(requestId);
  }

  // PDF Processing History operations
  async createPDFProcessingHistory(data: any) {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO pdf_processing_history (id, entity_id, file_name, document_type, 
                                        processed_by, ewb_status, processed_at, 
                                        invoice_no, amount, vendor_name, buyer_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id, 
      data.entityId || 'hsbc', 
      data.fileName, 
      data.documentType, 
      data.processedBy,
      data.ewbStatus, 
      data.processedAt ? data.processedAt.toISOString() : null, 
      data.invoiceNo, 
      data.amount, 
      data.vendorName, 
      data.buyerName
    );
    return { id, ...data };
  }

  async getAllPDFProcessingHistory() {
    const stmt = db.prepare(`
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
    return stmt.all();
  }

  async getPDFProcessingHistoryByUser(processedBy: string) {
    const stmt = db.prepare(`
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
      WHERE processed_by = ?
      ORDER BY processed_at DESC
    `);
    return stmt.all(processedBy);
  }

  // Bulk QR operations
  async createBulkQRBatch(data: any) {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO bulk_qr_batches (id, entity_id, file_name, total_records, 
                                  processed_records, success_records, failed_records, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id, data.entityId || 'hsbc', data.fileName, data.totalRecords,
      data.processedRecords || 0, data.successRecords || 0, data.failedRecords || 0,
      data.status || 'processing'
    );
    return { id, ...data };
  }

  async createBulkQRProcessing(data: any) {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO bulk_qr_processing (id, entity_id, batch_id, qr_string, status, 
                                     processed_at, extracted_data, error_message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id, 
      data.entityId || 'hsbc', 
      data.batchId, 
      data.qrString, 
      data.status || 'queued',
      data.processedAt ? data.processedAt.toISOString() : null, 
      JSON.stringify(data.extractedData), 
      data.errorMessage
    );
    return { id, ...data };
  }

  async getAllBulkQRBatches() {
    const stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        file_name as fileName,
        total_records as totalRecords,
        processed_records as processedRecords,
        success_records as successRecords,
        failed_records as failedRecords,
        status,
        created_at as createdAt,
        completed_at as completedAt
      FROM bulk_qr_batches 
      ORDER BY created_at DESC
    `);
    return stmt.all();
  }

  async getBulkQRProcessingByBatchId(batchId: string) {
    const stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        batch_id as batchId,
        qr_string as qrString,
        status,
        processed_at as processedAt,
        extracted_data as extractedData,
        error_message as errorMessage,
        created_at as createdAt
      FROM bulk_qr_processing 
      WHERE batch_id = ? 
      ORDER BY created_at ASC
    `);
    return stmt.all(batchId);
  }

  async updateBulkQRProcessing(id: string, data: any) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    const stmt = db.prepare(`UPDATE bulk_qr_processing SET ${fields} WHERE id = ?`);
    stmt.run(...values, id);
    return this.getBulkQRProcessingById(id);
  }

  async getBulkQRProcessingById(id: string) {
    const stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        batch_id as batchId,
        qr_string as qrString,
        status,
        processed_at as processedAt,
        extracted_data as extractedData,
        error_message as errorMessage,
        created_at as createdAt
      FROM bulk_qr_processing 
      WHERE id = ?
    `);
    return stmt.get(id);
  }

  async updateBulkQRBatch(id: string, data: any) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    const stmt = db.prepare(`UPDATE bulk_qr_batches SET ${fields} WHERE id = ?`);
    stmt.run(...values, id);
    return this.getBulkQRBatchById(id);
  }

  async getBulkQRBatchById(id: string) {
    const stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        file_name as fileName,
        total_records as totalRecords,
        processed_records as processedRecords,
        success_records as successRecords,
        failed_records as failedRecords,
        status,
        created_at as createdAt,
        completed_at as completedAt
      FROM bulk_qr_batches 
      WHERE id = ?
    `);
    return stmt.get(id);
  }

  // Search operations
  async searchInvoices(query: string) {
    const searchTerm = `%${query.toLowerCase()}%`;
    const stmt = db.prepare(`
      SELECT 'QR' as source, id, invoice_no as invoiceNo, irn, gstin, total_amount as amount, 
             date, status, processed_by as processedBy, extracted_at as timestamp
      FROM qr_data 
      WHERE LOWER(invoice_no) LIKE ? OR LOWER(irn) LIKE ? OR LOWER(gstin) LIKE ? 
         OR LOWER(buyer_gstin) LIKE ? OR LOWER(seller_gstin) LIKE ?
      UNION ALL
      SELECT 'PDF' as source, id, invoice_no as invoiceNo, '' as irn, gstin, amount, 
             date, status, '' as processedBy, extracted_at as timestamp
      FROM pdf_data 
      WHERE LOWER(invoice_no) LIKE ? OR LOWER(gstin) LIKE ? OR LOWER(file_name) LIKE ?
      ORDER BY timestamp DESC
      LIMIT 20
    `);
    return stmt.all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, 
                   searchTerm, searchTerm, searchTerm);
  }

  // Statistics operations
  async getQRStatistics() {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM qr_data');
    const successStmt = db.prepare('SELECT COUNT(*) as success FROM qr_data WHERE status = "success"');
    const failedStmt = db.prepare('SELECT COUNT(*) as failed FROM qr_data WHERE status = "failed"');
    
    const totalResult = totalStmt.get() as { total: number } | undefined;
    const successResult = successStmt.get() as { success: number } | undefined;
    const failedResult = failedStmt.get() as { failed: number } | undefined;
    
    const total = totalResult?.total ?? 0;
    const success = successResult?.success ?? 0;
    const failed = failedResult?.failed ?? 0;
    
    return {
      total,
      success,
      failed,
      successRate: total > 0 ? ((success / total) * 100).toFixed(1) : 0
    };
  }

  async getAPIStatistics() {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM api_logs');
    const successStmt = db.prepare('SELECT COUNT(*) as success FROM api_logs WHERE status = "success"');
    const failedStmt = db.prepare('SELECT COUNT(*) as failed FROM api_logs WHERE status = "error"');
    const avgResponseStmt = db.prepare('SELECT AVG(response_time) as avg_response FROM api_logs WHERE response_time IS NOT NULL');
    
    const totalResult = totalStmt.get() as { total: number } | undefined;
    const successResult = successStmt.get() as { success: number } | undefined;
    const failedResult = failedStmt.get() as { failed: number } | undefined;
    const avgResponseResult = avgResponseStmt.get() as { avg_response: number | null } | undefined;
    
    const total = totalResult?.total ?? 0;
    const success = successResult?.success ?? 0;
    const failed = failedResult?.failed ?? 0;
    const avgResponse = avgResponseResult?.avg_response ?? 0;
    
    return {
      total,
      success,
      failed,
      successRate: total > 0 ? ((success / total) * 100).toFixed(1) : 0,
      avgResponseTime: Math.round(avgResponse)
    };
  }

  async getUserStatistics() {
    const userStmt = db.prepare('SELECT COUNT(DISTINCT user) as unique_users FROM system_logs WHERE user IS NOT NULL');
    const activityStmt = db.prepare('SELECT COUNT(*) as total_activity FROM system_logs WHERE user IS NOT NULL');
    
    const userResult = userStmt.get() as { unique_users: number } | undefined;
    const activityResult = activityStmt.get() as { total_activity: number } | undefined;
    
    const uniqueUsers = userResult?.unique_users ?? 0;
    const totalActivity = activityResult?.total_activity ?? 0;
    
    return {
      totalUsers: uniqueUsers,
      activeUsers: uniqueUsers,
      totalActivity
    };
  }

  async getEGAMStatistics() {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM egam_repository');
    const recentPullsStmt = db.prepare(`
      SELECT COUNT(*) as recent_pulls FROM egam_audit_logs 
      WHERE started_at > datetime('now', '-24 hours')
    `);
    const lastPullStmt = db.prepare(`
      SELECT started_at FROM egam_audit_logs 
      ORDER BY started_at DESC LIMIT 1
    `);
    
    const totalResult = totalStmt.get() as { total: number } | undefined;
    const recentPullsResult = recentPullsStmt.get() as { recent_pulls: number } | undefined;
    const lastPullResult = lastPullStmt.get() as { started_at: string } | undefined;
    
    const total = totalResult?.total ?? 0;
    const recentPulls = recentPullsResult?.recent_pulls ?? 0;
    
    return {
      totalRecords: total,
      recentPulls,
      lastPull: lastPullResult?.started_at ?? null
    };
  }

  async getPDFStatistics() {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM pdf_processing_history');
    const successStmt = db.prepare('SELECT COUNT(*) as success FROM pdf_processing_history WHERE ewb_status = "success"');
    const failedStmt = db.prepare('SELECT COUNT(*) as failed FROM pdf_processing_history WHERE ewb_status = "failed"');
    
    const totalResult = totalStmt.get() as { total: number } | undefined;
    const successResult = successStmt.get() as { success: number } | undefined;
    const failedResult = failedStmt.get() as { failed: number } | undefined;
    
    const total = totalResult?.total ?? 0;
    const success = successResult?.success ?? 0;
    const failed = failedResult?.failed ?? 0;
    
    return {
      totalPDFs: total,
      ewbSuccess: success,
      ewbFailed: failed,
      successRate: total > 0 ? ((success / total) * 100).toFixed(1) : 0
    };
  }

  async getQRProcessingStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM qr_data');
    const successStmt = db.prepare('SELECT COUNT(*) as success FROM qr_data WHERE status = "success"');
    const failedStmt = db.prepare('SELECT COUNT(*) as failed FROM qr_data WHERE status = "failed"');
    
    const totalResult = totalStmt.get() as { total: number } | undefined;
    const successResult = successStmt.get() as { success: number } | undefined;
    const failedResult = failedStmt.get() as { failed: number } | undefined;
    
    const total = totalResult?.total ?? 0;
    const success = successResult?.success ?? 0;
    const failed = failedResult?.failed ?? 0;
    
    return {
      total,
      success,
      failed,
      successRate: total > 0 ? ((success / total) * 100).toFixed(1) : 0
    };
  }

  // Email Data operations
  async getAllEmailRecords() {
    const stmt = db.prepare(`
      SELECT 
        id,
        entity_id as entityId,
        sender,
        subject,
        received_at as receivedAt,
        attachments,
        processing_status as processingStatus,
        invoice_type as invoiceType,
        has_qr_in_egam as hasQrInEgam,
        invoice_no as invoiceNo,
        amount,
        vendor_name as vendorName,
        created_at as createdAt
      FROM email_data 
      ORDER BY received_at DESC
    `);
    const records = stmt.all();
    
    // Parse attachments JSON string to array and handle all fields
    return records.map((record: any) => {
      let attachments = [];
      try {
        if (record.attachments) {
          attachments = JSON.parse(record.attachments);
        }
      } catch (e) {
        console.error('Error parsing attachments:', e);
        attachments = [];
      }
      
      return {
        ...record,
        attachments,
        hasQrInEgam: Boolean(record.hasQrInEgam),
        processingStatus: record.processingStatus || 'queued',
        invoiceType: record.invoiceType || null,
        invoiceNo: record.invoiceNo || undefined,
        amount: record.amount || undefined,
        vendorName: record.vendorName || undefined
      };
    });
  }

  async createEmailRecord(data: any) {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO email_data (
        id, entity_id, sender, subject, received_at, attachments,
        processing_status, invoice_type, has_qr_in_egam, invoice_no, amount, vendor_name
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      data.sender,
      data.subject,
      data.receivedAt || new Date().toISOString(),
      data.attachments ? JSON.stringify(data.attachments) : null,
      data.processingStatus || 'queued',
      data.invoiceType || null,
      data.hasQrInEgam ? 1 : 0,
      data.invoiceNo || null,
      data.amount || null,
      data.vendorName || null
    );
    return { id, ...data };
  }

  async getMailboxInfo() {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM email_data');
    const processedStmt = db.prepare(`
      SELECT COUNT(*) as processed FROM email_data 
      WHERE processing_status = 'ready_for_review'
    `);
    const pendingStmt = db.prepare(`
      SELECT COUNT(*) as pending FROM email_data 
      WHERE processing_status IN ('queued', 'in_progress')
    `);
    
    const totalResult = totalStmt.get() as { total: number } | undefined;
    const processedResult = processedStmt.get() as { processed: number } | undefined;
    const pendingResult = pendingStmt.get() as { pending: number } | undefined;
    
    const total = totalResult?.total ?? 0;
    const processed = processedResult?.processed ?? 0;
    const pending = pendingResult?.pending ?? 0;
    
    return {
      name: "invoices@company.com",
      totalEmails: total,
      processedEmails: processed,
      pendingEmails: pending
    };
  }

  // Verticals operations for Cost Model
  async getAllVerticals() {
    const stmt = db.prepare('SELECT * FROM verticals ORDER BY created_at DESC');
    const rows = stmt.all();
    
    // Deduplicate by name (case-insensitive), keeping the most recent one
    const seenNames = new Map<string, any>();
    rows.forEach((row: any) => {
      const normalizedName = (row.name || '').trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      if (!existing || (row.created_at && existing.created_at && new Date(row.created_at).getTime() > new Date(existing.created_at).getTime())) {
        seenNames.set(normalizedName, row);
      }
    });
    
    return Array.from(seenNames.values()).map((row: any) => ({
      id: row.id,
      entityId: row.entity_id,
      verticalId: row.vertical_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    }));
  }

  async getVerticalById(id: string) {
    const stmt = db.prepare('SELECT * FROM verticals WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      entityId: row.entity_id,
      verticalId: row.vertical_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async getVerticalByVerticalId(verticalId: string) {
    const stmt = db.prepare('SELECT * FROM verticals WHERE vertical_id = ?');
    const row = stmt.get(verticalId) as any;
    if (!row) return null;
    return {
      id: row.id,
      entityId: row.entity_id,
      verticalId: row.vertical_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async createVertical(data: {
    name: string;
    description?: string;
    status?: string;
    metadata?: any;
    entityId?: string;
    createdBy?: string;
  }): Promise<any> {
    // Auto-generate sequential ID
    const verticalId = generateSequentialId('vertical');
    
    // Check if vertical_id already exists (shouldn't happen, but safety check)
    const existing = await this.getVerticalByVerticalId(verticalId);
    if (existing) {
      // If somehow exists, generate next one
      const nextId = generateSequentialId('vertical');
      return this.createVertical({ ...data, verticalId: nextId } as any);
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO verticals (
        id, entity_id, vertical_id, name, description, status, metadata, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      verticalId,
      data.name,
      data.description || null,
      data.status || 'active',
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.createdBy || null,
      data.createdBy || null
    );
    return await this.getVerticalById(id);
  }

  async updateVertical(id: string, data: {
    name?: string;
    description?: string;
    status?: string;
    metadata?: any;
    updatedBy?: string;
  }) {
    const existing = await this.getVerticalById(id);
    if (!existing) {
      throw new Error(`Vertical with id '${id}' not found`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updateFields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updateFields.push('description = ?');
      values.push(data.description);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updateFields.push('metadata = ?');
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE verticals 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return await this.getVerticalById(id);
  }

  async deleteVertical(id: string) {
    const existing = await this.getVerticalById(id);
    if (!existing) {
      throw new Error(`Vertical with id '${id}' not found`);
    }

    const stmt = db.prepare('DELETE FROM verticals WHERE id = ?');
    stmt.run(id);
    return true;
  }

  // Asset Class operations
  async getAllAssetClasses() {
    // Get all asset classes, then deduplicate by name (case-insensitive)
    const stmt = db.prepare('SELECT * FROM asset_class ORDER BY created_at DESC');
    const rows = stmt.all();
    
    // Deduplicate by name (case-insensitive), keeping the most recent one
    const seenNames = new Map<string, any>();
    
    rows.forEach((row: any) => {
      const normalizedName = (row.name || '').trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      
      if (!existing) {
        // First occurrence of this name
        seenNames.set(normalizedName, row);
      } else {
        // Compare dates to keep the most recent one
        const existingDate = existing.created_at ? new Date(existing.created_at).getTime() : 0;
        const currentDate = row.created_at ? new Date(row.created_at).getTime() : 0;
        
        if (currentDate > existingDate) {
          // Current one is more recent, replace it
          seenNames.set(normalizedName, row);
        }
      }
    });
    
    // Convert to array and sort by name
    const unique = Array.from(seenNames.values()).sort((a, b) => 
      (a.name || '').localeCompare(b.name || '')
    );
    
    return unique.map((row: any) => ({
      id: row.id,
      entityId: row.entity_id,
      classId: row.class_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    }));
  }

  async getAssetClassById(id: string) {
    const stmt = db.prepare('SELECT * FROM asset_class WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      entityId: row.entity_id,
      classId: row.class_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async createAssetClass(data: {
    name: string;
    description?: string;
    status?: string;
    metadata?: any;
    entityId?: string;
    createdBy?: string;
  }): Promise<any> {
    // Auto-generate sequential ID
    const classId = generateSequentialId('asset-class');
    
    const existing = db.prepare('SELECT * FROM asset_class WHERE class_id = ?').get(classId);
    if (existing) {
      const nextId = generateSequentialId('asset-class');
      return this.createAssetClass({ ...data, classId: nextId } as any);
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO asset_class (
        id, entity_id, class_id, name, description, status, metadata, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      classId,
      data.name,
      data.description || null,
      data.status || 'active',
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.createdBy || null,
      data.createdBy || null
    );
    return await this.getAssetClassById(id);
  }

  async updateAssetClass(id: string, data: {
    name?: string;
    description?: string;
    status?: string;
    metadata?: any;
    updatedBy?: string;
  }) {
    const existing = await this.getAssetClassById(id);
    if (!existing) {
      throw new Error(`Asset Class with id '${id}' not found`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updateFields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updateFields.push('description = ?');
      values.push(data.description);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updateFields.push('metadata = ?');
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE asset_class 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return await this.getAssetClassById(id);
  }

  async deleteAssetClass(id: string) {
    const existing = await this.getAssetClassById(id);
    if (!existing) {
      throw new Error(`Asset Class with id '${id}' not found`);
    }

    const stmt = db.prepare('DELETE FROM asset_class WHERE id = ?');
    stmt.run(id);
    return true;
  }

  // Asset Type operations
  async getAllAssetTypes(assetClassId?: string) {
    let stmt;
    let rows;
    if (assetClassId) {
      stmt = db.prepare('SELECT * FROM asset_type WHERE asset_class_id = ? ORDER BY created_at DESC');
      rows = stmt.all(assetClassId);
    } else {
      stmt = db.prepare('SELECT * FROM asset_type ORDER BY created_at DESC');
      rows = stmt.all();
    }
    
    // Deduplicate by name (case-insensitive), keeping the most recent one
    const seenNames = new Map<string, any>();
    rows.forEach((row: any) => {
      const normalizedName = (row.name || '').trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      if (!existing || (row.created_at && existing.created_at && new Date(row.created_at).getTime() > new Date(existing.created_at).getTime())) {
        seenNames.set(normalizedName, row);
      }
    });
    
    return Array.from(seenNames.values()).map((row: any) => ({
      id: row.id,
      entityId: row.entity_id,
      assetClassId: row.asset_class_id,
      typeId: row.type_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    }));
  }

  async getAssetTypeById(id: string) {
    const stmt = db.prepare('SELECT * FROM asset_type WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      entityId: row.entity_id,
      assetClassId: row.asset_class_id,
      typeId: row.type_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async createAssetType(data: {
    assetClassId: string;
    name: string;
    description?: string;
    status?: string;
    metadata?: any;
    entityId?: string;
    createdBy?: string;
  }): Promise<any> {
    // Check if asset class exists
    const assetClass = await this.getAssetClassById(data.assetClassId);
    if (!assetClass) {
      throw new Error(`Asset Class with id '${data.assetClassId}' not found`);
    }

    // Auto-generate sequential ID
    const typeId = generateSequentialId('asset-type', data.assetClassId);

    // Check if type_id already exists for this asset class
    const existing = db.prepare('SELECT * FROM asset_type WHERE asset_class_id = ? AND type_id = ?').get(data.assetClassId, typeId);
    if (existing) {
      const nextId = generateSequentialId('asset-type', data.assetClassId);
      return this.createAssetType({ ...data, typeId: nextId } as any);
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO asset_type (
        id, entity_id, asset_class_id, type_id, name, description, status, metadata, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      data.assetClassId,
      typeId,
      data.name,
      data.description || null,
      data.status || 'active',
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.createdBy || null,
      data.createdBy || null
    );
    return await this.getAssetTypeById(id);
  }

  async updateAssetType(id: string, data: {
    name?: string;
    description?: string;
    status?: string;
    metadata?: any;
    updatedBy?: string;
  }) {
    const existing = await this.getAssetTypeById(id);
    if (!existing) {
      throw new Error(`Asset Type with id '${id}' not found`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updateFields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updateFields.push('description = ?');
      values.push(data.description);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updateFields.push('metadata = ?');
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE asset_type 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return await this.getAssetTypeById(id);
  }

  async deleteAssetType(id: string) {
    const existing = await this.getAssetTypeById(id);
    if (!existing) {
      throw new Error(`Asset Type with id '${id}' not found`);
    }

    const stmt = db.prepare('DELETE FROM asset_type WHERE id = ?');
    stmt.run(id);
    return true;
  }

  // Asset operations
  async getAllAssets(assetTypeId?: string) {
    let stmt;
    let rows;
    if (assetTypeId) {
      stmt = db.prepare('SELECT * FROM assets WHERE asset_type_id = ? ORDER BY created_at DESC');
      rows = stmt.all(assetTypeId);
    } else {
      stmt = db.prepare('SELECT * FROM assets ORDER BY created_at DESC');
      rows = stmt.all();
    }
    
    // Deduplicate by name (case-insensitive), keeping the most recent one
    const seenNames = new Map<string, any>();
    rows.forEach((row: any) => {
      const normalizedName = (row.name || '').trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      if (!existing || (row.created_at && existing.created_at && new Date(row.created_at).getTime() > new Date(existing.created_at).getTime())) {
        seenNames.set(normalizedName, row);
      }
    });
    
    return Array.from(seenNames.values()).map((row: any) => ({
      id: row.id,
      entityId: row.entity_id,
      assetTypeId: row.asset_type_id,
      assetCode: row.asset_code,
      name: row.name,
      description: row.description,
      costOfAcquisition: row.cost_of_acquisition,
      dateOfAcquisition: row.date_of_acquisition,
      assetLife: row.asset_life,
      depreciationSchedule: row.depreciation_schedule ? JSON.parse(row.depreciation_schedule) : null,
      notes: row.notes,
      serviceId: row.service_id,
      serviceMappingType: row.service_mapping_type,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    }));
  }

  async getAssetById(id: string) {
    const stmt = db.prepare('SELECT * FROM assets WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      entityId: row.entity_id,
      assetTypeId: row.asset_type_id,
      assetCode: row.asset_code,
      name: row.name,
      description: row.description,
      costOfAcquisition: row.cost_of_acquisition,
      dateOfAcquisition: row.date_of_acquisition,
      assetLife: row.asset_life,
      depreciationSchedule: row.depreciation_schedule ? JSON.parse(row.depreciation_schedule) : null,
      notes: row.notes,
      serviceId: row.service_id,
      serviceMappingType: row.service_mapping_type,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async createAsset(data: {
    assetTypeId: string;
    name: string;
    description?: string;
    costOfAcquisition: number;
    dateOfAcquisition: string;
    assetLife: number;
    depreciationSchedule?: any;
    notes?: string;
    serviceId?: string;
    serviceMappingType?: 'Direct' | 'Indirect';
    status?: string;
    metadata?: any;
    entityId?: string;
    createdBy?: string;
  }): Promise<any> {
    // Validate serviceMappingType if provided
    if (data.serviceMappingType && !['Direct', 'Indirect'].includes(data.serviceMappingType)) {
      throw new Error(`Invalid serviceMappingType: ${data.serviceMappingType}. Must be 'Direct' or 'Indirect'`);
    }

    // Check if asset type exists
    const assetType = await this.getAssetTypeById(data.assetTypeId);
    if (!assetType) {
      throw new Error(`Asset Type with id '${data.assetTypeId}' not found`);
    }

    // Auto-generate sequential ID based on asset type
    const assetCode = generateSequentialId('asset', data.assetTypeId);

    // Check if asset_code already exists
    const existing = db.prepare('SELECT * FROM assets WHERE entity_id = ? AND asset_code = ?').get(data.entityId || 'hsbc', assetCode);
    if (existing) {
      const nextId = generateSequentialId('asset', data.assetTypeId);
      return this.createAsset({ ...data, assetCode: nextId } as any);
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO assets (
        id, entity_id, asset_type_id, asset_code, name, description, cost_of_acquisition,
        date_of_acquisition, asset_life, depreciation_schedule, notes, service_id, service_mapping_type, status, metadata, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      data.assetTypeId,
      assetCode,
      data.name,
      data.description || null,
      data.costOfAcquisition,
      data.dateOfAcquisition,
      data.assetLife,
      data.depreciationSchedule ? JSON.stringify(data.depreciationSchedule) : null,
      data.notes || null,
      data.serviceId || null,
      data.serviceMappingType || null,
      data.status || 'active',
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.createdBy || null,
      data.createdBy || null
    );
    return await this.getAssetById(id);
  }

  async updateAsset(id: string, data: {
    name?: string;
    description?: string;
    costOfAcquisition?: number;
    dateOfAcquisition?: string;
    assetLife?: number;
    depreciationSchedule?: any;
    notes?: string;
    serviceId?: string;
    serviceMappingType?: 'Direct' | 'Indirect';
    status?: string;
    metadata?: any;
    updatedBy?: string;
  }) {
    // Validate serviceMappingType if provided
    if (data.serviceMappingType && !['Direct', 'Indirect'].includes(data.serviceMappingType)) {
      throw new Error(`Invalid serviceMappingType: ${data.serviceMappingType}. Must be 'Direct' or 'Indirect'`);
    }

    const existing = await this.getAssetById(id);
    if (!existing) {
      throw new Error(`Asset with id '${id}' not found`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updateFields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updateFields.push('description = ?');
      values.push(data.description);
    }
    if (data.costOfAcquisition !== undefined) {
      updateFields.push('cost_of_acquisition = ?');
      values.push(data.costOfAcquisition);
    }
    if (data.dateOfAcquisition !== undefined) {
      updateFields.push('date_of_acquisition = ?');
      values.push(data.dateOfAcquisition);
    }
    if (data.assetLife !== undefined) {
      updateFields.push('asset_life = ?');
      values.push(data.assetLife);
    }
    if (data.depreciationSchedule !== undefined) {
      updateFields.push('depreciation_schedule = ?');
      values.push(data.depreciationSchedule ? JSON.stringify(data.depreciationSchedule) : null);
    }
    if (data.notes !== undefined) {
      updateFields.push('notes = ?');
      values.push(data.notes);
    }
    if (data.serviceId !== undefined) {
      updateFields.push('service_id = ?');
      values.push(data.serviceId);
    }
    if (data.serviceMappingType !== undefined) {
      updateFields.push('service_mapping_type = ?');
      values.push(data.serviceMappingType);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updateFields.push('metadata = ?');
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE assets 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return await this.getAssetById(id);
  }

  async deleteAsset(id: string) {
    const existing = await this.getAssetById(id);
    if (!existing) {
      throw new Error(`Asset with id '${id}' not found`);
    }

    const stmt = db.prepare('DELETE FROM assets WHERE id = ?');
    stmt.run(id);
    return true;
  }

  // Asset Service Allocation operations
  async getAssetServiceAllocations(assetId: string) {
    const stmt = db.prepare('SELECT * FROM asset_service_allocations WHERE asset_id = ? AND status = ?');
    const rows = stmt.all(assetId, 'active') as any[];
    return rows.map(row => ({
      id: row.id,
      assetId: row.asset_id,
      serviceId: row.service_id,
      percentage: row.percentage,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    }));
  }

  async createAssetServiceAllocation(data: {
    assetId: string;
    serviceId: string;
    percentage: number;
    entityId?: string;
    createdBy?: string;
  }) {
    // Check if allocation already exists
    const existing = db.prepare('SELECT * FROM asset_service_allocations WHERE asset_id = ? AND service_id = ?').get(data.assetId, data.serviceId);
    if (existing) {
      throw new Error(`Allocation for this service already exists`);
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO asset_service_allocations (
        id, entity_id, asset_id, service_id, percentage, status, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      data.assetId,
      data.serviceId,
      data.percentage,
      'active',
      data.createdBy || null,
      data.createdBy || null
    );
    return await this.getAssetServiceAllocations(data.assetId);
  }

  async updateAssetServiceAllocation(id: string, data: {
    percentage?: number;
    updatedBy?: string;
  }) {
    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.percentage !== undefined) {
      updateFields.push('percentage = ?');
      values.push(data.percentage);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE asset_service_allocations 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    
    const allocation = db.prepare('SELECT * FROM asset_service_allocations WHERE id = ?').get(id) as any;
    if (!allocation) return null;
    
    return await this.getAssetServiceAllocations(allocation.asset_id);
  }

  async deleteAssetServiceAllocation(id: string) {
    const allocation = db.prepare('SELECT * FROM asset_service_allocations WHERE id = ?').get(id) as any;
    if (!allocation) {
      throw new Error(`Asset service allocation with id '${id}' not found`);
    }

    const stmt = db.prepare('DELETE FROM asset_service_allocations WHERE id = ?');
    stmt.run(id);
    return true;
  }

  async deleteAllAssetServiceAllocations(assetId: string) {
    const stmt = db.prepare('DELETE FROM asset_service_allocations WHERE asset_id = ?');
    stmt.run(assetId);
    return true;
  }

  async getTotalPercentageForAsset(assetId: string) {
    const stmt = db.prepare(`
      SELECT COALESCE(SUM(percentage), 0) as total 
      FROM asset_service_allocations 
      WHERE asset_id = ? AND status = 'active'
    `);
    const result = stmt.get(assetId) as { total: number };
    return result?.total || 0;
  }

  // Service Group operations
  async getAllServiceGroups(verticalId?: string) {
    let stmt;
    let rows;
    if (verticalId) {
      stmt = db.prepare('SELECT * FROM service_groups WHERE vertical_id = ? ORDER BY created_at DESC');
      rows = stmt.all(verticalId);
    } else {
      stmt = db.prepare('SELECT * FROM service_groups ORDER BY created_at DESC');
      rows = stmt.all();
    }
    return rows.map((row: any) => ({
      id: row.id,
      entityId: row.entity_id,
      verticalId: row.vertical_id,
      groupId: row.group_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    }));
  }

  async getServiceGroupById(id: string) {
    const stmt = db.prepare('SELECT * FROM service_groups WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      entityId: row.entity_id,
      verticalId: row.vertical_id,
      groupId: row.group_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async createServiceGroup(data: {
    verticalId: string;
    name: string;
    description?: string;
    status?: string;
    metadata?: any;
    entityId?: string;
    createdBy?: string;
  }): Promise<any> {
    // Check if vertical exists
    const vertical = await this.getVerticalById(data.verticalId);
    if (!vertical) {
      throw new Error(`Vertical with id '${data.verticalId}' not found`);
    }

    // Auto-generate sequential ID
    const groupId = generateSequentialId('service-group', data.verticalId);

    // Check if group_id already exists for this vertical
    const existing = db.prepare('SELECT * FROM service_groups WHERE vertical_id = ? AND group_id = ?').get(data.verticalId, groupId);
    if (existing) {
      const nextId = generateSequentialId('service-group', data.verticalId);
      return this.createServiceGroup({ ...data, groupId: nextId } as any);
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO service_groups (
        id, entity_id, vertical_id, group_id, name, description, status, metadata, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      data.verticalId,
      groupId,
      data.name,
      data.description || null,
      data.status || 'active',
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.createdBy || null,
      data.createdBy || null
    );
    return await this.getServiceGroupById(id);
  }

  async updateServiceGroup(id: string, data: {
    name?: string;
    description?: string;
    status?: string;
    metadata?: any;
    updatedBy?: string;
  }) {
    const existing = await this.getServiceGroupById(id);
    if (!existing) {
      throw new Error(`Service Group with id '${id}' not found`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updateFields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updateFields.push('description = ?');
      values.push(data.description);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updateFields.push('metadata = ?');
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE service_groups 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return await this.getServiceGroupById(id);
  }

  async deleteServiceGroup(id: string) {
    const existing = await this.getServiceGroupById(id);
    if (!existing) {
      throw new Error(`Service Group with id '${id}' not found`);
    }

    const stmt = db.prepare('DELETE FROM service_groups WHERE id = ?');
    stmt.run(id);
    return true;
  }

  // Service operations
  async getAllServices(serviceGroupId?: string) {
    let stmt;
    let rows;
    if (serviceGroupId) {
      stmt = db.prepare('SELECT * FROM services WHERE service_group_id = ? ORDER BY created_at DESC');
      rows = stmt.all(serviceGroupId);
    } else {
      stmt = db.prepare('SELECT * FROM services ORDER BY created_at DESC');
      rows = stmt.all();
    }
    
    // Deduplicate by name AND service_group_id (case-insensitive), keeping the most recent one
    // This allows same-named services in different service groups
    const seenNames = new Map<string, any>();
    rows.forEach((row: any) => {
      const normalizedName = ((row.name || '') + '|' + (row.service_group_id || '')).trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      if (!existing || (row.created_at && existing.created_at && new Date(row.created_at).getTime() > new Date(existing.created_at).getTime())) {
        seenNames.set(normalizedName, row);
      }
    });
    
    return Array.from(seenNames.values()).map((row: any) => {
      let metadata = null;
      if (row.metadata) {
        try {
          metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
        } catch (e) {
          console.warn(`Error parsing metadata for service ${row.id}:`, e);
          metadata = null;
        }
      }
      
      return {
        id: row.id,
        entityId: row.entity_id,
        serviceGroupId: row.service_group_id,
        serviceId: row.service_id,
        name: row.name,
        description: row.description,
        uom: row.uom,
        status: row.status,
        metadata,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      };
    });
  }

  async getServiceById(id: string) {
    const stmt = db.prepare('SELECT * FROM services WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      entityId: row.entity_id,
      serviceGroupId: row.service_group_id,
      serviceId: row.service_id,
      name: row.name,
      description: row.description,
      uom: row.uom,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async createService(data: {
    serviceGroupId: string;
    name: string;
    description?: string;
    uom: string;
    status?: string;
    metadata?: any;
    entityId?: string;
    createdBy?: string;
  }): Promise<any> {
    // Check if service group exists
    const serviceGroup = await this.getServiceGroupById(data.serviceGroupId);
    if (!serviceGroup) {
      throw new Error(`Service Group with id '${data.serviceGroupId}' not found`);
    }

    // Auto-generate sequential ID
    const serviceId = generateSequentialId('service', data.serviceGroupId);

    // Check if service_id already exists for this service group
    const existing = db.prepare('SELECT * FROM services WHERE service_group_id = ? AND service_id = ?').get(data.serviceGroupId, serviceId);
    if (existing) {
      const nextId = generateSequentialId('service', data.serviceGroupId);
      return this.createService({ ...data, serviceId: nextId } as any);
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO services (
        id, entity_id, service_group_id, service_id, name, description, uom, status, metadata, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      data.serviceGroupId,
      serviceId,
      data.name,
      data.description || null,
      data.uom,
      data.status || 'active',
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.createdBy || null,
      data.createdBy || null
    );
    return await this.getServiceById(id);
  }

  async updateService(id: string, data: {
    name?: string;
    description?: string;
    uom?: string;
    status?: string;
    metadata?: any;
    updatedBy?: string;
  }) {
    const existing = await this.getServiceById(id);
    if (!existing) {
      throw new Error(`Service with id '${id}' not found`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updateFields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updateFields.push('description = ?');
      values.push(data.description);
    }
    if (data.uom !== undefined) {
      updateFields.push('uom = ?');
      values.push(data.uom);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updateFields.push('metadata = ?');
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE services 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return await this.getServiceById(id);
  }

  async deleteService(id: string) {
    const existing = await this.getServiceById(id);
    if (!existing) {
      throw new Error(`Service with id '${id}' not found`);
    }

    const stmt = db.prepare('DELETE FROM services WHERE id = ?');
    stmt.run(id);
    return true;
  }

  // Cost Group operations
  async getAllCostGroups(verticalId?: string) {
    let stmt;
    let rows;
    if (verticalId) {
      stmt = db.prepare('SELECT * FROM cost_groups WHERE vertical_id = ? ORDER BY created_at DESC');
      rows = stmt.all(verticalId);
    } else {
      stmt = db.prepare('SELECT * FROM cost_groups ORDER BY created_at DESC');
      rows = stmt.all();
    }
    
    // Deduplicate by name (case-insensitive), keeping the most recent one
    const seenNames = new Map<string, any>();
    rows.forEach((row: any) => {
      const normalizedName = (row.name || '').trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      if (!existing || (row.created_at && existing.created_at && new Date(row.created_at).getTime() > new Date(existing.created_at).getTime())) {
        seenNames.set(normalizedName, row);
      }
    });
    
    return Array.from(seenNames.values()).map((row: any) => ({
      id: row.id,
      entityId: row.entity_id,
      verticalId: row.vertical_id,
      costGroupId: row.cost_group_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    }));
  }

  async getCostGroupById(id: string) {
    const stmt = db.prepare('SELECT * FROM cost_groups WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      entityId: row.entity_id,
      verticalId: row.vertical_id,
      costGroupId: row.cost_group_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async createCostGroup(data: {
    verticalId: string;
    name: string;
    description?: string;
    status?: string;
    metadata?: any;
    entityId?: string;
    createdBy?: string;
  }): Promise<any> {
    // Check if vertical exists
    const vertical = await this.getVerticalById(data.verticalId);
    if (!vertical) {
      throw new Error(`Vertical with id '${data.verticalId}' not found`);
    }

    // Auto-generate sequential ID
    const costGroupId = generateSequentialId('cost-group', data.verticalId);

    // Check if cost_group_id already exists for this vertical
    const existing = db.prepare('SELECT * FROM cost_groups WHERE vertical_id = ? AND cost_group_id = ?').get(data.verticalId, costGroupId);
    if (existing) {
      const nextId = generateSequentialId('cost-group', data.verticalId);
      return this.createCostGroup({ ...data, costGroupId: nextId } as any);
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO cost_groups (
        id, entity_id, vertical_id, cost_group_id, name, description, status, metadata, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      data.verticalId,
      costGroupId,
      data.name,
      data.description || null,
      data.status || 'active',
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.createdBy || null,
      data.createdBy || null
    );
    return await this.getCostGroupById(id);
  }

  async updateCostGroup(id: string, data: {
    name?: string;
    description?: string;
    status?: string;
    metadata?: any;
    updatedBy?: string;
  }) {
    const existing = await this.getCostGroupById(id);
    if (!existing) {
      throw new Error(`Cost Group with id '${id}' not found`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updateFields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updateFields.push('description = ?');
      values.push(data.description);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updateFields.push('metadata = ?');
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE cost_groups 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return await this.getCostGroupById(id);
  }

  async deleteCostGroup(id: string) {
    const existing = await this.getCostGroupById(id);
    if (!existing) {
      throw new Error(`Cost Group with id '${id}' not found`);
    }

    const stmt = db.prepare('DELETE FROM cost_groups WHERE id = ?');
    stmt.run(id);
    return true;
  }

  // Budget Line operations
  async getAllBudgetLines(costGroupId?: string) {
    let stmt;
    let rows;
    if (costGroupId) {
      stmt = db.prepare('SELECT * FROM budget_lines WHERE cost_group_id = ? ORDER BY created_at DESC');
      rows = stmt.all(costGroupId);
    } else {
      stmt = db.prepare('SELECT * FROM budget_lines ORDER BY created_at DESC');
      rows = stmt.all();
    }
    return rows.map((row: any) => ({
      id: row.id,
      entityId: row.entity_id,
      costGroupId: row.cost_group_id,
      budgetLineId: row.budget_line_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    }));
  }

  async getBudgetLineById(id: string) {
    const stmt = db.prepare('SELECT * FROM budget_lines WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      entityId: row.entity_id,
      costGroupId: row.cost_group_id,
      budgetLineId: row.budget_line_id,
      name: row.name,
      description: row.description,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async createBudgetLine(data: {
    costGroupId: string;
    name: string;
    description?: string;
    status?: string;
    metadata?: any;
    entityId?: string;
    createdBy?: string;
  }): Promise<any> {
    // Check if cost group exists
    const costGroup = await this.getCostGroupById(data.costGroupId);
    if (!costGroup) {
      throw new Error(`Cost Group with id '${data.costGroupId}' not found`);
    }

    // Auto-generate sequential ID
    const budgetLineId = generateSequentialId('budget-line', data.costGroupId);

    // Check if budget_line_id already exists for this cost group
    const existing = db.prepare('SELECT * FROM budget_lines WHERE cost_group_id = ? AND budget_line_id = ?').get(data.costGroupId, budgetLineId);
    if (existing) {
      const nextId = generateSequentialId('budget-line', data.costGroupId);
      return this.createBudgetLine({ ...data, budgetLineId: nextId } as any);
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO budget_lines (
        id, entity_id, cost_group_id, budget_line_id, name, description, status, metadata, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      data.costGroupId,
      budgetLineId,
      data.name,
      data.description || null,
      data.status || 'active',
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.createdBy || null,
      data.createdBy || null
    );
    return await this.getBudgetLineById(id);
  }

  async updateBudgetLine(id: string, data: {
    name?: string;
    description?: string;
    status?: string;
    metadata?: any;
    updatedBy?: string;
  }) {
    const existing = await this.getBudgetLineById(id);
    if (!existing) {
      throw new Error(`Budget Line with id '${id}' not found`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updateFields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updateFields.push('description = ?');
      values.push(data.description);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updateFields.push('metadata = ?');
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE budget_lines 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return await this.getBudgetLineById(id);
  }

  async deleteBudgetLine(id: string) {
    const existing = await this.getBudgetLineById(id);
    if (!existing) {
      throw new Error(`Budget Line with id '${id}' not found`);
    }

    const stmt = db.prepare('DELETE FROM budget_lines WHERE id = ?');
    stmt.run(id);
    return true;
  }

  // Budget Line Budget operations
  async getBudgetLineBudgets(budgetLineId: string, financialYear?: string) {
    let stmt;
    let rows;
    if (financialYear) {
      stmt = db.prepare('SELECT * FROM budget_line_budgets WHERE budget_line_id = ? AND financial_year = ? AND status = ?');
      rows = stmt.all(budgetLineId, financialYear, 'active') as any[];
    } else {
      stmt = db.prepare('SELECT * FROM budget_line_budgets WHERE budget_line_id = ? AND status = ? ORDER BY financial_year DESC');
      rows = stmt.all(budgetLineId, 'active') as any[];
    }
    return rows.map(row => ({
      id: row.id,
      budgetLineId: row.budget_line_id,
      financialYear: row.financial_year,
      budgetAmount: row.budget_amount,
      status: row.status,
      notes: row.notes,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    }));
  }

  async getBudgetLineBudgetById(id: string) {
    const stmt = db.prepare('SELECT * FROM budget_line_budgets WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      budgetLineId: row.budget_line_id,
      financialYear: row.financial_year,
      budgetAmount: row.budget_amount,
      status: row.status,
      notes: row.notes,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async createBudgetLineBudget(data: {
    budgetLineId: string;
    financialYear: string;
    budgetAmount: number;
    notes?: string;
    status?: string;
    metadata?: any;
    entityId?: string;
    createdBy?: string;
  }) {
    // Check if budget line exists
    const budgetLine = await this.getBudgetLineById(data.budgetLineId);
    if (!budgetLine) {
      throw new Error(`Budget Line with id '${data.budgetLineId}' not found`);
    }

    // Check if budget already exists for this financial year
    const existing = db.prepare('SELECT * FROM budget_line_budgets WHERE budget_line_id = ? AND financial_year = ?').get(data.budgetLineId, data.financialYear);
    if (existing) {
      throw new Error(`Budget already exists for this budget line and financial year`);
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO budget_line_budgets (
        id, entity_id, budget_line_id, financial_year, budget_amount, status, notes, metadata, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      data.budgetLineId,
      data.financialYear,
      data.budgetAmount,
      data.status || 'active',
      data.notes || null,
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.createdBy || null,
      data.createdBy || null
    );
    return await this.getBudgetLineBudgetById(id);
  }

  async updateBudgetLineBudget(id: string, data: {
    budgetAmount?: number;
    notes?: string;
    status?: string;
    metadata?: any;
    updatedBy?: string;
  }) {
    const existing = await this.getBudgetLineBudgetById(id);
    if (!existing) {
      throw new Error(`Budget Line Budget with id '${id}' not found`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.budgetAmount !== undefined) {
      updateFields.push('budget_amount = ?');
      values.push(data.budgetAmount);
    }
    if (data.notes !== undefined) {
      updateFields.push('notes = ?');
      values.push(data.notes);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updateFields.push('metadata = ?');
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE budget_line_budgets 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return await this.getBudgetLineBudgetById(id);
  }

  async deleteBudgetLineBudget(id: string) {
    const existing = await this.getBudgetLineBudgetById(id);
    if (!existing) {
      throw new Error(`Budget Line Budget with id '${id}' not found`);
    }

    const stmt = db.prepare('DELETE FROM budget_line_budgets WHERE id = ?');
    stmt.run(id);
    return true;
  }

  // Service Group Budget operations
  async getServiceGroupBudgets(serviceGroupId: string, financialYear?: string) {
    let stmt;
    let rows;
    if (financialYear) {
      stmt = db.prepare('SELECT * FROM service_group_budgets WHERE service_group_id = ? AND financial_year = ? AND status = ?');
      rows = stmt.all(serviceGroupId, financialYear, 'active');
    } else {
      stmt = db.prepare('SELECT * FROM service_group_budgets WHERE service_group_id = ? AND status = ? ORDER BY financial_year DESC');
      rows = stmt.all(serviceGroupId, 'active');
    }

    return rows.map((row: any) => ({
      id: row.id,
      serviceGroupId: row.service_group_id,
      financialYear: row.financial_year,
      budgetAmount: row.budget_amount,
      status: row.status,
      notes: row.notes,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    }));
  }

  async getServiceGroupBudgetById(id: string) {
    const stmt = db.prepare('SELECT * FROM service_group_budgets WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      serviceGroupId: row.service_group_id,
      financialYear: row.financial_year,
      budgetAmount: row.budget_amount,
      status: row.status,
      notes: row.notes,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async createServiceGroupBudget(data: {
    serviceGroupId: string;
    financialYear: string;
    budgetAmount: number;
    notes?: string;
    status?: string;
    metadata?: any;
    entityId?: string;
    createdBy?: string;
  }) {
    // Check if service group exists
    const serviceGroup = await this.getServiceGroupById(data.serviceGroupId);
    if (!serviceGroup) {
      throw new Error(`Service Group with id '${data.serviceGroupId}' not found`);
    }

    // Check if budget already exists for this financial year
    const existing = db.prepare('SELECT * FROM service_group_budgets WHERE service_group_id = ? AND financial_year = ?').get(data.serviceGroupId, data.financialYear);
    if (existing) {
      throw new Error(`Budget already exists for this service group and financial year`);
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO service_group_budgets (
        id, entity_id, service_group_id, financial_year, budget_amount, status, notes, metadata, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      data.serviceGroupId,
      data.financialYear,
      data.budgetAmount,
      data.status || 'active',
      data.notes || null,
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.createdBy || null,
      data.createdBy || null
    );
    return await this.getServiceGroupBudgetById(id);
  }

  async updateServiceGroupBudget(id: string, data: {
    budgetAmount?: number;
    notes?: string;
    status?: string;
    metadata?: any;
    updatedBy?: string;
  }) {
    const existing = await this.getServiceGroupBudgetById(id);
    if (!existing) {
      throw new Error(`Service Group Budget with id '${id}' not found`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.budgetAmount !== undefined) {
      updateFields.push('budget_amount = ?');
      values.push(data.budgetAmount);
    }
    if (data.notes !== undefined) {
      updateFields.push('notes = ?');
      values.push(data.notes || null);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updateFields.push('metadata = ?');
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE service_group_budgets 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return await this.getServiceGroupBudgetById(id);
  }

  async deleteServiceGroupBudget(id: string) {
    const existing = await this.getServiceGroupBudgetById(id);
    if (!existing) {
      throw new Error(`Service Group Budget with id '${id}' not found`);
    }

    const stmt = db.prepare('DELETE FROM service_group_budgets WHERE id = ?');
    stmt.run(id);
    return true;
  }

  // Cost Element operations
  async getAllCostElements(budgetLineId?: string, costType?: string) {
    let stmt;
    let rows;
    if (budgetLineId && costType) {
      stmt = db.prepare('SELECT * FROM cost_elements WHERE budget_line_id = ? AND cost_type = ? ORDER BY created_at DESC');
      rows = stmt.all(budgetLineId, costType);
    } else if (budgetLineId) {
      stmt = db.prepare('SELECT * FROM cost_elements WHERE budget_line_id = ? ORDER BY created_at DESC');
      rows = stmt.all(budgetLineId);
    } else if (costType) {
      stmt = db.prepare('SELECT * FROM cost_elements WHERE cost_type = ? ORDER BY created_at DESC');
      rows = stmt.all(costType);
    } else {
      stmt = db.prepare('SELECT * FROM cost_elements ORDER BY created_at DESC');
      rows = stmt.all();
    }
    
    // Deduplicate by name AND budget_line_id (case-insensitive), keeping the most recent one
    // This allows same-named cost elements in different budget lines
    const seenNames = new Map<string, any>();
    rows.forEach((row: any) => {
      const normalizedName = ((row.name || '') + '|' + (row.budget_line_id || '')).trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      if (!existing || (row.created_at && existing.created_at && new Date(row.created_at).getTime() > new Date(existing.created_at).getTime())) {
        seenNames.set(normalizedName, row);
      }
    });
    
    return Array.from(seenNames.values()).map((row: any) => ({
      id: row.id,
      entityId: row.entity_id,
      budgetLineId: row.budget_line_id,
      costElementId: row.cost_element_id,
      name: row.name,
      description: row.description,
      costType: row.cost_type,
      serviceId: row.service_id,
      isBudgeted: Boolean(row.is_budgeted),
      financialYear: row.financial_year,
      amount: row.amount,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    }));
  }

  async getCostElementById(id: string) {
    const stmt = db.prepare('SELECT * FROM cost_elements WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      entityId: row.entity_id,
      budgetLineId: row.budget_line_id,
      costElementId: row.cost_element_id,
      name: row.name,
      description: row.description,
      costType: row.cost_type,
      serviceId: row.service_id,
      isBudgeted: Boolean(row.is_budgeted),
      financialYear: row.financial_year,
      amount: row.amount,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async createCostElement(data: {
    budgetLineId: string;
    name: string;
    description?: string;
    costType: 'Direct' | 'Indirect' | 'Common';
    serviceId?: string;
    isBudgeted: boolean;
    financialYear?: string;
    amount: number;
    status?: string;
    metadata?: any;
    entityId?: string;
    createdBy?: string;
  }) {
    // Check if budget line exists
    const budgetLine = await this.getBudgetLineById(data.budgetLineId);
    if (!budgetLine) {
      throw new Error(`Budget Line with id '${data.budgetLineId}' not found`);
    }

    // If Direct cost, serviceId is required
    if (data.costType === 'Direct' && !data.serviceId) {
      throw new Error('Service ID is required for Direct cost elements');
    }

    // If Indirect or Common, serviceId should be null
    if ((data.costType === 'Indirect' || data.costType === 'Common') && data.serviceId) {
      throw new Error('Service ID should not be provided for Indirect or Common cost elements');
    }

    // If Budgeted, financialYear is required
    if (data.isBudgeted && !data.financialYear) {
      throw new Error('Financial Year is required for Budgeted cost elements');
    }

    // Check if service exists (for Direct costs)
    if (data.serviceId) {
      const service = await this.getServiceById(data.serviceId);
      if (!service) {
        throw new Error(`Service with id '${data.serviceId}' not found`);
      }
    }

    // Auto-generate sequential ID
    let costElementId = generateSequentialId('cost-element', data.budgetLineId);
    
    // Safety check: ensure ID is generated
    if (!costElementId || costElementId.trim() === '') {
      costElementId = `COST-ELEMENT-${Date.now()}`;
    }

    // Check if cost_element_id already exists for this budget line
    const existing = db.prepare('SELECT * FROM cost_elements WHERE budget_line_id = ? AND cost_element_id = ?').get(data.budgetLineId, costElementId);
    if (existing) {
      // If somehow exists, generate next one
      costElementId = generateSequentialId('cost-element', data.budgetLineId);
      if (!costElementId || costElementId.trim() === '') {
        costElementId = `COST-ELEMENT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO cost_elements (
        id, entity_id, budget_line_id, cost_element_id, name, description, cost_type, service_id, is_budgeted, financial_year, amount, status, metadata, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    try {
      stmt.run(
        id,
        data.entityId || 'hsbc',
        data.budgetLineId,
        costElementId,
        data.name,
        data.description || null,
        data.costType,
        data.serviceId || null,
        data.isBudgeted ? 1 : 0,
        data.financialYear || null,
        data.amount || null,
        data.status || 'active',
        data.metadata ? JSON.stringify(data.metadata) : null,
        data.createdBy || null,
        data.createdBy || null
      );
    } catch (error: any) {
      console.error('Error inserting cost element:', error);
      throw new Error(`Failed to create cost element: ${error.message || 'Unknown error'}`);
    }
    
    const created = await this.getCostElementById(id);
    if (!created) {
      throw new Error('Cost element was created but could not be retrieved');
    }
    return created;
  }

  async updateCostElement(id: string, data: {
    name?: string;
    description?: string;
    isBudgeted?: boolean;
    financialYear?: string;
    amount?: number;
    status?: string;
    metadata?: any;
    updatedBy?: string;
  }) {
    const existing = await this.getCostElementById(id);
    if (!existing) {
      throw new Error(`Cost Element with id '${id}' not found`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updateFields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updateFields.push('description = ?');
      values.push(data.description);
    }
    if (data.isBudgeted !== undefined) {
      updateFields.push('is_budgeted = ?');
      values.push(data.isBudgeted ? 1 : 0);
    }
    if (data.financialYear !== undefined) {
      updateFields.push('financial_year = ?');
      values.push(data.financialYear);
    }
    if (data.amount !== undefined) {
      updateFields.push('amount = ?');
      values.push(data.amount);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updateFields.push('metadata = ?');
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE cost_elements 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return await this.getCostElementById(id);
  }

  async deleteCostElement(id: string) {
    const existing = await this.getCostElementById(id);
    if (!existing) {
      throw new Error(`Cost Element with id '${id}' not found`);
    }

    // Delete associated cost rules
    db.prepare('DELETE FROM cost_rules WHERE cost_element_id = ?').run(id);

    const stmt = db.prepare('DELETE FROM cost_elements WHERE id = ?');
    stmt.run(id);
    return true;
  }

  // Cost Rules operations
  async getAllCostRules(costElementId?: string) {
    let stmt;
    let rows;
    if (costElementId) {
      stmt = db.prepare('SELECT * FROM cost_rules WHERE cost_element_id = ? ORDER BY created_at DESC');
      rows = stmt.all(costElementId);
    } else {
      stmt = db.prepare('SELECT * FROM cost_rules ORDER BY created_at DESC');
      rows = stmt.all();
    }
    return rows.map((row: any) => ({
      id: row.id,
      entityId: row.entity_id,
      costElementId: row.cost_element_id,
      serviceId: row.service_id,
      percentage: row.percentage,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    }));
  }

  async getCostRuleById(id: string) {
    const stmt = db.prepare('SELECT * FROM cost_rules WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      entityId: row.entity_id,
      costElementId: row.cost_element_id,
      serviceId: row.service_id,
      percentage: row.percentage,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by
    };
  }

  async createCostRule(data: {
    costElementId: string;
    serviceId: string;
    percentage: number;
    status?: string;
    metadata?: any;
    entityId?: string;
    createdBy?: string;
  }) {
    // Check if cost element exists
    const costElement = await this.getCostElementById(data.costElementId);
    if (!costElement) {
      throw new Error(`Cost Element with id '${data.costElementId}' not found`);
    }

    // Check if cost element is Indirect or Common
    if (costElement.costType === 'Direct') {
      throw new Error('Cost Rules can only be created for Indirect or Common cost elements');
    }

    // Check if service exists
    const service = await this.getServiceById(data.serviceId);
    if (!service) {
      throw new Error(`Service with id '${data.serviceId}' not found`);
    }

    // Check if rule already exists
    const existing = db.prepare('SELECT * FROM cost_rules WHERE cost_element_id = ? AND service_id = ?').get(data.costElementId, data.serviceId);
    if (existing) {
      throw new Error(`Cost Rule already exists for this Cost Element and Service combination`);
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO cost_rules (
        id, entity_id, cost_element_id, service_id, percentage, status, metadata, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.entityId || 'hsbc',
      data.costElementId,
      data.serviceId,
      data.percentage,
      data.status || 'active',
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.createdBy || null,
      data.createdBy || null
    );
    return await this.getCostRuleById(id);
  }

  async updateCostRule(id: string, data: {
    percentage?: number;
    status?: string;
    metadata?: any;
    updatedBy?: string;
  }) {
    const existing = await this.getCostRuleById(id);
    if (!existing) {
      throw new Error(`Cost Rule with id '${id}' not found`);
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.percentage !== undefined) {
      updateFields.push('percentage = ?');
      values.push(data.percentage);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updateFields.push('metadata = ?');
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }
    if (data.updatedBy !== undefined) {
      updateFields.push('updated_by = ?');
      values.push(data.updatedBy);
    }

    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = db.prepare(`
      UPDATE cost_rules 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return await this.getCostRuleById(id);
  }

  async deleteCostRule(id: string) {
    const existing = await this.getCostRuleById(id);
    if (!existing) {
      throw new Error(`Cost Rule with id '${id}' not found`);
    }

    const stmt = db.prepare('DELETE FROM cost_rules WHERE id = ?');
    stmt.run(id);
    return true;
  }

  async getCostRulesByCostElement(costElementId: string) {
    return await this.getAllCostRules(costElementId);
  }

  async getTotalPercentageForCostElement(costElementId: string) {
    const stmt = db.prepare('SELECT SUM(percentage) as total FROM cost_rules WHERE cost_element_id = ?');
    const result = stmt.get(costElementId) as any;
    return result?.total || 0;
  }

  // Service Level Cost operations
  async calculateServiceLevelCost(serviceId: string, year: number) {
    try {
      // Get service details - include all services regardless of status
      const service = await this.getServiceById(serviceId);
      if (!service) {
        throw new Error(`Service with id '${serviceId}' not found`);
      }

      let directCosts = 0;
      let depreciation = 0;
      let indirectCosts = 0;
      let commonCosts = 0;

      // 1. Calculate Direct Costs for this service (only active cost elements)
      try {
        const directCostElements = db.prepare(`
          SELECT * FROM cost_elements 
          WHERE service_id = ? AND cost_type = 'Direct' AND status = 'active'
        `).all(serviceId);
        
        directCostElements.forEach((ce: any) => {
          directCosts += ce.amount || 0;
        });
      } catch (e) {
        console.warn(`Error fetching direct costs for service ${serviceId}:`, e);
      }

      // 2. Calculate Depreciation for assets tagged to this service for the specific year (only active assets)
      try {
        const assets = db.prepare(`
          SELECT * FROM assets 
          WHERE service_id = ? AND status = 'active'
        `).all(serviceId);
        
        assets.forEach((asset: any) => {
          if (asset.depreciation_schedule) {
            try {
              const schedule = JSON.parse(asset.depreciation_schedule);
              const yearData = schedule.find((y: any) => y.year === year);
              if (yearData && yearData.depreciation) {
                depreciation += yearData.depreciation;
              }
            } catch (e) {
              // Skip invalid depreciation schedules
              console.warn(`Invalid depreciation schedule for asset ${asset.id}`);
            }
          }
        });
      } catch (e) {
        console.warn(`Error fetching depreciation for service ${serviceId}:`, e);
      }

      // 3. Calculate Indirect Costs allocated to this service
      try {
        const indirectCostElements = db.prepare(`
          SELECT * FROM cost_elements 
          WHERE cost_type = 'Indirect' AND status = 'active'
        `).all();
        
        indirectCostElements.forEach((ce: any) => {
          try {
            const costRule = db.prepare(`
              SELECT * FROM cost_rules 
              WHERE cost_element_id = ? AND service_id = ? AND status = 'active'
            `).get(ce.id, serviceId) as any;
            
            if (costRule && costRule.percentage) {
              const allocatedAmount = (ce.amount || 0) * (costRule.percentage / 100);
              indirectCosts += allocatedAmount;
            }
          } catch (e) {
            console.warn(`Error processing indirect cost element ${ce.id} for service ${serviceId}:`, e);
          }
        });
      } catch (e) {
        console.warn(`Error fetching indirect costs for service ${serviceId}:`, e);
      }

      // 4. Calculate Common Costs allocated to this service
      try {
        const commonCostElements = db.prepare(`
          SELECT * FROM cost_elements 
          WHERE cost_type = 'Common' AND status = 'active'
        `).all();
        
        commonCostElements.forEach((ce: any) => {
          try {
            const costRule = db.prepare(`
              SELECT * FROM cost_rules 
              WHERE cost_element_id = ? AND service_id = ? AND status = 'active'
            `).get(ce.id, serviceId) as any;
            
            if (costRule && costRule.percentage) {
              const allocatedAmount = (ce.amount || 0) * (costRule.percentage / 100);
              commonCosts += allocatedAmount;
            }
          } catch (e) {
            console.warn(`Error processing common cost element ${ce.id} for service ${serviceId}:`, e);
          }
        });
      } catch (e) {
        console.warn(`Error fetching common costs for service ${serviceId}:`, e);
      }

      const totalCost = directCosts + depreciation + indirectCosts + commonCosts;
      const costPerUnit = service.uom && parseFloat(service.uom) > 0 
        ? totalCost / parseFloat(service.uom) 
        : 0;

      return {
        serviceId: service.id,
        serviceName: service.name,
        serviceCode: service.serviceId,
        uom: service.uom,
        year,
        directCosts: Math.round(directCosts * 100) / 100,
        depreciation: Math.round(depreciation * 100) / 100,
        indirectCosts: Math.round(indirectCosts * 100) / 100,
        commonCosts: Math.round(commonCosts * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        costPerUnit: Math.round(costPerUnit * 100) / 100
      };
    } catch (error: any) {
      console.error(`Error calculating service level cost for service ${serviceId}:`, error);
      throw error;
    }
  }

  async getAllServiceLevelCosts(year: number) {
    try {
      // Get ALL services from Service Management (including inactive ones for visibility)
      const services = await this.getAllServices();
      
      console.log(`[ServiceLevelCost] Found ${services.length} services for year ${year}`);
      
      if (!services || services.length === 0) {
        console.log('[ServiceLevelCost] No services found in database');
        return [];
      }
      
      const results = [];
      
      for (const service of services) {
        try {
          // Calculate cost for all services, even if they have zero costs
          const cost = await this.calculateServiceLevelCost(service.id, year);
          results.push(cost);
        } catch (error: any) {
          // If calculation fails, still include the service with zero costs
          // This ensures all services from Service Management are visible
          console.warn(`[ServiceLevelCost] Error calculating cost for service ${service.id} (${service.name}):`, error.message);
          results.push({
            serviceId: service.id,
            serviceName: service.name,
            serviceCode: service.serviceId,
            uom: service.uom || '0',
            year,
            directCosts: 0,
            depreciation: 0,
            indirectCosts: 0,
            commonCosts: 0,
            totalCost: 0,
            costPerUnit: 0
          });
        }
      }
      
      console.log(`[ServiceLevelCost] Returning ${results.length} service cost calculations`);
      return results.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
    } catch (error: any) {
      console.error('[ServiceLevelCost] Error in getAllServiceLevelCosts:', error);
      throw new Error(`Failed to fetch service level costs: ${error.message}`);
    }
  }

  // Get service budget amount (sum of budgeted cost elements for a service)
  async getServiceBudgetAmount(serviceId: string, financialYear?: string): Promise<number> {
    try {
      let query = `
        SELECT SUM(amount) as total 
        FROM cost_elements 
        WHERE service_id = ? AND is_budgeted = 1 AND status = 'active'
      `;
      const params: any[] = [serviceId];
      
      if (financialYear) {
        query += ' AND financial_year = ?';
        params.push(financialYear);
      }
      
      const stmt = db.prepare(query);
      const result = stmt.get(...params) as { total: number | null };
      return result?.total || 0;
    } catch (error: any) {
      console.warn(`Error fetching service budget amount for service ${serviceId}:`, error);
      return 0;
    }
  }

  // ---------- BOM: Parts (PRT) ----------
  async getParts(entityId: string = 'hsbc') {
    const stmt = db.prepare(
      'SELECT * FROM parts WHERE entity_id = ? AND status = ? ORDER BY part_id'
    );
    return stmt.all(entityId, 'active') as any[];
  }

  async getPartById(id: string) {
    const stmt = db.prepare('SELECT * FROM parts WHERE id = ?');
    return stmt.get(id) as any;
  }

  async getPartByPartId(entityId: string, partId: string) {
    const stmt = db.prepare('SELECT * FROM parts WHERE entity_id = ? AND part_id = ?');
    return stmt.get(entityId, partId) as any;
  }

  async createPart(data: { entityId?: string; partId: string; description: string; uom: string }) {
    const id = randomUUID();
    const entityId = data.entityId || 'hsbc';
    const stmt = db.prepare(`
      INSERT INTO parts (id, entity_id, part_id, description, uom, status)
      VALUES (?, ?, ?, ?, ?, 'active')
    `);
    stmt.run(id, entityId, data.partId, data.description, data.uom);
    return this.getPartById(id);
  }

  async updatePart(id: string, data: Partial<{ partId: string; description: string; uom: string; status: string }>) {
    const existing = await this.getPartById(id);
    if (!existing) return null;
    const partId = data.partId ?? existing.part_id;
    const description = data.description ?? existing.description;
    const uom = data.uom ?? existing.uom;
    const status = data.status ?? existing.status;
    const stmt = db.prepare(`
      UPDATE parts SET part_id = ?, description = ?, uom = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    stmt.run(partId, description, uom, status, id);
    return this.getPartById(id);
  }

  async deletePart(id: string) {
    const stmt = db.prepare('DELETE FROM parts WHERE id = ?');
    const result = stmt.run(id);
    return (result as any).changes > 0;
  }

  // ---------- BOM: Finished goods (FG) ----------
  static readonly DEFAULT_HSN = '8471';

  async getFinishedGoods(entityId: string = 'hsbc') {
    const stmt = db.prepare(
      'SELECT * FROM finished_goods WHERE entity_id = ? AND status = ? ORDER BY fg_id'
    );
    const rows = stmt.all(entityId, 'active') as any[];
    return rows.map((row) => ({ ...row, hsn: row.hsn || DatabaseService.DEFAULT_HSN }));
  }

  async getFinishedGoodById(id: string) {
    const stmt = db.prepare('SELECT * FROM finished_goods WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return row;
    return { ...row, hsn: row.hsn || DatabaseService.DEFAULT_HSN };
  }

  async getFinishedGoodByFgId(entityId: string, fgId: string) {
    const stmt = db.prepare('SELECT * FROM finished_goods WHERE entity_id = ? AND fg_id = ?');
    return stmt.get(entityId, fgId) as any;
  }

  async createFinishedGood(data: { entityId?: string; fgId: string; description: string; uom: string; hsn?: string }) {
    const id = randomUUID();
    const entityId = data.entityId || 'hsbc';
    const hsn = (data.hsn?.trim()) || DatabaseService.DEFAULT_HSN;
    const stmt = db.prepare(`
      INSERT INTO finished_goods (id, entity_id, fg_id, description, uom, hsn, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `);
    stmt.run(id, entityId, data.fgId, data.description, data.uom, hsn);
    return this.getFinishedGoodById(id);
  }

  async updateFinishedGood(id: string, data: Partial<{ fgId: string; description: string; uom: string; hsn: string; status: string }>) {
    const existing = await this.getFinishedGoodById(id);
    if (!existing) return null;
    const fgId = data.fgId ?? existing.fg_id;
    const description = data.description ?? existing.description;
    const uom = data.uom ?? existing.uom;
    const hsn = data.hsn !== undefined ? (data.hsn?.trim() || DatabaseService.DEFAULT_HSN) : (existing.hsn || DatabaseService.DEFAULT_HSN);
    const status = data.status ?? existing.status;
    const stmt = db.prepare(`
      UPDATE finished_goods SET fg_id = ?, description = ?, uom = ?, hsn = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    stmt.run(fgId, description, uom, hsn, status, id);
    return this.getFinishedGoodById(id);
  }

  async deleteFinishedGood(id: string) {
    const stmt = db.prepare('DELETE FROM finished_goods WHERE id = ?');
    const result = stmt.run(id);
    return (result as any).changes > 0;
  }

  // ---------- BOM: Bill of materials ----------
  async getBomByFinishedGoodId(finishedGoodId: string) {
    const stmt = db.prepare('SELECT * FROM bom WHERE finished_good_id = ?');
    return stmt.get(finishedGoodId) as any;
  }

  async getBomById(id: string) {
    const stmt = db.prepare('SELECT * FROM bom WHERE id = ?');
    return stmt.get(id) as any;
  }

  async getAllBoms(entityId: string = 'hsbc') {
    const stmt = db.prepare(`
      SELECT b.*, fg.fg_id, fg.description as fg_description, fg.uom as fg_uom, COALESCE(fg.hsn, ?) as fg_hsn
      FROM bom b
      JOIN finished_goods fg ON fg.id = b.finished_good_id
      WHERE b.entity_id = ? AND b.status = 'active'
      ORDER BY fg.fg_id
    `);
    return stmt.all(DatabaseService.DEFAULT_HSN, entityId) as any[];
  }

  async getBomsWithLines(entityId: string = 'hsbc') {
    const boms = await this.getAllBoms(entityId);
    const result = [];
    for (const bom of boms) {
      const lines = await this.getBomLines(bom.id);
      result.push({ ...bom, lines });
    }
    return result;
  }

  async createBom(data: { entityId?: string; finishedGoodId: string }) {
    const id = randomUUID();
    const entityId = data.entityId || 'hsbc';
    const stmt = db.prepare(`
      INSERT INTO bom (id, entity_id, finished_good_id, version, status)
      VALUES (?, ?, ?, 1, 'active')
    `);
    stmt.run(id, entityId, data.finishedGoodId);
    return this.getBomById(id);
  }

  async deleteBom(id: string) {
    const stmt = db.prepare('DELETE FROM bom WHERE id = ?');
    const result = stmt.run(id);
    return (result as any).changes > 0;
  }

  // ---------- BOM: BOM lines ----------
  async getBomLines(bomId: string) {
    const stmt = db.prepare(`
      SELECT bl.*, p.part_id, p.description as part_description, p.uom as part_uom
      FROM bom_lines bl
      JOIN parts p ON p.id = bl.part_id
      WHERE bl.bom_id = ?
      ORDER BY bl.id
    `);
    return stmt.all(bomId) as any[];
  }

  async createBomLine(data: {
    bomId: string;
    partId: string;
    quantity: number;
    consumptionUom: string;
    uomConversionFactor: number;
  }) {
    const bom = await this.getBomById(data.bomId);
    if (!bom) throw new Error('BOM not found');
    const part = await this.getPartByPartId(bom.entity_id, data.partId);
    if (!part) throw new Error(`Part not found: ${data.partId}`);
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO bom_lines (id, bom_id, part_id, quantity, consumption_uom, uom_conversion_factor)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, data.bomId, part.id, data.quantity, data.consumptionUom, data.uomConversionFactor ?? 1);
    return db.prepare('SELECT * FROM bom_lines WHERE id = ?').get(id) as any;
  }

  async updateBomLine(id: string, data: Partial<{ quantity: number; consumptionUom: string; uomConversionFactor: number }>) {
    const existing = db.prepare('SELECT * FROM bom_lines WHERE id = ?').get(id) as any;
    if (!existing) return null;
    const quantity = data.quantity ?? existing.quantity;
    const consumptionUom = data.consumptionUom ?? existing.consumption_uom;
    const uomConversionFactor = data.uomConversionFactor ?? existing.uom_conversion_factor;
    const stmt = db.prepare(`
      UPDATE bom_lines SET quantity = ?, consumption_uom = ?, uom_conversion_factor = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    stmt.run(quantity, consumptionUom, uomConversionFactor, id);
    return db.prepare('SELECT * FROM bom_lines WHERE id = ?').get(id) as any;
  }

  async deleteBomLine(id: string) {
    const stmt = db.prepare('DELETE FROM bom_lines WHERE id = ?');
    const result = stmt.run(id);
    return (result as any).changes > 0;
  }
}

// Initialize database on module load
try {
  console.log('[Database] Initializing database tables...');
  initializeDatabase();
  console.log('[Database] Database initialization complete');
} catch (error) {
  console.error('[Database] Error initializing database:', error);
  throw error;
}

export const databaseService = new DatabaseService();
