import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  X, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  QrCode,
  Mail,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Building2,
  User,
  Hash,
  FileBarChart,
  RefreshCw
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface ConsolidatedInvoice {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  vendorEmail: string;
  vendorGstin: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  invoiceDate: string;
  dueDate: string;
  source: 'qr' | 'pdf' | 'email';
  sourceDetails: string;
  status: 'processed' | 'pending' | 'error' | 'ready_for_review';
  processingDate: string;
  qrCode?: string;
  irn?: string;
  attachments: string[];
  paymentTerms: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  cgst: number;
  sgst: number;
  igst: number;
  hasQrInEgam: boolean;
  egamStatus: 'found' | 'not_found' | 'pending';
  validationStatus: 'valid' | 'invalid' | 'pending';
  errorMessage?: string;
  processedBy: string;
  lastModified: string;
}

// Data fetching functions to simulate real API calls
const fetchQRData = (): ConsolidatedInvoice[] => {
  return [
    {
      id: "qr-1",
      invoiceNumber: "INV-2024-001",
      vendorName: "ABC Technologies Pvt Ltd",
      vendorEmail: "billing@abctech.com",
      vendorGstin: "27ABCDE1234F1Z5",
      amount: 125000,
      taxAmount: 22500,
      totalAmount: 147500,
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-15",
      source: 'qr',
      sourceDetails: "QR Scanner - Batch 001",
      status: 'processed',
      processingDate: "2024-01-18T10:30:00Z",
      qrCode: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n",
      irn: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n",
      attachments: ["invoice_001.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Software Development Services",
      quantity: 1,
      unitPrice: 125000,
      cgst: 11250,
      sgst: 11250,
      igst: 0,
      hasQrInEgam: true,
      egamStatus: 'found',
      validationStatus: 'valid',
      processedBy: "QR Scanner",
      lastModified: "2024-01-18T10:30:00Z"
    },
    {
      id: "qr-2",
      invoiceNumber: "DC-2024-015",
      vendorName: "Logistics Pro Ltd",
      vendorEmail: "vendor5@example.com",
      vendorGstin: "05LOGISTICS1234567",
      amount: 45200,
      taxAmount: 8136,
      totalAmount: 53336,
      invoiceDate: "2024-01-14",
      dueDate: "2024-02-14",
      source: 'qr',
      sourceDetails: "QR Scanner - Batch 002",
      status: 'error',
      processingDate: "2024-01-18T06:30:00Z",
      qrCode: "2b3c4d5e6f7g8h9i0j1k2l3m4n5o",
      attachments: ["delivery_challan_015.pdf"],
      paymentTerms: "Net 15",
      itemDescription: "Logistics Services",
      quantity: 1,
      unitPrice: 45200,
      cgst: 4068,
      sgst: 4068,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'invalid',
      errorMessage: "Invalid GSTIN format",
      processedBy: "QR Scanner",
      lastModified: "2024-01-18T06:30:00Z"
    },
    {
      id: "qr-3",
      invoiceNumber: "INV-2024-003",
      vendorName: "Tech Innovations Ltd",
      vendorEmail: "billing@techinnovations.com",
      vendorGstin: "29TECH1234567A1B",
      amount: 87500,
      taxAmount: 15750,
      totalAmount: 103250,
      invoiceDate: "2024-01-17",
      dueDate: "2024-02-17",
      source: 'qr',
      sourceDetails: "QR Scanner - Batch 003",
      status: 'processed',
      processingDate: "2024-01-18T11:15:00Z",
      qrCode: "3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
      irn: "3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
      attachments: ["invoice_003.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "IT Consulting Services",
      quantity: 1,
      unitPrice: 87500,
      cgst: 7875,
      sgst: 7875,
      igst: 0,
      hasQrInEgam: true,
      egamStatus: 'found',
      validationStatus: 'valid',
      processedBy: "QR Scanner",
      lastModified: "2024-01-18T11:15:00Z"
    }
  ];
};

const fetchPDFData = (): ConsolidatedInvoice[] => {
  return [
    {
      id: "pdf-1",
      invoiceNumber: "TI-2024-002",
      vendorName: "XYZ Corporation Ltd",
      vendorEmail: "vendor2@example.com",
      vendorGstin: "29XYZ1234567A1B2",
      amount: 89500,
      taxAmount: 16110,
      totalAmount: 105610,
      invoiceDate: "2024-01-16",
      dueDate: "2024-02-16",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_002.pdf",
      status: 'ready_for_review',
      processingDate: "2024-01-18T09:15:00Z",
      attachments: ["tax_invoice_jan.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Consulting Services",
      quantity: 1,
      unitPrice: 89500,
      cgst: 8055,
      sgst: 8055,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'pending',
      processedBy: "OCR Engine",
      lastModified: "2024-01-18T09:15:00Z"
    },
    {
      id: "pdf-2",
      invoiceNumber: "INV-2024-004",
      vendorName: "Digital Solutions Inc",
      vendorEmail: "billing@digitalsolutions.com",
      vendorGstin: "07DIGITAL1234567",
      amount: 156000,
      taxAmount: 28080,
      totalAmount: 184080,
      invoiceDate: "2024-01-18",
      dueDate: "2024-02-18",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_004.pdf",
      status: 'processed',
      processingDate: "2024-01-18T12:30:00Z",
      attachments: ["invoice_004.pdf", "terms_conditions.pdf"],
      paymentTerms: "Net 45",
      itemDescription: "Digital Marketing Services",
      quantity: 1,
      unitPrice: 156000,
      cgst: 14040,
      sgst: 14040,
      igst: 0,
      hasQrInEgam: true,
      egamStatus: 'found',
      validationStatus: 'valid',
      processedBy: "OCR Engine",
      lastModified: "2024-01-18T12:30:00Z"
    }
  ];
};

const fetchEmailData = (): ConsolidatedInvoice[] => {
  return [
    {
      id: "email-1",
      invoiceNumber: "BS-Q4-2023",
      vendorName: "Global Services Inc",
      vendorEmail: "vendor3@example.com",
      vendorGstin: "07GLOBAL1234567A",
      amount: 234750,
      taxAmount: 42255,
      totalAmount: 277005,
      invoiceDate: "2024-01-10",
      dueDate: "2024-02-10",
      source: 'email',
      sourceDetails: "Email Queue - Billing Statement Q4 2023",
      status: 'pending',
      processingDate: "2024-01-18T08:45:00Z",
      attachments: ["billing_q4.pdf", "payment_terms.pdf"],
      paymentTerms: "Net 45",
      itemDescription: "IT Infrastructure Services",
      quantity: 1,
      unitPrice: 234750,
      cgst: 21127.5,
      sgst: 21127.5,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'pending',
      validationStatus: 'pending',
      processedBy: "Email Processor",
      lastModified: "2024-01-18T08:45:00Z"
    },
    {
      id: "email-2",
      invoiceNumber: "CN-2024-001",
      vendorName: "Tech Solutions Ltd",
      vendorEmail: "vendor4@example.com",
      vendorGstin: "19TECH1234567A1B",
      amount: 15000,
      taxAmount: 2700,
      totalAmount: 17700,
      invoiceDate: "2024-01-12",
      dueDate: "2024-02-12",
      source: 'email',
      sourceDetails: "Email Queue - Credit Note CN-2024-001",
      status: 'processed',
      processingDate: "2024-01-18T07:20:00Z",
      attachments: ["credit_note_001.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Credit Note - Return",
      quantity: 1,
      unitPrice: 15000,
      cgst: 1350,
      sgst: 1350,
      igst: 0,
      hasQrInEgam: true,
      egamStatus: 'found',
      validationStatus: 'valid',
      processedBy: "Email Processor",
      lastModified: "2024-01-18T07:20:00Z"
    },
    {
      id: "email-3",
      invoiceNumber: "INV-2024-005",
      vendorName: "Cloud Services Ltd",
      vendorEmail: "billing@cloudservices.com",
      vendorGstin: "33CLOUD1234567A1",
      amount: 67800,
      taxAmount: 12204,
      totalAmount: 80004,
      invoiceDate: "2024-01-19",
      dueDate: "2024-02-19",
      source: 'email',
      sourceDetails: "Email Queue - Cloud Services Invoice",
      status: 'ready_for_review',
      processingDate: "2024-01-19T09:00:00Z",
      attachments: ["cloud_invoice_005.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Cloud Infrastructure Services",
      quantity: 1,
      unitPrice: 67800,
      cgst: 6102,
      sgst: 6102,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'pending',
      processedBy: "Email Processor",
      lastModified: "2024-01-19T09:00:00Z"
    }
  ];
};

// Consolidate all data from different sources
const consolidateAllData = (): ConsolidatedInvoice[] => {
  const qrData = fetchQRData();
  const pdfData = fetchPDFData();
  const emailData = fetchEmailData();
  
  return [...qrData, ...pdfData, ...emailData];
};

// Mock consolidated data - now dynamically generated
const mockConsolidatedInvoices: ConsolidatedInvoice[] = consolidateAllData();

export function InvoiceTracker() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("processingDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ConsolidatedInvoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [consolidatedData, setConsolidatedData] = useState<ConsolidatedInvoice[]>(mockConsolidatedInvoices);
  const { toast } = useToast();

  // Function to refresh data from all sources
  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API calls to fetch fresh data from all sources
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const freshData = consolidateAllData();
      setConsolidatedData(freshData);
      
      toast({
        title: "Data Refreshed",
        description: `Successfully fetched ${freshData.length} invoices from all sources`,
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to fetch fresh data from sources",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalInvoices = consolidatedData.length;
    const processedInvoices = consolidatedData.filter(inv => inv.status === 'processed').length;
    const pendingInvoices = consolidatedData.filter(inv => inv.status === 'pending').length;
    const errorInvoices = consolidatedData.filter(inv => inv.status === 'error').length;
    const readyForReview = consolidatedData.filter(inv => inv.status === 'ready_for_review').length;
    
    const totalAmount = consolidatedData.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalTaxAmount = consolidatedData.reduce((sum, inv) => sum + inv.taxAmount, 0);
    
    const qrInvoices = consolidatedData.filter(inv => inv.source === 'qr').length;
    const pdfInvoices = consolidatedData.filter(inv => inv.source === 'pdf').length;
    const emailInvoices = consolidatedData.filter(inv => inv.source === 'email').length;
    
    const validInvoices = consolidatedData.filter(inv => inv.validationStatus === 'valid').length;
    const egamFound = consolidatedData.filter(inv => inv.egamStatus === 'found').length;
    
    return {
      totalInvoices,
      processedInvoices,
      pendingInvoices,
      errorInvoices,
      readyForReview,
      totalAmount,
      totalTaxAmount,
      qrInvoices,
      pdfInvoices,
      emailInvoices,
      validInvoices,
      egamFound,
      processingRate: totalInvoices > 0 ? (processedInvoices / totalInvoices) * 100 : 0,
      validationRate: totalInvoices > 0 ? (validInvoices / totalInvoices) * 100 : 0,
      egamMatchRate: totalInvoices > 0 ? (egamFound / totalInvoices) * 100 : 0
    };
  }, [consolidatedData]);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'qr': return <QrCode className="h-4 w-4 text-blue-500" />;
      case 'pdf': return <Upload className="h-4 w-4 text-green-500" />;
      case 'email': return <Mail className="h-4 w-4 text-purple-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'qr': return 'QR';
      case 'pdf': return 'PDF';
      case 'email': return 'Email';
      default: return source;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Processed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'ready_for_review':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1"><Eye className="h-3 w-3" />Ready for Review</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"><XCircle className="h-3 w-3" />Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1"><AlertCircle className="h-3 w-3" />Unknown</Badge>;
    }
  };

  const getValidationBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Valid</Badge>;
      case 'invalid':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Invalid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    }
  };

  const getEgamBadge = (status: string) => {
    switch (status) {
      case 'found':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Found</Badge>;
      case 'not_found':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Not Found</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    }
  };

  const filterInvoices = (invoices: ConsolidatedInvoice[], source: string, status: string, dateRange: string) => {
    let filtered = invoices;

    // Source filter
    if (source !== 'all') {
      filtered = filtered.filter(inv => inv.source === source);
    }

    // Status filter
    if (status !== 'all') {
      filtered = filtered.filter(inv => inv.status === status);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(inv => {
        const invoiceDate = new Date(inv.invoiceDate);
        switch (dateRange) {
          case 'today':
            return invoiceDate >= today;
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return invoiceDate >= yesterday && invoiceDate < today;
          case 'last7days':
            const last7Days = new Date(today);
            last7Days.setDate(last7Days.getDate() - 7);
            return invoiceDate >= last7Days;
          case 'last30days':
            const last30Days = new Date(today);
            last30Days.setDate(last30Days.getDate() - 30);
            return invoiceDate >= last30Days;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const searchInvoices = (invoices: ConsolidatedInvoice[], query: string) => {
    if (!query.trim()) return invoices;
    
    const searchTerm = query.toLowerCase();
    return invoices.filter(inv => 
      inv.invoiceNumber.toLowerCase().includes(searchTerm) ||
      inv.vendorName.toLowerCase().includes(searchTerm) ||
      inv.vendorEmail.toLowerCase().includes(searchTerm) ||
      inv.vendorGstin.toLowerCase().includes(searchTerm) ||
      inv.itemDescription.toLowerCase().includes(searchTerm)
    );
  };

  const sortInvoices = (invoices: ConsolidatedInvoice[], field: string, direction: "asc" | "desc") => {
    return [...invoices].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (field) {
        case 'invoiceNumber':
          aValue = a.invoiceNumber.toLowerCase();
          bValue = b.invoiceNumber.toLowerCase();
          break;
        case 'vendorName':
          aValue = a.vendorName.toLowerCase();
          bValue = b.vendorName.toLowerCase();
          break;
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'invoiceDate':
          aValue = new Date(a.invoiceDate).getTime();
          bValue = new Date(b.invoiceDate).getTime();
          break;
        case 'processingDate':
          aValue = new Date(a.processingDate).getTime();
          bValue = new Date(b.processingDate).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredInvoices = useMemo(() => {
    let invoices = filterInvoices(consolidatedData, sourceFilter, statusFilter, dateRange);
    invoices = searchInvoices(invoices, searchQuery);
    invoices = sortInvoices(invoices, sortField, sortDirection);
    return invoices;
  }, [consolidatedData, searchQuery, sourceFilter, statusFilter, dateRange, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-blue-500" /> : 
      <ArrowDown className="h-4 w-4 text-blue-500" />;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSourceFilter("all");
    setStatusFilter("all");
    setDateRange("all");
    setSortField("processingDate");
    setSortDirection("desc");
  };

  const hasActiveFilters = searchQuery || sourceFilter !== "all" || statusFilter !== "all" || dateRange !== "all";

  const handleInvoiceClick = (invoice: ConsolidatedInvoice) => {
    // Don't open modal for QR invoices with error status and EGAM not found
    if (invoice.source === 'qr' && invoice.status === 'error' && invoice.egamStatus === 'not_found') {
      return;
    }
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="w-full space-y-8" data-testid="invoice-tracker">
      {/* Summary Metrics - Single Row */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="modern-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Invoices</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{summaryMetrics.totalInvoices}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 dark:text-green-400">+12.5%</span>
                </div>
              </div>
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <FileText className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">QR Scanned</p>
                <p className="text-xl font-bold text-blue-600">{summaryMetrics.qrInvoices}</p>
                <p className="text-xs text-gray-500">QR Processing</p>
              </div>
              <QrCode className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">PDF Uploaded</p>
                <p className="text-xl font-bold text-green-600">{summaryMetrics.pdfInvoices}</p>
                <p className="text-xs text-gray-500">OCR Processing</p>
              </div>
              <Upload className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Email Processed</p>
                <p className="text-xl font-bold text-purple-600">{summaryMetrics.emailInvoices}</p>
                <p className="text-xs text-gray-500">Email Queue</p>
              </div>
              <Mail className="h-5 w-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Invoice Table */}
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="modern-card-title">
                Consolidated Invoice Tracker
              </CardTitle>
              <p className="modern-card-subtitle">
                All invoices from QR Scanner, PDF Upload, and Email Queue
                {hasActiveFilters && (
                  <span className="ml-2 text-blue-600 font-medium">
                    ({filteredInvoices.length} of {consolidatedData.length} invoices)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={refreshAllData}
                disabled={isRefreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    !
                  </Badge>
                )}
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className={`space-y-4 transition-all duration-300 ${showFilters ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Source Filter */}
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="qr">QR Scanner</SelectItem>
                  <SelectItem value="pdf">PDF Upload</SelectItem>
                  <SelectItem value="email">Email Queue</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ready_for_review">Ready for Review</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Filter */}
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </Button>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50">
                  <TableHead className="font-semibold text-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('invoiceNumber')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Invoice #
                      {getSortIcon('invoiceNumber')}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">Source</TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('totalAmount')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Amount
                      {getSortIcon('totalAmount')}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('invoiceDate')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Invoice Date
                      {getSortIcon('invoiceDate')}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">EGAM</TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('processingDate')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Processed
                      {getSortIcon('processingDate')}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow 
                    key={invoice.id} 
                    className={`table-row-hover ${
                      !(invoice.source === 'qr' && invoice.status === 'error' && invoice.egamStatus === 'not_found') 
                        ? 'cursor-pointer' 
                        : 'cursor-default opacity-60'
                    }`}
                    onClick={() => handleInvoiceClick(invoice)}
                  >
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(invoice.source)}
                        <span className="text-sm">{getSourceLabel(invoice.source)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(invoice.totalAmount)}</p>
                        <p className="text-sm text-gray-500">Tax: {formatCurrency(invoice.taxAmount)}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{formatDateTime(invoice.invoiceDate)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>{getEgamBadge(invoice.egamStatus)}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(invoice.processingDate)}</TableCell>
                    <TableCell>
                      {!(invoice.source === 'qr' && invoice.status === 'error' && invoice.egamStatus === 'not_found') && (
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                      No invoices found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedInvoice?.source === 'qr' && selectedInvoice?.status === 'processed' ? (
                <>
                  <QrCode className="h-5 w-5" />
                  <span>QR Code Details - {selectedInvoice?.invoiceNumber}</span>
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  <span>Invoice Details - {selectedInvoice?.invoiceNumber}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              {selectedInvoice.source === 'qr' && selectedInvoice.status === 'processed' ? (
                // QR Code Details View
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* QR Extracted Data */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <QrCode className="h-5 w-5" />
                        <span>QR Extracted Data</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">IRN</label>
                        <Input 
                          value={selectedInvoice.irn || selectedInvoice.qrCode || ''} 
                          readOnly 
                          className="font-mono text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Invoice No</label>
                          <p className="text-sm font-mono">{selectedInvoice.invoiceNumber}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Date</label>
                          <p className="text-sm">{formatDateTime(selectedInvoice.invoiceDate)}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedInvoice.totalAmount)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">GSTIN</label>
                          <p className="text-sm font-mono">{selectedInvoice.vendorGstin}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Buyer GSTIN</label>
                          <p className="text-sm font-mono">29XYZAB5678P1Q2</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Invoice Type</label>
                        <p className="text-sm">B2B</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* EGAM Additional Data */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {selectedInvoice.egamStatus === 'found' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span>EGAM Additional Data</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {selectedInvoice.egamStatus === 'found' ? (
                        <>
                          {/* Invoice & Tax Details */}
                          <div>
                            <h4 className="font-semibold text-sm mb-3">INVOICE & TAX DETAILS</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Invoice Status</span>
                                <span className="text-sm font-medium text-green-600">Verified</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Tax Amount</span>
                                <span className="text-sm font-medium">{formatCurrency(selectedInvoice.taxAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">CGST</span>
                                <span className="text-sm font-medium">{formatCurrency(selectedInvoice.cgst)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">SGST</span>
                                <span className="text-sm font-medium">{formatCurrency(selectedInvoice.sgst)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">IGST</span>
                                <span className="text-sm font-medium">{formatCurrency(selectedInvoice.igst)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">CESS</span>
                                <span className="text-sm font-medium">{formatCurrency(1250)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Payment Status</span>
                                <span className="text-sm font-medium text-orange-600">Pending</span>
                              </div>
                            </div>
                          </div>

                          {/* Vendor Information */}
                          <div>
                            <h4 className="font-semibold text-sm mb-3">VENDOR INFORMATION</h4>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm text-muted-foreground">Name: </span>
                                <span className="text-sm font-medium">{selectedInvoice.vendorName}</span>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Address: </span>
                                <span className="text-sm">123 Business Park, Mumbai, Maharashtra 400001</span>
                              </div>
                            </div>
                          </div>

                          {/* Buyer Information */}
                          <div>
                            <h4 className="font-semibold text-sm mb-3">BUYER INFORMATION</h4>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm text-muted-foreground">Name: </span>
                                <span className="text-sm font-medium">XYZ Corporation Ltd</span>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Address: </span>
                                <span className="text-sm">456 Corporate Plaza, Delhi, Delhi 110001</span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        // EGAM Not Found
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <XCircle className="h-16 w-16 text-red-500 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">EGAM Data Not Found</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            The invoice data could not be found in the EGAM system.
                          </p>
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 w-full">
                            <div className="flex items-center space-x-2">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-800 dark:text-red-200">
                                Status: Not Found
                              </span>
                            </div>
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              This invoice may need manual verification or the data may not be available in EGAM.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                // Standard Invoice Details View
                <div className="space-y-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Invoice Number</label>
                        <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Source</label>
                        <div className="flex items-center space-x-2">
                          {getSourceIcon(selectedInvoice.source)}
                          <span className="text-sm">{getSourceLabel(selectedInvoice.source)}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Invoice Date</label>
                        <p>{formatDateTime(selectedInvoice.invoiceDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                        <p>{formatDateTime(selectedInvoice.dueDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <div>{getStatusBadge(selectedInvoice.status)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Processing Date</label>
                        <p>{formatDateTime(selectedInvoice.processingDate)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vendor Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Vendor Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Vendor Name</label>
                        <p className="font-medium">{selectedInvoice.vendorName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p>{selectedInvoice.vendorEmail}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">GSTIN</label>
                        <p className="font-mono">{selectedInvoice.vendorGstin}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Payment Terms</label>
                        <p>{selectedInvoice.paymentTerms}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financial Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Financial Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Base Amount</label>
                        <p className="font-medium text-lg">{formatCurrency(selectedInvoice.amount)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Tax Amount</label>
                        <p className="font-medium text-lg">{formatCurrency(selectedInvoice.taxAmount)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                        <p className="font-bold text-xl text-green-600">{formatCurrency(selectedInvoice.totalAmount)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Item Description</label>
                        <p>{selectedInvoice.itemDescription}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Validation & Processing */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Validation & Processing</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Validation Status</label>
                        <div>{getValidationBadge(selectedInvoice.validationStatus)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">EGAM Status</label>
                        <div>{getEgamBadge(selectedInvoice.egamStatus)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Processed By</label>
                        <p>{selectedInvoice.processedBy}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Last Modified</label>
                        <p>{formatDateTime(selectedInvoice.lastModified)}</p>
                      </div>
                      {selectedInvoice.errorMessage && (
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">Error Message</label>
                          <p className="text-red-600 text-sm">{selectedInvoice.errorMessage}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
