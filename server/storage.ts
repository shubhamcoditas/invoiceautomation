import { type User, type InsertUser, type QRData, type InsertQRData, type PDFData, type InsertPDFData, type EGAMData, type InsertEGAMData, type EGAMAuditLog, type InsertEGAMAuditLog, type SystemLog, type InsertSystemLog, type APILog, type InsertAPILog, type PDFProcessingHistory, type InsertPDFProcessingHistory, type BulkQRProcessing, type InsertBulkQRProcessing, type BulkQRBatches, type InsertBulkQRBatches } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // QR Data operations
  createQRData(data: InsertQRData): Promise<QRData>;
  getAllQRData(): Promise<QRData[]>;
  updateQRData(id: string, data: Partial<InsertQRData>): Promise<QRData | undefined>;
  
  // PDF Data operations
  createPDFData(data: InsertPDFData): Promise<PDFData>;
  getAllPDFData(): Promise<PDFData[]>;
  updatePDFData(id: string, data: Partial<InsertPDFData>): Promise<PDFData | undefined>;
  
  // EGAM Repository operations
  getAllEGAMData(): Promise<EGAMData[]>;
  createEGAMData(data: InsertEGAMData): Promise<EGAMData>;
  updateEGAMData(id: string, data: Partial<InsertEGAMData>): Promise<EGAMData | undefined>;
  getEGAMDataByIRN(irn: string): Promise<EGAMData | undefined>;
  
  // EGAM Audit Logs operations
  createEGAMAuditLog(log: InsertEGAMAuditLog): Promise<EGAMAuditLog>;
  getAllEGAMAuditLogs(): Promise<EGAMAuditLog[]>;
  getNextScheduledPull(): Promise<Date | null>;
  
  // System Logs operations
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  getAllSystemLogs(): Promise<SystemLog[]>;
  getSystemLogsByLevel(level: string): Promise<SystemLog[]>;
  
  // API Logs operations
  createAPILog(log: InsertAPILog): Promise<APILog>;
  getAllAPILogs(): Promise<APILog[]>;
  getAPILogsByStatus(status: string): Promise<APILog[]>;
  
  // PDF Processing History operations
  createPDFProcessingHistory(history: InsertPDFProcessingHistory): Promise<PDFProcessingHistory>;
  getAllPDFProcessingHistory(): Promise<PDFProcessingHistory[]>;
  getPDFProcessingHistoryByUser(processedBy: string): Promise<PDFProcessingHistory[]>;
  
  // Bulk QR Processing operations
  createBulkQRBatch(batch: InsertBulkQRBatches): Promise<BulkQRBatches>;
  createBulkQRProcessing(processing: InsertBulkQRProcessing): Promise<BulkQRProcessing>;
  getAllBulkQRBatches(): Promise<BulkQRBatches[]>;
  getBulkQRProcessingByBatchId(batchId: string): Promise<BulkQRProcessing[]>;
  updateBulkQRProcessing(id: string, data: Partial<InsertBulkQRProcessing>): Promise<BulkQRProcessing | undefined>;
  updateBulkQRBatch(id: string, data: Partial<InsertBulkQRBatches>): Promise<BulkQRBatches | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private qrData: Map<string, QRData>;
  private pdfData: Map<string, PDFData>;
  private egamData: Map<string, EGAMData>;
  private egamAuditLogs: Map<string, EGAMAuditLog>;
  private systemLogs: Map<string, SystemLog>;
  private apiLogs: Map<string, APILog>;
  private pdfProcessingHistory: Map<string, PDFProcessingHistory>;
  private bulkQRBatches: Map<string, BulkQRBatches>;
  private bulkQRProcessing: Map<string, BulkQRProcessing>;

  constructor() {
    this.users = new Map();
    this.qrData = new Map();
    this.pdfData = new Map();
    this.egamData = new Map();
    this.egamAuditLogs = new Map();
    this.systemLogs = new Map();
    this.apiLogs = new Map();
    this.pdfProcessingHistory = new Map();
    this.bulkQRBatches = new Map();
    this.bulkQRProcessing = new Map();
    
    // Initialize with some dummy data
    this.initializeDummyData();
  }

  private initializeDummyData() {
    // Add a default admin user
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      password: "password",
      role: "admin"
    };
    this.users.set(adminUser.id, adminUser);

    // Add some EGAM dummy data
    const egamRecords = [
      {
        id: randomUUID(),
        irn: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n",
        invoiceNo: "INV-2024-001",
        date: "2024-01-15",
        vendorGstin: "27ABCDE1234F1Z5",
        amount: "₹125,000.00",
        status: "processed",
        fetchedAt: new Date()
      },
      {
        id: randomUUID(),
        irn: "2b3c4d5e6f7g8h9i0j1k2l3m4n5o",
        invoiceNo: "INV-2024-002",
        date: "2024-01-16",
        vendorGstin: "29XYZAB5678P1Q2",
        amount: "₹89,500.00",
        status: "pending",
        fetchedAt: new Date()
      }
    ];

    egamRecords.forEach(record => {
      this.egamData.set(record.id, record);
    });

    // Add some QR data dummy records
    const qrRecords = [
      {
        id: randomUUID(),
        irn: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n",
        gstin: "27ABCDE1234F1Z5",
        invoiceNo: "INV-2024-001",
        date: "2024-01-15",
        totalAmount: "₹125,000.00",
        buyerGstin: "29XYZAB5678P1Q2",
        sellerGstin: "27ABCDE1234F1Z5",
        invoiceType: "B2B",
        qrString: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
        processedBy: "admin",
        status: "success" as string,
        extractedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: randomUUID(),
        irn: "2b3c4d5e6f7g8h9i0j1k2l3m4n5o",
        gstin: "29XYZAB5678P1Q2",
        invoiceNo: "INV-2024-002",
        date: "2024-01-16",
        totalAmount: "₹89,500.00",
        buyerGstin: "27ABCDE1234F1Z5",
        sellerGstin: "29XYZAB5678P1Q2",
        invoiceType: "B2B",
        qrString: "2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
        processedBy: "john_doe",
        status: "success" as string,
        extractedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: randomUUID(),
        irn: "3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
        gstin: "07PQRST9012M3N4",
        invoiceNo: "INV-2024-003",
        date: "2024-01-17",
        totalAmount: "₹45,750.00",
        buyerGstin: "29XYZAB5678P1Q2",
        sellerGstin: "07PQRST9012M3N4",
        invoiceType: "B2B",
        qrString: "3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
        processedBy: "jane_smith",
        status: "failed",
        extractedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      },
      {
        id: randomUUID(),
        irn: "4d5e6f7g8h9i0j1k2l3m4n5o6p7q",
        gstin: "19LMNOP3456R7S8",
        invoiceNo: "INV-2024-004",
        date: "2024-01-18",
        totalAmount: "₹67,200.00",
        buyerGstin: "27ABCDE1234F1Z5",
        sellerGstin: "19LMNOP3456R7S8",
        invoiceType: "B2B",
        qrString: "4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
        processedBy: "mike_wilson",
        status: "success" as string,
        extractedAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        id: randomUUID(),
        irn: "5e6f7g8h9i0j1k2l3m4n5o6p7q8r",
        gstin: "33UVWXY7890Z1A2",
        invoiceNo: "INV-2024-005",
        date: "2024-01-19",
        totalAmount: "₹156,800.00",
        buyerGstin: "29XYZAB5678P1Q2",
        sellerGstin: "33UVWXY7890Z1A2",
        invoiceType: "B2B",
        qrString: "5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
        processedBy: "sarah_jones",
        status: "success" as string,
        extractedAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      },
      {
        id: randomUUID(),
        irn: "6f7g8h9i0j1k2l3m4n5o6p7q8r9s",
        gstin: "12BCDEF4567G8H9",
        invoiceNo: "INV-2024-006",
        date: "2024-01-20",
        totalAmount: "₹98,300.00",
        buyerGstin: "07PQRST9012M3N4",
        sellerGstin: "12BCDEF4567G8H9",
        invoiceType: "B2B",
        qrString: "6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
        processedBy: "admin",
        status: "failed",
        extractedAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      {
        id: randomUUID(),
        irn: "7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
        gstin: "06IJKLM0123N4O5",
        invoiceNo: "INV-2024-007",
        date: "2024-01-21",
        totalAmount: "₹234,500.00",
        buyerGstin: "19LMNOP3456R7S8",
        sellerGstin: "06IJKLM0123N4O5",
        invoiceType: "B2B",
        qrString: "7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
        processedBy: "john_doe",
        status: "success" as string,
        extractedAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        id: randomUUID(),
        irn: "8h9i0j1k2l3m4n5o6p7q8r9s0t1u",
        gstin: "24PQRST5678U9V0",
        invoiceNo: "INV-2024-008",
        date: "2024-01-22",
        totalAmount: "₹78,900.00",
        buyerGstin: "33UVWXY7890Z1A2",
        sellerGstin: "24PQRST5678U9V0",
        invoiceType: "B2B",
        qrString: "8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
        processedBy: "jane_smith",
        status: "success" as string,
        extractedAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      }
    ];

    qrRecords.forEach(record => {
      this.qrData.set(record.id, record);
    });

    // Add some bulk QR processing dummy data
    const bulkBatchId = randomUUID();
    const bulkBatch = {
      id: bulkBatchId,
      fileName: "qr_batch_import_2024_01_20.xlsx",
      totalRecords: 5,
      processedRecords: 5,
      successRecords: 4,
      failedRecords: 1,
      status: "completed",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000) // 10 minutes later
    };
    this.bulkQRBatches.set(bulkBatchId, bulkBatch);

    const bulkProcessingRecords = [
      {
        id: randomUUID(),
        batchId: bulkBatchId,
        qrString: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n",
        status: "success" as string,
        processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000),
        extractedData: { irn: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n", invoiceNo: "INV-2024-001" },
        errorMessage: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: randomUUID(),
        batchId: bulkBatchId,
        qrString: "2b3c4d5e6f7g8h9i0j1k2l3m4n5o",
        status: "success" as string,
        processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 1000),
        extractedData: { irn: "2b3c4d5e6f7g8h9i0j1k2l3m4n5o", invoiceNo: "INV-2024-002" },
        errorMessage: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: randomUUID(),
        batchId: bulkBatchId,
        qrString: "3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
        status: "success" as string,
        processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 1000),
        extractedData: { irn: "3c4d5e6f7g8h9i0j1k2l3m4n5o6p", invoiceNo: "INV-2024-003" },
        errorMessage: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: randomUUID(),
        batchId: bulkBatchId,
        qrString: "4d5e6f7g8h9i0j1k2l3m4n5o6p7q",
        status: "success" as string,
        processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000),
        extractedData: { irn: "4d5e6f7g8h9i0j1k2l3m4n5o6p7q", invoiceNo: "INV-2024-004" },
        errorMessage: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: randomUUID(),
        batchId: bulkBatchId,
        qrString: "invalid_qr_string_123",
        status: "failed",
        processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
        extractedData: null,
        errorMessage: "Invalid QR string format",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    bulkProcessingRecords.forEach(record => {
      this.bulkQRProcessing.set(record.id, record);
    });

    // Add some EGAM audit log dummy data
    const auditRecords = [
      {
        id: randomUUID(),
        pullType: 'scheduled',
        status: 'success',
        recordsCount: '2',
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000), // 5 minutes later
        errorMessage: null,
        nextScheduledAt: new Date(Date.now() + 22 * 60 * 60 * 1000) // 22 hours from now
      },
      {
        id: randomUUID(),
        pullType: 'manual',
        status: 'success',
        recordsCount: '1',
        startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 3 * 60 * 1000), // 3 minutes later
        errorMessage: null,
        nextScheduledAt: null
      },
      {
        id: randomUUID(),
        pullType: 'scheduled',
        status: 'error',
        recordsCount: null,
        startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000 + 2 * 60 * 1000), // 2 minutes later
        errorMessage: 'Connection timeout to KIGS API',
        nextScheduledAt: new Date(Date.now() + 21 * 60 * 60 * 1000) // 21 hours from now
      }
    ];

    auditRecords.forEach(record => {
      this.egamAuditLogs.set(record.id, record);
    });

    // Add some PDF processing history dummy data
    const pdfHistoryRecords = [
      {
        id: randomUUID(),
        fileName: "invoice_001.pdf",
        documentType: "Invoice",
        processedBy: "admin",
        ewbStatus: "success",
        processedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        invoiceNo: "INV-2024-001",
        amount: "₹125,000.00",
        vendorName: "ABC Technologies Pvt Ltd",
        buyerName: "XYZ Corporation Ltd"
      },
      {
        id: randomUUID(),
        fileName: "delivery_challan_002.pdf",
        documentType: "Delivery Challan",
        processedBy: "admin",
        ewbStatus: "failed",
        processedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        invoiceNo: "DC-2024-002",
        amount: "₹45,000.00",
        vendorName: "DEF Logistics Ltd",
        buyerName: "GHI Industries"
      },
      {
        id: randomUUID(),
        fileName: "boe_003.pdf",
        documentType: "BOE",
        processedBy: "admin",
        ewbStatus: "not_attempted",
        processedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        invoiceNo: "BOE-2024-003",
        amount: "₹78,500.00",
        vendorName: "JKL Trading Co",
        buyerName: "MNO Enterprises"
      },
      {
        id: randomUUID(),
        fileName: "tax_invoice_004.pdf",
        documentType: "Invoice",
        processedBy: "john_doe",
        ewbStatus: "success",
        processedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        invoiceNo: "INV-2024-004",
        amount: "₹89,750.00",
        vendorName: "Tech Solutions Inc",
        buyerName: "Global Enterprises"
      },
      {
        id: randomUUID(),
        fileName: "shipping_bill_005.pdf",
        documentType: "Shipping Bill",
        processedBy: "jane_smith",
        ewbStatus: "failed",
        processedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        invoiceNo: "SB-2024-005",
        amount: "₹15,200.00",
        vendorName: "Digital Services Ltd",
        buyerName: "Retail Corp"
      },
      {
        id: randomUUID(),
        fileName: "delivery_challan_006.pdf",
        documentType: "Delivery Challan",
        processedBy: "admin",
        ewbStatus: "success",
        processedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        invoiceNo: "DC-2024-006",
        amount: "₹32,100.00",
        vendorName: "Manufacturing Co",
        buyerName: "Distribution Ltd"
      },
      {
        id: randomUUID(),
        fileName: "boe_007.pdf",
        documentType: "BOE",
        processedBy: "mike_wilson",
        ewbStatus: "not_attempted",
        processedAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
        invoiceNo: "BOE-2024-007",
        amount: "₹8,500.00",
        vendorName: "Service Provider",
        buyerName: "Client Company"
      },
      {
        id: randomUUID(),
        fileName: "invoice_008.pdf",
        documentType: "Invoice",
        processedBy: "sarah_jones",
        ewbStatus: "success",
        processedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        invoiceNo: "INV-2024-008",
        amount: "₹156,300.00",
        vendorName: "Software Solutions",
        buyerName: "IT Corporation"
      },
      {
        id: randomUUID(),
        fileName: "shipping_bill_009.pdf",
        documentType: "Shipping Bill",
        processedBy: "admin",
        ewbStatus: "failed",
        processedAt: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
        invoiceNo: "SB-2024-009",
        amount: "₹67,800.00",
        vendorName: "Logistics Pro",
        buyerName: "Supply Chain Co"
      },
      {
        id: randomUUID(),
        fileName: "boe_010.pdf",
        documentType: "BOE",
        processedBy: "david_brown",
        ewbStatus: "success",
        processedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
        invoiceNo: "BOE-2024-010",
        amount: "₹203,450.00",
        vendorName: "Shipping Solutions",
        buyerName: "Import Export Ltd"
      },
      {
        id: randomUUID(),
        fileName: "invoice_011.pdf",
        documentType: "Invoice",
        processedBy: "lisa_garcia",
        ewbStatus: "not_attempted",
        processedAt: new Date(Date.now() - 11 * 60 * 60 * 1000), // 11 hours ago
        invoiceNo: "INV-2024-011",
        amount: "₹94,200.00",
        vendorName: "Consulting Firm",
        buyerName: "Business Solutions"
      },
      {
        id: randomUUID(),
        fileName: "delivery_challan_012.pdf",
        documentType: "Delivery Challan",
        processedBy: "admin",
        ewbStatus: "success",
        processedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        invoiceNo: "DC-2024-012",
        amount: "₹28,750.00",
        vendorName: "Financial Services",
        buyerName: "Banking Corp"
      },
      {
        id: randomUUID(),
        fileName: "shipping_bill_013.pdf",
        documentType: "Shipping Bill",
        processedBy: "alex_taylor",
        ewbStatus: "failed",
        processedAt: new Date(Date.now() - 13 * 60 * 60 * 1000), // 13 hours ago
        invoiceNo: "SB-2024-013",
        amount: "₹41,600.00",
        vendorName: "Trading Company",
        buyerName: "Retail Chain"
      },
      {
        id: randomUUID(),
        fileName: "boe_014.pdf",
        documentType: "BOE",
        processedBy: "emma_davis",
        ewbStatus: "success",
        processedAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
        invoiceNo: "BOE-2024-014",
        amount: "₹12,300.00",
        vendorName: "Healthcare Services",
        buyerName: "Medical Center"
      },
      {
        id: randomUUID(),
        fileName: "invoice_015.pdf",
        documentType: "Invoice",
        processedBy: "admin",
        ewbStatus: "not_attempted",
        processedAt: new Date(Date.now() - 15 * 60 * 60 * 1000), // 15 hours ago
        invoiceNo: "INV-2024-015",
        amount: "₹178,900.00",
        vendorName: "Construction Ltd",
        buyerName: "Real Estate Co"
      },
      {
        id: randomUUID(),
        fileName: "delivery_challan_016.pdf",
        documentType: "Delivery Challan",
        processedBy: "robert_miller",
        ewbStatus: "success",
        processedAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
        invoiceNo: "DC-2024-016",
        amount: "₹55,400.00",
        vendorName: "Transport Co",
        buyerName: "Distribution Network"
      },
      {
        id: randomUUID(),
        fileName: "shipping_bill_017.pdf",
        documentType: "Shipping Bill",
        processedBy: "admin",
        ewbStatus: "failed",
        processedAt: new Date(Date.now() - 17 * 60 * 60 * 1000), // 17 hours ago
        invoiceNo: "SB-2024-017",
        amount: "₹91,250.00",
        vendorName: "Freight Forwarder",
        buyerName: "Shipping Company"
      },
      {
        id: randomUUID(),
        fileName: "invoice_018.pdf",
        documentType: "Invoice",
        processedBy: "jennifer_white",
        ewbStatus: "success",
        processedAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
        invoiceNo: "INV-2024-018",
        amount: "₹267,800.00",
        vendorName: "Technology Corp",
        buyerName: "Innovation Labs"
      },
      {
        id: randomUUID(),
        fileName: "delivery_challan_019.pdf",
        documentType: "Delivery Challan",
        processedBy: "admin",
        ewbStatus: "not_attempted",
        processedAt: new Date(Date.now() - 19 * 60 * 60 * 1000), // 19 hours ago
        invoiceNo: "DC-2024-019",
        amount: "₹19,750.00",
        vendorName: "Marketing Agency",
        buyerName: "Advertising Co"
      },
      {
        id: randomUUID(),
        fileName: "boe_020.pdf",
        documentType: "BOE",
        processedBy: "michael_johnson",
        ewbStatus: "success",
        processedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
        invoiceNo: "BOE-2024-020",
        amount: "₹73,600.00",
        vendorName: "Energy Solutions",
        buyerName: "Power Company"
      },
      {
        id: randomUUID(),
        fileName: "shipping_bill_021.pdf",
        documentType: "Shipping Bill",
        processedBy: "admin",
        ewbStatus: "failed",
        processedAt: new Date(Date.now() - 21 * 60 * 60 * 1000), // 21 hours ago
        invoiceNo: "SB-2024-021",
        amount: "₹6,800.00",
        vendorName: "Maintenance Co",
        buyerName: "Facility Manager"
      },
      {
        id: randomUUID(),
        fileName: "invoice_022.pdf",
        documentType: "Invoice",
        processedBy: "sophia_martinez",
        ewbStatus: "success",
        processedAt: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
        invoiceNo: "INV-2024-022",
        amount: "₹145,200.00",
        vendorName: "Legal Services",
        buyerName: "Law Firm"
      },
      {
        id: randomUUID(),
        fileName: "delivery_challan_023.pdf",
        documentType: "Delivery Challan",
        processedBy: "admin",
        ewbStatus: "not_attempted",
        processedAt: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
        invoiceNo: "DC-2024-023",
        amount: "₹38,900.00",
        vendorName: "Warehouse Co",
        buyerName: "Storage Solutions"
      },
      {
        id: randomUUID(),
        fileName: "shipping_bill_024.pdf",
        documentType: "Shipping Bill",
        processedBy: "william_anderson",
        ewbStatus: "success",
        processedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        invoiceNo: "SB-2024-024",
        amount: "₹312,500.00",
        vendorName: "Heavy Industries",
        buyerName: "Manufacturing Corp"
      },
      {
        id: randomUUID(),
        fileName: "invoice_025.pdf",
        documentType: "Invoice",
        processedBy: "admin",
        ewbStatus: "failed",
        processedAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
        invoiceNo: "INV-2024-025",
        amount: "₹87,300.00",
        vendorName: "Education Services",
        buyerName: "University"
      }
    ];

    pdfHistoryRecords.forEach(record => {
      this.pdfProcessingHistory.set(record.id, record);
    });

    // Add some API logs dummy data for different APIs
    const apiLogRecords = [
      // Search Taxpayer API logs
      {
        id: randomUUID(),
        apiName: "Search Taxpayer",
        apiType: "search-taxpayer",
        parameters: { gstin: "27ABCDE1234F1Z5", action: "TP", fy: "2024-25" },
        response: { status: "success", data: { taxpayerName: "ABC Technologies Pvt Ltd" } },
        status: "success" as string,
        responseTime: 245 as number,
        timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        id: randomUUID(),
        apiName: "Search Taxpayer",
        apiType: "search-taxpayer",
        parameters: { gstin: "29XYZAB5678P1Q2", action: "TP", fy: "2024-25" },
        response: { status: "error", message: "GSTIN not found" },
        status: "error",
        responseTime: 180 as number,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      // PAN to GSTIN API logs
      {
        id: randomUUID(),
        apiName: "PAN to GSTIN",
        apiType: "pan-to-gstin",
        parameters: { pan: "ABCDE1234F", action: "TP", fy: "2024-25" },
        response: { status: "success", data: { gstinList: ["27ABCDE1234F1Z5", "29ABCDE1234F1Z6"] } },
        status: "success" as string,
        responseTime: 320 as number,
        timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
      },
      {
        id: randomUUID(),
        apiName: "PAN to GSTIN",
        apiType: "pan-to-gstin",
        parameters: { pan: "FGHIJ5678K", action: "TP", fy: "2024-25" },
        response: { status: "success", data: { gstinList: ["33FGHIJ5678K1L2"] } },
        status: "success" as string,
        responseTime: 280 as number,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      },
      // View & Track Returns API logs
      {
        id: randomUUID(),
        apiName: "View & Track Returns",
        apiType: "view-track-returns",
        parameters: { gstin: "27ABCDE1234F1Z5", fy: "2024-25", type: "GSTR1" },
        response: { status: "success", data: { returns: [{ period: "012024", status: "Filed" }] } },
        status: "success" as string,
        responseTime: 450 as number,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      {
        id: randomUUID(),
        apiName: "View & Track Returns",
        apiType: "view-track-returns",
        parameters: { gstin: "29XYZAB5678P1Q2", fy: "2024-25", type: "GSTR3B" },
        response: { status: "error", message: "No returns found" },
        status: "error",
        responseTime: 200 as number,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      // Get Preference API logs
      {
        id: randomUUID(),
        apiName: "Get Preference",
        apiType: "get-preference",
        parameters: { gstin: "27ABCDE1234F1Z5", fy: "2024-25", preferenceType: "General" },
        response: { status: "success", data: { preferences: { notifications: true, filing: "auto" } } },
        status: "success" as string,
        responseTime: 190 as number,
        timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      // MSME Validation API logs
      {
        id: randomUUID(),
        apiName: "MSME Validation",
        apiType: "msme-validation",
        parameters: { msmeId: "MSME123456", gstin: "27ABCDE1234F1Z5", enterpriseType: "Micro" },
        response: { status: "success", data: { isValid: true, enterpriseType: "Micro" } },
        status: "success" as string,
        responseTime: 380 as number,
        timestamp: new Date(Date.now() - 20 * 60 * 1000) // 20 minutes ago
      },
      {
        id: randomUUID(),
        apiName: "MSME Validation",
        apiType: "msme-validation",
        parameters: { msmeId: "MSME789012", gstin: "29XYZAB5678P1Q2", enterpriseType: "Small" },
        response: { status: "error", message: "MSME ID not found" },
        status: "error",
        responseTime: 150 as number,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      },
      // CIN Validation API logs
      {
        id: randomUUID(),
        apiName: "CIN Validation",
        apiType: "cin-validation",
        parameters: { cin: "L74999DL2010PTC123456", gstin: "27ABCDE1234F1Z5", companyType: "Private Limited" },
        response: { status: "success", data: { isValid: true, companyName: "ABC Technologies Pvt Ltd" } },
        status: "success" as string,
        responseTime: 420 as number,
        timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
      },
      {
        id: randomUUID(),
        apiName: "CIN Validation",
        apiType: "cin-validation",
        parameters: { cin: "U12345MH2020PTC789012", gstin: "33MNPQR9012S3T4", companyType: "Public Limited" },
        response: { status: "success", data: { isValid: true, companyName: "XYZ Corporation Ltd" } },
        status: "success" as string,
        responseTime: 350 as number,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      }
    ];

    apiLogRecords.forEach(record => {
      this.apiLogs.set(record.id, record);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, role: insertUser.role || 'business_user' };
    this.users.set(id, user);
    return user;
  }

  async createQRData(data: InsertQRData): Promise<QRData> {
    const id = randomUUID();
    const qrRecord: QRData = { 
      ...data, 
      id, 
      status: data.status || "success",
      extractedAt: new Date()
    };
    this.qrData.set(id, qrRecord);
    return qrRecord;
  }

  async getAllQRData(): Promise<QRData[]> {
    return Array.from(this.qrData.values());
  }

  async updateQRData(id: string, data: Partial<InsertQRData>): Promise<QRData | undefined> {
    const existing = this.qrData.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...data };
    this.qrData.set(id, updated);
    return updated;
  }

  async createPDFData(data: InsertPDFData): Promise<PDFData> {
    const id = randomUUID();
    const pdfRecord: PDFData = { 
      ...data, 
      id, 
      status: data.status || 'processed',
      extractedAt: new Date()
    };
    this.pdfData.set(id, pdfRecord);
    return pdfRecord;
  }

  async getAllPDFData(): Promise<PDFData[]> {
    return Array.from(this.pdfData.values());
  }

  async updatePDFData(id: string, data: Partial<InsertPDFData>): Promise<PDFData | undefined> {
    const existing = this.pdfData.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...data };
    this.pdfData.set(id, updated);
    return updated;
  }

  async getAllEGAMData(): Promise<EGAMData[]> {
    return Array.from(this.egamData.values());
  }

  async createEGAMData(data: InsertEGAMData): Promise<EGAMData> {
    const id = randomUUID();
    const egamRecord: EGAMData = { 
      ...data, 
      id, 
      status: data.status || 'processed',
      fetchedAt: new Date()
    };
    this.egamData.set(id, egamRecord);
    return egamRecord;
  }

  async updateEGAMData(id: string, data: Partial<InsertEGAMData>): Promise<EGAMData | undefined> {
    const existing = this.egamData.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...data };
    this.egamData.set(id, updated);
    return updated;
  }

  async getEGAMDataByIRN(irn: string): Promise<EGAMData | undefined> {
    return Array.from(this.egamData.values()).find(data => data.irn === irn);
  }

  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    const id = randomUUID();
    const systemLog: SystemLog = { 
      ...log, 
      id, 
      details: log.details || null,
      timestamp: new Date()
    };
    this.systemLogs.set(id, systemLog);
    return systemLog;
  }

  async getAllSystemLogs(): Promise<SystemLog[]> {
    return Array.from(this.systemLogs.values()).sort((a, b) => 
      new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
    );
  }

  async getSystemLogsByLevel(level: string): Promise<SystemLog[]> {
    return Array.from(this.systemLogs.values())
      .filter(log => log.level === level)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime());
  }

  async createAPILog(log: InsertAPILog): Promise<APILog> {
    const id = randomUUID();
    const apiLog: APILog = { 
      ...log, 
      id, 
      parameters: log.parameters || {},
      response: log.response || {},
      responseTime: log.responseTime || null,
      timestamp: new Date()
    };
    this.apiLogs.set(id, apiLog);
    return apiLog;
  }

  async getAllAPILogs(): Promise<APILog[]> {
    return Array.from(this.apiLogs.values()).sort((a, b) => 
      new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
    );
  }

  async getAPILogsByStatus(status: string): Promise<APILog[]> {
    return Array.from(this.apiLogs.values())
      .filter(log => log.status === status)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime());
  }

  async createEGAMAuditLog(log: InsertEGAMAuditLog): Promise<EGAMAuditLog> {
    const id = randomUUID();
    const auditLog: EGAMAuditLog = { 
      ...log, 
      id, 
      recordsCount: log.recordsCount || null,
      completedAt: log.completedAt || null,
      errorMessage: log.errorMessage || null,
      nextScheduledAt: log.nextScheduledAt || null
    };
    this.egamAuditLogs.set(id, auditLog);
    return auditLog;
  }

  async getAllEGAMAuditLogs(): Promise<EGAMAuditLog[]> {
    return Array.from(this.egamAuditLogs.values()).sort((a, b) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  async getNextScheduledPull(): Promise<Date | null> {
    const scheduledLogs = Array.from(this.egamAuditLogs.values())
      .filter(log => log.nextScheduledAt && log.pullType === 'scheduled')
      .sort((a, b) => new Date(a.nextScheduledAt!).getTime() - new Date(b.nextScheduledAt!).getTime());
    
    return scheduledLogs.length > 0 ? scheduledLogs[0].nextScheduledAt : null;
  }

  async createPDFProcessingHistory(history: InsertPDFProcessingHistory): Promise<PDFProcessingHistory> {
    const id = randomUUID();
    const pdfHistory: PDFProcessingHistory = { 
      ...history, 
      id, 
      invoiceNo: history.invoiceNo || null,
      amount: history.amount || null,
      vendorName: history.vendorName || null,
      buyerName: history.buyerName || null,
      processedAt: new Date()
    };
    this.pdfProcessingHistory.set(id, pdfHistory);
    return pdfHistory;
  }

  async getAllPDFProcessingHistory(): Promise<PDFProcessingHistory[]> {
    return Array.from(this.pdfProcessingHistory.values()).sort((a, b) => 
      new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime()
    );
  }

  async getPDFProcessingHistoryByUser(processedBy: string): Promise<PDFProcessingHistory[]> {
    return Array.from(this.pdfProcessingHistory.values())
      .filter(history => history.processedBy === processedBy)
      .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime());
  }

  // Bulk QR Processing methods
  async createBulkQRBatch(batch: InsertBulkQRBatches): Promise<BulkQRBatches> {
    const id = randomUUID();
    const bulkBatch: BulkQRBatches = {
      id,
      fileName: batch.fileName,
      totalRecords: batch.totalRecords,
      processedRecords: batch.processedRecords || 0,
      successRecords: batch.successRecords || 0,
      failedRecords: batch.failedRecords || 0,
      status: batch.status || 'processing',
      createdAt: new Date(),
      completedAt: batch.completedAt || null,
    };
    this.bulkQRBatches.set(id, bulkBatch);
    return bulkBatch;
  }

  async createBulkQRProcessing(processing: InsertBulkQRProcessing): Promise<BulkQRProcessing> {
    const id = randomUUID();
    const bulkProcessing: BulkQRProcessing = {
      id,
      batchId: processing.batchId,
      qrString: processing.qrString,
      status: processing.status || 'queued',
      processedAt: processing.processedAt || null,
      extractedData: processing.extractedData || null,
      errorMessage: processing.errorMessage || null,
      createdAt: new Date(),
    };
    this.bulkQRProcessing.set(id, bulkProcessing);
    return bulkProcessing;
  }

  async getAllBulkQRBatches(): Promise<BulkQRBatches[]> {
    return Array.from(this.bulkQRBatches.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getBulkQRProcessingByBatchId(batchId: string): Promise<BulkQRProcessing[]> {
    return Array.from(this.bulkQRProcessing.values())
      .filter(processing => processing.batchId === batchId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async updateBulkQRProcessing(id: string, data: Partial<InsertBulkQRProcessing>): Promise<BulkQRProcessing | undefined> {
    const existing = this.bulkQRProcessing.get(id);
    if (!existing) return undefined;

    const updated: BulkQRProcessing = {
      ...existing,
      ...data,
    };
    this.bulkQRProcessing.set(id, updated);
    return updated;
  }

  async updateBulkQRBatch(id: string, data: Partial<InsertBulkQRBatches>): Promise<BulkQRBatches | undefined> {
    const existing = this.bulkQRBatches.get(id);
    if (!existing) return undefined;

    const updated: BulkQRBatches = {
      ...existing,
      ...data,
    };
    this.bulkQRBatches.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
