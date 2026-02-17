/// <reference path="./types.d.ts" />
import express, { type Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { registerRoutes } from "./routes";
import { registerAPIRoutes } from "./apiRoutes";
import { setupVite, serveStatic, log } from "./vite";
import { databaseService } from "./database";
import path from "path";
import { readFileSync, existsSync } from "fs";
import compression from "compression";
import rateLimit from "express-rate-limit";

const app = express();

// Load PDF into memory at startup
let pdfBuffer: Buffer | null = null;
const pdfFileName = '2025-11-12_EK_176-212342123_Invoice_KAINMD55682.pdf';
const pdfPath = path.join(process.cwd(), 'assets', pdfFileName);

try {
  if (existsSync(pdfPath)) {
    pdfBuffer = readFileSync(pdfPath);
    console.log(`[PDF Loaded] PDF loaded into memory: ${pdfFileName} (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
  } else {
    console.warn(`[PDF Warning] PDF file not found at: ${pdfPath}`);
    console.warn(`[PDF Warning] Download functionality will not work until PDF is placed in assets/ folder`);
  }
} catch (error) {
  console.error(`[PDF Error] Failed to load PDF into memory:`, error);
}

// CRITICAL: Register EA PDF download route IMMEDIATELY after app creation
// This MUST be before ANY middleware, including express.json()
// Using a very simple route pattern that Express will definitely match
app.get('/api/ea/pdf-file', (req: Request, res: Response) => {
  console.log('[EA PDF Route] ====== ROUTE HANDLER CALLED ======');
  console.log('[EA PDF Route] Request method:', req.method);
  console.log('[EA PDF Route] Request URL:', req.url);
  console.log('[EA PDF Route] Request path:', req.path);
  console.log('[EA PDF Route] PDF buffer exists:', !!pdfBuffer);
  
  if (!pdfBuffer) {
    console.error('[EA PDF Route] PDF buffer is null!');
    return res.status(404).json({ error: 'PDF not available' });
  }
  
  console.log('[EA PDF Route] Sending PDF from memory, size:', pdfBuffer.length);
  try {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFileName}"`);
    res.send(pdfBuffer);
    console.log('[EA PDF Route] ====== PDF SENT SUCCESSFULLY ======');
  } catch (error) {
    console.error('[EA PDF Route] Error sending PDF:', error);
    res.status(500).json({ error: 'Failed to send PDF' });
  }
});

// Also register with a different pattern as backup
app.all('/api/ea/pdf-file', (req: Request, res: Response) => {
  console.log('[EA PDF Route ALL] ALL method handler called');
  if (!pdfBuffer) {
    return res.status(404).json({ error: 'PDF not available' });
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${pdfFileName}"`);
  res.send(pdfBuffer);
});

console.log('[CRITICAL] EA PDF route registered IMMEDIATELY: GET /api/ea/pdf-file');

// CRITICAL: Handle raw PDF uploads BEFORE JSON parser
// This must come first to prevent express.json() from trying to parse PDF as JSON
app.use('/api/ea/upload-pdf', express.raw({ type: ['application/pdf', 'application/octet-stream'], limit: '50mb' }));

// Configure request body size limits (50MB for file uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// ============================================================================
// PERFORMANCE OPTIMIZATION: Response Compression
// ============================================================================
app.use(compression({
  level: 6, // Compression level (1-9, 6 is a good balance)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req: Request, res: Response) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression for all other requests
    return compression.filter(req, res);
  },
}));
console.log('[Server] Response compression enabled');

// ============================================================================
// SECURITY & PERFORMANCE: Request Rate Limiting
// ============================================================================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);
console.log('[Server] Rate limiting enabled (100 requests per 15 minutes per IP)');

// ============================================================================
// CRITICAL: Register Invoice Management API routes FIRST, before ANY middleware
// This ensures they are matched before Vite can intercept them
// ============================================================================
console.log('[CRITICAL] Registering Invoice Management API routes FIRST');

app.get('/api/agents', async (req: Request, res: Response) => {
  console.log('[API] GET /api/agents - Handler executing');
  try {
    const entityId = (req as any).entityId || 'hsbc';
    const agents = await databaseService.getUsersByRole('agent', entityId);
    console.log('[API] Found', agents.length, 'agents');
    const agentsWithoutPassword = agents.map((agent: any) => {
      const { password, ...rest } = agent;
      return rest;
    });
    res.json(agentsWithoutPassword);
  } catch (error) {
    console.error('[API] Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

app.get('/api/tickets', async (req: Request, res: Response) => {
  console.log('[API] GET /api/tickets - Handler executing');
  try {
    const entityId = (req as any).entityId || 'hsbc';
    const tickets = await databaseService.getAllTickets(entityId);
    console.log('[API] Found', tickets.length, 'tickets');
    const totalInvoicesWithTickets = await databaseService.getTotalInvoicesWithTickets(entityId);
    res.json({ tickets, totalInvoicesWithTickets });
  } catch (error) {
    console.error('[API] Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

app.get('/api/test', (req: Request, res: Response) => {
  console.log('[API] GET /api/test - Test route working!');
  res.json({ message: 'API routing is working!', timestamp: new Date().toISOString() });
});

app.get('/api/test-ea-download', (req: Request, res: Response) => {
  console.log('[API] GET /api/test-ea-download - Test EA download route!');
  res.json({ message: 'EA download route is registered!', timestamp: new Date().toISOString() });
});

// Register EA PDF routes early to ensure they're matched before Vite
console.log('[CRITICAL] Registering EA PDF routes early');
console.log('[CRITICAL] Route: GET /api/ea/search-document');
console.log('[CRITICAL] Route: GET /api/ea/download/:id');
console.log('[CRITICAL] Route: GET /api/ea/download-default');

app.get('/api/ea/search-document', async (req: Request, res: Response) => {
  const requestId = req.requestId || 'unknown';
  try {
    // Always return a document result, regardless of search query
    const defaultPDF = {
      id: 'default-ea-pdf-001',
      entityId: 'emirates',
      fileName: '2025-11-12_EK_176-212342123_Invoice_KAINMD55682.pdf',
      invoiceNo: 'KAINMD55682',
      date: '2025-11-12',
      irn: '',
      gstin: '',
      amount: '0',
      status: 'processed',
      extractedAt: new Date().toISOString(),
    };
    
    res.json({ 
      documents: [defaultPDF], // Always return the default PDF
      count: 1,
      requestId 
    });
  } catch (error) {
    console.error(`[EA Search] ${requestId} - Error searching EA documents:`, error);
    res.status(500).json({ 
      error: 'Failed to search documents', 
      requestId
    });
  }
});

// Duplicate route removed - using the one registered immediately after app creation

app.get('/api/ea/download-default', (req: Request, res: Response) => {
  const requestId = req.requestId || 'unknown';
  
  // Serve PDF from memory
  if (!pdfBuffer) {
    return res.status(404).json({ 
      error: 'PDF file not available. Please ensure the PDF file is in the assets/ folder and restart the server.', 
      requestId,
      expectedPath: pdfPath
    });
  }

  try {
    // Send the file from memory
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFileName}"`);
    res.send(pdfBuffer);
    console.log(`[EA Download Default] ${requestId} - PDF sent successfully from memory`);
  } catch (error) {
    console.error(`[EA Download Default] ${requestId} - Error sending PDF:`, error);
    res.status(500).json({ error: 'Failed to download PDF', requestId });
  }
});

console.log('[CRITICAL] Invoice Management API routes registered');
console.log('[CRITICAL] EA PDF routes registered early');
// ============================================================================

// CORS configuration
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  // Allow requests from same origin or configured origins
  if (!origin || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    // In production, you should configure allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (allowedOrigins.includes(origin as string)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request ID middleware - must be first to track all requests
app.use((req: Request, res: Response, next: NextFunction) => {
  // Use X-Request-ID header if provided, otherwise generate a new UUID
  const requestId = (req.headers["x-request-id"] as string) || randomUUID();
  req.requestId = requestId;
  
  // Add request ID to response headers for client tracing
  res.setHeader("X-Request-ID", requestId);
  
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const requestId = req.requestId || "unknown";
      let logLine = `[${requestId}] ${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  registerAPIRoutes(app);
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const requestId = req.requestId || "unknown";

    // Log error with request ID
    console.error(`[${requestId}] Error:`, {
      status,
      message,
      path: req.path,
      method: req.method,
      error: err instanceof Error ? err.message : String(err),
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });

    res.status(status).json({ 
      message,
      requestId,
      ...(process.env.NODE_ENV === "development" && { 
        error: err instanceof Error ? err.message : String(err) 
      })
    });
    // Removed throw err to prevent unhandled promise rejection
  });

  // CRITICAL: Setup Vite ONLY after all API routes are registered
  // This ensures API routes are matched before Vite middleware runs
  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  console.log('[Server] All routes registered. Setting up Vite middleware...');
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
    console.log('[Server] Vite middleware setup complete');
  } else {
    serveStatic(app);
    console.log('[Server] Static file serving setup complete');
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  // Use 0.0.0.0 to allow connections from other machines/containers
  // Use localhost only in development for security
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : process.env.HOST || "localhost";
  server.listen(port, host, () => {
    log(`serving on ${host}:${port}`);
  });
})();
