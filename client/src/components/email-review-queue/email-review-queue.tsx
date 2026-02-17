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
  Mail, 
  Download, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Paperclip,
  Search,
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar
} from "lucide-react";
import { formatDateTime, statusBadgeConfig } from "@/lib/utils";
import { exportEmailDataToExcel } from "@/lib/excel-export";

interface EmailRecord {
  id: string;
  sender: string;
  subject: string;
  receivedAt: string;
  attachments: string[];
  processingStatus: 'queued' | 'in_progress' | 'ready_for_review';
  invoiceType: 'with_qr' | 'without_qr';
  hasQrInEgam: boolean;
  invoiceNo?: string;
  amount?: string;
  vendorName?: string;
}

interface MailboxInfo {
  name: string;
  totalEmails: number;
  processedEmails: number;
  pendingEmails: number;
}

const mockMailboxInfo: MailboxInfo = {
  name: "invoices@company.com",
  totalEmails: 10,
  processedEmails: 2,
  pendingEmails: 8
};

const mockEmailRecords: EmailRecord[] = [
  {
    id: "1",
    sender: "vendor1@example.com",
    subject: "Invoice INV-2024-001",
    receivedAt: "2024-01-18T10:30:00Z",
    attachments: ["invoice_001.pdf", "supporting_doc.pdf"],
    processingStatus: "ready_for_review",
    invoiceType: "with_qr",
    hasQrInEgam: true,
    invoiceNo: "INV-2024-001",
    amount: "₹125,000.00",
    vendorName: "ABC Technologies Pvt Ltd"
  },
  {
    id: "2",
    sender: "vendor2@example.com",
    subject: "Tax Invoice - January 2024",
    receivedAt: "2024-01-18T09:15:00Z",
    attachments: ["tax_invoice_jan.pdf"],
    processingStatus: "ready_for_review",
    invoiceType: "without_qr",
    hasQrInEgam: false,
    invoiceNo: "TI-2024-002",
    amount: "₹89,500.00",
    vendorName: "XYZ Corporation Ltd"
  },
  {
    id: "3",
    sender: "vendor3@example.com",
    subject: "GST Invoice INV-2024-003",
    receivedAt: "2024-01-18T08:45:00Z",
    attachments: ["gst_invoice_003.pdf", "payment_terms.pdf"],
    processingStatus: "ready_for_review",
    invoiceType: "with_qr",
    hasQrInEgam: true,
    invoiceNo: "INV-2024-003",
    amount: "₹234,750.00",
    vendorName: "Global Services Inc"
  },
  {
    id: "4",
    sender: "vendor4@example.com",
    subject: "Invoice INV-2024-004",
    receivedAt: "2024-01-18T07:20:00Z",
    attachments: ["invoice_004.pdf"],
    processingStatus: "ready_for_review",
    invoiceType: "without_qr",
    hasQrInEgam: true,
    invoiceNo: "INV-2024-004",
    amount: "₹156,200.00",
    vendorName: "Tech Solutions Ltd"
  },
  {
    id: "5",
    sender: "vendor5@example.com",
    subject: "Tax Invoice INV-2024-005",
    receivedAt: "2024-01-18T06:30:00Z",
    attachments: ["tax_invoice_005.pdf"],
    processingStatus: "ready_for_review",
    invoiceType: "with_qr",
    hasQrInEgam: false,
    invoiceNo: "INV-2024-005",
    amount: "₹78,900.00",
    vendorName: "Logistics Pro Ltd"
  },
  {
    id: "6",
    sender: "vendor6@example.com",
    subject: "GST Invoice INV-2024-006",
    receivedAt: "2024-01-18T05:45:00Z",
    attachments: ["gst_invoice_006.pdf"],
    processingStatus: "ready_for_review",
    invoiceType: "without_qr",
    hasQrInEgam: false,
    invoiceNo: "INV-2024-006",
    amount: "₹345,600.00",
    vendorName: "Manufacturing Co Ltd"
  },
  {
    id: "7",
    sender: "vendor7@example.com",
    subject: "Invoice INV-2024-007",
    receivedAt: "2024-01-18T04:20:00Z",
    attachments: ["invoice_007.pdf", "supporting_docs.pdf"],
    processingStatus: "ready_for_review",
    invoiceType: "with_qr",
    hasQrInEgam: true,
    invoiceNo: "INV-2024-007",
    amount: "₹198,750.00",
    vendorName: "Software Solutions Pvt Ltd"
  },
  {
    id: "8",
    sender: "vendor8@example.com",
    subject: "Tax Invoice INV-2024-008",
    receivedAt: "2024-01-18T03:15:00Z",
    attachments: ["tax_invoice_008.pdf"],
    processingStatus: "ready_for_review",
    invoiceType: "without_qr",
    hasQrInEgam: true,
    invoiceNo: "INV-2024-008",
    amount: "₹267,300.00",
    vendorName: "Digital Services Ltd"
  },
  {
    id: "9",
    sender: "vendor9@example.com",
    subject: "GST Invoice INV-2024-009",
    receivedAt: "2024-01-18T02:30:00Z",
    attachments: ["gst_invoice_009.pdf"],
    processingStatus: "in_progress",
    invoiceType: "with_qr",
    hasQrInEgam: false,
    invoiceNo: "INV-2024-009",
    amount: "₹89,400.00",
    vendorName: "Consulting Firm Ltd"
  },
  {
    id: "10",
    sender: "vendor10@example.com",
    subject: "Invoice INV-2024-010",
    receivedAt: "2024-01-18T01:45:00Z",
    attachments: ["invoice_010.pdf"],
    processingStatus: "queued",
    invoiceType: "without_qr",
    hasQrInEgam: false,
    invoiceNo: "INV-2024-010",
    amount: "₹445,800.00",
    vendorName: "Engineering Solutions Inc"
  }
];

export function EmailReviewQueue() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedEmail, setSelectedEmail] = useState<EmailRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const { toast } = useToast();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("receivedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  const getStatusBadge = (status: EmailRecord['processingStatus']) => {
    if (status === 'queued') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Queued
        </Badge>
      );
    }
    
    if (status === 'in_progress') {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          In Progress
        </Badge>
      );
    }
    
    if (status === 'ready_for_review') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Ready for Review
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Unknown
      </Badge>
    );
  };

  const getStatusIcon = (status: EmailRecord['processingStatus']) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'ready_for_review':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const filterEmails = (emails: EmailRecord[], tab: string) => {
    switch (tab) {
      case 'with_qr_egam':
        return emails.filter(email => email.invoiceType === 'with_qr' && email.hasQrInEgam);
      case 'without_qr_egam':
        return emails.filter(email => email.invoiceType === 'without_qr' && email.hasQrInEgam);
      case 'with_qr_not_found':
        return emails.filter(email => email.invoiceType === 'with_qr' && !email.hasQrInEgam);
      case 'without_qr_not_found':
        return emails.filter(email => email.invoiceType === 'without_qr' && !email.hasQrInEgam);
      default:
        return emails;
    }
  };

  const getDateRangeFilter = (dateRange: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateRange) {
      case 'today':
        return (email: EmailRecord) => {
          const emailDate = new Date(email.receivedAt);
          return emailDate >= today;
        };
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return (email: EmailRecord) => {
          const emailDate = new Date(email.receivedAt);
          return emailDate >= yesterday && emailDate < today;
        };
      case 'last7days':
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        return (email: EmailRecord) => {
          const emailDate = new Date(email.receivedAt);
          return emailDate >= last7Days;
        };
      case 'last30days':
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        return (email: EmailRecord) => {
          const emailDate = new Date(email.receivedAt);
          return emailDate >= last30Days;
        };
      default:
        return () => true;
    }
  };

  const searchEmails = (emails: EmailRecord[], query: string) => {
    if (!query.trim()) return emails;
    
    const searchTerm = query.toLowerCase();
    return emails.filter(email => 
      email.sender.toLowerCase().includes(searchTerm) ||
      email.subject.toLowerCase().includes(searchTerm) ||
      email.invoiceNo?.toLowerCase().includes(searchTerm) ||
      email.vendorName?.toLowerCase().includes(searchTerm) ||
      email.amount?.toLowerCase().includes(searchTerm)
    );
  };

  const sortEmails = (emails: EmailRecord[], field: string, direction: "asc" | "desc") => {
    return [...emails].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (field) {
        case 'sender':
          aValue = a.sender.toLowerCase();
          bValue = b.sender.toLowerCase();
          break;
        case 'subject':
          aValue = a.subject.toLowerCase();
          bValue = b.subject.toLowerCase();
          break;
        case 'receivedAt':
          aValue = new Date(a.receivedAt).getTime();
          bValue = new Date(b.receivedAt).getTime();
          break;
        case 'processingStatus':
          aValue = a.processingStatus;
          bValue = b.processingStatus;
          break;
        case 'invoiceNo':
          aValue = a.invoiceNo || '';
          bValue = b.invoiceNo || '';
          break;
        case 'amount':
          aValue = parseFloat(a.amount?.replace(/[₹,]/g, '') || '0');
          bValue = parseFloat(b.amount?.replace(/[₹,]/g, '') || '0');
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredEmails = useMemo(() => {
    let emails = filterEmails(mockEmailRecords, selectedTab);
    
    // Apply search filter
    emails = searchEmails(emails, searchQuery);
    
    // Apply status filter
    if (statusFilter !== 'all') {
      emails = emails.filter(email => email.processingStatus === statusFilter);
    }
    
    // Apply date range filter
    const dateFilter = getDateRangeFilter(dateRange);
    emails = emails.filter(dateFilter);
    
    // Apply sorting
    emails = sortEmails(emails, sortField, sortDirection);
    
    return emails;
  }, [selectedTab, searchQuery, statusFilter, dateRange, sortField, sortDirection]);

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
    setStatusFilter("all");
    setDateRange("all");
    setSortField("receivedAt");
    setSortDirection("desc");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || dateRange !== "all";

  const handleEmailClick = (email: EmailRecord) => {
    if (email.processingStatus === 'ready_for_review') {
      setSelectedEmail(email);
      setCurrentEmailIndex(filteredEmails.findIndex(e => e.id === email.id));
      setIsModalOpen(true);
    }
  };

  const handleNextEmail = () => {
    const readyForReviewEmails = filteredEmails.filter(email => email.processingStatus === 'ready_for_review');
    const currentIndex = readyForReviewEmails.findIndex(email => email.id === selectedEmail?.id);
    const nextIndex = (currentIndex + 1) % readyForReviewEmails.length;
    setSelectedEmail(readyForReviewEmails[nextIndex]);
    setCurrentEmailIndex(filteredEmails.findIndex(e => e.id === readyForReviewEmails[nextIndex].id));
  };

  const handlePreviousEmail = () => {
    const readyForReviewEmails = filteredEmails.filter(email => email.processingStatus === 'ready_for_review');
    const currentIndex = readyForReviewEmails.findIndex(email => email.id === selectedEmail?.id);
    const prevIndex = currentIndex === 0 ? readyForReviewEmails.length - 1 : currentIndex - 1;
    setSelectedEmail(readyForReviewEmails[prevIndex]);
    setCurrentEmailIndex(filteredEmails.findIndex(e => e.id === readyForReviewEmails[prevIndex].id));
  };

  const getTabDisplayName = (tab: string) => {
    const tabNames: { [key: string]: string } = {
      'all': 'All Emails',
      'with_qr_egam': 'EGAM with QR',
      'without_qr_egam': 'EGAM without QR',
      'with_qr_not_found': 'QR not in EGAM',
      'without_qr_not_found': 'No QR not in EGAM'
    };
    return tabNames[tab] || tab;
  };

  const handleExport = () => {
    const exportData = filteredEmails.map(email => ({
      sender: email.sender,
      subject: email.subject,
      receivedAt: formatDateTime(email.receivedAt),
      attachments: email.attachments.join(', '),
      processingStatus: email.processingStatus,
      invoiceType: email.invoiceType,
      hasQrInEgam: email.hasQrInEgam ? 'Yes' : 'No',
      invoiceNo: email.invoiceNo || '-',
      amount: email.amount || '-',
      vendorName: email.vendorName || '-'
    }));

    const fileName = `${getTabDisplayName(selectedTab).replace(/\s+/g, '_').toLowerCase()}_emails`;
    const success = exportEmailDataToExcel(exportData, fileName);
    if (success) {
      toast({
        title: "Export Successful",
        description: `${getTabDisplayName(selectedTab)} data exported to Excel successfully!`,
      });
    } else {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-6" data-testid="email-review-queue">
      {/* Email Review Queue - Main View */}
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="modern-card-title">
                Email Review Queue
              </CardTitle>
              <p className="modern-card-subtitle">
                Processing emails from: <span className="font-medium">{mockMailboxInfo.name}</span>
              </p>
            </div>
            <div className="flex space-x-4 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{mockMailboxInfo.totalEmails}</p>
                <p className="text-muted-foreground">Total Emails</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{mockMailboxInfo.processedEmails}</p>
                <p className="text-muted-foreground">Processed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{mockMailboxInfo.pendingEmails}</p>
                <p className="text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Email Processing Status Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Email Processing Status</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getTabDisplayName(selectedTab)} ({filteredEmails.length} emails)
                    {hasActiveFilters && (
                      <span className="ml-2 text-blue-600 font-medium">
                        (filtered from {mockEmailRecords.length})
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
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
                    onClick={handleExport} 
                    className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={filteredEmails.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export {getTabDisplayName(selectedTab)}
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className={`space-y-4 transition-all duration-300 ${showFilters ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search emails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="queued">Queued</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="ready_for_review">Ready for Review</SelectItem>
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
                    <span>Clear Filters</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-5 gap-1 p-1 bg-muted/50">
              <TabsTrigger 
                value="all" 
                className="text-xs px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All Emails
              </TabsTrigger>
              <TabsTrigger 
                value="with_qr_egam" 
                className="text-xs px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                EGAM with QR
              </TabsTrigger>
              <TabsTrigger 
                value="without_qr_egam" 
                className="text-xs px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                EGAM without QR
              </TabsTrigger>
              <TabsTrigger 
                value="with_qr_not_found" 
                className="text-xs px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                QR not in EGAM
              </TabsTrigger>
              <TabsTrigger 
                value="without_qr_not_found" 
                className="text-xs px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                No QR not in EGAM
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/50">
                      <TableHead className="font-semibold text-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('processingStatus')}
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                        >
                          Status
                          {getSortIcon('processingStatus')}
                        </Button>
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('sender')}
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                        >
                          Sender
                          {getSortIcon('sender')}
                        </Button>
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('subject')}
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                        >
                          Subject
                          {getSortIcon('subject')}
                        </Button>
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">Attachments</TableHead>
                      <TableHead className="font-semibold text-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('receivedAt')}
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                        >
                          Received At
                          {getSortIcon('receivedAt')}
                        </Button>
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('invoiceNo')}
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                        >
                          Invoice Details
                          {getSortIcon('invoiceNo')}
                        </Button>
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmails.map((email) => (
                      <TableRow 
                        key={email.id} 
                        className={`table-row-hover ${email.processingStatus === 'ready_for_review' ? 'cursor-pointer' : ''}`}
                        onClick={() => handleEmailClick(email)}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(email.processingStatus)}
                            {getStatusBadge(email.processingStatus)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{email.sender}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{email.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Paperclip className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{email.attachments.length} files</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDateTime(email.receivedAt)}
                        </TableCell>
                        <TableCell>
                          {email.invoiceNo && (
                            <div className="text-sm">
                              <p className="font-medium">{email.invoiceNo}</p>
                              <p className="text-gray-600">{email.amount}</p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {email.processingStatus === 'ready_for_review' && (
                            <Button size="sm" variant="outline">
                              <Eye className="mr-2 h-4 w-4" />
                              Review
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredEmails.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                          No emails found for this category
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="modal-content max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="modal-title">
                Email Review - {selectedEmail?.subject}
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousEmail}
                  disabled={filteredEmails.filter(e => e.processingStatus === 'ready_for_review').length <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextEmail}
                  disabled={filteredEmails.filter(e => e.processingStatus === 'ready_for_review').length <= 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {selectedEmail && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              {/* PDF Preview - Reusing PDF Upload component structure */}
              <Card>
                <CardHeader>
                  <CardTitle>Document Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg bg-white shadow-sm min-h-[400px] overflow-hidden">
                    {/* PDF Header */}
                    <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">{selectedEmail.attachments[0]}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        From: {selectedEmail.sender}
                      </div>
                    </div>
                    
                    {/* PDF Content - Similar to PDF Upload component */}
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
                            <p className="font-medium">{selectedEmail.vendorName || 'Vendor Name'}</p>
                            <p>123 Business Park, Mumbai, Maharashtra 400001</p>
                            <p>GSTIN: {
                              selectedEmail.id === "1" && "27ABCDE1234F1Z5"
                              || selectedEmail.id === "2" && "29XYZAB5678P1Q2"
                              || selectedEmail.id === "3" && "07PQRST9012M3N4"
                              || selectedEmail.id === "4" && "19LMNOP3456R7S8"
                              || selectedEmail.id === "5" && "33UVWXY7890Z1A2"
                              || selectedEmail.id === "6" && "12BCDEF4567G8H9"
                              || selectedEmail.id === "7" && "06IJKLM0123N4O5"
                              || selectedEmail.id === "8" && "24PQRST5678U9V0"
                              || selectedEmail.id === "9" && "35STUVW3456X7Y8"
                              || selectedEmail.id === "10" && "18MNOPQ7890R1S2"
                              || "27ABCDE1234F1Z5"
                            }</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-gray-700 mb-2">Invoice Details:</h3>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p><span className="font-medium">Invoice No:</span> {selectedEmail.invoiceNo || 'INV-2024-001'}</p>
                            <p><span className="font-medium">Date:</span> 2024-01-15</p>
                            <p><span className="font-medium">IRN:</span> {
                              selectedEmail.id === "1" && "1a2b3c4d5e6f7g8h9i0j1k2l3m4n"
                              || selectedEmail.id === "2" && "2b3c4d5e6f7g8h9i0j1k2l3m4n5o"
                              || selectedEmail.id === "3" && "3c4d5e6f7g8h9i0j1k2l3m4n5o6p"
                              || selectedEmail.id === "4" && "4d5e6f7g8h9i0j1k2l3m4n5o6p7q"
                              || selectedEmail.id === "5" && "5e6f7g8h9i0j1k2l3m4n5o6p7q8r"
                              || selectedEmail.id === "6" && "6f7g8h9i0j1k2l3m4n5o6p7q8r9s"
                              || selectedEmail.id === "7" && "7g8h9i0j1k2l3m4n5o6p7q8r9s0t"
                              || selectedEmail.id === "8" && "8h9i0j1k2l3m4n5o6p7q8r9s0t1u"
                              || selectedEmail.id === "9" && "9i0j1k2l3m4n5o6p7q8r9s0t1u2v"
                              || selectedEmail.id === "10" && "0j1k2l3m4n5o6p7q8r9s0t1u2v3w"
                              || "1a2b3c4d5e6f7g8h9i0j1k2l3m4n"
                            }</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bill To */}
                      <div>
                        <h3 className="font-semibold text-sm text-gray-700 mb-2">Bill To:</h3>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p className="font-medium">Company Name Ltd</p>
                          <p>456 Corporate Plaza, Delhi, Delhi 110001</p>
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
                              <td className="p-2 border-r border-b">Software Development Services</td>
                              <td className="p-2 border-r border-b text-center">1</td>
                              <td className="p-2 border-r border-b text-right">₹125,000.00</td>
                              <td className="p-2 border-b text-right">{selectedEmail.amount || '₹125,000.00'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Tax Details */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <p><span className="font-medium">CGST (9%):</span> ₹11,250.00</p>
                          <p><span className="font-medium">SGST (9%):</span> ₹11,250.00</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">Total: {selectedEmail.amount || '₹125,000.00'}</p>
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className="text-center text-xs text-gray-500 pt-4 border-t">
                        <p>Thank you for your business!</p>
                        <p className="mt-1">Payment Terms: Net 30</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form Data - Similar to PDF Upload component */}
              <Card>
                <CardHeader>
                  <CardTitle>Document Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">Basic Information</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Invoice No</label>
                        <div className="p-2 bg-gray-50 rounded text-sm">{selectedEmail.invoiceNo || 'INV-2024-001'}</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <div className="p-2 bg-gray-50 rounded text-sm">2024-01-15</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">IRN</label>
                        <div className="p-2 bg-gray-50 rounded text-xs font-mono">
                          {selectedEmail.id === "1" && "1a2b3c4d5e6f7g8h9i0j1k2l3m4n"}
                          {selectedEmail.id === "2" && "2b3c4d5e6f7g8h9i0j1k2l3m4n5o"}
                          {selectedEmail.id === "3" && "3c4d5e6f7g8h9i0j1k2l3m4n5o6p"}
                          {selectedEmail.id === "4" && "4d5e6f7g8h9i0j1k2l3m4n5o6p7q"}
                          {selectedEmail.id === "5" && "5e6f7g8h9i0j1k2l3m4n5o6p7q8r"}
                          {selectedEmail.id === "6" && "6f7g8h9i0j1k2l3m4n5o6p7q8r9s"}
                          {selectedEmail.id === "7" && "7g8h9i0j1k2l3m4n5o6p7q8r9s0t"}
                          {selectedEmail.id === "8" && "8h9i0j1k2l3m4n5o6p7q8r9s0t1u"}
                          {selectedEmail.id === "9" && "9i0j1k2l3m4n5o6p7q8r9s0t1u2v"}
                          {selectedEmail.id === "10" && "0j1k2l3m4n5o6p7q8r9s0t1u2v3w"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">GSTIN</label>
                        <div className="p-2 bg-gray-50 rounded text-sm">
                          {selectedEmail.id === "1" && "27ABCDE1234F1Z5"}
                          {selectedEmail.id === "2" && "29XYZAB5678P1Q2"}
                          {selectedEmail.id === "3" && "07PQRST9012M3N4"}
                          {selectedEmail.id === "4" && "19LMNOP3456R7S8"}
                          {selectedEmail.id === "5" && "33UVWXY7890Z1A2"}
                          {selectedEmail.id === "6" && "12BCDEF4567G8H9"}
                          {selectedEmail.id === "7" && "06IJKLM0123N4O5"}
                          {selectedEmail.id === "8" && "24PQRST5678U9V0"}
                          {selectedEmail.id === "9" && "35STUVW3456X7Y8"}
                          {selectedEmail.id === "10" && "18MNOPQ7890R1S2"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vendor & Buyer Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">Parties</h4>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vendor Name</label>
                      <div className="p-2 bg-gray-50 rounded text-sm">{selectedEmail.vendorName || 'Vendor Name'}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vendor Address</label>
                      <div className="p-2 bg-gray-50 rounded text-sm">123 Business Park, Mumbai, Maharashtra 400001</div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Buyer Name</label>
                      <div className="p-2 bg-gray-50 rounded text-sm">Company Name Ltd</div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Buyer Address</label>
                      <div className="p-2 bg-gray-50 rounded text-sm">456 Corporate Plaza, Delhi, Delhi 110001</div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">Financial Details</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
                        <div className="p-2 bg-gray-50 rounded text-sm">{selectedEmail.amount || '₹125,000.00'}</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tax Amount</label>
                        <div className="p-2 bg-gray-50 rounded text-sm">₹22,500.00</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Payment Terms</label>
                        <div className="p-2 bg-gray-50 rounded text-sm">Net 30</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Due Date</label>
                        <div className="p-2 bg-gray-50 rounded text-sm">2024-02-15</div>
                      </div>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">Item Details</h4>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Item Description</label>
                      <div className="p-2 bg-gray-50 rounded text-sm">Software Development Services</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Quantity</label>
                        <div className="p-2 bg-gray-50 rounded text-sm">1</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Unit Price</label>
                        <div className="p-2 bg-gray-50 rounded text-sm">₹125,000.00</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
