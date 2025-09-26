import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/use-app-state";
import { FileText, Upload, Edit, Save, X, FileSpreadsheet, Eye, Download, CheckCircle, Plus, Clock, User, CheckCircle2, XCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { Loading, TableLoading } from "@/components/ui/loading";
import { generateDummyPDFData } from "@/lib/dummy-data";
import { exportPDFDataToExcel } from "@/lib/excel-export";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { formatDateTime, statusBadgeConfig } from "@/lib/utils";

interface ProcessingFile {
  name: string;
  progress: number;
  status: 'processing' | 'complete' | 'error';
}

const documentTypes = [
  { value: 'invoice', label: 'Invoice' },
  { value: 'delivery-challan', label: 'Delivery Challan' },
  { value: 'boe', label: 'BOE' },
  { value: 'shipping-bill', label: 'Shipping Bill' }
];

interface FormData {
  documentType: string;
  invoiceNo: string;
  date: string;
  irn: string;
  gstin: string;
  amount: string;
  vendorName: string;
  vendorAddress: string;
  buyerName: string;
  buyerAddress: string;
  itemDescription: string;
  quantity: string;
  unitPrice: string;
  taxAmount: string;
  totalAmount: string;
  paymentTerms: string;
  dueDate: string;
  remarks: string;
}

interface PDFProcessingHistory {
  id: string;
  fileName: string;
  documentType: string;
  processedBy: string;
  ewbStatus: 'success' | 'failed' | 'not_attempted';
  processedAt: string;
  invoiceNo?: string;
  amount?: string;
  vendorName?: string;
  buyerName?: string;
}

export function PDFUpload() {
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pdfHistory, setPdfHistory] = useState<PDFProcessingHistory[]>([]);
  const [showNewUpload, setShowNewUpload] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    documentType: '',
    invoiceNo: '',
    date: '',
    irn: '',
    gstin: '',
    amount: '',
    vendorName: '',
    vendorAddress: '',
    buyerName: '',
    buyerAddress: '',
    itemDescription: '',
    quantity: '',
    unitPrice: '',
    taxAmount: '',
    totalAmount: '',
    paymentTerms: '',
    dueDate: '',
    remarks: ''
  });
  const { state, dispatch } = useAppState();
  const { toast } = useToast();

  // Fetch PDF processing history
  const { data: pdfHistoryData, refetch: refetchHistory, isLoading: isHistoryLoading } = useQuery<PDFProcessingHistory[]>({
    queryKey: ['api', 'pdf-processing-history'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const processPDFMutation = useMutation({
    mutationFn: async (pdfData: any) => {
      const response = await apiRequest('POST', '/api/pdf-data', pdfData);
      return response.json();
    },
    onSuccess: (data) => {
      const currentData = state.extractedPDFData || [];
      dispatch({ type: 'SET_PDF_DATA', payload: [...currentData, data] });
      setIsProcessing(false);
      toast({
        title: "Success",
        description: "PDF processed successfully!",
      });
    },
    onError: () => {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to process PDF",
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);
    
    // Simulate processing
      const interval = setInterval(() => {
      setProcessingFiles([{
        name: file.name,
        progress: Math.min(100, Math.random() * 20 + 80),
        status: 'processing'
      }]);
    }, 100);

    setTimeout(() => {
            clearInterval(interval);
      setProcessingFiles([{
        name: file.name,
        progress: 100,
        status: 'complete'
      }]);
      
      // Generate form data from dummy data
      const dummyData = {
        fileName: file.name,
        invoiceNo: `INV-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        date: '2024-01-18',
        irn: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        gstin: '27ABCDE1234F1Z5',
        amount: `₹${(Math.random() * 100000 + 10000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        vendorName: 'Sample Vendor Ltd',
        vendorAddress: '123 Business Park, Mumbai, Maharashtra 400001',
        buyerName: 'Sample Buyer Corp',
        buyerAddress: '456 Corporate Plaza, Delhi, Delhi 110001',
        itemDescription: 'Software Development Services',
        quantity: '1',
        unitPrice: `₹${(Math.random() * 50000 + 50000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        taxAmount: `₹${(Math.random() * 10000 + 5000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        totalAmount: `₹${(Math.random() * 100000 + 10000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        paymentTerms: 'Net 30',
        dueDate: '2024-02-18',
        remarks: 'Payment due within 30 days'
      };
      setFormData({
        documentType: selectedDocumentType,
        invoiceNo: dummyData.invoiceNo || '',
        date: dummyData.date || '',
        irn: dummyData.irn || '',
        gstin: dummyData.gstin || '',
        amount: dummyData.amount || '',
        vendorName: 'ABC Technologies Pvt Ltd',
        vendorAddress: '123 Business Park, Mumbai, Maharashtra 400001',
        buyerName: 'XYZ Corporation Ltd',
        buyerAddress: '456 Corporate Plaza, Delhi, Delhi 110001',
        itemDescription: 'Software Development Services',
        quantity: '1',
        unitPrice: dummyData.amount || '',
        taxAmount: '₹18,750.00',
        totalAmount: dummyData.amount || '',
        paymentTerms: 'Net 30',
        dueDate: new Date(new Date(dummyData.date || new Date()).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        remarks: 'Invoice processed successfully'
      });
      
      setIsProcessing(false);
    }, 2000);
    
    // Clear the input
    event.target.value = '';
  };

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Process the form data
    const pdfData = {
      fileName: uploadedFile?.name || '',
      invoiceNo: formData.invoiceNo,
      date: formData.date,
      irn: formData.irn,
      gstin: formData.gstin,
      amount: formData.amount,
      status: 'processed'
    };
    
    processPDFMutation.mutate(pdfData);
      setIsEditing(false);
  };

  const handleGenerateEWB = async () => {
    // Validate mandatory fields
    const mandatoryFields = ['invoiceNo', 'date', 'irn', 'gstin', 'amount', 'vendorName', 'buyerName'];
    const missingFields = mandatoryFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
        toast({
        title: "Validation Error",
        description: `Please fill in all mandatory fields: ${missingFields.join(', ')}`,
          variant: "destructive",
        });
      return;
    }

    try {
      // Create PDF processing history entry
      await apiRequest('POST', '/api/pdf-processing-history', {
        fileName: uploadedFile?.name || 'unknown.pdf',
        documentType: formData.documentType,
        processedBy: 'admin', // In a real app, this would be the current user
        ewbStatus: 'success',
        invoiceNo: formData.invoiceNo,
        amount: formData.amount,
        vendorName: formData.vendorName,
        buyerName: formData.buyerName
      });

      // Refetch history to update the table
      refetchHistory();

      toast({
        title: "EWB Generated",
        description: "E-Way Bill generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate EWB",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    if (formData.invoiceNo) {
      const exportData = [{
        fileName: uploadedFile?.name || '',
        invoiceNo: formData.invoiceNo,
        date: formData.date,
        irn: formData.irn,
        gstin: formData.gstin,
        amount: formData.amount,
        status: 'processed'
      }];
      
      const success = exportPDFDataToExcel(exportData);
      if (success) {
        toast({
          title: "Success",
          description: "PDF data exported to Excel successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to export data",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "No data to export",
        variant: "destructive",
      });
    }
  };

  // Check if EWB-required fields are filled
  const isEWBFieldFilled = (field: keyof FormData) => {
    const ewbRequiredFields: (keyof FormData)[] = ['invoiceNo', 'date', 'irn', 'gstin', 'amount', 'vendorName', 'buyerName'];
    return ewbRequiredFields.includes(field) && formData[field] && formData[field].trim() !== '';
  };

  // Get EWB status icon and color
  const getEWBStatusIcon = (status: 'success' | 'failed' | 'not_attempted') => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'not_attempted':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEWBStatusBadge = (status: 'success' | 'failed' | 'not_attempted') => {
    if (status === 'not_attempted') {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Not Attempted
        </Badge>
      );
    }
    
    const config = statusBadgeConfig[status.toLowerCase() as keyof typeof statusBadgeConfig] || statusBadgeConfig.error;
    const IconComponent = status.toLowerCase() === 'success' ? CheckCircle2 : AlertTriangle;
    
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const handleReset = () => {
    setSelectedDocumentType("");
    setUploadedFile(null);
    setShowNewUpload(false);
    setFormData({
      documentType: '',
      invoiceNo: '',
      date: '',
      irn: '',
      gstin: '',
      amount: '',
      vendorName: '',
      vendorAddress: '',
      buyerName: '',
      buyerAddress: '',
      itemDescription: '',
      quantity: '',
      unitPrice: '',
      taxAmount: '',
      totalAmount: '',
      paymentTerms: '',
      dueDate: '',
      remarks: ''
    });
    setIsEditing(false);
    setProcessingFiles([]);
  };

  return (
    <div className="w-full space-y-8" data-testid="pdf-upload">
      {/* PDF Processing History - Main View */}
      {!showNewUpload && !uploadedFile && (
        <Card className="modern-card animate-fade-in">
          <CardHeader className="modern-card-header">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="modern-card-title">PDF Processing History</CardTitle>
                <p className="modern-card-subtitle">View and manage your PDF processing history</p>
              </div>
              <Button 
                onClick={() => setShowNewUpload(true)} 
                className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                New PDF Upload
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-4 px-4 font-semibold text-foreground">File Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Type</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Processed By</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">EWB Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Invoice No</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Amount</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Processed At</th>
                  </tr>
                </thead>
                <tbody>
                  {pdfHistoryData?.map((history) => (
                    <tr key={history.id} className="border-b border-border/30 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 transition-all duration-200">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#00338D] to-[#4A90E2] rounded-lg flex items-center justify-center">
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{history.fileName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="border-[#00338D]/30 text-[#00338D]">{history.documentType}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{history.processedBy}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getEWBStatusIcon(history.ewbStatus)}
                          {getEWBStatusBadge(history.ewbStatus)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {history.invoiceNo || '-'}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {history.amount || '-'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatDateTime(history.processedAt)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!pdfHistoryData || pdfHistoryData.length === 0) && (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center text-muted-foreground">
                        <div className="flex flex-col items-center space-y-2">
                          <FileText className="h-12 w-12 text-muted-foreground/50" />
                          <p className="text-lg font-medium">No PDF processing history found</p>
                          <p className="text-sm">Upload your first PDF to get started</p>
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

      {/* Document Type Selection & Upload */}
      {(showNewUpload || uploadedFile) && !uploadedFile && (
      <Card className="modern-card animate-slide-up">
        <CardHeader className="modern-card-header">
          <div className="flex justify-between items-center">
          <CardTitle className="modern-card-title flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00338D] to-[#4A90E2] rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-white" />
            </div>
            PDF Document Processing
          </CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setShowNewUpload(false)}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Back to History
            </Button>
          </div>
        </CardHeader>
          <CardContent className="space-y-6">
            {/* Document Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="document-type" className="text-sm font-medium">
                Select Document Type <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                <SelectTrigger id="document-type" className="w-full h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="Choose document type..." />
                </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-300 shadow-2xl rounded-lg z-[100] p-2">
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
            <FileText className="h-12 w-12 text-red-500 mx-auto" />
            <div>
                <p className="text-lg font-medium">Upload PDF Document</p>
                <p className="text-muted-foreground">Drag and drop PDF file or click to browse</p>
            </div>
            
              <Button 
                onClick={() => document.getElementById('pdf-file-input')?.click()} 
                disabled={!selectedDocumentType}
                data-testid="button-browse-pdf"
              >
              <Upload className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
            
            <input
              id="pdf-file-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileUpload}
              data-testid="input-pdf-file"
            />
          </div>

          {/* Processing Progress */}
          {processingFiles.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                  <CardTitle className="text-lg">Processing Document...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processingFiles.map((file, index) => (
                    <div key={index} className="space-y-2" data-testid={`processing-file-${index}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {file.status === 'complete' ? 'Complete' : 'Processing...'}
                        </span>
                      </div>
                      <Progress value={file.progress} className="w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      )}

      {/* Form Layout with PDF Preview */}
      {uploadedFile && !isProcessing && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PDF Preview */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Document Preview</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg bg-white shadow-sm min-h-[500px] overflow-hidden">
                {/* PDF Header */}
                <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">{uploadedFile.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                
                {/* PDF Content */}
                <div className="p-6 space-y-4">
                  {/* Invoice Header */}
                  <div className="text-center border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800">TAX INVOICE</h2>
                    <p className="text-sm text-gray-600 mt-1">GST Invoice</p>
                  </div>
                  
                  {/* Invoice Details */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-700 mb-2">From:</h3>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="font-medium">{formData.vendorName || 'ABC Technologies Pvt Ltd'}</p>
                        <p>{formData.vendorAddress || '123 Business Park, Mumbai, Maharashtra 400001'}</p>
                        <p>GSTIN: {formData.gstin || '27ABCDE1234F1Z5'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-700 mb-2">Invoice Details:</h3>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p><span className="font-medium">Invoice No:</span> {formData.invoiceNo || 'INV-2024-001'}</p>
                        <p><span className="font-medium">Date:</span> {formData.date || '2024-01-15'}</p>
                        <p><span className="font-medium">IRN:</span> {formData.irn || '1a2b3c4d5e6f7g8h9i0j1k2l3m4n'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bill To */}
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700 mb-2">Bill To:</h3>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p className="font-medium">{formData.buyerName || 'XYZ Corporation Ltd'}</p>
                      <p>{formData.buyerAddress || '456 Corporate Plaza, Delhi, Delhi 110001'}</p>
                    </div>
                  </div>
                  
                  {/* Item Table */}
                  <div className="border rounded">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-2 border-r">Description</th>
                          <th className="text-center p-2 border-r">Qty</th>
                          <th className="text-right p-2 border-r">Rate</th>
                          <th className="text-right p-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border-r border-b">{formData.itemDescription || 'Software Development Services'}</td>
                          <td className="p-2 border-r border-b text-center">{formData.quantity || '1'}</td>
                          <td className="p-2 border-r border-b text-right">{formData.unitPrice || '₹125,000.00'}</td>
                          <td className="p-2 border-b text-right">{formData.amount || '₹125,000.00'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Tax Details */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <p><span className="font-medium">CGST (9%):</span> {formData.taxAmount || '₹11,250.00'}</p>
                      <p><span className="font-medium">SGST (9%):</span> {formData.taxAmount || '₹11,250.00'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">Total: {formData.amount || '₹125,000.00'}</p>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="text-center text-xs text-gray-500 pt-4 border-t">
                    <p>Thank you for your business!</p>
                    <p className="mt-1">Payment Terms: {formData.paymentTerms || 'Net 30'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Data */}
          <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Document Details</CardTitle>
              <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleEdit} data-testid="button-edit-data">
                    <Edit className="mr-2 h-4 w-4" />
                    {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  {isEditing && (
                    <Button onClick={handleSave} data-testid="button-save-changes">
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                )}
              </div>
            </div>
          </CardHeader>
            <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground">Basic Information</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNo" className="flex items-center space-x-2">
                      <span>Invoice No <span className="text-red-500">*</span></span>
                      {isEWBFieldFilled('invoiceNo') && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </Label>
                    <Input
                      id="invoiceNo"
                      value={formData.invoiceNo}
                      onChange={(e) => handleFormChange('invoiceNo', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center space-x-2">
                      <span>Date <span className="text-red-500">*</span></span>
                      {isEWBFieldFilled('date') && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleFormChange('date', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="irn" className="flex items-center space-x-2">
                      <span>IRN <span className="text-red-500">*</span></span>
                      {isEWBFieldFilled('irn') && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </Label>
                    <Input
                      id="irn"
                      value={formData.irn}
                      onChange={(e) => handleFormChange('irn', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstin" className="flex items-center space-x-2">
                      <span>GSTIN <span className="text-red-500">*</span></span>
                      {isEWBFieldFilled('gstin') && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </Label>
                    <Input
                      id="gstin"
                      value={formData.gstin}
                      onChange={(e) => handleFormChange('gstin', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Vendor & Buyer Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground">Parties</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="vendorName" className="flex items-center space-x-2">
                    <span>Vendor Name <span className="text-red-500">*</span></span>
                    {isEWBFieldFilled('vendorName') && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Input
                    id="vendorName"
                    value={formData.vendorName}
                    onChange={(e) => handleFormChange('vendorName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vendorAddress">Vendor Address</Label>
                  <Textarea
                    id="vendorAddress"
                    value={formData.vendorAddress}
                    onChange={(e) => handleFormChange('vendorAddress', e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerName" className="flex items-center space-x-2">
                    <span>Buyer Name <span className="text-red-500">*</span></span>
                    {isEWBFieldFilled('buyerName') && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Input
                    id="buyerName"
                    value={formData.buyerName}
                    onChange={(e) => handleFormChange('buyerName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="buyerAddress">Buyer Address</Label>
                  <Textarea
                    id="buyerAddress"
                    value={formData.buyerAddress}
                    onChange={(e) => handleFormChange('buyerAddress', e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground">Financial Details</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="flex items-center space-x-2">
                      <span>Amount <span className="text-red-500">*</span></span>
                      {isEWBFieldFilled('amount') && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </Label>
                    <Input
                      id="amount"
                      value={formData.amount}
                      onChange={(e) => handleFormChange('amount', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxAmount">Tax Amount</Label>
                          <Input
                      id="taxAmount"
                      value={formData.taxAmount}
                      onChange={(e) => handleFormChange('taxAmount', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                          <Input
                      id="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={(e) => handleFormChange('paymentTerms', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                          <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleFormChange('dueDate', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground">Item Details</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="itemDescription">Item Description</Label>
                  <Textarea
                    id="itemDescription"
                    value={formData.itemDescription}
                    onChange={(e) => handleFormChange('itemDescription', e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                          <Input
                      id="quantity"
                      value={formData.quantity}
                      onChange={(e) => handleFormChange('quantity', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice">Unit Price</Label>
                          <Input
                      id="unitPrice"
                      value={formData.unitPrice}
                      onChange={(e) => handleFormChange('unitPrice', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleFormChange('remarks', e.target.value)}
                  disabled={!isEditing}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      {uploadedFile && !isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleReset}>
                <X className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleExport}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export to Excel
                </Button>
                <Button onClick={handleGenerateEWB} className="bg-green-600 hover:bg-green-700">
                  <Download className="mr-2 h-4 w-4" />
                  Generate EWB
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
