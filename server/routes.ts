import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQRDataSchema, insertPDFDataSchema, insertEGAMDataSchema, insertSystemLogSchema, insertAPILogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // QR Data routes
  app.post('/api/qr-data', async (req, res) => {
    try {
      const validatedData = insertQRDataSchema.parse(req.body);
      const qrData = await storage.createQRData(validatedData);
      
      // Log the action
      await storage.createSystemLog({
        level: 'SUCCESS',
        module: 'QR Scanner',
        message: 'QR code processed successfully',
        details: `IRN: ${qrData.irn} extracted`
      });
      
      res.json(qrData);
    } catch (error) {
      await storage.createSystemLog({
        level: 'ERROR',
        module: 'QR Scanner',
        message: 'Failed to process QR code',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      res.status(400).json({ error: 'Invalid QR data' });
    }
  });

  app.get('/api/qr-data', async (req, res) => {
    try {
      const qrData = await storage.getAllQRData();
      res.json(qrData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch QR data' });
    }
  });

  app.put('/api/qr-data/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedData = await storage.updateQRData(id, updates);
      
      if (!updatedData) {
        return res.status(404).json({ error: 'QR data not found' });
      }
      
      res.json(updatedData);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update QR data' });
    }
  });

  // PDF Data routes
  app.post('/api/pdf-data', async (req, res) => {
    try {
      const validatedData = insertPDFDataSchema.parse(req.body);
      const pdfData = await storage.createPDFData(validatedData);
      
      await storage.createSystemLog({
        level: 'SUCCESS',
        module: 'PDF Upload',
        message: 'PDF processed successfully',
        details: `File: ${pdfData.fileName}, Invoice: ${pdfData.invoiceNo}`
      });
      
      res.json(pdfData);
    } catch (error) {
      await storage.createSystemLog({
        level: 'ERROR',
        module: 'PDF Upload',
        message: 'Failed to process PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      res.status(400).json({ error: 'Invalid PDF data' });
    }
  });

  app.get('/api/pdf-data', async (req, res) => {
    try {
      const pdfData = await storage.getAllPDFData();
      res.json(pdfData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch PDF data' });
    }
  });

  // EGAM Repository routes
  app.get('/api/egam-data', async (req, res) => {
    try {
      const egamData = await storage.getAllEGAMData();
      res.json(egamData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch EGAM data' });
    }
  });

  app.post('/api/egam-data/fetch', async (req, res) => {
    try {
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

      await storage.createSystemLog({
        level: 'SUCCESS',
        module: 'EGAM Repository',
        message: 'EGAM data sync completed',
        details: `Fetched ${createdRecords.length} records from KIGS`
      });

      res.json({ 
        success: true, 
        count: createdRecords.length,
        data: createdRecords 
      });
    } catch (error) {
      await storage.createSystemLog({
        level: 'ERROR',
        module: 'EGAM Repository',
        message: 'Failed to fetch EGAM data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      res.status(500).json({ error: 'Failed to fetch EGAM data' });
    }
  });

  // Reconciliation route
  app.post('/api/reconciliation/run', async (req, res) => {
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
        details: `Matched: ${summary.matched}, Mismatched: ${summary.mismatched}, Missing: ${summary.missing}`
      });

      res.json({ results: reconciliationResults, summary });
    } catch (error) {
      await storage.createSystemLog({
        level: 'ERROR',
        module: 'Reconciliation',
        message: 'Reconciliation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      res.status(500).json({ error: 'Reconciliation failed' });
    }
  });

  // Push to KIGS simulation
  app.post('/api/kigs/push', async (req, res) => {
    try {
      // Simulate push to KIGS with random success/failure
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        const ewbNumber = `EWB${Math.random().toString().substr(2, 9)}`;
        
        await storage.createSystemLog({
          level: 'SUCCESS',
          module: 'EWB Generation',
          message: 'Data successfully pushed to KIGS',
          details: `EWB Number: ${ewbNumber}`
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
          details: 'Connection timeout or server error'
        });

        res.status(500).json({ 
          status: 'error', 
          message: 'Failed to push data to KIGS. Please try again.'
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Push to KIGS failed' });
    }
  });

  // Validation API endpoints
  app.post('/api/validation/:apiType', async (req, res) => {
    try {
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
            gstins: [`${parameters.pan.substr(0, 5)}1234F1Z5`, `${parameters.pan.substr(0, 5)}5678P2Q3`]
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

      // Log the API call
      await storage.createAPILog({
        apiName: apiType,
        parameters,
        response,
        status: response.status
      });

      await storage.createSystemLog({
        level: response.status === 'success' ? 'SUCCESS' : 'ERROR',
        module: 'API Validation',
        message: `${apiType} API call ${response.status}`,
        details: `Parameters: ${JSON.stringify(parameters)}`
      });

      res.json(response);
    } catch (error) {
      await storage.createSystemLog({
        level: 'ERROR',
        module: 'API Validation',
        message: 'API call failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      res.status(500).json({ error: 'API call failed' });
    }
  });

  // System logs routes
  app.get('/api/system-logs', async (req, res) => {
    try {
      const { level } = req.query;
      const logs = level ? 
        await storage.getSystemLogsByLevel(level as string) : 
        await storage.getAllSystemLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch system logs' });
    }
  });

  // API logs routes
  app.get('/api/api-logs', async (req, res) => {
    try {
      const { status } = req.query;
      const logs = status ? 
        await storage.getAPILogsByStatus(status as string) : 
        await storage.getAllAPILogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch API logs' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
