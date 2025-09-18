import { type User, type InsertUser, type QRData, type InsertQRData, type PDFData, type InsertPDFData, type EGAMData, type InsertEGAMData, type SystemLog, type InsertSystemLog, type APILog, type InsertAPILog } from "@shared/schema";
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
  
  // System Logs operations
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  getAllSystemLogs(): Promise<SystemLog[]>;
  getSystemLogsByLevel(level: string): Promise<SystemLog[]>;
  
  // API Logs operations
  createAPILog(log: InsertAPILog): Promise<APILog>;
  getAllAPILogs(): Promise<APILog[]>;
  getAPILogsByStatus(status: string): Promise<APILog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private qrData: Map<string, QRData>;
  private pdfData: Map<string, PDFData>;
  private egamData: Map<string, EGAMData>;
  private systemLogs: Map<string, SystemLog>;
  private apiLogs: Map<string, APILog>;

  constructor() {
    this.users = new Map();
    this.qrData = new Map();
    this.pdfData = new Map();
    this.egamData = new Map();
    this.systemLogs = new Map();
    this.apiLogs = new Map();
    
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
}

export const storage = new MemStorage();
