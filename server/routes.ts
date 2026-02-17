import type { Express, Request, Response, NextFunction } from "express";
import express, { Router } from "express";
import { createServer, type Server } from "http";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { insertQRDataSchema, insertPDFDataSchema, insertEGAMDataSchema, insertSystemLogSchema, insertAPILogSchema, insertPDFProcessingHistorySchema, insertBulkQRProcessingSchema, insertBulkQRBatchesSchema, insertVerticalSchema, insertAssetClassSchema, insertAssetTypeSchema, insertAssetSchema, insertServiceGroupSchema, insertServiceSchema, insertCostGroupSchema, insertBudgetLineSchema, insertCostElementSchema, insertBudgetSchema, insertCostRuleSchema, insertAssetServiceAllocationSchema } from "@shared/schema";
import { databaseService } from "./database";
import path from "path";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { fileURLToPath } from "url";

export async function registerRoutes(app: Express): Promise<Server> {
  // CRITICAL: Register EA PDF download route FIRST, before any middleware
  const pdfFileName = '2025-11-12_EK_176-212342123_Invoice_KAINMD55682.pdf';
  const pdfPath = path.join(process.cwd(), 'assets', pdfFileName);
  
  // Load PDF into memory at route registration time
  let pdfBuffer: Buffer | null = null;
  try {
    if (existsSync(pdfPath)) {
      const buffer = readFileSync(pdfPath);
      pdfBuffer = buffer;
      console.log(`[Routes] PDF loaded into memory: ${pdfFileName} (${(buffer.length / 1024).toFixed(2)} KB)`);
      console.log(`[Routes] PDF path: ${pdfPath}`);
    } else {
      console.warn(`[Routes] PDF file not found at: ${pdfPath}`);
      console.warn(`[Routes] Current working directory: ${process.cwd()}`);
    }
  } catch (error) {
    console.error(`[Routes] Failed to load PDF:`, error);
  }
  
  // Register EA PDF download route - MUST be before any middleware
  app.get('/api/ea/pdf-file', (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    console.log(`[Routes] ${requestId} - EA PDF download route EXECUTING`);
    console.log(`[Routes] ${requestId} - PDF path: ${pdfPath}`);
    console.log(`[Routes] ${requestId} - PDF buffer exists: ${!!pdfBuffer}`);
    
    // If buffer is not loaded, try to load it now (fallback)
    let currentBuffer = pdfBuffer;
    if (!currentBuffer) {
      try {
        if (existsSync(pdfPath)) {
          currentBuffer = readFileSync(pdfPath);
          pdfBuffer = currentBuffer; // Update the module-level buffer
          console.log(`[Routes] ${requestId} - PDF loaded on-demand: ${pdfFileName}`);
        } else {
          console.error(`[Routes] ${requestId} - PDF file not found at: ${pdfPath}`);
          return res.status(404).json({ 
            error: 'PDF file not available',
            path: pdfPath,
            cwd: process.cwd()
          });
        }
      } catch (error) {
        console.error(`[Routes] ${requestId} - Error loading PDF:`, error);
        return res.status(500).json({ 
          error: 'Failed to load PDF file',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    // At this point, currentBuffer is guaranteed to be non-null
    if (!currentBuffer) {
      return res.status(500).json({ error: 'PDF buffer is null' });
    }
    
    try {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${pdfFileName}"`);
      res.send(currentBuffer);
      console.log(`[Routes] ${requestId} - PDF sent successfully (${(currentBuffer.length / 1024).toFixed(2)} KB)`);
    } catch (error) {
      console.error(`[Routes] ${requestId} - Error sending PDF:`, error);
      res.status(500).json({ 
        error: 'Failed to send PDF',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  console.log('[Routes] EA PDF download route registered: GET /api/ea/pdf-file');
  
  // Add request logging middleware to trace all requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl || req.url || '';
    const method = req.method || 'GET';
    if (url.startsWith('/api/')) {
      console.log(`[Request Logger] ${method} ${url} - Incoming API request`);
    }
    next();
  });

  // CRITICAL: Register Invoice Management API routes DIRECTLY on app
  // This ensures they're matched BEFORE any middleware (including Vite)
  // Express matches route handlers (app.get) before middleware (app.use)
  console.log('[Routes] ========================================');
  console.log('[Routes] Registering Invoice Management API routes directly on app');
  console.log('[Routes] Routes: GET /api/agents, GET /api/tickets, GET /api/tickets/search/:ticketId');
  console.log('[Routes] ========================================');
  
  // Add a diagnostic route to verify routing is working
  app.get('/api/test-routing', (req: Request, res: Response) => {
    console.log('[TEST ROUTE] /api/test-routing was hit!');
    res.json({ 
      message: 'Routing is working!', 
      timestamp: new Date().toISOString(),
      path: req.path,
      url: req.url,
      originalUrl: req.originalUrl
    });
  });
  
  // Get all agents - Register directly on app for highest priority
  app.get('/api/agents', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    console.log(`[ROUTE HANDLER] ${requestId} GET /api/agents - HANDLER EXECUTING`);
    
    // CRITICAL: Check if response was already sent (shouldn't happen, but defensive)
    if (res.headersSent) {
      console.error(`[ROUTE HANDLER] ${requestId} Response already sent! This should not happen.`);
      return;
    }
    
    try {
      console.log(`[${requestId}] GET /api/agents - Route handler called`);
      const entityId = (req as any).entityId || 'hsbc';
      const agents = await databaseService.getUsersByRole('agent', entityId);
      console.log(`[${requestId}] Found ${agents.length} agents`);
      // Remove password from response
      const agentsWithoutPassword = agents.map((agent: any) => {
        const { password, ...agentWithoutPassword } = agent;
        return agentWithoutPassword;
      });
      console.log(`[${requestId}] Sending JSON response with ${agentsWithoutPassword.length} agents`);
      res.setHeader('Content-Type', 'application/json');
      res.json(agentsWithoutPassword);
      console.log(`[${requestId}] Response sent successfully`);
    } catch (error) {
      console.error(`[${requestId}] Error fetching agents:`, error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Failed to fetch agents',
          requestId,
          details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
        });
      }
    }
  });

  // Get all tickets with count of unique invoices
  app.get('/api/tickets', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      console.log(`[${requestId}] GET /api/tickets - Route handler called`);
      const entityId = (req as any).entityId || 'hsbc';
      const tickets = await databaseService.getAllTickets(entityId);
      console.log(`[${requestId}] Found ${tickets.length} tickets`);
      const totalInvoicesWithTickets = await databaseService.getTotalInvoicesWithTickets(entityId);
      console.log(`[${requestId}] Total invoices with tickets: ${totalInvoicesWithTickets}`);
      res.setHeader('Content-Type', 'application/json');
      res.json({ tickets, totalInvoicesWithTickets });
    } catch (error) {
      console.error(`[${requestId}] Error fetching tickets:`, error);
      res.status(500).json({ 
        error: 'Failed to fetch tickets',
        requestId,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  // Search ticket by Ticket ID
  app.get('/api/tickets/search/:ticketId', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const ticket = await databaseService.getTicketByTicketId(req.params.ticketId);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found', requestId });
      }
      res.json(ticket);
    } catch (error) {
      console.error(`[${requestId}] Error searching ticket:`, error);
      res.status(500).json({ 
        error: 'Failed to search ticket',
        requestId,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  // Search tickets by Invoice ID
  app.get('/api/tickets/by-invoice/:invoiceId', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const invoiceId = decodeURIComponent(req.params.invoiceId);
      const entityId = (req as any).entityId || 'hsbc';
      console.log(`[${requestId}] Searching tickets for Invoice ID: ${invoiceId}, Entity ID: ${entityId}`);
      const tickets = await databaseService.getTicketsByInvoiceId(invoiceId, entityId);
      console.log(`[${requestId}] Found ${tickets.length} ticket(s) for Invoice ID: ${invoiceId}`);
      if (tickets.length === 0) {
        return res.status(404).json({ 
          error: 'No tickets found for this Invoice ID', 
          requestId,
          tickets: []
        });
      }
      res.json({ tickets, requestId });
    } catch (error) {
      console.error(`[${requestId}] Error searching tickets by invoice ID:`, error);
      res.status(500).json({ 
        error: 'Failed to search tickets by invoice ID',
        requestId,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });
  
  console.log('[Routes] Invoice Management API routes registered successfully');
  
  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Simple rate limiting middleware (basic implementation)
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  const RATE_LIMIT_MAX = 100; // requests per window

  app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || (Array.isArray(req.headers['x-forwarded-for']) 
      ? req.headers['x-forwarded-for'][0] 
      : req.headers['x-forwarded-for']) || 'unknown';
    const now = Date.now();
    const clientData = rateLimitMap.get(clientId as string);

    if (!clientData || now > clientData.resetTime) {
      rateLimitMap.set(clientId as string, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      return next();
    }

    if (clientData.count >= RATE_LIMIT_MAX) {
      return res.status(429).json({ 
        error: 'Too many requests', 
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }

    clientData.count++;
    next();
  });

  // Clean up old rate limit entries periodically
  setInterval(() => {
    const now = Date.now();
    const entries = Array.from(rateLimitMap.entries());
    for (const [key, value] of entries) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, RATE_LIMIT_WINDOW);

  // QR Data routes
  app.post('/api/qr-data', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertQRDataSchema.parse(req.body);
      const qrData = await storage.createQRData(validatedData);
      
      // Log the action
      await storage.createSystemLog({
        level: 'SUCCESS',
        module: 'QR Scanner',
        message: 'QR code processed successfully',
        details: `IRN: ${qrData.irn} extracted`,
        requestId
      });
      
      res.json(qrData);
    } catch (error) {
      await storage.createSystemLog({
        level: 'ERROR',
        module: 'QR Scanner',
        message: 'Failed to process QR code',
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId
      });
      res.status(400).json({ error: 'Invalid QR data', requestId });
    }
  });

  app.get('/api/qr-data', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const qrData = await storage.getAllQRData();
      res.json(qrData);
    } catch (error) {
      console.error(`[${requestId}] Error fetching QR data:`, error);
      res.status(500).json({ error: 'Failed to fetch QR data', requestId });
    }
  });

  app.put('/api/qr-data/:id', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedData = await storage.updateQRData(id, updates);
      
      if (!updatedData) {
        return res.status(404).json({ error: 'QR data not found', requestId });
      }
      
      res.json(updatedData);
    } catch (error) {
      console.error(`[${requestId}] Error updating QR data:`, error);
      res.status(400).json({ error: 'Failed to update QR data', requestId });
    }
  });

  // PDF Data routes
  app.post('/api/pdf-data', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertPDFDataSchema.parse(req.body);
      const pdfData = await storage.createPDFData(validatedData);
      
      await storage.createSystemLog({
        level: 'SUCCESS',
        module: 'PDF Upload',
        message: 'PDF processed successfully',
        details: `File: ${pdfData.fileName}, Invoice: ${pdfData.invoiceNo}`,
        requestId
      });
      
      res.json(pdfData);
    } catch (error) {
      await storage.createSystemLog({
        level: 'ERROR',
        module: 'PDF Upload',
        message: 'Failed to process PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId
      });
      res.status(400).json({ error: 'Invalid PDF data', requestId });
    }
  });

  app.get('/api/pdf-data', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const pdfData = await storage.getAllPDFData();
      res.json(pdfData);
    } catch (error) {
      console.error(`[${requestId}] Error fetching PDF data:`, error);
      res.status(500).json({ error: 'Failed to fetch PDF data', requestId });
    }
  });

  // Emirates Airlines PDF routes
  // Note: These routes are now registered in server/index.ts for early registration
  // The routes in index.ts use in-memory PDF and take precedence

  // Upload PDF file for Emirates Airlines
  // Accepts PDF as raw binary with metadata in query params
  app.post('/api/ea/upload-pdf', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      // Get metadata from query params or headers
      const { fileName, invoiceNo, date, irn, gstin, amount } = req.query;
      
      if (!fileName || !invoiceNo) {
        return res.status(400).json({ 
          error: 'fileName and invoiceNo are required as query parameters', 
          requestId 
        });
      }

      // Validate that we have file data
      // req.body will be a Buffer when using express.raw()
      const pdfBuffer = req.body instanceof Buffer ? req.body : Buffer.from(req.body || '');
      if (!pdfBuffer || pdfBuffer.length === 0) {
        return res.status(400).json({ 
          error: 'PDF file data is required in request body', 
          requestId 
        });
      }

      // Create storage directory if it doesn't exist
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const storageDir = path.join(__dirname, '..', 'storage', 'pdfs', 'emirates');
      
      if (!existsSync(storageDir)) {
        mkdirSync(storageDir, { recursive: true });
      }

      // Generate unique filename
      const fileId = randomUUID();
      const fileExtension = path.extname(fileName as string) || '.pdf';
      const uniqueFileName = `${fileId}${fileExtension}`;
      const filePath = path.join(storageDir, uniqueFileName);

      // Save the file
      writeFileSync(filePath, pdfBuffer);

      // Save metadata to database
      const pdfData = await databaseService.createPDFData({
        entityId: 'emirates',
        fileName: fileName as string,
        filePath: filePath,
        invoiceNo: invoiceNo as string,
        date: (date as string) || new Date().toISOString().split('T')[0],
        irn: (irn as string) || '',
        gstin: (gstin as string) || '',
        amount: (amount as string) || '0',
        status: 'processed'
      });

      await storage.createSystemLog({
        level: 'SUCCESS',
        module: 'EA PDF Upload',
        message: 'PDF uploaded successfully for Emirates Airlines',
        details: `File: ${fileName}, Invoice: ${invoiceNo}`,
        requestId
      });

      res.json({ 
        ...pdfData,
        message: 'PDF uploaded successfully',
        requestId 
      });
    } catch (error) {
      console.error(`[${requestId}] Error uploading PDF:`, error);
      await storage.createSystemLog({
        level: 'ERROR',
        module: 'EA PDF Upload',
        message: 'Failed to upload PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId
      });
      res.status(500).json({ error: 'Failed to upload PDF', requestId });
    }
  });

  // EGAM Repository routes
  app.get('/api/egam-data', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const egamData = await storage.getAllEGAMData();
      res.json(egamData);
    } catch (error) {
      console.error(`[${requestId}] Error fetching EGAM data:`, error);
      res.status(500).json({ error: 'Failed to fetch EGAM data', requestId });
    }
  });

  // EGAM Audit Logs routes
  app.get('/api/egam-audit-logs', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const auditLogs = await storage.getAllEGAMAuditLogs();
      res.json(auditLogs);
    } catch (error) {
      console.error(`[${requestId}] Error fetching EGAM audit logs:`, error);
      res.status(500).json({ error: 'Failed to fetch EGAM audit logs', requestId });
    }
  });

  app.get('/api/egam-next-pull', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const nextPull = await storage.getNextScheduledPull();
      res.json({ nextScheduledAt: nextPull });
    } catch (error) {
      console.error(`[${requestId}] Error fetching next scheduled pull:`, error);
      res.status(500).json({ error: 'Failed to fetch next scheduled pull', requestId });
    }
  });

  app.post('/api/egam-data/fetch', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    const pullType = req.body.pullType || 'manual';
    const auditLogId = randomUUID();
    
    try {
      // Create audit log entry for the pull
      const auditLog = await storage.createEGAMAuditLog({
        pullType,
        status: 'in_progress',
        recordsCount: null,
        startedAt: new Date(),
        completedAt: null,
        errorMessage: null,
        nextScheduledAt: pullType === 'scheduled' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null
      });

      // Simulate fetching data from KIGS
      const mockEGAMData = [
        {
          irn: "3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
          invoiceNo: "INV-2024-003",
          date: "2024-01-17",
          vendorGstin: "33MNOPQ9012R3S4",
          amount: "₹234,750.00",
          status: "processed"
        },
        {
          irn: "4d5e6f7g8h9i0j1k2l3m4n5o6p7q",
          invoiceNo: "INV-2024-004",
          date: "2024-01-18",
          vendorGstin: "35STUVW3456X7Y8",
          amount: "₹156,200.00",
          status: "pending"
        }
      ];

      const createdRecords = [];
      for (const data of mockEGAMData) {
        const record = await storage.createEGAMData(data);
        createdRecords.push(record);
      }

      // Update audit log with success
      await storage.createEGAMAuditLog({
        pullType,
        status: 'success',
        recordsCount: createdRecords.length.toString(),
        startedAt: auditLog.startedAt,
        completedAt: new Date(),
        errorMessage: null,
        nextScheduledAt: pullType === 'scheduled' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null
      });

      await storage.createSystemLog({
        level: 'SUCCESS',
        module: 'EGAM Repository',
        message: 'EGAM data sync completed',
        details: `Fetched ${createdRecords.length} records from KIGS`,
        requestId
      });

      res.json({ 
        success: true, 
        count: createdRecords.length,
        data: createdRecords 
      });
    } catch (error) {
      // Update audit log with error
      await storage.createEGAMAuditLog({
        pullType,
        status: 'error',
        recordsCount: null,
        startedAt: new Date(),
        completedAt: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        nextScheduledAt: pullType === 'scheduled' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null
      });

      await storage.createSystemLog({
        level: 'ERROR',
        module: 'EGAM Repository',
        message: 'Failed to fetch EGAM data',
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId
      });
      res.status(500).json({ error: 'Failed to fetch EGAM data', requestId });
    }
  });

  // Reconciliation route
  app.post('/api/reconciliation/run', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const qrData = await storage.getAllQRData();
      const pdfData = await storage.getAllPDFData();
      const egamData = await storage.getAllEGAMData();

      // Simple reconciliation logic
      const allExtractedData = [
        ...qrData.map(qr => ({ ...qr, source: 'QR Code', extractedAmount: qr.totalAmount })),
        ...pdfData.map(pdf => ({ ...pdf, source: 'PDF', extractedAmount: pdf.amount }))
      ];

      const reconciliationResults = allExtractedData.map(extracted => {
        const egamMatch = egamData.find(egam => egam.irn === extracted.irn);
        
        if (!egamMatch) {
          return {
            ...extracted,
            status: 'missing',
            egamAmount: null,
            difference: null
          };
        }

        const egamAmount = parseFloat(egamMatch.amount.replace(/[₹,]/g, ''));
        const extractedAmount = parseFloat(extracted.extractedAmount.replace(/[₹,]/g, ''));
        const difference = Math.abs(egamAmount - extractedAmount);

        return {
          ...extracted,
          status: difference === 0 ? 'matched' : 'mismatched',
          egamAmount: egamMatch.amount,
          difference: difference === 0 ? '₹0.00' : `₹${difference.toLocaleString()}`
        };
      });

      const summary = {
        matched: reconciliationResults.filter(r => r.status === 'matched').length,
        mismatched: reconciliationResults.filter(r => r.status === 'mismatched').length,
        missing: reconciliationResults.filter(r => r.status === 'missing').length,
        total: reconciliationResults.length
      };

      await storage.createSystemLog({
        level: 'INFO',
        module: 'Reconciliation',
        message: 'Reconciliation completed',
        details: `Matched: ${summary.matched}, Mismatched: ${summary.mismatched}, Missing: ${summary.missing}`,
        requestId
      });

      res.json({ results: reconciliationResults, summary });
    } catch (error) {
      await storage.createSystemLog({
        level: 'ERROR',
        module: 'Reconciliation',
        message: 'Reconciliation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId
      });
      res.status(500).json({ error: 'Reconciliation failed', requestId });
    }
  });

  // Push to KIGS simulation - Always returns success for demo
  app.post('/api/kigs/push', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      // Always return success for demo purposes
      const ewbNumber = `EWB${Math.random().toString().substr(2, 9)}`;
      
      if (success) {
        const ewbNumber = `EWB${Math.random().toString().substr(2, 9)}`;
        
        await storage.createSystemLog({
          level: 'SUCCESS',
          module: 'EWB Generation',
          message: 'Data successfully pushed to KIGS',
          details: `EWB Number: ${ewbNumber}`,
          requestId
        });

        res.json({ 
          status: 'success', 
          ewbNumber,
          message: 'Data successfully pushed to KIGS'
        });
      } else {
        await storage.createSystemLog({
          level: 'ERROR',
          module: 'EWB Generation',
          message: 'Failed to push data to KIGS',
          details: 'Connection timeout or server error',
          requestId
        });

        res.status(500).json({ 
          status: 'error', 
          message: 'Failed to push data to KIGS. Please try again.',
          requestId
        });
      }
    } catch (error) {
      console.error(`[${requestId}] Error pushing to KIGS:`, error);
      res.status(500).json({ error: 'Push to KIGS failed', requestId });
    }
  });

  // Validation API endpoints
  app.post('/api/validation/:apiType', async (req, res) => {
    try {
      const startTime = Date.now();
      const { apiType } = req.params;
      const parameters = req.body;

      // Mock API responses
      const mockResponses: Record<string, any> = {
        'search-taxpayer': {
          status: 'success',
          data: {
            gstin: parameters.gstin,
            tradeName: 'Sample Company Pvt Ltd',
            legalName: 'Sample Company Private Limited',
            status: 'Active',
            registrationDate: '2020-04-15',
            lastReturnDate: '2024-01-15'
          }
        },
        'pan-to-gstin': {
          status: 'success',
          data: {
            pan: parameters.pan,
            gstins: parameters.pan ? [`${parameters.pan.substring(0, 5)}1234F1Z5`, `${parameters.pan.substring(0, 5)}5678P2Q3`] : ['27ABCDE1234F1Z5', '29ABCDE1234F2Z6']
          }
        },
        'view-track-returns': {
          status: 'success',
          data: {
            gstin: parameters.gstin,
            financialYear: parameters.fy,
            returns: [
              { period: 'Jan-2024', status: 'Filed', dueDate: '2024-02-20' },
              { period: 'Feb-2024', status: 'Pending', dueDate: '2024-03-20' }
            ]
          }
        },
        'get-preference': {
          status: 'success',
          data: {
            gstin: parameters.gstin,
            preferences: {
              invoiceFrequency: 'Monthly',
              communicationMode: 'Email',
              language: 'English'
            }
          }
        },
        'msme-validation': {
          status: 'success',
          data: {
            msmeId: parameters.msmeId,
            companyName: 'MSME Sample Company',
            registrationDate: '2022-01-15',
            category: 'Micro Enterprise',
            isValid: true
          }
        },
        'cin-validation': {
          status: 'success',
          data: {
            cin: parameters.cin,
            companyName: 'CIN Sample Company Limited',
            incorporationDate: '2019-03-10',
            status: 'Active',
            isValid: true
          }
        }
      };

      const response = mockResponses[apiType] || { status: 'error', message: 'API not implemented' };
      const responseTime = Date.now() - startTime;

      const requestId = req.requestId || 'unknown';
      
      // Log the API call
      await storage.createAPILog({
        apiName: apiType,
        apiType: apiType,
        parameters,
        response,
        status: response.status,
        responseTime: responseTime,
        requestId
      });

      await storage.createSystemLog({
        level: response.status === 'success' ? 'SUCCESS' : 'ERROR',
        module: 'API Validation',
        message: `${apiType} API call ${response.status}`,
        details: `Parameters: ${JSON.stringify(parameters)}`,
        requestId
      });

      res.json(response);
    } catch (error) {
      const requestId = req.requestId || 'unknown';
      try {
        await storage.createSystemLog({
          level: 'ERROR',
          module: 'API Validation',
          message: 'API call failed',
          details: error instanceof Error ? error.message : 'Unknown error',
          requestId
        });
      } catch (logError) {
        console.error(`[${requestId}] Failed to log error:`, logError);
      }
      res.status(500).json({ error: 'API call failed', requestId });
    }
  });

  // System logs routes
  app.get('/api/system-logs', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { level, requestId: queryRequestId } = req.query;
      let logs;
      if (queryRequestId) {
        logs = await storage.getSystemLogsByRequestId(queryRequestId as string);
      } else if (level) {
        logs = await storage.getSystemLogsByLevel(level as string);
      } else {
        logs = await storage.getAllSystemLogs();
      }
      res.json(logs);
    } catch (error) {
      console.error(`[${requestId}] Error fetching system logs:`, error);
      res.status(500).json({ error: 'Failed to fetch system logs', requestId });
    }
  });

  // API logs routes
  app.get('/api/api-logs', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { status, requestId: queryRequestId } = req.query;
      let logs;
      if (queryRequestId) {
        logs = await storage.getAPILogsByRequestId(queryRequestId as string);
      } else if (status) {
        logs = await storage.getAPILogsByStatus(status as string);
      } else {
        logs = await storage.getAllAPILogs();
      }
      res.json(logs);
    } catch (error) {
      console.error(`[${requestId}] Error fetching API logs:`, error);
      res.status(500).json({ error: 'Failed to fetch API logs', requestId });
    }
  });

  // PDF Processing History routes
  app.get('/api/pdf-processing-history', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { processedBy } = req.query;
      const history = processedBy ? 
        await storage.getPDFProcessingHistoryByUser(processedBy as string) : 
        await storage.getAllPDFProcessingHistory();
      res.json(history);
    } catch (error) {
      console.error(`[${requestId}] Error fetching PDF processing history:`, error);
      res.status(500).json({ error: 'Failed to fetch PDF processing history', requestId });
    }
  });

  app.post('/api/pdf-processing-history', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertPDFProcessingHistorySchema.parse(req.body);
      const history = await storage.createPDFProcessingHistory(validatedData);
      res.json(history);
    } catch (error) {
      console.error(`[${requestId}] Error creating PDF processing history:`, error);
      res.status(400).json({ error: 'Invalid PDF processing history data', requestId });
    }
  });

  app.put('/api/pdf-processing-history/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPDFProcessingHistorySchema.partial().parse(req.body);
      const history = await storage.updatePDFProcessingHistory(id, validatedData);
      
      if (!history) {
        return res.status(404).json({ error: 'PDF processing history record not found' });
      }
      
      res.json(history);
    } catch (error) {
      res.status(400).json({ error: 'Invalid PDF processing history data' });
    }
  });

  // Bulk QR Processing routes
  app.post('/api/bulk-qr/batch', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertBulkQRBatchesSchema.parse(req.body);
      const batch = await storage.createBulkQRBatch(validatedData);
      
      // Log the action
      await storage.createSystemLog({
        level: 'SUCCESS',
        module: 'Bulk QR Processing',
        message: `Created bulk QR batch: ${batch.fileName}`,
        details: `Total records: ${batch.totalRecords}`,
        requestId
      });
      
      res.json(batch);
    } catch (error) {
      console.error(`[${requestId}] Error creating bulk QR batch:`, error);
      res.status(400).json({ error: 'Invalid batch data', requestId });
    }
  });

  app.get('/api/bulk-qr/batches', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const batches = await storage.getAllBulkQRBatches();
      res.json(batches);
    } catch (error) {
      console.error(`[${requestId}] Error fetching bulk QR batches:`, error);
      res.status(500).json({ error: 'Failed to fetch bulk QR batches', requestId });
    }
  });

  app.post('/api/bulk-qr/processing', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertBulkQRProcessingSchema.parse(req.body);
      const processing = await storage.createBulkQRProcessing(validatedData);
      res.json(processing);
    } catch (error) {
      console.error(`[${requestId}] Error creating bulk QR processing:`, error);
      res.status(400).json({ error: 'Invalid processing data', requestId });
    }
  });

  app.get('/api/bulk-qr/processing/:batchId', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { batchId } = req.params;
      const processing = await storage.getBulkQRProcessingByBatchId(batchId);
      res.json(processing);
    } catch (error) {
      console.error(`[${requestId}] Error fetching bulk QR processing:`, error);
      res.status(500).json({ error: 'Failed to fetch bulk QR processing', requestId });
    }
  });

  app.put('/api/bulk-qr/processing/:id', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await storage.updateBulkQRProcessing(id, updates);
      
      if (!updated) {
        return res.status(404).json({ error: 'Bulk QR processing not found', requestId });
      }
      
      res.json(updated);
    } catch (error) {
      console.error(`[${requestId}] Error updating bulk QR processing:`, error);
      res.status(500).json({ error: 'Failed to update bulk QR processing', requestId });
    }
  });

  app.put('/api/bulk-qr/batch/:id', async (req, res) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await storage.updateBulkQRBatch(id, updates);
      
      if (!updated) {
        return res.status(404).json({ error: 'Bulk QR batch not found', requestId });
      }
      
      res.json(updated);
    } catch (error) {
      console.error(`[${requestId}] Error updating bulk QR batch:`, error);
      res.status(500).json({ error: 'Failed to update bulk QR batch', requestId });
    }
  });

  // ============================================================================
  // COST MODEL API ROUTES
  // ============================================================================

  // Verticals - Support both /api/verticals and /api/cost-model/verticals
  app.get('/api/verticals', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const verticals = await storage.getAllVerticals();
      res.json(verticals);
    } catch (error) {
      console.error(`[${requestId}] Error fetching verticals:`, error);
      res.status(500).json({ error: 'Failed to fetch verticals', requestId });
    }
  });

  app.get('/api/cost-model/verticals', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const verticals = await storage.getAllVerticals();
      res.json(verticals);
    } catch (error) {
      console.error(`[${requestId}] Error fetching verticals:`, error);
      res.status(500).json({ error: 'Failed to fetch verticals', requestId });
    }
  });

  app.post('/api/cost-model/verticals', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertVerticalSchema.parse(req.body);
      const vertical = await storage.createVertical(validatedData);
      res.json(vertical);
    } catch (error) {
      console.error(`[${requestId}] Error creating vertical:`, error);
      res.status(400).json({ error: 'Failed to create vertical', requestId });
    }
  });

  app.put('/api/cost-model/verticals/:id', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { id } = req.params;
      const updates = insertVerticalSchema.partial().parse(req.body);
      const updated = await storage.updateVertical(id, updates);
      if (!updated) {
        return res.status(404).json({ error: 'Vertical not found', requestId });
      }
      res.json(updated);
    } catch (error) {
      console.error(`[${requestId}] Error updating vertical:`, error);
      res.status(400).json({ error: 'Failed to update vertical', requestId });
    }
  });

  app.delete('/api/cost-model/verticals/:id', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { id } = req.params;
      const deleted = await storage.deleteVertical(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Vertical not found', requestId });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`[${requestId}] Error deleting vertical:`, error);
      res.status(500).json({ error: 'Failed to delete vertical', requestId });
    }
  });

  // Asset Classes - Support both /api/asset-class and /api/cost-model/asset-classes
  app.get('/api/asset-class', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const assetClasses = await storage.getAllAssetClasses();
      res.json(assetClasses);
    } catch (error) {
      console.error(`[${requestId}] Error fetching asset classes:`, error);
      res.status(500).json({ error: 'Failed to fetch asset classes', requestId });
    }
  });

  app.get('/api/cost-model/asset-classes', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const assetClasses = await storage.getAllAssetClasses();
      res.json(assetClasses);
    } catch (error) {
      console.error(`[${requestId}] Error fetching asset classes:`, error);
      res.status(500).json({ error: 'Failed to fetch asset classes', requestId });
    }
  });

  app.post('/api/cost-model/asset-classes', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertAssetClassSchema.parse(req.body);
      const assetClass = await storage.createAssetClass(validatedData);
      res.json(assetClass);
    } catch (error) {
      console.error(`[${requestId}] Error creating asset class:`, error);
      res.status(400).json({ error: 'Failed to create asset class', requestId });
    }
  });

  // Asset Types - Support both /api/asset-type and /api/cost-model/asset-types
  app.get('/api/asset-type', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const assetClassId = req.query.assetClassId as string;
      const assetTypes = assetClassId 
        ? await storage.getAssetTypesByClass(assetClassId)
        : await storage.getAllAssetTypes();
      res.json(assetTypes);
    } catch (error) {
      console.error(`[${requestId}] Error fetching asset types:`, error);
      res.status(500).json({ error: 'Failed to fetch asset types', requestId });
    }
  });

  app.get('/api/cost-model/asset-types', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const assetClassId = req.query.assetClassId as string;
      const assetTypes = assetClassId 
        ? await storage.getAssetTypesByClass(assetClassId)
        : await storage.getAllAssetTypes();
      res.json(assetTypes);
    } catch (error) {
      console.error(`[${requestId}] Error fetching asset types:`, error);
      res.status(500).json({ error: 'Failed to fetch asset types', requestId });
    }
  });

  app.post('/api/cost-model/asset-types', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertAssetTypeSchema.parse(req.body);
      const assetType = await storage.createAssetType(validatedData);
      res.json(assetType);
    } catch (error) {
      console.error(`[${requestId}] Error creating asset type:`, error);
      res.status(400).json({ error: 'Failed to create asset type', requestId });
    }
  });

  // Assets - Support both /api/assets and /api/cost-model/assets
  app.get('/api/assets', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const assetTypeId = req.query.assetTypeId as string;
      const assets = assetTypeId 
        ? await storage.getAssetsByType(assetTypeId)
        : await storage.getAllAssets();
      res.json(assets);
    } catch (error) {
      console.error(`[${requestId}] Error fetching assets:`, error);
      res.status(500).json({ error: 'Failed to fetch assets', requestId });
    }
  });

  app.get('/api/cost-model/assets', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const assetTypeId = req.query.assetTypeId as string;
      const assets = assetTypeId 
        ? await storage.getAssetsByType(assetTypeId)
        : await storage.getAllAssets();
      res.json(assets);
    } catch (error) {
      console.error(`[${requestId}] Error fetching assets:`, error);
      res.status(500).json({ error: 'Failed to fetch assets', requestId });
    }
  });

  app.post('/api/cost-model/assets', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertAssetSchema.parse(req.body);
      const asset = await storage.createAsset(validatedData);
      res.json(asset);
    } catch (error) {
      console.error(`[${requestId}] Error creating asset:`, error);
      res.status(400).json({ error: 'Failed to create asset', requestId });
    }
  });

  // Service Groups - Support both /api/service-groups and /api/cost-model/service-groups
  app.get('/api/service-groups', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const verticalId = req.query.verticalId as string;
      const serviceGroups = verticalId 
        ? await storage.getServiceGroupsByVertical(verticalId)
        : await storage.getAllServiceGroups();
      res.json(serviceGroups);
    } catch (error) {
      console.error(`[${requestId}] Error fetching service groups:`, error);
      res.status(500).json({ error: 'Failed to fetch service groups', requestId });
    }
  });

  app.get('/api/cost-model/service-groups', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const verticalId = req.query.verticalId as string;
      const serviceGroups = verticalId 
        ? await storage.getServiceGroupsByVertical(verticalId)
        : await storage.getAllServiceGroups();
      res.json(serviceGroups);
    } catch (error) {
      console.error(`[${requestId}] Error fetching service groups:`, error);
      res.status(500).json({ error: 'Failed to fetch service groups', requestId });
    }
  });

  app.post('/api/cost-model/service-groups', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertServiceGroupSchema.parse(req.body);
      const serviceGroup = await storage.createServiceGroup(validatedData);
      res.json(serviceGroup);
    } catch (error) {
      console.error(`[${requestId}] Error creating service group:`, error);
      res.status(400).json({ error: 'Failed to create service group', requestId });
    }
  });

  // Services - Support both /api/services and /api/cost-model/services
  app.get('/api/services', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const serviceGroupId = req.query.serviceGroupId as string;
      const services = serviceGroupId 
        ? await storage.getServicesByGroup(serviceGroupId)
        : await storage.getAllServices();
      res.json(services);
    } catch (error) {
      console.error(`[${requestId}] Error fetching services:`, error);
      res.status(500).json({ error: 'Failed to fetch services', requestId });
    }
  });

  app.get('/api/cost-model/services', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const serviceGroupId = req.query.serviceGroupId as string;
      const services = serviceGroupId 
        ? await storage.getServicesByGroup(serviceGroupId)
        : await storage.getAllServices();
      res.json(services);
    } catch (error) {
      console.error(`[${requestId}] Error fetching services:`, error);
      res.status(500).json({ error: 'Failed to fetch services', requestId });
    }
  });

  app.post('/api/cost-model/services', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.json(service);
    } catch (error) {
      console.error(`[${requestId}] Error creating service:`, error);
      res.status(400).json({ error: 'Failed to create service', requestId });
    }
  });

  // Cost Groups - Support both /api/cost-groups and /api/cost-model/cost-groups
  app.get('/api/cost-groups', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const verticalId = req.query.verticalId as string;
      const costGroups = verticalId 
        ? await storage.getCostGroupsByVertical(verticalId)
        : await storage.getAllCostGroups();
      res.json(costGroups);
    } catch (error) {
      console.error(`[${requestId}] Error fetching cost groups:`, error);
      res.status(500).json({ error: 'Failed to fetch cost groups', requestId });
    }
  });

  app.get('/api/cost-model/cost-groups', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const verticalId = req.query.verticalId as string;
      const costGroups = verticalId 
        ? await storage.getCostGroupsByVertical(verticalId)
        : await storage.getAllCostGroups();
      res.json(costGroups);
    } catch (error) {
      console.error(`[${requestId}] Error fetching cost groups:`, error);
      res.status(500).json({ error: 'Failed to fetch cost groups', requestId });
    }
  });

  app.post('/api/cost-model/cost-groups', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertCostGroupSchema.parse(req.body);
      const costGroup = await storage.createCostGroup(validatedData);
      res.json(costGroup);
    } catch (error) {
      console.error(`[${requestId}] Error creating cost group:`, error);
      res.status(400).json({ error: 'Failed to create cost group', requestId });
    }
  });

  // Budget Lines - Support both /api/budget-lines and /api/cost-model/budget-lines
  app.get('/api/budget-lines', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const costGroupId = req.query.costGroupId as string;
      const budgetLines = costGroupId 
        ? await storage.getBudgetLinesByCostGroup(costGroupId)
        : await storage.getAllBudgetLines();
      res.json(budgetLines);
    } catch (error) {
      console.error(`[${requestId}] Error fetching budget lines:`, error);
      res.status(500).json({ error: 'Failed to fetch budget lines', requestId });
    }
  });

  app.get('/api/cost-model/budget-lines', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const costGroupId = req.query.costGroupId as string;
      const budgetLines = costGroupId 
        ? await storage.getBudgetLinesByCostGroup(costGroupId)
        : await storage.getAllBudgetLines();
      res.json(budgetLines);
    } catch (error) {
      console.error(`[${requestId}] Error fetching budget lines:`, error);
      res.status(500).json({ error: 'Failed to fetch budget lines', requestId });
    }
  });

  app.post('/api/cost-model/budget-lines', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertBudgetLineSchema.parse(req.body);
      const budgetLine = await storage.createBudgetLine(validatedData);
      res.json(budgetLine);
    } catch (error) {
      console.error(`[${requestId}] Error creating budget line:`, error);
      res.status(400).json({ error: 'Failed to create budget line', requestId });
    }
  });

  // Cost Elements - Support both /api/cost-elements and /api/cost-model/cost-elements
  app.get('/api/cost-elements', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const budgetLineId = req.query.budgetLineId as string;
      const serviceId = req.query.serviceId as string;
      let costElements;
      if (budgetLineId) {
        costElements = await storage.getCostElementsByBudgetLine(budgetLineId);
      } else if (serviceId) {
        costElements = await storage.getCostElementsByService(serviceId);
      } else {
        costElements = await storage.getAllCostElements();
      }
      res.json(costElements);
    } catch (error) {
      console.error(`[${requestId}] Error fetching cost elements:`, error);
      res.status(500).json({ error: 'Failed to fetch cost elements', requestId });
    }
  });

  app.get('/api/cost-model/cost-elements', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const budgetLineId = req.query.budgetLineId as string;
      const serviceId = req.query.serviceId as string;
      let costElements;
      if (budgetLineId) {
        costElements = await storage.getCostElementsByBudgetLine(budgetLineId);
      } else if (serviceId) {
        costElements = await storage.getCostElementsByService(serviceId);
      } else {
        costElements = await storage.getAllCostElements();
      }
      res.json(costElements);
    } catch (error) {
      console.error(`[${requestId}] Error fetching cost elements:`, error);
      res.status(500).json({ error: 'Failed to fetch cost elements', requestId });
    }
  });

  app.post('/api/cost-model/cost-elements', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const validatedData = insertCostElementSchema.parse(req.body);
      const costElement = await storage.createCostElement(validatedData);
      res.json(costElement);
    } catch (error) {
      console.error(`[${requestId}] Error creating cost element:`, error);
      res.status(400).json({ error: 'Failed to create cost element', requestId });
    }
  });

  // Service Cost Calculation
  app.get('/api/cost-model/services/:id/cost', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { id } = req.params;
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const cost = await storage.calculateServiceCost(id, year);
      res.json(cost);
    } catch (error) {
      console.error(`[${requestId}] Error calculating service cost:`, error);
      res.status(500).json({ error: 'Failed to calculate service cost', requestId });
    }
  });

  // ============================================================================
  // EMIRATES AIRLINE ACTIVITY LOGS API ROUTES
  // ============================================================================

  // Get all EA activity logs
  app.get('/api/ea-activity-logs', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { category, activityType, userId } = req.query;
      let logs;
      
      if (category) {
        logs = await storage.getEAActivityLogsByCategory(category as string);
      } else if (activityType) {
        logs = await storage.getEAActivityLogsByType(activityType as string);
      } else if (userId) {
        logs = await storage.getEAActivityLogsByUser(userId as string);
      } else {
        logs = await storage.getAllEAActivityLogs();
      }
      
      res.json(logs);
    } catch (error) {
      console.error(`[${requestId}] Error fetching EA activity logs:`, error);
      res.status(500).json({ error: 'Failed to fetch EA activity logs', requestId });
    }
  });

  // Create a new EA activity log
  app.post('/api/ea-activity-logs', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const activityLog = await storage.createEAActivityLog(req.body);
      res.json(activityLog);
    } catch (error) {
      console.error(`[${requestId}] Error creating EA activity log:`, error);
      res.status(400).json({ error: 'Failed to create EA activity log', requestId });
    }
  });

  // Log user login activity
  app.post('/api/ea-activity-logs/login', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { userName, userRole, userId, ipAddress, userAgent, status } = req.body;
      const activityLog = await storage.createEAActivityLog({
        activityType: 'login',
        category: 'authentication',
        userName,
        userRole,
        userId,
        description: status === 'success' 
          ? `${userRole === 'admin' ? 'Administrator' : 'Agent'} logged in successfully`
          : `${userRole === 'admin' ? 'Administrator' : 'Agent'} login failed`,
        ipAddress,
        userAgent,
        status: status || 'success',
        entityId: 'emirates'
      });
      res.json(activityLog);
    } catch (error) {
      console.error(`[${requestId}] Error logging login activity:`, error);
      res.status(400).json({ error: 'Failed to log login activity', requestId });
    }
  });

  // Log bulk download activity
  app.post('/api/ea-activity-logs/bulk-download', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { userName, userRole, userId, recordsCount, metadata, status } = req.body;
      const activityLog = await storage.createEAActivityLog({
        activityType: 'bulk_download',
        category: 'download',
        userName,
        userRole,
        userId,
        description: status === 'success'
          ? `Bulk downloaded ${recordsCount} invoices`
          : 'Bulk download failed',
        metadata,
        recordsCount,
        status: status || 'success',
        entityId: 'emirates'
      });
      res.json(activityLog);
    } catch (error) {
      console.error(`[${requestId}] Error logging bulk download activity:`, error);
      res.status(400).json({ error: 'Failed to log bulk download activity', requestId });
    }
  });

  // Log cloud sync activity
  app.post('/api/ea-activity-logs/cloud-sync', async (req: Request, res: Response) => {
    const requestId = req.requestId || 'unknown';
    try {
      const { userName, userRole, userId, recordsCount, metadata, status } = req.body;
      const activityLog = await storage.createEAActivityLog({
        activityType: 'cloud_sync',
        category: 'sync',
        userName: userName || 'System',
        userRole: userRole || 'system',
        userId,
        description: status === 'success'
          ? `${recordsCount?.toLocaleString() || 0} records synced to cloud storage`
          : 'Cloud sync failed',
        metadata,
        recordsCount,
        status: status || 'success',
        entityId: 'emirates'
      });
      res.json(activityLog);
    } catch (error) {
      console.error(`[${requestId}] Error logging cloud sync activity:`, error);
      res.status(400).json({ error: 'Failed to log cloud sync activity', requestId });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
