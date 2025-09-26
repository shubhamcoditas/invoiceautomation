import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/use-app-state";
import { QrCode, Upload, FileSpreadsheet, FileText, Clock, CheckCircle, XCircle, AlertCircle, Download, Eye, User, CheckCircle2, AlertTriangle } from "lucide-react";
import { generateDummyQRData } from "@/lib/dummy-data";
import { exportQRDataToExcel } from "@/lib/excel-export";
import { parseExcelForQRStrings, validateQRString } from "@/lib/excel-parser";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { Loading, TableLoading } from "@/components/ui/loading";
import { QRData, BulkQRBatches, BulkQRProcessing, InsertBulkQRBatches, InsertBulkQRProcessing } from "@shared/schema";
import { formatDateTime, statusBadgeConfig } from "@/lib/utils";

// Function to generate fabricated EGAM data based on QR data
const generateEGAMData = (qrData: any) => {
  const baseDate = qrData.date || "2024-01-15";
  const invoiceNo = qrData.invoiceNo || "INV-2024-001";
  const amount = qrData.totalAmount || "₹125,000.00";
  
  return {
    // QR Extracted Data (from QR string)
    irn: qrData.irn || "1a2b3c4d5e6f7g8h9i0j1k2l3m4n",
    invoiceNo: qrData.invoiceNo || "INV-2024-001",
    date: qrData.date || "2024-01-15",
    totalAmount: qrData.totalAmount || "₹125,000.00",
    gstin: qrData.gstin || "27ABCDE1234F1Z5",
    buyerGstin: qrData.buyerGstin || "29XYZAB5678P1Q2",
    invoiceType: qrData.invoiceType || "B2B",
    
    // EGAM Additional Data (generated/fabricated)
    invoiceStatus: "Verified",
    taxAmount: "₹18,750.00",
    cgst: "₹9,375.00",
    sgst: "₹9,375.00",
    igst: "₹0.00",
    cess: "₹1,250.00",
    vendorName: "ABC Technologies Pvt Ltd",
    vendorAddress: "123 Business Park, Mumbai, Maharashtra 400001",
    buyerName: "XYZ Corporation Ltd",
    buyerAddress: "456 Corporate Plaza, Delhi, Delhi 110001",
    paymentStatus: "Pending",
    dueDate: new Date(new Date(baseDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentTerms: "Net 30",
    poNumber: `PO-${invoiceNo.split('-')[1]}-001`,
    deliveryDate: baseDate,
    shippingAddress: "456 Corporate Plaza, Delhi, Delhi 110001",
    billingAddress: "456 Corporate Plaza, Delhi, Delhi 110001",
    itemDescription: "Software Development Services",
    quantity: "1",
    unitPrice: amount,
    discount: "₹5,000.00",
    totalBeforeTax: "₹120,000.00",
    hsnCode: "998314",
    sacCode: "998314",
    placeOfSupply: "Delhi",
    reverseCharge: "No",
    ewayBillNo: `EWB${Math.random().toString().substr(2, 9)}`,
    transporterName: "Fast Logistics Ltd",
    vehicleNumber: "MH01AB1234",
    distance: "1,200 km",
      branch: "Mumbai Central"
  };
};

export function QRScanner() {
  const [currentView, setCurrentView] = useState<'history' | 'newQR' | 'bulkImport'>('history');
  const [manualData, setManualData] = useState("");
  const [egamData, setEgamData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(null);
  const [bulkProcessingData, setBulkProcessingData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [visibleRecords, setVisibleRecords] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { state, dispatch } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch historical QR data
  const { data: qrHistoryData, isLoading: isHistoryLoading, refetch: refetchQRHistory } = useQuery<QRData[]>({
    queryKey: ['api', 'qr-data'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch bulk QR batches
  const { data: bulkBatches, isLoading: isBatchesLoading, refetch: refetchBulkBatches } = useQuery<BulkQRBatches[]>({
    queryKey: ['api', 'bulk-qr-batches'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch bulk QR processing data for current batch
  const { data: currentBatchProcessingData, isLoading: isProcessingLoading, refetch: refetchProcessingData } = useQuery<BulkQRProcessing[]>({
    queryKey: ['api', 'bulk-qr-processing', currentBatchId],
    queryFn: () => currentBatchId ? getQueryFn({ on401: "throw" })(`/api/bulk-qr/processing/${currentBatchId}`) : Promise.resolve([]),
    enabled: !!currentBatchId,
    refetchInterval: (data) => {
      if (data && Array.isArray(data) && data.some(item => item.status === 'queued' || item.status === 'in_progress')) {
        return 3000; // Refetch every 3 seconds if there are pending items
      }
      return false; // Stop refetching if all items are processed
    },
  });

  const processQRMutation = useMutation({
    mutationFn: async (qrData: any) => {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return qrData; // Return the dummy data directly
    },
    onSuccess: (data) => {
      setEgamData(generateEGAMData(data));
      queryClient.invalidateQueries({ queryKey: ['api', 'qr-data'] });
      toast({
        title: "QR Processed",
        description: "QR data extracted and EGAM data generated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error processing QR:", error);
      toast({
        title: "QR Processing Failed",
        description: "There was an error processing the QR code.",
        variant: "destructive",
      });
    },
  });

  const processBulkQRMutation = useMutation({
    mutationFn: async (batchData: InsertBulkQRBatches) => {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: `batch_${Date.now()}`,
        ...batchData,
        createdAt: new Date(),
        status: 'completed'
      };
    },
    onSuccess: async (batch: any) => {
      setCurrentBatchId(batch.id);
      refetchBulkBatches();
      toast({
        title: "Bulk QR Import Started",
        description: `Processing batch "${batch.fileName}" with ${batch.totalRecords} QR strings.`,
      });

      // Simulate processing each QR string in the batch
      if (selectedFile) {
        const qrStrings = await parseExcelForQRStrings(selectedFile);
        for (const qrString of qrStrings) {
          const validation = validateQRString(qrString);
          let status: 'queued' | 'in_progress' | 'success' | 'failed' = 'queued';
          let errorMessage: string | null = null;
          let extractedData: any = null;

          if (!validation.isValid) {
            status = 'failed';
            errorMessage = validation.error;
          } else {
            // Simulate successful processing
            status = 'in_progress';
            extractedData = generateDummyQRData(); // Simulate data extraction
          }

          // No API call needed - just simulate the processing
          console.log('Processing QR:', qrString, 'Status:', status);
        }
        refetchProcessingData(); // Refresh processing data for the new batch
      }
    },
    onError: (error) => {
      console.error("Error initiating bulk QR import:", error);
      toast({
        title: "Bulk Import Failed",
        description: "There was an error initiating the bulk QR import.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsProcessing(true);
      setProcessingProgress(0);
      setVisibleRecords([]);
      
      try {
        // Generate dummy processing data for the uploaded file
        const dummyProcessingData = [
          {
            id: '1',
            qrString: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
            processedBy: 'admin',
            status: 'success',
            processedAt: new Date(),
            errorMessage: null
          },
          {
            id: '2',
            qrString: '2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
            processedBy: 'john_doe',
            status: 'success',
            processedAt: new Date(),
            errorMessage: null
          },
          {
            id: '3',
            qrString: '3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
            processedBy: 'jane_smith',
            status: 'failed',
            processedAt: new Date(),
            errorMessage: 'Invalid QR format'
          },
          {
            id: '4',
            qrString: '4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
            processedBy: 'mike_wilson',
            status: 'success',
            processedAt: new Date(),
            errorMessage: null
          },
          {
            id: '5',
            qrString: '5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
            processedBy: 'sarah_jones',
            status: 'success',
            processedAt: new Date(),
            errorMessage: null
          }
        ];
        
        // Store the processing data in state
        setBulkProcessingData(dummyProcessingData);
        
        // Progressive loading with delays
        for (let i = 0; i < dummyProcessingData.length; i++) {
          // Add delay between each record (1-3 seconds)
          const delay = Math.random() * 2000 + 1000; // 1-3 seconds
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Add the next record to visible records
          setVisibleRecords(prev => [...prev, dummyProcessingData[i]]);
          
          // Update progress
          const progress = ((i + 1) / dummyProcessingData.length) * 100;
          setProcessingProgress(progress);
        }
        
        // Processing complete
        setIsProcessing(false);
        
        toast({
          title: "File Processing Complete",
          description: `Successfully processed ${dummyProcessingData.length} QR strings from "${file.name}".`,
        });
      } catch (error: any) {
        setIsProcessing(false);
        toast({
          title: "File Processing Error",
          description: error.message || "Failed to process Excel file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleManualQRSubmit = () => {
    const validation = validateQRString(manualData);
    if (!validation.isValid) {
      toast({
        title: "Invalid QR String",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    const qrData = generateDummyQRData();
    processQRMutation.mutate(qrData, {
      onSuccess: () => {
        setManualData("");
        // Stay on the same page to show results - no redirect
      }
    });
  };

  const handleNewQRClick = () => {
    // Clear any existing data when navigating to new QR view
    setEgamData(null);
    setManualData("");
    setCurrentView('newQR');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config = statusBadgeConfig[status.toLowerCase() as keyof typeof statusBadgeConfig] || statusBadgeConfig.error;
    const IconComponent = status.toLowerCase() === 'success' ? CheckCircle2 : AlertTriangle;
    
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const exportBulkData = () => {
    if (!currentBatchProcessingData || currentBatchProcessingData.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There is no processing data in the current batch to export.",
        variant: "info",
      });
      return;
    }

    const exportData = currentBatchProcessingData.map(item => ({
      "QR String": item.qrString,
      "Status": item.status,
      "Processed At": item.processedAt ? formatDateTime(item.processedAt) : '-',
      "Error Message": item.errorMessage || '-',
      "Extracted IRN": item.extractedData?.irn || '-',
      "Extracted Invoice No": item.extractedData?.invoiceNo || '-',
      "Extracted Amount": item.extractedData?.totalAmount || '-',
    }));

    exportQRDataToExcel(exportData, `bulk-qr-processing-${currentBatchId}`);
  };

  // Show different views based on currentView state
  if (currentView === 'newQR') {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="modern-card animate-fade-in">
          <CardHeader className="modern-card-header">
            <div className="flex justify-between items-center">
            <div>
                <CardTitle className="modern-card-title">New QR Scan</CardTitle>
                <p className="modern-card-subtitle">Extract invoice data from QR codes</p>
            </div>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('history')}
              >
                Back to History
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
                <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">QR String</label>
                    <Textarea
                  placeholder="Paste QR string here..."
                      value={manualData}
                      onChange={(e) => setManualData(e.target.value)}
                  className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('history')}
                >
                      Cancel
                    </Button>
                <Button 
                  onClick={handleManualQRSubmit}
                  disabled={processQRMutation.isPending}
                  className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white"
                >
                  {processQRMutation.isPending ? "Processing..." : "Process QR"}
                    </Button>
              </div>
            </div>

            {egamData && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-lg font-semibold">QR Processing Successful</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* QR Extracted Data - Left Side */}
                  <Card className="border border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                    <CardHeader>
                      <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center">
                        <QrCode className="mr-2 h-5 w-5" />
                        QR Extracted Data
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">IRN:</span>
                          <span className="font-mono text-xs">{egamData.irn || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">Invoice No:</span>
                          <span className="font-mono text-xs">{egamData.invoiceNo || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">Date:</span>
                          <span className="font-mono text-xs">{egamData.date || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">Total Amount:</span>
                          <span className="font-mono text-xs font-semibold text-green-600">{egamData.totalAmount || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">GSTIN:</span>
                          <span className="font-mono text-xs">{egamData.gstin || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">Buyer GSTIN:</span>
                          <span className="font-mono text-xs">{egamData.buyerGstin || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">Invoice Type:</span>
                          <span className="font-mono text-xs">{egamData.invoiceType || 'N/A'}</span>
                        </div>
                      </div>
        </CardContent>
      </Card>

                  {/* EGAM Additional Data - Right Side */}
                  <Card className="border border-green-200 bg-green-50 dark:bg-green-900/10">
            <CardHeader>
                      <CardTitle className="text-green-800 dark:text-green-200 flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        EGAM Additional Data
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        {/* Invoice & Tax Information */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-green-800 dark:text-green-200 text-xs uppercase tracking-wide">Invoice & Tax Details</h4>
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Invoice Status:</span>
                            <span className="font-semibold text-green-600">{egamData.invoiceStatus}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Tax Amount:</span>
                            <span className="font-semibold">{egamData.taxAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">CGST:</span>
                            <span>{egamData.cgst}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">SGST:</span>
                            <span>{egamData.sgst}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">IGST:</span>
                            <span>{egamData.igst}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">CESS:</span>
                            <span>{egamData.cess}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Payment Status:</span>
                            <span className="font-semibold text-orange-600">{egamData.paymentStatus}</span>
                          </div>
                        </div>

                        {/* Vendor Information */}
                        <div className="space-y-3 pt-3 border-t border-green-300/30">
                          <h4 className="font-semibold text-green-800 dark:text-green-200 text-xs uppercase tracking-wide">Vendor Information</h4>
                          <div>
                            <span className="font-medium text-muted-foreground">Name:</span>
                            <p className="font-semibold text-sm mt-1">{egamData.vendorName}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Address:</span>
                            <p className="text-xs text-muted-foreground mt-1">{egamData.vendorAddress}</p>
                          </div>
                        </div>

                        {/* Buyer Information */}
                        <div className="space-y-3 pt-3 border-t border-green-300/30">
                          <h4 className="font-semibold text-green-800 dark:text-green-200 text-xs uppercase tracking-wide">Buyer Information</h4>
                          <div>
                            <span className="font-medium text-muted-foreground">Name:</span>
                            <p className="font-semibold text-sm mt-1">{egamData.buyerName}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Address:</span>
                            <p className="text-xs text-muted-foreground mt-1">{egamData.buyerAddress}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>


                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => {
                      setEgamData(null);
                      setManualData("");
                    }}
                    variant="outline"
                    className="border-[#00338D] text-[#00338D] hover:bg-[#00338D] hover:text-white"
                  >
                    Process Another QR
                  </Button>
                  <Button 
                    onClick={() => setCurrentView('history')}
                    className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white"
                  >
                    Back to History
                  </Button>
                </div>
              </div>
            )}
            </CardContent>
          </Card>
      </div>
    );
  }

  if (currentView === 'bulkImport') {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="modern-card animate-fade-in">
          <CardHeader className="modern-card-header">
            <div className="flex justify-between items-center">
                  <div>
                <CardTitle className="modern-card-title">Bulk QR Import</CardTitle>
                <p className="modern-card-subtitle">Upload Excel file with multiple QR strings for batch processing</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('history')}
              >
                Back to History
              </Button>
                    </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Component - Only show when not processing and no file uploaded */}
            {!selectedFile && !isProcessing && (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-[#00338D] transition-colors">
                <FileSpreadsheet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Excel File</h3>
                <p className="text-muted-foreground mb-4">
                  Select an Excel file containing QR strings for batch processing
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={processBulkQRMutation.isPending}
                  className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {processBulkQRMutation.isPending ? "Processing..." : "Choose File"}
                </Button>
                  </div>
            )}

            {/* Upload New File CTA - Show after processing is complete */}
            {selectedFile && !isProcessing && bulkProcessingData.length > 0 && (
              <div className="text-center py-6">
                <div className="mb-4">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-2" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Processing Complete</h3>
                  <p className="text-muted-foreground">
                    All QR strings have been processed successfully. You can upload another file to process more records.
                  </p>
                    </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => {
                    setSelectedFile(null);
                    setBulkProcessingData([]);
                    setVisibleRecords([]);
                    setProcessingProgress(0);
                    fileInputRef.current?.click();
                  }}
                  className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Bulk Excel
                </Button>
                  </div>
            )}

            {/* Processing Queue - Show when file is selected and (processing or completed) */}
            {selectedFile && (isProcessing || bulkProcessingData.length > 0) && (
              <Card className="border border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                <CardHeader>
                  <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center justify-between">
                    <span>Processing Queue</span>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>File: {selectedFile.name}</span>
                      <span>Records: {bulkProcessingData.length}</span>
                      <span>Success: {visibleRecords.filter(item => item.status === 'success').length}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {isProcessing ? 'Processing...' : 'Processing Complete'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(processingProgress)}%
                      </span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Processed: {visibleRecords.length} / {bulkProcessingData.length}</span>
                      <span>
                        {isProcessing ? 'Processing records...' : 'All records processed'}
                      </span>
                    </div>
                  </div>

                  {/* Processing Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-4 px-4 font-semibold text-foreground">QR String</th>
                          <th className="text-left py-4 px-4 font-semibold text-foreground">Status</th>
                          <th className="text-left py-4 px-4 font-semibold text-foreground">Error Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRecords.map((item) => (
                          <tr key={item.id} className="border-b border-border/30 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 transition-all duration-200">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#00338D] to-[#4A90E2] rounded-lg flex items-center justify-center">
                                  <QrCode className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-foreground max-w-xs truncate">{item.qrString}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(item.status)}
                                {getStatusBadge(item.status)}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-muted-foreground">
                              {item.errorMessage || '-'}
                            </td>
                          </tr>
                        ))}
                        {isProcessing && visibleRecords.length < bulkProcessingData.length && (
                          <tr>
                            <td colSpan={3} className="py-8 text-center text-muted-foreground">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00338D]"></div>
                                <span>Processing next record...</span>
                    </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                </div>
              </CardContent>
            </Card>
          )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default history view
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Historical QR Scans - Main View */}
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="modern-card-title">QR Processing History</CardTitle>
              <p className="modern-card-subtitle">View and manage your QR processing history</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setCurrentView('bulkImport')} 
                variant="outline"
                className="border-[#00338D] text-[#00338D] hover:bg-[#00338D] hover:text-white"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
              <Button 
                onClick={handleNewQRClick} 
                className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <QrCode className="mr-2 h-4 w-4" />
                New QR Scan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isHistoryLoading ? (
            <TableLoading columns={7} rows={5} />
          ) : qrHistoryData && qrHistoryData.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {qrHistoryData.length} QR codes processed
                </p>
                <Button
                  onClick={() => exportQRDataToExcel(qrHistoryData, 'qr-history')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-4 px-4 font-semibold text-foreground">QR String</th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground">Processed By</th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground">Invoice No</th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground">Amount</th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground">Date</th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground">Processed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qrHistoryData.map((item) => (
                      <tr key={item.id} className="border-b border-border/30 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 transition-all duration-200">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#00338D] to-[#4A90E2] rounded-lg flex items-center justify-center">
                              <QrCode className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-foreground max-w-xs truncate">{item.qrString}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{item.processedBy}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            {getStatusBadge(item.status)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {item.invoiceNo}
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {item.totalAmount}
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {item.date}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{formatDateTime(item.extractedAt)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <QrCode className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No QR scans found</p>
              <p className="text-sm text-muted-foreground mb-4">Process your first QR code to get started</p>
              <Button 
                onClick={handleNewQRClick} 
                className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white"
              >
                <QrCode className="mr-2 h-4 w-4" />
                Scan First QR
              </Button>
        </div>
      )}
        </CardContent>
      </Card>
    </div>
  );
}