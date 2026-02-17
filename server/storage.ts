import { type User, type InsertUser, type QRData, type InsertQRData, type PDFData, type InsertPDFData, type EGAMData, type InsertEGAMData, type EGAMAuditLog, type InsertEGAMAuditLog, type SystemLog, type InsertSystemLog, type APILog, type InsertAPILog, type PDFProcessingHistory, type InsertPDFProcessingHistory, type BulkQRProcessing, type InsertBulkQRProcessing, type BulkQRBatches, type InsertBulkQRBatches, type Vertical, type InsertVertical, type AssetClass, type InsertAssetClass, type AssetType, type InsertAssetType, type Asset, type InsertAsset, type ServiceGroup, type InsertServiceGroup, type Service, type InsertService, type CostGroup, type InsertCostGroup, type BudgetLine, type InsertBudgetLine, type CostElement, type InsertCostElement, type Budget, type InsertBudget, type CostRule, type InsertCostRule, type AssetServiceAllocation, type InsertAssetServiceAllocation, type EAActivityLog, type InsertEAActivityLog } from "@shared/schema";
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
  getSystemLogsByRequestId(requestId: string): Promise<SystemLog[]>;
  
  // API Logs operations
  createAPILog(log: InsertAPILog): Promise<APILog>;
  getAllAPILogs(): Promise<APILog[]>;
  getAPILogsByStatus(status: string): Promise<APILog[]>;
  getAPILogsByRequestId(requestId: string): Promise<APILog[]>;
  
  // PDF Processing History operations
  createPDFProcessingHistory(history: InsertPDFProcessingHistory): Promise<PDFProcessingHistory>;
  getAllPDFProcessingHistory(): Promise<PDFProcessingHistory[]>;
  getPDFProcessingHistoryByUser(processedBy: string): Promise<PDFProcessingHistory[]>;
  updatePDFProcessingHistory(id: string, data: Partial<InsertPDFProcessingHistory>): Promise<PDFProcessingHistory | undefined>;
  getPDFProcessingHistoryByInvoiceNo(invoiceNo: string): Promise<PDFProcessingHistory | undefined>;
  
  // Bulk QR Processing operations
  createBulkQRBatch(batch: InsertBulkQRBatches): Promise<BulkQRBatches>;
  createBulkQRProcessing(processing: InsertBulkQRProcessing): Promise<BulkQRProcessing>;
  getAllBulkQRBatches(): Promise<BulkQRBatches[]>;
  getBulkQRProcessingByBatchId(batchId: string): Promise<BulkQRProcessing[]>;
  updateBulkQRProcessing(id: string, data: Partial<InsertBulkQRProcessing>): Promise<BulkQRProcessing | undefined>;
  updateBulkQRBatch(id: string, data: Partial<InsertBulkQRBatches>): Promise<BulkQRBatches | undefined>;
  
  // Cost Model - Verticals
  getAllVerticals(): Promise<Vertical[]>;
  createVertical(data: InsertVertical): Promise<Vertical>;
  updateVertical(id: string, data: Partial<InsertVertical>): Promise<Vertical | undefined>;
  deleteVertical(id: string): Promise<boolean>;
  
  // Cost Model - Asset Classes
  getAllAssetClasses(): Promise<AssetClass[]>;
  createAssetClass(data: InsertAssetClass): Promise<AssetClass>;
  updateAssetClass(id: string, data: Partial<InsertAssetClass>): Promise<AssetClass | undefined>;
  deleteAssetClass(id: string): Promise<boolean>;
  
  // Cost Model - Asset Types
  getAllAssetTypes(): Promise<AssetType[]>;
  getAssetTypesByClass(assetClassId: string): Promise<AssetType[]>;
  createAssetType(data: InsertAssetType): Promise<AssetType>;
  updateAssetType(id: string, data: Partial<InsertAssetType>): Promise<AssetType | undefined>;
  deleteAssetType(id: string): Promise<boolean>;
  
  // Cost Model - Assets
  getAllAssets(): Promise<Asset[]>;
  getAssetsByType(assetTypeId: string): Promise<Asset[]>;
  createAsset(data: InsertAsset): Promise<Asset>;
  updateAsset(id: string, data: Partial<InsertAsset>): Promise<Asset | undefined>;
  deleteAsset(id: string): Promise<boolean>;
  
  // Cost Model - Asset Service Allocations
  getAssetServiceAllocations(assetId: string): Promise<AssetServiceAllocation[]>;
  createAssetServiceAllocation(data: InsertAssetServiceAllocation): Promise<AssetServiceAllocation>;
  deleteAssetServiceAllocation(id: string): Promise<boolean>;
  deleteAllAssetServiceAllocations(assetId: string): Promise<boolean>;
  
  // Cost Model - Service Groups
  getAllServiceGroups(): Promise<ServiceGroup[]>;
  getServiceGroupsByVertical(verticalId: string): Promise<ServiceGroup[]>;
  createServiceGroup(data: InsertServiceGroup): Promise<ServiceGroup>;
  updateServiceGroup(id: string, data: Partial<InsertServiceGroup>): Promise<ServiceGroup | undefined>;
  deleteServiceGroup(id: string): Promise<boolean>;
  
  // Cost Model - Services
  getAllServices(): Promise<Service[]>;
  getServicesByGroup(serviceGroupId: string): Promise<Service[]>;
  createService(data: InsertService): Promise<Service>;
  updateService(id: string, data: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
  
  // Cost Model - Cost Groups
  getAllCostGroups(): Promise<CostGroup[]>;
  getCostGroupsByVertical(verticalId: string): Promise<CostGroup[]>;
  createCostGroup(data: InsertCostGroup): Promise<CostGroup>;
  updateCostGroup(id: string, data: Partial<InsertCostGroup>): Promise<CostGroup | undefined>;
  deleteCostGroup(id: string): Promise<boolean>;
  
  // Cost Model - Budget Lines
  getAllBudgetLines(): Promise<BudgetLine[]>;
  getBudgetLinesByCostGroup(costGroupId: string): Promise<BudgetLine[]>;
  createBudgetLine(data: InsertBudgetLine): Promise<BudgetLine>;
  updateBudgetLine(id: string, data: Partial<InsertBudgetLine>): Promise<BudgetLine | undefined>;
  deleteBudgetLine(id: string): Promise<boolean>;
  
  // Cost Model - Budgets
  getBudgetsByBudgetLine(budgetLineId: string): Promise<Budget[]>;
  getBudgetsByServiceGroup(serviceGroupId: string): Promise<Budget[]>;
  createBudget(data: InsertBudget): Promise<Budget>;
  updateBudget(id: string, data: Partial<InsertBudget>): Promise<Budget | undefined>;
  deleteBudget(id: string): Promise<boolean>;
  
  // Cost Model - Cost Elements
  getAllCostElements(): Promise<CostElement[]>;
  getCostElementsByBudgetLine(budgetLineId: string): Promise<CostElement[]>;
  getCostElementsByService(serviceId: string): Promise<CostElement[]>;
  createCostElement(data: InsertCostElement): Promise<CostElement>;
  updateCostElement(id: string, data: Partial<InsertCostElement>): Promise<CostElement | undefined>;
  deleteCostElement(id: string): Promise<boolean>;
  
  // Cost Model - Cost Rules
  getCostRulesByCostElement(costElementId: string): Promise<CostRule[]>;
  createCostRule(data: InsertCostRule): Promise<CostRule>;
  deleteCostRule(id: string): Promise<boolean>;
  deleteAllCostRules(costElementId: string): Promise<boolean>;
  
  // Cost Model - Calculations
  calculateServiceCost(serviceId: string, year?: number): Promise<{
    directCosts: number;
    depreciation: number;
    indirectCosts: number;
    commonCosts: number;
    totalCost: number;
    costPerUnit: number;
  }>;
  
  // EA Activity Logs operations
  createEAActivityLog(log: InsertEAActivityLog): Promise<EAActivityLog>;
  getAllEAActivityLogs(): Promise<EAActivityLog[]>;
  getEAActivityLogsByCategory(category: string): Promise<EAActivityLog[]>;
  getEAActivityLogsByType(activityType: string): Promise<EAActivityLog[]>;
  getEAActivityLogsByUser(userId: string): Promise<EAActivityLog[]>;
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
  
  // Cost Model storage
  private verticals: Map<string, Vertical>;
  private assetClasses: Map<string, AssetClass>;
  private assetTypes: Map<string, AssetType>;
  private assets: Map<string, Asset>;
  private assetServiceAllocations: Map<string, AssetServiceAllocation>;
  private serviceGroups: Map<string, ServiceGroup>;
  private services: Map<string, Service>;
  private costGroups: Map<string, CostGroup>;
  private budgetLines: Map<string, BudgetLine>;
  private budgets: Map<string, Budget>;
  private costElements: Map<string, CostElement>;
  private costRules: Map<string, CostRule>;
  
  // EA Activity Logs storage
  private eaActivityLogs: Map<string, EAActivityLog>;

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
    
    // Cost Model maps
    this.verticals = new Map();
    this.assetClasses = new Map();
    this.assetTypes = new Map();
    this.assets = new Map();
    this.assetServiceAllocations = new Map();
    this.serviceGroups = new Map();
    this.services = new Map();
    this.costGroups = new Map();
    this.budgetLines = new Map();
    this.budgets = new Map();
    this.costElements = new Map();
    this.costRules = new Map();
    
    // EA Activity Logs
    this.eaActivityLogs = new Map();
    
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
        requestId: randomUUID(), // Add request ID for tracing
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
        requestId: randomUUID(), // Add request ID for tracing
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
        requestId: randomUUID(), // Add request ID for tracing
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
        requestId: randomUUID(), // Add request ID for tracing
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
        requestId: randomUUID(), // Add request ID for tracing
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
        requestId: randomUUID(), // Add request ID for tracing
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
        requestId: randomUUID(), // Add request ID for tracing
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
        requestId: randomUUID(), // Add request ID for tracing
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
        requestId: randomUUID(), // Add request ID for tracing
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
        requestId: randomUUID(), // Add request ID for tracing
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
        requestId: randomUUID(), // Add request ID for tracing
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      }
    ];

    apiLogRecords.forEach(record => {
      this.apiLogs.set(record.id, record);
    });

    // ========== COST MODEL DUMMY DATA ==========
    // Helper function to generate sequential IDs
    const generateId = (prefix: string, index: number) => {
      return `${prefix}${String(index).padStart(4, '0')}`;
    };

    // 1. Create Verticals
    const verticalsData = [
      { name: 'Information Technology', description: 'IT department managing technology infrastructure and systems', status: 'active' },
      { name: 'Human Resources', description: 'HR department managing workforce, recruitment, and employee relations', status: 'active' },
      { name: 'Operations', description: 'Operations department managing day-to-day business activities', status: 'active' },
      { name: 'Finance', description: 'Finance department managing financial planning, accounting, and budgeting', status: 'active' },
      { name: 'Marketing', description: 'Marketing department managing brand, campaigns, and customer acquisition', status: 'active' },
    ];

    const verticalIds: string[] = [];
    verticalsData.forEach((vertical, index) => {
      const id = randomUUID();
      const verticalId = generateId('V', index + 1);
      const verticalRecord: Vertical = {
        id,
        entityId: 'hsbc',
        verticalId,
        name: vertical.name,
        description: vertical.description,
        status: vertical.status,
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.verticals.set(id, verticalRecord);
      verticalIds.push(id);
    });

    // 2. Create Asset Classes
    const assetClassesData = [
      { name: 'Furniture and Fixtures', description: 'Office furniture, desks, chairs, and fixtures', status: 'active' },
      { name: 'Computer Equipment', description: 'Computers, servers, laptops, and related hardware', status: 'active' },
      { name: 'Vehicles', description: 'Company vehicles for transportation', status: 'active' },
      { name: 'Office Equipment', description: 'Printers, scanners, and other office equipment', status: 'active' },
    ];

    const assetClassIds: string[] = [];
    assetClassesData.forEach((assetClass, index) => {
      const id = randomUUID();
      const classId = generateId('AC', index + 1);
      const assetClassRecord: AssetClass = {
        id,
        entityId: 'hsbc',
        classId,
        name: assetClass.name,
        description: assetClass.description,
        status: assetClass.status,
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.assetClasses.set(id, assetClassRecord);
      assetClassIds.push(id);
    });

    // 3. Create Asset Types
    const assetTypesData = [
      { assetClassId: assetClassIds[0], name: 'Office Chairs', description: 'Ergonomic office chairs', status: 'active' },
      { assetClassId: assetClassIds[0], name: 'Desks', description: 'Office desks and workstations', status: 'active' },
      { assetClassId: assetClassIds[1], name: 'Servers', description: 'Server hardware and equipment', status: 'active' },
      { assetClassId: assetClassIds[1], name: 'Laptops', description: 'Laptop computers', status: 'active' },
      { assetClassId: assetClassIds[1], name: 'Network Equipment', description: 'Routers, switches, and networking gear', status: 'active' },
      { assetClassId: assetClassIds[2], name: 'Cars', description: 'Company cars', status: 'active' },
      { assetClassId: assetClassIds[3], name: 'Printers', description: 'Office printers', status: 'active' },
    ];

    const assetTypeIds: string[] = [];
    assetTypesData.forEach((assetType, index) => {
      const id = randomUUID();
      const typeId = generateId('AT', index + 1);
      const assetTypeRecord: AssetType = {
        id,
        entityId: 'hsbc',
        assetClassId: assetType.assetClassId,
        typeId,
        name: assetType.name,
        description: assetType.description,
        status: assetType.status,
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.assetTypes.set(id, assetTypeRecord);
      assetTypeIds.push(id);
    });

    // 4. Create Assets
    const assetsData = [
      { assetTypeId: assetTypeIds[0], assetCode: 'CHAIR-001', name: 'Ergonomic Chair - Conference Room', costOfAcquisition: 15000, dateOfAcquisition: '2023-01-15', assetLife: 5, serviceMapping: 'Direct', status: 'Active' },
      { assetTypeId: assetTypeIds[0], assetCode: 'CHAIR-002', name: 'Ergonomic Chair - Office', costOfAcquisition: 12000, dateOfAcquisition: '2023-02-20', assetLife: 5, serviceMapping: 'Indirect', status: 'Active' },
      { assetTypeId: assetTypeIds[1], assetCode: 'DESK-001', name: 'Standing Desk - IT Department', costOfAcquisition: 25000, dateOfAcquisition: '2023-03-10', assetLife: 7, serviceMapping: 'Direct', status: 'Active' },
      { assetTypeId: assetTypeIds[2], assetCode: 'SRV-001', name: 'Dell PowerEdge Server', costOfAcquisition: 350000, dateOfAcquisition: '2023-04-05', assetLife: 5, serviceMapping: 'Direct', status: 'Active' },
      { assetTypeId: assetTypeIds[2], assetCode: 'SRV-002', name: 'HP ProLiant Server', costOfAcquisition: 280000, dateOfAcquisition: '2023-05-12', assetLife: 5, serviceMapping: 'Direct', status: 'Active' },
      { assetTypeId: assetTypeIds[3], assetCode: 'LAP-001', name: 'Dell Latitude Laptop', costOfAcquisition: 65000, dateOfAcquisition: '2023-06-01', assetLife: 3, serviceMapping: 'Direct', status: 'Active' },
      { assetTypeId: assetTypeIds[3], assetCode: 'LAP-002', name: 'HP EliteBook Laptop', costOfAcquisition: 72000, dateOfAcquisition: '2023-07-15', assetLife: 3, serviceMapping: 'Indirect', status: 'Active' },
      { assetTypeId: assetTypeIds[4], assetCode: 'NET-001', name: 'Cisco Switch 48 Port', costOfAcquisition: 120000, dateOfAcquisition: '2023-08-20', assetLife: 5, serviceMapping: 'Direct', status: 'Active' },
      { assetTypeId: assetTypeIds[6], assetCode: 'PRT-001', name: 'HP LaserJet Printer', costOfAcquisition: 45000, dateOfAcquisition: '2023-09-10', assetLife: 4, serviceMapping: 'Indirect', status: 'Active' },
    ];

    const assetIds: string[] = [];
    assetsData.forEach((asset, index) => {
      const id = randomUUID();
      const assetRecord: Asset = {
        id,
        entityId: 'hsbc',
        assetTypeId: asset.assetTypeId,
        assetCode: asset.assetCode,
        name: asset.name,
        description: `${asset.name} - Asset for cost allocation`,
        costOfAcquisition: asset.costOfAcquisition,
        dateOfAcquisition: asset.dateOfAcquisition,
        assetLife: asset.assetLife,
        serviceMapping: asset.serviceMapping as 'Direct' | 'Indirect',
        status: asset.status,
        notes: null,
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.assets.set(id, assetRecord);
      assetIds.push(id);
    });

    // 5. Create Service Groups
    const serviceGroupsData = [
      { verticalId: verticalIds[0], name: 'IT Infrastructure Services', description: 'IT infrastructure and support services', status: 'active' },
      { verticalId: verticalIds[0], name: 'Software Development', description: 'Software development and maintenance services', status: 'active' },
      { verticalId: verticalIds[1], name: 'Recruitment Services', description: 'Recruitment and talent acquisition services', status: 'active' },
      { verticalId: verticalIds[1], name: 'Training Services', description: 'Employee training and development services', status: 'active' },
      { verticalId: verticalIds[2], name: 'Operations Support', description: 'Day-to-day operations support services', status: 'active' },
      { verticalId: verticalIds[3], name: 'Financial Planning', description: 'Financial planning and analysis services', status: 'active' },
      { verticalId: verticalIds[4], name: 'Digital Marketing', description: 'Digital marketing and campaign management services', status: 'active' },
    ];

    const serviceGroupIds: string[] = [];
    serviceGroupsData.forEach((serviceGroup, index) => {
      const id = randomUUID();
      const groupId = generateId('SG', index + 1);
      const serviceGroupRecord: ServiceGroup = {
        id,
        entityId: 'hsbc',
        verticalId: serviceGroup.verticalId,
        groupId,
        name: serviceGroup.name,
        description: serviceGroup.description,
        status: serviceGroup.status,
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.serviceGroups.set(id, serviceGroupRecord);
      serviceGroupIds.push(id);
    });

    // 6. Create Services
    const servicesData = [
      { serviceGroupId: serviceGroupIds[0], name: 'Server Management', description: 'Server administration and maintenance', uom: 100, status: 'active' },
      { serviceGroupId: serviceGroupIds[0], name: 'Network Support', description: 'Network infrastructure support', uom: 150, status: 'active' },
      { serviceGroupId: serviceGroupIds[1], name: 'Application Development', description: 'Custom application development', uom: 200, status: 'active' },
      { serviceGroupId: serviceGroupIds[1], name: 'Code Review', description: 'Code review and quality assurance', uom: 80, status: 'active' },
      { serviceGroupId: serviceGroupIds[2], name: 'Candidate Screening', description: 'Resume screening and candidate evaluation', uom: 50, status: 'active' },
      { serviceGroupId: serviceGroupIds[2], name: 'Interview Coordination', description: 'Interview scheduling and coordination', uom: 30, status: 'active' },
      { serviceGroupId: serviceGroupIds[3], name: 'Technical Training', description: 'Technical skills training programs', uom: 40, status: 'active' },
      { serviceGroupId: serviceGroupIds[4], name: 'Process Optimization', description: 'Business process optimization services', uom: 60, status: 'active' },
      { serviceGroupId: serviceGroupIds[5], name: 'Budget Analysis', description: 'Budget planning and analysis services', uom: 25, status: 'active' },
      { serviceGroupId: serviceGroupIds[6], name: 'Social Media Management', description: 'Social media content and campaign management', uom: 120, status: 'active' },
    ];

    const serviceIds: string[] = [];
    servicesData.forEach((service, index) => {
      const id = randomUUID();
      const serviceId = generateId('S', index + 1);
      const serviceRecord: Service = {
        id,
        entityId: 'hsbc',
        serviceGroupId: service.serviceGroupId,
        serviceId,
        name: service.name,
        description: service.description,
        uom: service.uom,
        status: service.status,
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.services.set(id, serviceRecord);
      serviceIds.push(id);
    });

    // 7. Create Cost Groups
    const costGroupsData = [
      { verticalId: verticalIds[0], name: 'IT Infrastructure Costs', description: 'IT infrastructure and hardware costs', status: 'active' },
      { verticalId: verticalIds[0], name: 'Software License Costs', description: 'Software licensing and subscription costs', status: 'active' },
      { verticalId: verticalIds[1], name: 'Recruitment Costs', description: 'Recruitment and hiring related costs', status: 'active' },
      { verticalId: verticalIds[1], name: 'Training Costs', description: 'Employee training and development costs', status: 'active' },
      { verticalId: verticalIds[2], name: 'Operations Costs', description: 'Day-to-day operations costs', status: 'active' },
      { verticalId: verticalIds[2], name: 'Facilities Costs', description: 'Office space and facilities costs', status: 'active' },
      { verticalId: verticalIds[3], name: 'Financial Services Costs', description: 'Financial planning and analysis costs', status: 'active' },
      { verticalId: verticalIds[4], name: 'Marketing Campaign Costs', description: 'Marketing and advertising campaign costs', status: 'active' },
    ];

    const costGroupIds: string[] = [];
    costGroupsData.forEach((costGroup, index) => {
      const id = randomUUID();
      const costGroupId = generateId('CG', index + 1);
      const costGroupRecord: CostGroup = {
        id,
        entityId: 'hsbc',
        verticalId: costGroup.verticalId,
        costGroupId,
        name: costGroup.name,
        description: costGroup.description,
        status: costGroup.status,
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.costGroups.set(id, costGroupRecord);
      costGroupIds.push(id);
    });

    // 8. Create Budget Lines
    const budgetLinesData = [
      { costGroupId: costGroupIds[0], name: 'Server Hardware', description: 'Server equipment and hardware costs', status: 'active' },
      { costGroupId: costGroupIds[0], name: 'Network Equipment', description: 'Networking hardware and equipment', status: 'active' },
      { costGroupId: costGroupIds[1], name: 'Cloud Services', description: 'Cloud infrastructure and services', status: 'active' },
      { costGroupId: costGroupIds[1], name: 'Enterprise Software', description: 'Enterprise software licenses', status: 'active' },
      { costGroupId: costGroupIds[2], name: 'Agency Fees', description: 'Recruitment agency fees', status: 'active' },
      { costGroupId: costGroupIds[2], name: 'Job Portal Subscriptions', description: 'Online job portal subscriptions', status: 'active' },
      { costGroupId: costGroupIds[3], name: 'Training Programs', description: 'Employee training program costs', status: 'active' },
      { costGroupId: costGroupIds[4], name: 'Office Supplies', description: 'Day-to-day office supplies', status: 'active' },
      { costGroupId: costGroupIds[5], name: 'Office Rent', description: 'Office space rental costs', status: 'active' },
      { costGroupId: costGroupIds[5], name: 'Utilities', description: 'Electricity, water, and other utilities', status: 'active' },
      { costGroupId: costGroupIds[6], name: 'IT Team Salaries', description: 'Salaries for IT department', status: 'active' },
      { costGroupId: costGroupIds[7], name: 'Digital Advertising', description: 'Online advertising and marketing costs', status: 'active' },
    ];

    const budgetLineIds: string[] = [];
    budgetLinesData.forEach((budgetLine, index) => {
      const id = randomUUID();
      const budgetLineId = generateId('BL', index + 1);
      const budgetLineRecord: BudgetLine = {
        id,
        entityId: 'hsbc',
        costGroupId: budgetLine.costGroupId,
        budgetLineId,
        name: budgetLine.name,
        description: budgetLine.description,
        status: budgetLine.status,
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.budgetLines.set(id, budgetLineRecord);
      budgetLineIds.push(id);
    });

    // 9. Create Cost Elements
    const costElementsData = [
      { budgetLineId: budgetLineIds[0], name: 'Dell Server Purchase', description: 'Server hardware purchase', costType: 'Direct', serviceId: serviceIds[0], isBudgeted: true, financialYear: '2024-25', amount: 350000, status: 'active' },
      { budgetLineId: budgetLineIds[1], name: 'Cisco Switch Purchase', description: 'Network switch equipment', costType: 'Direct', serviceId: serviceIds[1], isBudgeted: true, financialYear: '2024-25', amount: 250000, status: 'active' },
      { budgetLineId: budgetLineIds[2], name: 'AWS Cloud Services', description: 'Amazon Web Services subscription', costType: 'Indirect', isBudgeted: true, financialYear: '2024-25', amount: 300000, status: 'active' },
      { budgetLineId: budgetLineIds[3], name: 'Microsoft Office 365', description: 'Office 365 enterprise license', costType: 'Indirect', isBudgeted: true, financialYear: '2024-25', amount: 150000, status: 'active' },
      { budgetLineId: budgetLineIds[4], name: 'Recruitment Agency Fee', description: 'Fee paid to recruitment agency', costType: 'Direct', serviceId: serviceIds[4], isBudgeted: false, amount: 50000, status: 'active' },
      { budgetLineId: budgetLineIds[5], name: 'Naukri.com Subscription', description: 'Job portal subscription', costType: 'Common', isBudgeted: true, financialYear: '2024-25', amount: 75000, status: 'active' },
      { budgetLineId: budgetLineIds[6], name: 'Technical Training Program', description: 'Employee technical training', costType: 'Direct', serviceId: serviceIds[6], isBudgeted: true, financialYear: '2024-25', amount: 200000, status: 'active' },
      { budgetLineId: budgetLineIds[7], name: 'Stationery Purchase', description: 'Office stationery and supplies', costType: 'Common', isBudgeted: false, amount: 25000, status: 'active' },
      { budgetLineId: budgetLineIds[8], name: 'Office Rent - Main Building', description: 'Monthly office rent', costType: 'Indirect', isBudgeted: true, financialYear: '2024-25', amount: 1200000, status: 'active' },
      { budgetLineId: budgetLineIds[9], name: 'Electricity Bill', description: 'Monthly electricity charges', costType: 'Indirect', isBudgeted: false, amount: 50000, status: 'active' },
      { budgetLineId: budgetLineIds[10], name: 'IT Team Salaries', description: 'Salaries for IT department', costType: 'Direct', serviceId: serviceIds[0], isBudgeted: true, financialYear: '2024-25', amount: 2000000, status: 'active' },
      { budgetLineId: budgetLineIds[11], name: 'Google Ads Campaign', description: 'Google advertising campaign', costType: 'Direct', serviceId: serviceIds[9], isBudgeted: true, financialYear: '2024-25', amount: 500000, status: 'active' },
    ];

    const costElementIds: string[] = [];
    costElementsData.forEach((costElement, index) => {
      const id = randomUUID();
      const costElementId = generateId('CE', index + 1);
      const costElementRecord: CostElement = {
        id,
        entityId: 'hsbc',
        budgetLineId: costElement.budgetLineId,
        costElementId,
        name: costElement.name,
        description: costElement.description,
        costType: costElement.costType as 'Direct' | 'Indirect' | 'Common',
        serviceId: costElement.serviceId || null,
        isBudgeted: costElement.isBudgeted,
        financialYear: costElement.financialYear || null,
        amount: costElement.amount,
        status: costElement.status,
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.costElements.set(id, costElementRecord);
      costElementIds.push(id);
    });

    // 10. Create Budgets for Budget Lines
    budgetLineIds.forEach((budgetLineId, index) => {
      const id = randomUUID();
      const budgetRecord: Budget = {
        id,
        entityId: 'hsbc',
        budgetLineId,
        financialYear: '2024-25',
        budgetAmount: (index + 1) * 100000, // Varying budget amounts
        notes: `Budget for ${budgetLinesData[index].name}`,
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.budgets.set(id, budgetRecord);
    });

    // 11. Create Cost Rules (Allocations for Indirect and Common costs)
    // AWS Cloud Services (Indirect) - Allocate to multiple services
    const costRule1: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[2], // AWS Cloud Services
      serviceId: serviceIds[0], // Server Management
      percentage: 40,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule1.id, costRule1);

    const costRule2: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[2], // AWS Cloud Services
      serviceId: serviceIds[1], // Network Support
      percentage: 35,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule2.id, costRule2);

    const costRule3: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[2], // AWS Cloud Services
      serviceId: serviceIds[2], // Application Development
      percentage: 25,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule3.id, costRule3);

    // Office 365 (Indirect) - Allocate to multiple services
    const costRule4: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[3], // Office 365
      serviceId: serviceIds[0], // Server Management
      percentage: 30,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule4.id, costRule4);

    const costRule5: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[3], // Office 365
      serviceId: serviceIds[2], // Application Development
      percentage: 40,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule5.id, costRule5);

    const costRule6: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[3], // Office 365
      serviceId: serviceIds[4], // Candidate Screening
      percentage: 30,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule6.id, costRule6);

    // Office Rent (Indirect) - Allocate to multiple services
    const costRule7: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[8], // Office Rent
      serviceId: serviceIds[0], // Server Management
      percentage: 25,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule7.id, costRule7);

    const costRule8: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[8], // Office Rent
      serviceId: serviceIds[2], // Application Development
      percentage: 30,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule8.id, costRule8);

    const costRule9: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[8], // Office Rent
      serviceId: serviceIds[4], // Candidate Screening
      percentage: 20,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule9.id, costRule9);

    const costRule10: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[8], // Office Rent
      serviceId: serviceIds[6], // Technical Training
      percentage: 25,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule10.id, costRule10);

    // Naukri.com Subscription (Common) - Allocate to recruitment services
    const costRule11: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[5], // Naukri.com Subscription
      serviceId: serviceIds[4], // Candidate Screening
      percentage: 60,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule11.id, costRule11);

    const costRule12: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[5], // Naukri.com Subscription
      serviceId: serviceIds[5], // Interview Coordination
      percentage: 40,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule12.id, costRule12);

    // Stationery (Common) - Allocate to multiple services
    const costRule13: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[7], // Stationery
      serviceId: serviceIds[0], // Server Management
      percentage: 20,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule13.id, costRule13);

    const costRule14: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[7], // Stationery
      serviceId: serviceIds[2], // Application Development
      percentage: 30,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule14.id, costRule14);

    const costRule15: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[7], // Stationery
      serviceId: serviceIds[4], // Candidate Screening
      percentage: 25,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule15.id, costRule15);

    const costRule16: CostRule = {
      id: randomUUID(),
      entityId: 'hsbc',
      costElementId: costElementIds[7], // Stationery
      serviceId: serviceIds[6], // Technical Training
      percentage: 25,
      status: 'active',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.costRules.set(costRule16.id, costRule16);

    // 12. Create Asset Service Allocations (for Indirect assets)
    // Chair-002 (Indirect) - Allocate to multiple services
    const assetAlloc1: AssetServiceAllocation = {
      id: randomUUID(),
      entityId: 'hsbc',
      assetId: assetIds[1], // CHAIR-002
      serviceId: serviceIds[0], // Server Management
      percentage: 40,
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assetServiceAllocations.set(assetAlloc1.id, assetAlloc1);

    const assetAlloc2: AssetServiceAllocation = {
      id: randomUUID(),
      entityId: 'hsbc',
      assetId: assetIds[1], // CHAIR-002
      serviceId: serviceIds[2], // Application Development
      percentage: 35,
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assetServiceAllocations.set(assetAlloc2.id, assetAlloc2);

    const assetAlloc3: AssetServiceAllocation = {
      id: randomUUID(),
      entityId: 'hsbc',
      assetId: assetIds[1], // CHAIR-002
      serviceId: serviceIds[4], // Candidate Screening
      percentage: 25,
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assetServiceAllocations.set(assetAlloc3.id, assetAlloc3);

    // LAP-002 (Indirect) - Allocate to multiple services
    const assetAlloc4: AssetServiceAllocation = {
      id: randomUUID(),
      entityId: 'hsbc',
      assetId: assetIds[6], // LAP-002
      serviceId: serviceIds[2], // Application Development
      percentage: 50,
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assetServiceAllocations.set(assetAlloc4.id, assetAlloc4);

    const assetAlloc5: AssetServiceAllocation = {
      id: randomUUID(),
      entityId: 'hsbc',
      assetId: assetIds[6], // LAP-002
      serviceId: serviceIds[3], // Code Review
      percentage: 50,
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assetServiceAllocations.set(assetAlloc5.id, assetAlloc5);

    // PRT-001 (Indirect) - Allocate to multiple services
    const assetAlloc6: AssetServiceAllocation = {
      id: randomUUID(),
      entityId: 'hsbc',
      assetId: assetIds[8], // PRT-001
      serviceId: serviceIds[0], // Server Management
      percentage: 30,
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assetServiceAllocations.set(assetAlloc6.id, assetAlloc6);

    const assetAlloc7: AssetServiceAllocation = {
      id: randomUUID(),
      entityId: 'hsbc',
      assetId: assetIds[8], // PRT-001
      serviceId: serviceIds[2], // Application Development
      percentage: 40,
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assetServiceAllocations.set(assetAlloc7.id, assetAlloc7);

    const assetAlloc8: AssetServiceAllocation = {
      id: randomUUID(),
      entityId: 'hsbc',
      assetId: assetIds[8], // PRT-001
      serviceId: serviceIds[4], // Candidate Screening
      percentage: 30,
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assetServiceAllocations.set(assetAlloc8.id, assetAlloc8);

    // ========== EA ACTIVITY LOGS DUMMY DATA ==========
    const eaActivityLogsData: Array<{
      activityType: string;
      category: string;
      userName: string;
      userRole: string;
      description: string;
      metadata?: any;
      ipAddress?: string;
      status: string;
      recordsCount?: number;
      hoursAgo: number;
    }> = [
      // Login activities
      {
        activityType: 'login',
        category: 'authentication',
        userName: 'Ahmed Al-Rashid',
        userRole: 'agent',
        description: 'Agent logged in successfully',
        ipAddress: '192.168.1.45',
        status: 'success',
        hoursAgo: 0.5
      },
      {
        activityType: 'login',
        category: 'authentication',
        userName: 'Sarah Johnson',
        userRole: 'admin',
        description: 'Administrator logged in',
        ipAddress: '10.0.0.122',
        status: 'success',
        hoursAgo: 1
      },
      {
        activityType: 'login',
        category: 'authentication',
        userName: 'Mohammed Hassan',
        userRole: 'agent',
        description: 'Agent logged in successfully',
        ipAddress: '172.16.0.89',
        status: 'success',
        hoursAgo: 1.5
      },
      {
        activityType: 'login',
        category: 'authentication',
        userName: 'Lisa Chen',
        userRole: 'agent',
        description: 'Agent login failed - invalid credentials',
        ipAddress: '192.168.2.33',
        status: 'failed',
        hoursAgo: 2
      },
      {
        activityType: 'login',
        category: 'authentication',
        userName: 'Omar Al-Farsi',
        userRole: 'agent',
        description: 'Agent logged in successfully',
        ipAddress: '10.0.1.56',
        status: 'success',
        hoursAgo: 2.5
      },
      {
        activityType: 'login',
        category: 'authentication',
        userName: 'Priya Sharma',
        userRole: 'admin',
        description: 'Administrator logged in',
        ipAddress: '192.168.1.100',
        status: 'success',
        hoursAgo: 3
      },
      {
        activityType: 'login',
        category: 'authentication',
        userName: 'James Wilson',
        userRole: 'agent',
        description: 'Agent logged in successfully',
        ipAddress: '172.16.1.45',
        status: 'success',
        hoursAgo: 4
      },
      // Bulk download activities
      {
        activityType: 'bulk_download',
        category: 'download',
        userName: 'Ahmed Al-Rashid',
        userRole: 'agent',
        description: 'Bulk downloaded 156 invoices for December 2025',
        metadata: { fileCount: 156, period: 'December 2025', format: 'PDF' },
        status: 'success',
        recordsCount: 156,
        hoursAgo: 0.25
      },
      {
        activityType: 'bulk_download',
        category: 'download',
        userName: 'Mohammed Hassan',
        userRole: 'agent',
        description: 'Bulk downloaded 89 invoices for November 2025',
        metadata: { fileCount: 89, period: 'November 2025', format: 'PDF' },
        status: 'success',
        recordsCount: 89,
        hoursAgo: 1.25
      },
      {
        activityType: 'bulk_download',
        category: 'download',
        userName: 'Omar Al-Farsi',
        userRole: 'agent',
        description: 'Bulk download failed - network timeout',
        metadata: { period: 'October 2025', format: 'PDF' },
        status: 'failed',
        hoursAgo: 2.75
      },
      {
        activityType: 'bulk_download',
        category: 'download',
        userName: 'James Wilson',
        userRole: 'agent',
        description: 'Bulk downloaded 234 invoices for Q4 2025',
        metadata: { fileCount: 234, period: 'Q4 2025', format: 'ZIP' },
        status: 'success',
        recordsCount: 234,
        hoursAgo: 3.5
      },
      {
        activityType: 'bulk_download',
        category: 'download',
        userName: 'Priya Sharma',
        userRole: 'admin',
        description: 'Bulk downloaded 512 invoices for annual audit',
        metadata: { fileCount: 512, period: 'FY 2025', format: 'ZIP' },
        status: 'success',
        recordsCount: 512,
        hoursAgo: 5
      },
      // Cloud sync activities
      {
        activityType: 'cloud_sync',
        category: 'sync',
        userName: 'System',
        userRole: 'system',
        description: '63,450 records synced to cloud storage',
        metadata: { destination: 'AWS S3', region: 'me-south-1' },
        status: 'success',
        recordsCount: 63450,
        hoursAgo: 0.1
      },
      {
        activityType: 'cloud_sync',
        category: 'sync',
        userName: 'System',
        userRole: 'system',
        description: '28,712 records synced to backup server',
        metadata: { destination: 'Azure Blob', region: 'uae-north' },
        status: 'success',
        recordsCount: 28712,
        hoursAgo: 1
      },
      {
        activityType: 'cloud_sync',
        category: 'sync',
        userName: 'System',
        userRole: 'system',
        description: 'Cloud sync failed - connection refused',
        metadata: { destination: 'AWS S3', region: 'me-south-1' },
        status: 'failed',
        hoursAgo: 2
      },
      {
        activityType: 'cloud_sync',
        category: 'sync',
        userName: 'System',
        userRole: 'system',
        description: '15,890 records synced to cloud storage',
        metadata: { destination: 'AWS S3', region: 'me-south-1' },
        status: 'success',
        recordsCount: 15890,
        hoursAgo: 3
      },
      {
        activityType: 'cloud_sync',
        category: 'sync',
        userName: 'Sarah Johnson',
        userRole: 'admin',
        description: 'Manual sync triggered - 42,100 records synced',
        metadata: { destination: 'AWS S3', region: 'me-south-1', trigger: 'manual' },
        status: 'success',
        recordsCount: 42100,
        hoursAgo: 4.5
      },
      {
        activityType: 'cloud_sync',
        category: 'sync',
        userName: 'System',
        userRole: 'system',
        description: '87,230 records synced during scheduled backup',
        metadata: { destination: 'Azure Blob', region: 'uae-north', trigger: 'scheduled' },
        status: 'success',
        recordsCount: 87230,
        hoursAgo: 6
      },
      // More login activities for variety
      {
        activityType: 'login',
        category: 'authentication',
        userName: 'Fatima Al-Mahmoud',
        userRole: 'agent',
        description: 'Agent logged in successfully',
        ipAddress: '192.168.3.77',
        status: 'success',
        hoursAgo: 5
      },
      {
        activityType: 'login',
        category: 'authentication',
        userName: 'David Kim',
        userRole: 'agent',
        description: 'Agent logged in successfully',
        ipAddress: '10.0.2.44',
        status: 'success',
        hoursAgo: 6
      },
      {
        activityType: 'login',
        category: 'authentication',
        userName: 'Aisha Khalid',
        userRole: 'agent',
        description: 'Agent session expired, re-authenticated',
        ipAddress: '172.16.2.11',
        status: 'success',
        hoursAgo: 7
      },
      // More download activities
      {
        activityType: 'bulk_download',
        category: 'download',
        userName: 'Fatima Al-Mahmoud',
        userRole: 'agent',
        description: 'Bulk downloaded 78 invoices for customs clearance',
        metadata: { fileCount: 78, purpose: 'Customs Clearance', format: 'PDF' },
        status: 'success',
        recordsCount: 78,
        hoursAgo: 6.5
      },
      {
        activityType: 'bulk_download',
        category: 'download',
        userName: 'David Kim',
        userRole: 'agent',
        description: 'Bulk downloaded 45 invoices for client ABC Corp',
        metadata: { fileCount: 45, client: 'ABC Corp', format: 'PDF' },
        status: 'success',
        recordsCount: 45,
        hoursAgo: 8
      },
    ];

    eaActivityLogsData.forEach((activity) => {
      const id = randomUUID();
      const timestamp = new Date(Date.now() - activity.hoursAgo * 60 * 60 * 1000);
      const activityLog: EAActivityLog = {
        id,
        entityId: 'emirates',
        activityType: activity.activityType,
        category: activity.category,
        userId: randomUUID(),
        userName: activity.userName,
        userRole: activity.userRole,
        description: activity.description,
        metadata: activity.metadata || null,
        ipAddress: activity.ipAddress || null,
        userAgent: null,
        status: activity.status,
        recordsCount: activity.recordsCount || null,
        timestamp
      };
      this.eaActivityLogs.set(id, activityLog);
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

  async getSystemLogsByRequestId(requestId: string): Promise<SystemLog[]> {
    return Array.from(this.systemLogs.values())
      .filter(log => log.requestId === requestId)
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

  async getAPILogsByRequestId(requestId: string): Promise<APILog[]> {
    return Array.from(this.apiLogs.values())
      .filter(log => log.requestId === requestId)
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
      entityId: history.entityId || 'hsbc', // Default to hsbc if not provided
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

  async updatePDFProcessingHistory(id: string, data: Partial<InsertPDFProcessingHistory>): Promise<PDFProcessingHistory | undefined> {
    const existing = this.pdfProcessingHistory.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...data,
      invoiceNo: data.invoiceNo !== undefined ? data.invoiceNo : existing.invoiceNo,
      amount: data.amount !== undefined ? data.amount : existing.amount,
      vendorName: data.vendorName !== undefined ? data.vendorName : existing.vendorName,
      buyerName: data.buyerName !== undefined ? data.buyerName : existing.buyerName,
    };
    this.pdfProcessingHistory.set(id, updated);
    return updated;
  }

  async getPDFProcessingHistoryByInvoiceNo(invoiceNo: string): Promise<PDFProcessingHistory | undefined> {
    return Array.from(this.pdfProcessingHistory.values())
      .find(history => history.invoiceNo === invoiceNo);
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

  // ============================================================================
  // COST MODEL IMPLEMENTATIONS
  // ============================================================================

  // Verticals
  async getAllVerticals(): Promise<Vertical[]> {
    return Array.from(this.verticals.values());
  }

  async createVertical(data: InsertVertical): Promise<Vertical> {
    const id = randomUUID();
    const verticalId = `V${String(this.verticals.size + 1).padStart(3, '0')}`;
    const vertical: Vertical = {
      id,
      entityId: data.entityId || 'hsbc',
      verticalId,
      name: data.name,
      description: data.description || null,
      status: data.status || 'active',
      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.verticals.set(id, vertical);
    return vertical;
  }

  async updateVertical(id: string, data: Partial<InsertVertical>): Promise<Vertical | undefined> {
    const existing = this.verticals.get(id);
    if (!existing) return undefined;
    const updated: Vertical = { ...existing, ...data, updatedAt: new Date() };
    this.verticals.set(id, updated);
    return updated;
  }

  async deleteVertical(id: string): Promise<boolean> {
    return this.verticals.delete(id);
  }

  // Asset Classes
  async getAllAssetClasses(): Promise<AssetClass[]> {
    return Array.from(this.assetClasses.values());
  }

  async createAssetClass(data: InsertAssetClass): Promise<AssetClass> {
    const id = randomUUID();
    const classId = `AC${String(this.assetClasses.size + 1).padStart(3, '0')}`;
    const assetClass: AssetClass = {
      id,
      entityId: data.entityId || 'hsbc',
      classId,
      name: data.name,
      description: data.description || null,
      status: data.status || 'active',
      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.assetClasses.set(id, assetClass);
    return assetClass;
  }

  async updateAssetClass(id: string, data: Partial<InsertAssetClass>): Promise<AssetClass | undefined> {
    const existing = this.assetClasses.get(id);
    if (!existing) return undefined;
    const updated: AssetClass = { ...existing, ...data, updatedAt: new Date() };
    this.assetClasses.set(id, updated);
    return updated;
  }

  async deleteAssetClass(id: string): Promise<boolean> {
    return this.assetClasses.delete(id);
  }

  // Asset Types
  async getAllAssetTypes(): Promise<AssetType[]> {
    return Array.from(this.assetTypes.values());
  }

  async getAssetTypesByClass(assetClassId: string): Promise<AssetType[]> {
    return Array.from(this.assetTypes.values()).filter(at => at.assetClassId === assetClassId);
  }

  async createAssetType(data: InsertAssetType): Promise<AssetType> {
    const id = randomUUID();
    const classTypes = Array.from(this.assetTypes.values()).filter(at => at.assetClassId === data.assetClassId);
    const typeId = `AT${String(classTypes.length + 1).padStart(3, '0')}`;
    const assetType: AssetType = {
      id,
      entityId: data.entityId || 'hsbc',
      assetClassId: data.assetClassId,
      typeId,
      name: data.name,
      description: data.description || null,
      status: data.status || 'active',
      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.assetTypes.set(id, assetType);
    return assetType;
  }

  async updateAssetType(id: string, data: Partial<InsertAssetType>): Promise<AssetType | undefined> {
    const existing = this.assetTypes.get(id);
    if (!existing) return undefined;
    const updated: AssetType = { ...existing, ...data, updatedAt: new Date() };
    this.assetTypes.set(id, updated);
    return updated;
  }

  async deleteAssetType(id: string): Promise<boolean> {
    return this.assetTypes.delete(id);
  }

  // Assets
  async getAllAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  async getAssetsByType(assetTypeId: string): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(a => a.assetTypeId === assetTypeId);
  }

  async createAsset(data: InsertAsset): Promise<Asset> {
    const id = randomUUID();
    const assetCode = `A${String(this.assets.size + 1).padStart(3, '0')}`;
    const asset: Asset = {
      id,
      entityId: data.entityId || 'hsbc',
      assetTypeId: data.assetTypeId,
      assetCode,
      name: data.name,
      description: data.description || null,
      costOfAcquisition: data.costOfAcquisition,
      dateOfAcquisition: data.dateOfAcquisition,
      assetLife: data.assetLife,
      serviceMappingType: data.serviceMappingType,
      directServiceId: data.directServiceId || null,
      status: data.status || 'active',
      notes: data.notes || null,
      depreciationSchedule: data.depreciationSchedule || null,
      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.assets.set(id, asset);
    return asset;
  }

  async updateAsset(id: string, data: Partial<InsertAsset>): Promise<Asset | undefined> {
    const existing = this.assets.get(id);
    if (!existing) return undefined;
    const updated: Asset = { ...existing, ...data, updatedAt: new Date() };
    this.assets.set(id, updated);
    return updated;
  }

  async deleteAsset(id: string): Promise<boolean> {
    return this.assets.delete(id);
  }

  // Asset Service Allocations
  async getAssetServiceAllocations(assetId: string): Promise<AssetServiceAllocation[]> {
    return Array.from(this.assetServiceAllocations.values()).filter(asa => asa.assetId === assetId);
  }

  async createAssetServiceAllocation(data: InsertAssetServiceAllocation): Promise<AssetServiceAllocation> {
    const id = randomUUID();
    const allocation: AssetServiceAllocation = {
      id,
      entityId: data.entityId || 'hsbc',
      assetId: data.assetId,
      serviceId: data.serviceId,
      allocationPercentage: data.allocationPercentage,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.assetServiceAllocations.set(id, allocation);
    return allocation;
  }

  async deleteAssetServiceAllocation(id: string): Promise<boolean> {
    return this.assetServiceAllocations.delete(id);
  }

  async deleteAllAssetServiceAllocations(assetId: string): Promise<boolean> {
    const allocations = Array.from(this.assetServiceAllocations.entries()).filter(([_, asa]) => asa.assetId === assetId);
    allocations.forEach(([id]) => this.assetServiceAllocations.delete(id));
    return true;
  }

  // Service Groups
  async getAllServiceGroups(): Promise<ServiceGroup[]> {
    return Array.from(this.serviceGroups.values());
  }

  async getServiceGroupsByVertical(verticalId: string): Promise<ServiceGroup[]> {
    return Array.from(this.serviceGroups.values()).filter(sg => sg.verticalId === verticalId);
  }

  async createServiceGroup(data: InsertServiceGroup): Promise<ServiceGroup> {
    const id = randomUUID();
    const groups = Array.from(this.serviceGroups.values()).filter(sg => sg.verticalId === data.verticalId);
    const groupId = `SG${String(groups.length + 1).padStart(3, '0')}`;
    const serviceGroup: ServiceGroup = {
      id,
      entityId: data.entityId || 'hsbc',
      verticalId: data.verticalId,
      groupId,
      name: data.name,
      description: data.description || null,
      status: data.status || 'active',
      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.serviceGroups.set(id, serviceGroup);
    return serviceGroup;
  }

  async updateServiceGroup(id: string, data: Partial<InsertServiceGroup>): Promise<ServiceGroup | undefined> {
    const existing = this.serviceGroups.get(id);
    if (!existing) return undefined;
    const updated: ServiceGroup = { ...existing, ...data, updatedAt: new Date() };
    this.serviceGroups.set(id, updated);
    return updated;
  }

  async deleteServiceGroup(id: string): Promise<boolean> {
    return this.serviceGroups.delete(id);
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServicesByGroup(serviceGroupId: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(s => s.serviceGroupId === serviceGroupId);
  }

  async createService(data: InsertService): Promise<Service> {
    const id = randomUUID();
    const services = Array.from(this.services.values()).filter(s => s.serviceGroupId === data.serviceGroupId);
    const serviceId = `S${String(services.length + 1).padStart(3, '0')}`;
    const service: Service = {
      id,
      entityId: data.entityId || 'hsbc',
      serviceGroupId: data.serviceGroupId,
      serviceId,
      name: data.name,
      description: data.description || null,
      uom: data.uom || null,
      status: data.status || 'active',
      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: string, data: Partial<InsertService>): Promise<Service | undefined> {
    const existing = this.services.get(id);
    if (!existing) return undefined;
    const updated: Service = { ...existing, ...data, updatedAt: new Date() };
    this.services.set(id, updated);
    return updated;
  }

  async deleteService(id: string): Promise<boolean> {
    return this.services.delete(id);
  }

  // Cost Groups
  async getAllCostGroups(): Promise<CostGroup[]> {
    return Array.from(this.costGroups.values());
  }

  async getCostGroupsByVertical(verticalId: string): Promise<CostGroup[]> {
    return Array.from(this.costGroups.values()).filter(cg => cg.verticalId === verticalId);
  }

  async createCostGroup(data: InsertCostGroup): Promise<CostGroup> {
    const id = randomUUID();
    const groups = Array.from(this.costGroups.values()).filter(cg => cg.verticalId === data.verticalId);
    const costGroupId = `CG${String(groups.length + 1).padStart(3, '0')}`;
    const costGroup: CostGroup = {
      id,
      entityId: data.entityId || 'hsbc',
      verticalId: data.verticalId,
      costGroupId,
      name: data.name,
      description: data.description || null,
      status: data.status || 'active',
      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.costGroups.set(id, costGroup);
    return costGroup;
  }

  async updateCostGroup(id: string, data: Partial<InsertCostGroup>): Promise<CostGroup | undefined> {
    const existing = this.costGroups.get(id);
    if (!existing) return undefined;
    const updated: CostGroup = { ...existing, ...data, updatedAt: new Date() };
    this.costGroups.set(id, updated);
    return updated;
  }

  async deleteCostGroup(id: string): Promise<boolean> {
    return this.costGroups.delete(id);
  }

  // Budget Lines
  async getAllBudgetLines(): Promise<BudgetLine[]> {
    return Array.from(this.budgetLines.values());
  }

  async getBudgetLinesByCostGroup(costGroupId: string): Promise<BudgetLine[]> {
    return Array.from(this.budgetLines.values()).filter(bl => bl.costGroupId === costGroupId);
  }

  async createBudgetLine(data: InsertBudgetLine): Promise<BudgetLine> {
    const id = randomUUID();
    const lines = Array.from(this.budgetLines.values()).filter(bl => bl.costGroupId === data.costGroupId);
    const budgetLineId = `BL${String(lines.length + 1).padStart(3, '0')}`;
    const budgetLine: BudgetLine = {
      id,
      entityId: data.entityId || 'hsbc',
      costGroupId: data.costGroupId,
      budgetLineId,
      name: data.name,
      description: data.description || null,
      status: data.status || 'active',
      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.budgetLines.set(id, budgetLine);
    return budgetLine;
  }

  async updateBudgetLine(id: string, data: Partial<InsertBudgetLine>): Promise<BudgetLine | undefined> {
    const existing = this.budgetLines.get(id);
    if (!existing) return undefined;
    const updated: BudgetLine = { ...existing, ...data, updatedAt: new Date() };
    this.budgetLines.set(id, updated);
    return updated;
  }

  async deleteBudgetLine(id: string): Promise<boolean> {
    return this.budgetLines.delete(id);
  }

  // Budgets
  async getBudgetsByBudgetLine(budgetLineId: string): Promise<Budget[]> {
    return Array.from(this.budgets.values()).filter(b => b.budgetLineId === budgetLineId);
  }

  async getBudgetsByServiceGroup(serviceGroupId: string): Promise<Budget[]> {
    return Array.from(this.budgets.values()).filter(b => b.serviceGroupId === serviceGroupId);
  }

  async createBudget(data: InsertBudget): Promise<Budget> {
    const id = randomUUID();
    const budget: Budget = {
      id,
      entityId: data.entityId || 'hsbc',
      budgetLineId: data.budgetLineId || null,
      serviceGroupId: data.serviceGroupId || null,
      financialYear: data.financialYear,
      budgetAmount: data.budgetAmount,
      notes: data.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(id: string, data: Partial<InsertBudget>): Promise<Budget | undefined> {
    const existing = this.budgets.get(id);
    if (!existing) return undefined;
    const updated: Budget = { ...existing, ...data, updatedAt: new Date() };
    this.budgets.set(id, updated);
    return updated;
  }

  async deleteBudget(id: string): Promise<boolean> {
    return this.budgets.delete(id);
  }

  // Cost Elements
  async getAllCostElements(): Promise<CostElement[]> {
    return Array.from(this.costElements.values());
  }

  async getCostElementsByBudgetLine(budgetLineId: string): Promise<CostElement[]> {
    return Array.from(this.costElements.values()).filter(ce => ce.budgetLineId === budgetLineId);
  }

  async getCostElementsByService(serviceId: string): Promise<CostElement[]> {
    return Array.from(this.costElements.values()).filter(ce => ce.directServiceId === serviceId);
  }

  async createCostElement(data: InsertCostElement): Promise<CostElement> {
    const id = randomUUID();
    const elements = Array.from(this.costElements.values()).filter(ce => ce.budgetLineId === data.budgetLineId);
    const costElementId = `CE${String(elements.length + 1).padStart(3, '0')}`;
    const costElement: CostElement = {
      id,
      entityId: data.entityId || 'hsbc',
      budgetLineId: data.budgetLineId,
      costElementId,
      name: data.name,
      description: data.description || null,
      costType: data.costType,
      directServiceId: data.directServiceId || null,
      type: data.type,
      financialYear: data.financialYear || null,
      amount: data.amount,
      status: data.status || 'active',
      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.costElements.set(id, costElement);
    return costElement;
  }

  async updateCostElement(id: string, data: Partial<InsertCostElement>): Promise<CostElement | undefined> {
    const existing = this.costElements.get(id);
    if (!existing) return undefined;
    const updated: CostElement = { ...existing, ...data, updatedAt: new Date() };
    this.costElements.set(id, updated);
    return updated;
  }

  async deleteCostElement(id: string): Promise<boolean> {
    return this.costElements.delete(id);
  }

  // Cost Rules
  async getCostRulesByCostElement(costElementId: string): Promise<CostRule[]> {
    return Array.from(this.costRules.values()).filter(cr => cr.costElementId === costElementId);
  }

  async createCostRule(data: InsertCostRule): Promise<CostRule> {
    const id = randomUUID();
    const costRule: CostRule = {
      id,
      entityId: data.entityId || 'hsbc',
      costElementId: data.costElementId,
      serviceId: data.serviceId,
      allocationPercentage: data.allocationPercentage,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.costRules.set(id, costRule);
    return costRule;
  }

  async deleteCostRule(id: string): Promise<boolean> {
    return this.costRules.delete(id);
  }

  async deleteAllCostRules(costElementId: string): Promise<boolean> {
    const rules = Array.from(this.costRules.entries()).filter(([_, cr]) => cr.costElementId === costElementId);
    rules.forEach(([id]) => this.costRules.delete(id));
    return true;
  }

  // Service Cost Calculation
  async calculateServiceCost(serviceId: string, year?: number): Promise<{
    directCosts: number;
    depreciation: number;
    indirectCosts: number;
    commonCosts: number;
    totalCost: number;
    costPerUnit: number;
  }> {
    const currentYear = year || new Date().getFullYear();
    const service = Array.from(this.services.values()).find(s => s.id === serviceId);
    if (!service) {
      return { directCosts: 0, depreciation: 0, indirectCosts: 0, commonCosts: 0, totalCost: 0, costPerUnit: 0 };
    }

    // Direct Costs
    const directCostElements = Array.from(this.costElements.values())
      .filter(ce => ce.directServiceId === serviceId && ce.status === 'active');
    const directCosts = directCostElements.reduce((sum, ce) => sum + parseFloat(ce.amount.toString()), 0);

    // Depreciation
    let depreciation = 0;
    // Direct assets
    const directAssets = Array.from(this.assets.values())
      .filter(a => a.directServiceId === serviceId && a.status === 'active');
    for (const asset of directAssets) {
      if (asset.depreciationSchedule) {
        const schedule = asset.depreciationSchedule as any;
        const yearDep = schedule.find((y: any) => y.year === currentYear);
        if (yearDep) depreciation += parseFloat(yearDep.depreciation?.toString() || '0');
      }
    }
    // Indirect assets
    const indirectAssets = Array.from(this.assets.values())
      .filter(a => a.serviceMappingType === 'indirect' && a.status === 'active');
    for (const asset of indirectAssets) {
      const allocations = await this.getAssetServiceAllocations(asset.id);
      const allocation = allocations.find(a => a.serviceId === serviceId);
      if (allocation && asset.depreciationSchedule) {
        const schedule = asset.depreciationSchedule as any;
        const yearDep = schedule.find((y: any) => y.year === currentYear);
        if (yearDep) {
          const assetDep = parseFloat(yearDep.depreciation?.toString() || '0');
          const percentage = parseFloat(allocation.allocationPercentage.toString());
          depreciation += (assetDep * percentage) / 100;
        }
      }
    }

    // Indirect Costs
    let indirectCosts = 0;
    const indirectCostElements = Array.from(this.costElements.values())
      .filter(ce => ce.costType === 'indirect' && ce.status === 'active');
    for (const costElement of indirectCostElements) {
      const rules = await this.getCostRulesByCostElement(costElement.id);
      const rule = rules.find(r => r.serviceId === serviceId);
      if (rule) {
        const amount = parseFloat(costElement.amount.toString());
        const percentage = parseFloat(rule.allocationPercentage.toString());
        indirectCosts += (amount * percentage) / 100;
      }
    }

    // Common Costs
    let commonCosts = 0;
    const commonCostElements = Array.from(this.costElements.values())
      .filter(ce => ce.costType === 'common' && ce.status === 'active');
    for (const costElement of commonCostElements) {
      const rules = await this.getCostRulesByCostElement(costElement.id);
      const rule = rules.find(r => r.serviceId === serviceId);
      if (rule) {
        const amount = parseFloat(costElement.amount.toString());
        const percentage = parseFloat(rule.allocationPercentage.toString());
        commonCosts += (amount * percentage) / 100;
      }
    }

    const totalCost = directCosts + depreciation + indirectCosts + commonCosts;
    const uom = service.uom ? parseFloat(service.uom.toString()) : 0;
    const costPerUnit = uom > 0 ? totalCost / uom : 0;

    return { directCosts, depreciation, indirectCosts, commonCosts, totalCost, costPerUnit };
  }

  // ============================================================================
  // EA ACTIVITY LOGS IMPLEMENTATIONS
  // ============================================================================

  async createEAActivityLog(log: InsertEAActivityLog): Promise<EAActivityLog> {
    const id = randomUUID();
    const activityLog: EAActivityLog = {
      id,
      entityId: log.entityId || 'emirates',
      activityType: log.activityType,
      category: log.category,
      userId: log.userId || null,
      userName: log.userName,
      userRole: log.userRole || null,
      description: log.description,
      metadata: log.metadata || null,
      ipAddress: log.ipAddress || null,
      userAgent: log.userAgent || null,
      status: log.status || 'success',
      recordsCount: log.recordsCount || null,
      timestamp: new Date(),
    };
    this.eaActivityLogs.set(id, activityLog);
    return activityLog;
  }

  async getAllEAActivityLogs(): Promise<EAActivityLog[]> {
    return Array.from(this.eaActivityLogs.values()).sort((a, b) =>
      new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
    );
  }

  async getEAActivityLogsByCategory(category: string): Promise<EAActivityLog[]> {
    return Array.from(this.eaActivityLogs.values())
      .filter(log => log.category === category)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime());
  }

  async getEAActivityLogsByType(activityType: string): Promise<EAActivityLog[]> {
    return Array.from(this.eaActivityLogs.values())
      .filter(log => log.activityType === activityType)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime());
  }

  async getEAActivityLogsByUser(userId: string): Promise<EAActivityLog[]> {
    return Array.from(this.eaActivityLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime());
  }
}

export const storage = new MemStorage();
