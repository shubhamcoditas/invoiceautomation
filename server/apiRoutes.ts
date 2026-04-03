import type { Express } from "express";
import { databaseService } from "./database";
import { handleApiError, sendNotFound } from "./lib/apiError";
import { validateBody } from "./lib/validateBody";
import {
  insertQRDataSchema,
  insertPDFDataSchema,
  insertEGAMDataSchema,
  insertEGAMAuditLogSchema,
  insertSystemLogSchema,
  insertAPILogSchema,
  insertPDFProcessingHistorySchema,
  insertBulkQRProcessingSchema,
  insertBulkQRBatchesSchema,
  insertVerticalSchema,
} from "@shared/schema";

export function registerAPIRoutes(app: Express) {
  console.log('[API Routes] Registering API routes...');
  console.log('[API Routes] Registering /api/agents');
  console.log('[API Routes] Registering /api/tickets');
  
  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    try {
      // Simple health check - can be extended to check database connectivity
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    } catch (error) {
      res.status(503).json({ 
        status: 'unhealthy', 
        timestamp: new Date().toISOString() 
      });
    }
  });

  // Agent Management API Routes (Admin only)
  // Get all agents
  app.get('/api/agents', async (req, res) => {
    try {
      console.log('[API] GET /api/agents - Request received');
      const entityId = (req as any).entityId || 'hsbc'; // TODO: Get from auth middleware
      console.log('[API] Fetching agents with entityId:', entityId);
      const agents = await databaseService.getUsersByRole('agent', entityId);
      console.log('[API] Found', agents.length, 'agents');
      // Remove password from response
      const agentsWithoutPassword = agents.map((agent: any) => {
        const { password, ...agentWithoutPassword } = agent;
        return agentWithoutPassword;
      });
      console.log('[API] Returning', agentsWithoutPassword.length, 'agents (passwords removed)');
      res.json(agentsWithoutPassword);
    } catch (error) {
      handleApiError(error, res, { defaultMessage: "Failed to fetch agents" });
    }
  });

  // Get agent by ID
  app.get('/api/agents/:id', async (req, res) => {
    try {
      const agent = await databaseService.getUserById(req.params.id);
      if (!agent) return sendNotFound(res, "Agent not found");
      if ((agent as any).role !== 'agent') return sendNotFound(res, "User is not an agent");
      const { password, ...agentWithoutPassword } = agent as any;
      res.json(agentWithoutPassword);
    } catch (error) {
      handleApiError(error, res, { defaultMessage: "Failed to fetch agent" });
    }
  });

  // Create new agent
  app.post('/api/agents', async (req, res) => {
    try {
      const entityId = (req as any).entityId || 'hsbc'; // TODO: Get from auth middleware
      const agentData = {
        ...req.body,
        role: 'agent',
        entityId: entityId,
        status: req.body.status || 'active',
        // Password will be auto-generated if not provided
      };
      const agent = await databaseService.createUser(agentData);
      // Don't return password in response
      const { password, ...agentResponse } = agent as any;
      res.status(201).json(agentResponse);
    } catch (error) {
      console.error('Error creating agent:', error);
      res.status(400).json({ 
        error: 'Failed to create agent',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  // Update agent
  app.put('/api/agents/:id', async (req, res) => {
    try {
      const agent = await databaseService.getUserById(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      if ((agent as any).role !== 'agent') {
        return res.status(400).json({ error: 'User is not an agent' });
      }
      const updatedAgent = await databaseService.updateUser(req.params.id, req.body);
      // Remove password from response
      const { password, ...agentWithoutPassword } = updatedAgent as any;
      res.json(agentWithoutPassword);
    } catch (error) {
      console.error('Error updating agent:', error);
      res.status(400).json({ 
        error: 'Failed to update agent',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  // Delete agent
  app.delete('/api/agents/:id', async (req, res) => {
    try {
      const agent = await databaseService.getUserById(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      if (agent.role !== 'agent') {
        return res.status(400).json({ error: 'User is not an agent' });
      }
      const deleted = await databaseService.deleteUser(req.params.id);
      if (deleted) {
        res.json({ message: 'Agent deleted successfully' });
      } else {
        res.status(404).json({ error: 'Agent not found' });
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      res.status(500).json({ 
        error: 'Failed to delete agent',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  // Tickets API Routes
  // Get all tickets with count of unique invoices
  app.get('/api/tickets', async (req, res) => {
    console.log('[API] /api/tickets route handler called');
    try {
      console.log('[API] GET /api/tickets - Request received');
      const entityId = (req as any).entityId || 'hsbc';
      console.log('[API] Fetching tickets with entityId:', entityId);
      const tickets = await databaseService.getAllTickets(entityId);
      console.log('[API] Found', tickets.length, 'tickets');
      const totalInvoicesWithTickets = await databaseService.getTotalInvoicesWithTickets(entityId);
      console.log('[API] Total invoices with tickets:', totalInvoicesWithTickets);
      res.json({ tickets, totalInvoicesWithTickets });
    } catch (error) {
      console.error('[API] Error fetching tickets:', error);
      console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      res.status(500).json({ 
        error: 'Failed to fetch tickets',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      });
    }
  });

  // Search ticket by Ticket ID
  app.get('/api/tickets/search/:ticketId', async (req, res) => {
    try {
      const ticket = await databaseService.getTicketByTicketId(req.params.ticketId);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      console.error('Error searching ticket:', error);
      res.status(500).json({ 
        error: 'Failed to search ticket',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  // NOTE: QR Data, PDF Data, and EGAM Data routes are handled in routes.ts with proper validation
  // Only keeping unique routes here (like /api/egam-data/irn/:irn)
  
  // QR Data - only unique routes
  app.get('/api/qr-data/:id', async (req, res) => {
    try {
      const entityId = (req as any).entityId || 'hsbc'; // TODO: Get from auth middleware
      const qrData = await databaseService.getQRDataById(req.params.id);
      if (!qrData || (qrData as any).entityId !== entityId) {
        return res.status(404).json({ error: 'QR data not found' });
      }
      res.json(qrData);
    } catch (error) {
      console.error('Error fetching QR data:', error);
      res.status(500).json({ 
        error: 'Failed to fetch QR data',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  // EGAM Repository - unique route

  app.get('/api/egam-data/irn/:irn', async (req, res) => {
    try {
      const egamData = await databaseService.getEGAMDataByIRN(req.params.irn);
      if (!egamData) {
        return res.status(404).json({ error: 'EGAM data not found' });
      }
      res.json(egamData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch EGAM data' });
    }
  });

  // EGAM Audit Logs - only unique routes (main routes in routes.ts)
  app.post('/api/egam-audit-logs', async (req, res) => {
    try {
      const validatedData = insertEGAMAuditLogSchema.parse(req.body);
      const auditLog = await databaseService.createEGAMAuditLog(validatedData);
      res.json(auditLog);
    } catch (error) {
      console.error('Error creating EGAM audit log:', error);
      await databaseService.createSystemLog({
        level: 'ERROR',
        module: 'EGAM Repository',
        message: 'Failed to create EGAM audit log',
        details: error instanceof Error ? error.message : 'Unknown error'
      }).catch(() => {});
      res.status(400).json({ 
        error: 'Failed to create EGAM audit log',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  // System Logs - only unique routes (main routes in routes.ts)
  app.post('/api/system-logs', async (req, res) => {
    try {
      const validatedData = insertSystemLogSchema.parse(req.body);
      const systemLog = await databaseService.createSystemLog(validatedData);
      res.json(systemLog);
    } catch (error) {
      console.error('Error creating system log:', error);
      res.status(400).json({ 
        error: 'Failed to create system log',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  app.get('/api/system-logs/level/:level', async (req, res) => {
    try {
      const systemLogs = await databaseService.getSystemLogsByLevel(req.params.level);
      res.json(systemLogs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch system logs' });
    }
  });

  // API Logs - only unique routes (main routes in routes.ts)
  app.post('/api/api-logs', async (req, res) => {
    try {
      const validatedData = insertAPILogSchema.parse(req.body);
      const apiLog = await databaseService.createAPILog(validatedData);
      res.json(apiLog);
    } catch (error) {
      console.error('Error creating API log:', error);
      res.status(400).json({ 
        error: 'Failed to create API log',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  app.get('/api/api-logs/status/:status', async (req, res) => {
    try {
      const entityId = (req as any).entityId || 'hsbc'; // TODO: Get from auth middleware
      const apiLogs = await databaseService.getAPILogsByStatus(req.params.status);
      // Filter by entityId
      const filteredLogs = apiLogs.filter((log: any) => log.entityId === entityId);
      res.json(filteredLogs);
    } catch (error) {
      console.error('Error fetching API logs:', error);
      res.status(500).json({ 
        error: 'Failed to fetch API logs',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  // PDF Processing History - only unique routes (main routes in routes.ts)
  app.post('/api/pdf-processing-history', async (req, res) => {
    try {
      const validatedData = insertPDFProcessingHistorySchema.parse(req.body);
      const pdfHistory = await databaseService.createPDFProcessingHistory(validatedData);
      res.json(pdfHistory);
    } catch (error) {
      console.error('Error creating PDF processing history:', error);
      res.status(400).json({ 
        error: 'Failed to create PDF processing history',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  // NOTE: Bulk QR, Search, and Statistics routes are handled in routes.ts
  // Only keeping unique routes here
  
  // Bulk QR - alternative paths (routes.ts uses /api/bulk-qr/batch)
  app.post('/api/bulk-qr-batches', async (req, res) => {
    try {
      const validatedData = insertBulkQRBatchesSchema.parse(req.body);
      const batch = await databaseService.createBulkQRBatch(validatedData);
      res.json(batch);
    } catch (error) {
      console.error('Error creating bulk QR batch:', error);
      res.status(400).json({ 
        error: 'Failed to create bulk QR batch',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  app.post('/api/bulk-qr-processing', async (req, res) => {
    try {
      const validatedData = insertBulkQRProcessingSchema.parse(req.body);
      const processing = await databaseService.createBulkQRProcessing(validatedData);
      res.json(processing);
    } catch (error) {
      console.error('Error creating bulk QR processing:', error);
      res.status(400).json({ 
        error: 'Failed to create bulk QR processing',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  // Email Data APIs
  app.get('/api/email/records', async (req, res) => {
    try {
      const emailRecords = await databaseService.getAllEmailRecords();
      console.log(`[API] GET /api/email/records: Returning ${emailRecords.length} records`);
      res.json(emailRecords);
    } catch (error: any) {
      console.error('[API] Error fetching email records:', error);
      res.status(500).json({ error: 'Failed to fetch email records', details: error.message });
    }
  });

  app.post('/api/email/records', async (req, res) => {
    try {
      const emailRecord = await databaseService.createEmailRecord(req.body);
      res.json(emailRecord);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create email record' });
    }
  });

  app.get('/api/email/mailbox-info', async (req, res) => {
    try {
      const mailboxInfo = await databaseService.getMailboxInfo();
      console.log('[API] GET /api/email/mailbox-info:', mailboxInfo);
      res.json(mailboxInfo);
    } catch (error: any) {
      console.error('[API] Error fetching mailbox info:', error);
      res.status(500).json({ error: 'Failed to fetch mailbox info', details: error.message });
    }
  });

  // NOTE: System Overview route is handled in routes.ts

  // Verticals APIs for Cost Model
  app.get('/api/verticals', async (req, res) => {
    try {
      const entityId = (req as any).entityId || 'hsbc'; // TODO: Get from auth middleware
      const verticals = await databaseService.getAllVerticals();
      // Filter by entityId
      const filteredVerticals = verticals.filter((v: any) => v.entityId === entityId);
      res.json(filteredVerticals);
    } catch (error) {
      console.error('Error fetching verticals:', error);
      res.status(500).json({ 
        error: 'Failed to fetch verticals',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  app.get('/api/verticals/:id', async (req, res) => {
    try {
      const entityId = (req as any).entityId || 'hsbc'; // TODO: Get from auth middleware
      const vertical = await databaseService.getVerticalById(req.params.id);
      if (!vertical || (vertical as any).entityId !== entityId) {
        return res.status(404).json({ error: 'Vertical not found' });
      }
      res.json(vertical);
    } catch (error) {
      console.error('Error fetching vertical:', error);
      res.status(500).json({ 
        error: 'Failed to fetch vertical',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  app.post('/api/verticals', validateBody(insertVerticalSchema), async (req, res) => {
    try {
      const validatedData = (req as any).validatedBody;
      const vertical = await databaseService.createVertical({
        name: validatedData.name,
        description: validatedData.description ?? undefined,
        status: validatedData.status ?? undefined,
        metadata: validatedData.metadata ?? undefined,
        entityId: validatedData.entityId ?? undefined,
        createdBy: validatedData.createdBy ?? undefined
      });
      res.json(vertical);
    } catch (error) {
      handleApiError(error, res, { defaultMessage: "Failed to create vertical", defaultStatus: 400 });
    }
  });

  app.post('/api/verticals/bulk', async (req, res) => {
    try {
      const entityId = (req as any).entityId || 'hsbc';
      const { verticals: rawVerticals } = req.body;
      if (!Array.isArray(rawVerticals) || rawVerticals.length === 0) {
        return res.status(400).json({ error: 'Request body must include a non-empty "verticals" array.' });
      }
      const created: any[] = [];
      const errors: { row: number; message: string }[] = [];
      for (let i = 0; i < rawVerticals.length; i++) {
        const row = rawVerticals[i];
        const rowNum = i + 2;
        try {
          const validated = insertVerticalSchema.parse({
            name: row.name,
            description: row.description ?? '',
            status: row.status ?? 'active',
            entityId,
          });
          const vertical = await databaseService.createVertical({
            name: validated.name,
            description: validated.description ?? undefined,
            status: validated.status ?? undefined,
            entityId: validated.entityId ?? undefined,
          });
          created.push(vertical);
        } catch (err: any) {
          errors.push({ row: rowNum, message: err?.message ?? 'Validation failed' });
        }
      }
      res.json({
        created: created.length,
        failed: errors.length,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error: any) {
      console.error('Error in bulk verticals:', error);
      res.status(400).json({
        error: error.message || 'Bulk upload failed',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  app.put('/api/verticals/:id', async (req, res) => {
    try {
      // Validate update data (partial schema)
      const validatedData = insertVerticalSchema.partial().parse(req.body);
      // Convert null to undefined for optional fields
      const updateData: any = {};
      if (validatedData.name !== undefined) updateData.name = validatedData.name;
      if (validatedData.description !== undefined) updateData.description = validatedData.description ?? undefined;
      if (validatedData.status !== undefined) updateData.status = validatedData.status;
      const v = validatedData as Record<string, unknown>;
      if (v.metadata !== undefined) updateData.metadata = v.metadata;
      if (v.updatedBy !== undefined) updateData.updatedBy = v.updatedBy;
      
      const vertical = await databaseService.updateVertical(req.params.id, updateData);
      if (!vertical) {
        return res.status(404).json({ error: 'Vertical not found' });
      }
      res.json(vertical);
    } catch (error: any) {
      console.error('Error updating vertical:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to update vertical',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  app.delete('/api/verticals/:id', async (req, res) => {
    try {
      await databaseService.deleteVertical(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting vertical:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to delete vertical',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      });
    }
  });

  // Asset Class APIs
  app.get('/api/asset-class', async (req, res) => {
    try {
      const assetClasses = await databaseService.getAllAssetClasses();
      res.json(assetClasses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch asset classes' });
    }
  });

  app.get('/api/asset-class/:id', async (req, res) => {
    try {
      const assetClass = await databaseService.getAssetClassById(req.params.id);
      if (!assetClass) {
        return res.status(404).json({ error: 'Asset Class not found' });
      }
      res.json(assetClass);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch asset class' });
    }
  });

  app.post('/api/asset-class', async (req, res) => {
    try {
      const assetClass = await databaseService.createAssetClass(req.body);
      res.json(assetClass);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create asset class' });
    }
  });

  app.put('/api/asset-class/:id', async (req, res) => {
    try {
      const assetClass = await databaseService.updateAssetClass(req.params.id, req.body);
      if (!assetClass) {
        return res.status(404).json({ error: 'Asset Class not found' });
      }
      res.json(assetClass);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update asset class' });
    }
  });

  app.delete('/api/asset-class/:id', async (req, res) => {
    try {
      await databaseService.deleteAssetClass(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete asset class' });
    }
  });

  // Asset Type APIs
  app.get('/api/asset-type', async (req, res) => {
    try {
      const assetClassId = req.query.assetClassId as string | undefined;
      const assetTypes = await databaseService.getAllAssetTypes(assetClassId);
      res.json(assetTypes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch asset types' });
    }
  });

  app.get('/api/asset-type/:id', async (req, res) => {
    try {
      const assetType = await databaseService.getAssetTypeById(req.params.id);
      if (!assetType) {
        return res.status(404).json({ error: 'Asset Type not found' });
      }
      res.json(assetType);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch asset type' });
    }
  });

  app.post('/api/asset-type', async (req, res) => {
    try {
      const assetType = await databaseService.createAssetType(req.body);
      res.json(assetType);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create asset type' });
    }
  });

  app.put('/api/asset-type/:id', async (req, res) => {
    try {
      const assetType = await databaseService.updateAssetType(req.params.id, req.body);
      if (!assetType) {
        return res.status(404).json({ error: 'Asset Type not found' });
      }
      res.json(assetType);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update asset type' });
    }
  });

  app.delete('/api/asset-type/:id', async (req, res) => {
    try {
      await databaseService.deleteAssetType(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete asset type' });
    }
  });

  // Asset APIs
  app.get('/api/assets', async (req, res) => {
    try {
      const assetTypeId = req.query.assetTypeId as string | undefined;
      const assets = await databaseService.getAllAssets(assetTypeId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch assets' });
    }
  });

  app.get('/api/assets/:id', async (req, res) => {
    try {
      const asset = await databaseService.getAssetById(req.params.id);
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch asset' });
    }
  });

  app.post('/api/assets', async (req, res) => {
    try {
      const asset = await databaseService.createAsset(req.body);
      res.json(asset);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create asset' });
    }
  });

  app.put('/api/assets/:id', async (req, res) => {
    try {
      const asset = await databaseService.updateAsset(req.params.id, req.body);
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.json(asset);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update asset' });
    }
  });

  app.delete('/api/assets/:id', async (req, res) => {
    try {
      await databaseService.deleteAsset(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete asset' });
    }
  });

  // Asset Service Allocation APIs
  app.get('/api/assets/:assetId/service-allocations', async (req, res) => {
    try {
      const allocations = await databaseService.getAssetServiceAllocations(req.params.assetId);
      res.json(allocations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch asset service allocations' });
    }
  });

  app.get('/api/assets/:assetId/service-allocations/total', async (req, res) => {
    try {
      const total = await databaseService.getTotalPercentageForAsset(req.params.assetId);
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate total percentage' });
    }
  });

  app.post('/api/assets/:assetId/service-allocations', async (req, res) => {
    try {
      const allocations = await databaseService.createAssetServiceAllocation({
        ...req.body,
        assetId: req.params.assetId,
      });
      res.json(allocations);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create asset service allocation' });
    }
  });

  app.put('/api/assets/service-allocations/:id', async (req, res) => {
    try {
      const allocations = await databaseService.updateAssetServiceAllocation(req.params.id, req.body);
      if (!allocations) {
        return res.status(404).json({ error: 'Asset service allocation not found' });
      }
      res.json(allocations);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update asset service allocation' });
    }
  });

  app.delete('/api/assets/service-allocations/:id', async (req, res) => {
    try {
      await databaseService.deleteAssetServiceAllocation(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete asset service allocation' });
    }
  });

  // Service Group APIs
  app.get('/api/service-groups', async (req, res) => {
    try {
      const verticalId = req.query.verticalId as string | undefined;
      const serviceGroups = await databaseService.getAllServiceGroups(verticalId);
      res.json(serviceGroups);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch service groups' });
    }
  });

  // Service Group Budget APIs - MUST be registered BEFORE /api/service-groups/:id to avoid route conflicts
  app.get('/api/service-groups/:serviceGroupId/budgets', async (req, res) => {
    try {
      const financialYear = req.query.financialYear as string | undefined;
      const budgets = await databaseService.getServiceGroupBudgets(req.params.serviceGroupId, financialYear);
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch service group budgets' });
    }
  });

  app.post('/api/service-groups/:serviceGroupId/budgets', async (req, res) => {
    try {
      const budget = await databaseService.createServiceGroupBudget({
        ...req.body,
        serviceGroupId: req.params.serviceGroupId,
      });
      res.json(budget);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create budget' });
    }
  });

  app.put('/api/service-groups/:serviceGroupId/budgets/:id', async (req, res) => {
    try {
      const budget = await databaseService.updateServiceGroupBudget(req.params.id, req.body);
      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }
      res.json(budget);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update budget' });
    }
  });

  app.delete('/api/service-groups/:serviceGroupId/budgets/:id', async (req, res) => {
    try {
      await databaseService.deleteServiceGroupBudget(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete budget' });
    }
  });

  app.get('/api/service-groups/:id', async (req, res) => {
    try {
      const serviceGroup = await databaseService.getServiceGroupById(req.params.id);
      if (!serviceGroup) {
        return res.status(404).json({ error: 'Service Group not found' });
      }
      res.json(serviceGroup);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch service group' });
    }
  });

  app.post('/api/service-groups', async (req, res) => {
    try {
      const serviceGroup = await databaseService.createServiceGroup(req.body);
      res.json(serviceGroup);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create service group' });
    }
  });

  app.put('/api/service-groups/:id', async (req, res) => {
    try {
      const serviceGroup = await databaseService.updateServiceGroup(req.params.id, req.body);
      if (!serviceGroup) {
        return res.status(404).json({ error: 'Service Group not found' });
      }
      res.json(serviceGroup);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update service group' });
    }
  });

  app.delete('/api/service-groups/:id', async (req, res) => {
    try {
      await databaseService.deleteServiceGroup(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete service group' });
    }
  });

  // Service Level Cost APIs - MUST be registered BEFORE /api/services/:id to avoid route conflicts
  // #region agent log
  console.log('[DEBUG] Registering /api/service-level-costs route');
  fetch('http://127.0.0.1:7242/ingest/89bb9352-37f5-4a65-bf25-04ca80b92c8a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiRoutes.ts:618',message:'Registering /api/service-level-costs route',data:{routePath:'/api/service-level-costs'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  app.get('/api/service-level-costs', async (req, res) => {
    console.log('[API] Service Level Costs route hit - Method:', req.method, 'Path:', req.path, 'Query:', req.query);
    try {
      // Use current year by default (no year filter)
      const year = new Date().getFullYear();
      const serviceId = req.query.serviceId as string | undefined;
      
      console.log('[API] Processing request - year:', year, 'serviceId:', serviceId);
      
      if (serviceId) {
        const cost = await databaseService.calculateServiceLevelCost(serviceId, year);
        res.json(cost);
      } else {
        const costs = await databaseService.getAllServiceLevelCosts(year);
        // Ensure we always return an array
        if (!Array.isArray(costs)) {
          console.error('getAllServiceLevelCosts did not return an array:', costs);
          return res.json([]);
        }
        console.log('[API] Returning', costs.length, 'service costs');
        res.json(costs);
      }
    } catch (error: any) {
      console.error('Error in /api/service-level-costs:', error);
      res.status(500).json({ error: error.message || 'Failed to calculate service level costs' });
    }
  });

  // This route must come AFTER the general /api/service-level-costs route
  app.get('/api/service-level-costs/:serviceId', async (req, res) => {
    try {
      // Use current year by default (no year filter)
      const year = new Date().getFullYear();
      const cost = await databaseService.calculateServiceLevelCost(req.params.serviceId, year);
      res.json(cost);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to calculate service level cost' });
    }
  });

  // Get service budget amount
  app.get('/api/services/:id/budget', async (req, res) => {
    try {
      const financialYear = req.query.year as string | undefined;
      const amount = await databaseService.getServiceBudgetAmount(req.params.id, financialYear);
      res.json({ amount });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch service budget amount' });
    }
  });

  // Service APIs
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/89bb9352-37f5-4a65-bf25-04ca80b92c8a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiRoutes.ts:667',message:'Registering /api/services route',data:{routePath:'/api/services'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  app.get('/api/services', async (req, res) => {
    try {
      const serviceGroupId = req.query.serviceGroupId as string | undefined;
      const services = await databaseService.getAllServices(serviceGroupId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  });

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/89bb9352-37f5-4a65-bf25-04ca80b92c8a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiRoutes.ts:678',message:'Registering /api/services/:id route',data:{routePath:'/api/services/:id'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  app.get('/api/services/:id', async (req, res) => {
    // #region agent log
    if (req.path.includes('service-level-costs')) {
      fetch('http://127.0.0.1:7242/ingest/89bb9352-37f5-4a65-bf25-04ca80b92c8a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiRoutes.ts:680',message:'/api/services/:id matched service-level-costs (ROUTE CONFLICT)',data:{method:req.method,path:req.path,url:req.url,params:req.params},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }
    // #endregion
    try {
      const service = await databaseService.getServiceById(req.params.id);
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch service' });
    }
  });

  app.post('/api/services', async (req, res) => {
    try {
      const service = await databaseService.createService(req.body);
      res.json(service);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create service' });
    }
  });

  app.put('/api/services/:id', async (req, res) => {
    try {
      const service = await databaseService.updateService(req.params.id, req.body);
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json(service);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update service' });
    }
  });

  app.delete('/api/services/:id', async (req, res) => {
    try {
      await databaseService.deleteService(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete service' });
    }
  });

  // Cost Group APIs
  app.get('/api/cost-groups', async (req, res) => {
    try {
      const verticalId = req.query.verticalId as string | undefined;
      const costGroups = await databaseService.getAllCostGroups(verticalId);
      res.json(costGroups);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cost groups' });
    }
  });

  app.get('/api/cost-groups/:id', async (req, res) => {
    try {
      const costGroup = await databaseService.getCostGroupById(req.params.id);
      if (!costGroup) {
        return res.status(404).json({ error: 'Cost Group not found' });
      }
      res.json(costGroup);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cost group' });
    }
  });

  app.post('/api/cost-groups', async (req, res) => {
    try {
      const costGroup = await databaseService.createCostGroup(req.body);
      res.json(costGroup);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create cost group' });
    }
  });

  app.put('/api/cost-groups/:id', async (req, res) => {
    try {
      const costGroup = await databaseService.updateCostGroup(req.params.id, req.body);
      if (!costGroup) {
        return res.status(404).json({ error: 'Cost Group not found' });
      }
      res.json(costGroup);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update cost group' });
    }
  });

  app.delete('/api/cost-groups/:id', async (req, res) => {
    try {
      await databaseService.deleteCostGroup(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete cost group' });
    }
  });

  // Budget Line APIs
  app.get('/api/budget-lines', async (req, res) => {
    try {
      const costGroupId = req.query.costGroupId as string | undefined;
      const budgetLines = await databaseService.getAllBudgetLines(costGroupId);
      res.json(budgetLines);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch budget lines' });
    }
  });

  app.get('/api/budget-lines/:id', async (req, res) => {
    try {
      const budgetLine = await databaseService.getBudgetLineById(req.params.id);
      if (!budgetLine) {
        return res.status(404).json({ error: 'Budget Line not found' });
      }
      res.json(budgetLine);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch budget line' });
    }
  });

  app.post('/api/budget-lines', async (req, res) => {
    try {
      const budgetLine = await databaseService.createBudgetLine(req.body);
      res.json(budgetLine);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create budget line' });
    }
  });

  app.put('/api/budget-lines/:id', async (req, res) => {
    try {
      const budgetLine = await databaseService.updateBudgetLine(req.params.id, req.body);
      if (!budgetLine) {
        return res.status(404).json({ error: 'Budget Line not found' });
      }
      res.json(budgetLine);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update budget line' });
    }
  });

  app.delete('/api/budget-lines/:id', async (req, res) => {
    try {
      await databaseService.deleteBudgetLine(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete budget line' });
    }
  });

  // Budget Line Budget APIs
  app.get('/api/budget-lines/:budgetLineId/budgets', async (req, res) => {
    try {
      const financialYear = req.query.financialYear as string | undefined;
      const budgets = await databaseService.getBudgetLineBudgets(req.params.budgetLineId, financialYear);
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch budget line budgets' });
    }
  });

  app.get('/api/budget-line-budgets/:id', async (req, res) => {
    try {
      const budget = await databaseService.getBudgetLineBudgetById(req.params.id);
      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }
      res.json(budget);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch budget' });
    }
  });

  app.post('/api/budget-lines/:budgetLineId/budgets', async (req, res) => {
    try {
      console.log('[DEBUG] Creating budget for budgetLineId:', req.params.budgetLineId);
      console.log('[DEBUG] Request body:', req.body);
      const budget = await databaseService.createBudgetLineBudget({
        ...req.body,
        budgetLineId: req.params.budgetLineId,
      });
      if (!budget) {
        return res.status(500).json({ error: 'Failed to create budget' });
      }
      console.log('[DEBUG] Budget created successfully:', budget.id);
      res.json(budget);
    } catch (error: any) {
      console.error('[ERROR] Failed to create budget:', error);
      res.status(400).json({ error: error.message || 'Failed to create budget' });
    }
  });

  app.put('/api/budget-line-budgets/:id', async (req, res) => {
    try {
      const budget = await databaseService.updateBudgetLineBudget(req.params.id, req.body);
      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }
      res.json(budget);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update budget' });
    }
  });

  app.delete('/api/budget-line-budgets/:id', async (req, res) => {
    try {
      await databaseService.deleteBudgetLineBudget(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete budget' });
    }
  });

  // Cost Element APIs
  app.get('/api/cost-elements', async (req, res) => {
    try {
      const budgetLineId = req.query.budgetLineId as string | undefined;
      const costType = req.query.costType as string | undefined;
      const costElements = await databaseService.getAllCostElements(budgetLineId, costType);
      res.json(costElements);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cost elements' });
    }
  });

  app.get('/api/cost-elements/:id', async (req, res) => {
    try {
      const costElement = await databaseService.getCostElementById(req.params.id);
      if (!costElement) {
        return res.status(404).json({ error: 'Cost Element not found' });
      }
      res.json(costElement);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cost element' });
    }
  });

  app.post('/api/cost-elements', async (req, res) => {
    try {
      const costElement = await databaseService.createCostElement(req.body);
      res.json(costElement);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create cost element' });
    }
  });

  app.put('/api/cost-elements/:id', async (req, res) => {
    try {
      const costElement = await databaseService.updateCostElement(req.params.id, req.body);
      if (!costElement) {
        return res.status(404).json({ error: 'Cost Element not found' });
      }
      res.json(costElement);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update cost element' });
    }
  });

  app.delete('/api/cost-elements/:id', async (req, res) => {
    try {
      await databaseService.deleteCostElement(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete cost element' });
    }
  });

  // Cost Rules APIs
  app.get('/api/cost-rules', async (req, res) => {
    try {
      const costElementId = req.query.costElementId as string | undefined;
      const costRules = await databaseService.getAllCostRules(costElementId);
      res.json(costRules);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cost rules' });
    }
  });

  app.get('/api/cost-rules/:id', async (req, res) => {
    try {
      const costRule = await databaseService.getCostRuleById(req.params.id);
      if (!costRule) {
        return res.status(404).json({ error: 'Cost Rule not found' });
      }
      res.json(costRule);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cost rule' });
    }
  });

  app.get('/api/cost-rules/cost-element/:costElementId', async (req, res) => {
    try {
      const costRules = await databaseService.getCostRulesByCostElement(req.params.costElementId);
      res.json(costRules);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cost rules' });
    }
  });

  app.get('/api/cost-rules/cost-element/:costElementId/total', async (req, res) => {
    try {
      const total = await databaseService.getTotalPercentageForCostElement(req.params.costElementId);
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate total percentage' });
    }
  });

  app.post('/api/cost-rules', async (req, res) => {
    try {
      const costRule = await databaseService.createCostRule(req.body);
      res.json(costRule);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create cost rule' });
    }
  });

  app.put('/api/cost-rules/:id', async (req, res) => {
    try {
      const costRule = await databaseService.updateCostRule(req.params.id, req.body);
      if (!costRule) {
        return res.status(404).json({ error: 'Cost Rule not found' });
      }
      res.json(costRule);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update cost rule' });
    }
  });

  app.delete('/api/cost-rules/:id', async (req, res) => {
    try {
      await databaseService.deleteCostRule(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete cost rule' });
    }
  });

  // ---------- BOM: Parts (PRT) ----------
  const entityIdBom = (req: any) => req.entityId || 'hsbc';

  app.get('/api/bom/parts', async (req, res) => {
    try {
      const parts = await databaseService.getParts(entityIdBom(req));
      res.json(parts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch parts' });
    }
  });

  app.get('/api/bom/parts/:id', async (req, res) => {
    try {
      const part = await databaseService.getPartById(req.params.id);
      if (!part) return res.status(404).json({ error: 'Part not found' });
      res.json(part);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch part' });
    }
  });

  app.post('/api/bom/parts', async (req, res) => {
    try {
      const part = await databaseService.createPart({ ...req.body, entityId: entityIdBom(req) });
      res.status(201).json(part);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create part' });
    }
  });

  app.put('/api/bom/parts/:id', async (req, res) => {
    try {
      const part = await databaseService.updatePart(req.params.id, req.body);
      if (!part) return res.status(404).json({ error: 'Part not found' });
      res.json(part);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update part' });
    }
  });

  app.delete('/api/bom/parts/:id', async (req, res) => {
    try {
      await databaseService.deletePart(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete part' });
    }
  });

  // ---------- BOM: Finished goods (FG) ----------
  app.get('/api/bom/finished-goods', async (req, res) => {
    try {
      const fgs = await databaseService.getFinishedGoods(entityIdBom(req));
      res.json(fgs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch finished goods' });
    }
  });

  app.get('/api/bom/finished-goods/:id', async (req, res) => {
    try {
      const fg = await databaseService.getFinishedGoodById(req.params.id);
      if (!fg) return res.status(404).json({ error: 'Finished good not found' });
      res.json(fg);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch finished good' });
    }
  });

  app.post('/api/bom/finished-goods', async (req, res) => {
    try {
      const fg = await databaseService.createFinishedGood({ ...req.body, entityId: entityIdBom(req) });
      res.status(201).json(fg);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create finished good' });
    }
  });

  app.put('/api/bom/finished-goods/:id', async (req, res) => {
    try {
      const fg = await databaseService.updateFinishedGood(req.params.id, req.body);
      if (!fg) return res.status(404).json({ error: 'Finished good not found' });
      res.json(fg);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update finished good' });
    }
  });

  app.delete('/api/bom/finished-goods/:id', async (req, res) => {
    try {
      await databaseService.deleteFinishedGood(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete finished good' });
    }
  });

  // ---------- BOM: Bill of materials ----------
  app.get('/api/bom', async (req, res) => {
    try {
      const boms = await databaseService.getAllBoms(entityIdBom(req));
      res.json(boms);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch BOMs' });
    }
  });

  app.get('/api/bom/with-lines', async (req, res) => {
    try {
      const bomsWithLines = await databaseService.getBomsWithLines(entityIdBom(req));
      res.json(bomsWithLines);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch BOMs with lines' });
    }
  });

  app.get('/api/bom/by-finished-good/:finishedGoodId', async (req, res) => {
    try {
      const bom = await databaseService.getBomByFinishedGoodId(req.params.finishedGoodId);
      if (!bom) return res.status(404).json({ error: 'BOM not found for this finished good' });
      res.json(bom);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch BOM' });
    }
  });

  app.get('/api/bom/:id', async (req, res) => {
    try {
      const bom = await databaseService.getBomById(req.params.id);
      if (!bom) return res.status(404).json({ error: 'BOM not found' });
      res.json(bom);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch BOM' });
    }
  });

  app.post('/api/bom', async (req, res) => {
    try {
      const bom = await databaseService.createBom({ ...req.body, entityId: entityIdBom(req) });
      res.status(201).json(bom);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create BOM' });
    }
  });

  app.delete('/api/bom/:id', async (req, res) => {
    try {
      await databaseService.deleteBom(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete BOM' });
    }
  });

  // ---------- BOM: BOM lines ----------
  app.get('/api/bom/:bomId/lines', async (req, res) => {
    try {
      const lines = await databaseService.getBomLines(req.params.bomId);
      res.json(lines);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch BOM lines' });
    }
  });

  app.post('/api/bom/:bomId/lines', async (req, res) => {
    try {
      const line = await databaseService.createBomLine({
        bomId: req.params.bomId,
        partId: req.body.partId,
        quantity: req.body.quantity,
        consumptionUom: req.body.consumptionUom,
        uomConversionFactor: req.body.uomConversionFactor ?? 1,
      });
      res.status(201).json(line);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to add BOM line' });
    }
  });

  app.put('/api/bom/lines/:id', async (req, res) => {
    try {
      const line = await databaseService.updateBomLine(req.params.id, req.body);
      if (!line) return res.status(404).json({ error: 'BOM line not found' });
      res.json(line);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update BOM line' });
    }
  });

  app.delete('/api/bom/lines/:id', async (req, res) => {
    try {
      await databaseService.deleteBomLine(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete BOM line' });
    }
  });

  // Debug endpoint to verify route registration
  // #region agent log
  console.log('[DEBUG] Adding debug route /api/debug/routes');
  // #endregion
  app.get('/api/debug/routes', (req, res) => {
    const routes: string[] = [];
    // Try to extract route information
    (app as any)._router?.stack?.forEach((middleware: any) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods);
        routes.push(`${methods.join(',').toUpperCase()} ${middleware.route.path}`);
      }
    });
    res.json({ 
      message: 'Registered routes',
      routes: routes.filter(r => r.includes('service')),
      totalRoutes: routes.length,
      hasServiceLevelCosts: routes.some(r => r.includes('service-level-costs'))
    });
  });
}
