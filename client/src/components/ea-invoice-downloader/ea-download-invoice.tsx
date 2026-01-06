import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { Receipt, Download, Loader2, Ticket, Search, FileText, CheckCircle2, Info, Sparkles, Plane, FileMinus, FilePlus, Calendar as CalendarIcon, Building2 } from "lucide-react";
import { EARaiseTicketModal } from "./ea-raise-ticket-modal";
import { DownloadConfirmationModal } from "./download-confirmation-modal";
import { DownloadProgressBar, DownloadItem } from "./download-progress-bar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Document type detection based on filename or ID
type DocumentType = 'invoice' | 'credit_note' | 'debit_note';

const getDocumentType = (filename: string): DocumentType => {
  const lower = filename.toLowerCase();
  if (lower.includes('credit') || lower.includes('cn_')) return 'credit_note';
  if (lower.includes('debit') || lower.includes('dn_')) return 'debit_note';
  return 'invoice';
};

const getDocumentTypeLabel = (type: DocumentType) => {
  switch (type) {
    case 'credit_note': return 'Credit Note';
    case 'debit_note': return 'Debit Note';
    default: return 'Invoice';
  }
};

const getDocumentTypeIcon = (type: DocumentType) => {
  switch (type) {
    case 'credit_note': return FileMinus;
    case 'debit_note': return FilePlus;
    default: return Receipt;
  }
};

interface EADownloadInvoiceProps {
  isAgent?: boolean;
}

export function EADownloadInvoice({ isAgent = false }: EADownloadInvoiceProps) {
  const [isRaiseTicketOpen, setIsRaiseTicketOpen] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const [pnr, setPnr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documentFound, setDocumentFound] = useState(false);
  const [documentFileName, setDocumentFileName] = useState("");
  const [foundDocument, setFoundDocument] = useState<any>(null);
  
  // Agent-specific state
  const [agentGstn, setAgentGstn] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [isAgentFetching, setIsAgentFetching] = useState(false);
  const [dateRangeError, setDateRangeError] = useState("");
  const [invoiceCounts, setInvoiceCounts] = useState<{
    invoices: { count: number; totalFiles: number; totalSize: string; estimatedTime: string };
    creditNotes: { count: number; totalFiles: number; totalSize: string; estimatedTime: string };
    debitNotes: { count: number; totalFiles: number; totalSize: string; estimatedTime: string };
  } | null>(null);
  
  // Download state
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    documentType: 'invoices' | 'creditNotes' | 'debitNotes';
  }>({ open: false, documentType: 'invoices' });
  const downloadIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const { toast } = useToast();
  
  // Extract invoice ID from document - use documentId if available, otherwise extract from filename
  const getInvoiceId = () => {
    if (documentId) {
      return documentId;
    }
    if (foundDocument?.invoiceNo) {
      return foundDocument.invoiceNo;
    }
    // Try to extract from filename (e.g., "2025-11-12_EK_176-212342123_Invoice_KAINMD55682.pdf" -> "KAINMD55682")
    const match = documentFileName.match(/_Invoice_([^.]+)/);
    if (match && match[1]) {
      return match[1];
    }
    // Fallback: use filename without extension
    return documentFileName.replace('.pdf', '').replace('.PDF', '');
  };
  
  // Determine document type from filename
  const documentType = documentFileName ? getDocumentType(documentFileName) : 'invoice';
  const DocumentIcon = getDocumentTypeIcon(documentType);

  // Check if at least one field has value
  const hasValidInput = documentId.trim() || pnr.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasValidInput) {
      return;
    }

    setIsLoading(true);
    setDocumentFound(false);
    setFoundDocument(null);

    // Simulate search with a minor delay (no API call needed)
    setTimeout(() => {
      // Always return the default PDF card
      const defaultDocument = {
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

      setFoundDocument(defaultDocument);
      setDocumentFileName(defaultDocument.fileName);
      setDocumentFound(true);
      setIsLoading(false);
    }, 800); // 800ms delay to simulate search
  };

  const handleDownload = async () => {
    if (!foundDocument || !foundDocument.id) {
      toast({
        title: "Error",
        description: "No document available to download.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting download for document:', foundDocument);
      // Try the static file endpoint first (more reliable)
      const downloadUrl = `/api/ea/pdf-file`;
      console.log('Download URL:', downloadUrl);
      
      const response = await fetch(downloadUrl);
      
      console.log('Download response status:', response.status);
      console.log('Download response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download failed:', errorText);
        throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`);
      }

      // Get the blob
      const blob = await response.blob();
      console.log('Blob received, size:', blob.size, 'type:', blob.type);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = foundDocument.fileName || documentFileName || '2025-11-12_EK_176-212342123_Invoice_KAINMD55682.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your document is being downloaded.",
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to download document. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate months difference between two dates
  const getMonthsDifference = (date1: Date, date2: Date): number => {
    const yearsDiff = date2.getFullYear() - date1.getFullYear();
    const monthsDiff = date2.getMonth() - date1.getMonth();
    return yearsDiff * 12 + monthsDiff;
  };

  // Get today's date (end of day)
  const getToday = (): Date => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return today;
  };

  // Get minimum allowed date (21 months ago from today)
  const getMinDate = (): Date => {
    const today = getToday();
    const minDate = new Date(today);
    minDate.setMonth(minDate.getMonth() - 21);
    return minDate;
  };

  // Validate date range (max 21 months from past, max date is today)
  const validateDateRange = (from: Date | undefined, to: Date | undefined): string => {
    if (!from || !to) {
      return "";
    }
    const today = getToday();
    const minDate = getMinDate();
    
    if (to > today) {
      return "To date cannot be in the future";
    }
    if (from < minDate) {
      return "From date cannot be more than 21 months in the past";
    }
    if (from > to) {
      return "From date cannot be after To date";
    }
    const monthsDiff = getMonthsDifference(from, to);
    if (monthsDiff > 21) {
      return "Date range cannot exceed 21 months";
    }
    return "";
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  // Calculate estimated download time based on file size
  const calculateEstimatedTime = (totalSizeBytes: number): string => {
    // Assume average download speed of 5 MB/s
    const speedMBps = 5;
    const sizeMB = totalSizeBytes / (1024 * 1024);
    const seconds = sizeMB / speedMBps;
    
    if (seconds < 60) {
      return `${Math.ceil(seconds)}s`;
    } else if (seconds < 3600) {
      return `${Math.ceil(seconds / 60)}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.ceil((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  // Handle agent fetch invoices
  const handleAgentFetch = async () => {
    // Validate inputs
    if (!agentGstn.trim() && !fromDate && !toDate) {
      setDateRangeError("Please enter GSTN or select a period range");
      return;
    }

    // Validate date range if dates are provided
    if (fromDate && toDate) {
      const error = validateDateRange(fromDate, toDate);
      if (error) {
        setDateRangeError(error);
        return;
      }
    } else if ((fromDate && !toDate) || (!fromDate && toDate)) {
      setDateRangeError("Please select both From Date and To Date");
      return;
    }

    setDateRangeError("");
    setIsAgentFetching(true);
    setInvoiceCounts(null);

    // Simulate API call to fetch invoice counts
    setTimeout(() => {
      // Mock data - in real implementation, this would come from API
      const mockInvoices = {
        count: 145,
        totalFiles: 145,
        totalSize: formatFileSize(145 * 2.5 * 1024 * 1024), // 145 files * 2.5 MB each
        estimatedTime: calculateEstimatedTime(145 * 2.5 * 1024 * 1024)
      };
      const mockCreditNotes = {
        count: 23,
        totalFiles: 23,
        totalSize: formatFileSize(23 * 2.1 * 1024 * 1024), // 23 files * 2.1 MB each
        estimatedTime: calculateEstimatedTime(23 * 2.1 * 1024 * 1024)
      };
      const mockDebitNotes = {
        count: 8,
        totalFiles: 8,
        totalSize: formatFileSize(8 * 2.3 * 1024 * 1024), // 8 files * 2.3 MB each
        estimatedTime: calculateEstimatedTime(8 * 2.3 * 1024 * 1024)
      };

      setInvoiceCounts({
        invoices: mockInvoices,
        creditNotes: mockCreditNotes,
        debitNotes: mockDebitNotes
      });
      setIsAgentFetching(false);
    }, 2000);
  };

  // Update date range error when dates change
  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    if (date && toDate) {
      setDateRangeError(validateDateRange(date, toDate));
    } else {
      setDateRangeError("");
    }
    // Clear counts when dates change
    setInvoiceCounts(null);
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    if (fromDate && date) {
      setDateRangeError(validateDateRange(fromDate, date));
    } else {
      setDateRangeError("");
    }
    // Clear counts when dates change
    setInvoiceCounts(null);
  };

  // Clear counts when GSTN changes
  const handleGstnChange = (value: string) => {
    // Allow alphanumeric, commas, and spaces, then convert to uppercase
    let processedValue = value.replace(/[^a-zA-Z0-9,\s]/g, "");
    // Remove extra spaces around commas
    processedValue = processedValue.replace(/\s*,\s*/g, ",");
    // Convert to uppercase
    processedValue = processedValue.toUpperCase();
    setAgentGstn(processedValue);
    setInvoiceCounts(null);
  };

  // Download management functions
  const handleDownloadClick = (documentType: 'invoices' | 'creditNotes' | 'debitNotes') => {
    if (!invoiceCounts) return;
    
    const count = documentType === 'invoices' 
      ? invoiceCounts.invoices.count 
      : documentType === 'creditNotes' 
      ? invoiceCounts.creditNotes.count 
      : invoiceCounts.debitNotes.count;
    
    if (count === 0) {
      toast({
        title: "No Documents",
        description: `No ${documentType === 'invoices' ? 'invoices' : documentType === 'creditNotes' ? 'credit notes' : 'debit notes'} available to download.`,
        variant: "destructive",
      });
      return;
    }

    // Check if queue is full
    if (downloads.length >= 3) {
      toast({
        title: "Download Queue Full",
        description: "You can only have up to 3 downloads at a time. Please wait for one to complete.",
        variant: "destructive",
      });
      return;
    }

    setConfirmationModal({ open: true, documentType });
  };

  const handleDownloadConfirm = () => {
    if (!invoiceCounts) return;

    const { documentType } = confirmationModal;
    const countData = documentType === 'invoices' 
      ? invoiceCounts.invoices 
      : documentType === 'creditNotes' 
      ? invoiceCounts.creditNotes 
      : invoiceCounts.debitNotes;

    if (countData.count === 0) return;

    // Check queue limit again
    if (downloads.length >= 3) {
      toast({
        title: "Download Queue Full",
        description: "You can only have up to 3 downloads at a time.",
        variant: "destructive",
      });
      return;
    }

    const downloadId = `${documentType}-${Date.now()}`;
    const label = documentType === 'invoices' 
      ? 'Invoices' 
      : documentType === 'creditNotes' 
      ? 'Credit Notes' 
      : 'Debit Notes';

    const newDownload: DownloadItem = {
      id: downloadId,
      documentType,
      label,
      progress: 0,
      status: 'pending',
      totalFiles: countData.totalFiles,
      downloadedFiles: 0,
    };

    setDownloads(prev => [...prev, newDownload]);

    // Start download after a short delay (to show pending state)
    setTimeout(() => {
      startDownload(downloadId);
    }, 500);
  };

  const startDownload = (downloadId: string) => {
    setDownloads(prev => {
      const download = prev.find(d => d.id === downloadId);
      if (!download) return prev;

      // Start the download progress simulation
      let progress = 0;
      let downloadedFiles = 0;
      const totalFiles = download.totalFiles;

      const interval = setInterval(() => {
        progress += Math.random() * 5; // Random progress increment
        downloadedFiles = Math.floor((progress / 100) * totalFiles);

        if (progress >= 100) {
          progress = 100;
          downloadedFiles = totalFiles;
          clearInterval(interval);
          downloadIntervalsRef.current.delete(downloadId);

          setDownloads(prevDownloads => prevDownloads.map(d => 
            d.id === downloadId 
              ? { ...d, progress: 100, status: 'completed' as const, downloadedFiles: totalFiles }
              : d
          ));

          toast({
            title: "Download Complete",
            description: `Successfully downloaded ${totalFiles} files.`,
          });
        } else {
          setDownloads(prevDownloads => prevDownloads.map(d => 
            d.id === downloadId 
              ? { ...d, progress, downloadedFiles, status: 'downloading' as const }
              : d
          ));
        }
      }, 300); // Update every 300ms

      downloadIntervalsRef.current.set(downloadId, interval);

      // Update status to downloading
      return prev.map(d => 
        d.id === downloadId ? { ...d, status: 'downloading' as const } : d
      );
    });
  };

  const handleRemoveDownload = (id: string) => {
    // Clear interval if exists
    const interval = downloadIntervalsRef.current.get(id);
    if (interval) {
      clearInterval(interval);
      downloadIntervalsRef.current.delete(id);
    }

    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  const handleCancelDownload = (id: string) => {
    // Clear interval if exists
    const interval = downloadIntervalsRef.current.get(id);
    if (interval) {
      clearInterval(interval);
      downloadIntervalsRef.current.delete(id);
    }

    setDownloads(prev => prev.filter(d => d.id !== id));
    
    toast({
      title: "Download Cancelled",
      description: "The download has been cancelled.",
    });
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      downloadIntervalsRef.current.forEach(interval => clearInterval(interval));
      downloadIntervalsRef.current.clear();
    };
  }, []);

  return (
    <>
      <div className="space-y-6 w-full">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Search Card - Full Width */}
          <Card className="relative overflow-hidden border-2 border-[#1964d7]/20 dark:border-[#1964d7]/40 shadow-lg">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1964d7] via-[#1582b0] to-[#1964d7]"></div>
            
            <CardHeader className="bg-gradient-to-r from-red-50/50 to-rose-50/50 dark:from-red-900/10 dark:to-rose-900/10 border-b border-[#1964d7]/20 dark:border-[#1964d7]/30 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#1964d7] to-[#1582b0]">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Search Invoice</CardTitle>
                  <CardDescription className="text-sm mt-0.5">
                    Enter Ticket ID or PNR to find your Invoice, Credit Note, or Debit Note
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                  <div className="space-y-2">
                    <Label htmlFor="documentId" className="text-sm font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#1964d7]" />
                      Ticket ID
                    </Label>
                    <Input
                      id="documentId"
                      type="text"
                      placeholder="e.g., EK-INV-001234, EK-CN-001234"
                      value={documentId}
                      onChange={(e) => setDocumentId(e.target.value)}
                      disabled={isLoading}
                      className="h-11 text-sm px-4 border-2 focus:border-[#1964d7] focus:ring-[#1964d7]/20"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Enter Invoice, Credit Note, or Debit Note ID
                    </p>
                  </div>

                  {/* OR Separator - Desktop */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-full border-2 border-[#1964d7]/30 dark:border-[#1964d7]/50 shadow-md">
                      <span className="text-xs font-bold text-[#1964d7] dark:text-red-400">OR</span>
                    </div>
                  </div>

                  {/* OR Separator - Mobile */}
                  <div className="flex lg:hidden items-center justify-center">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent dark:via-red-700"></div>
                    <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full mx-3">
                      <span className="text-xs font-bold text-[#1964d7] dark:text-red-400">OR</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent dark:via-red-700"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pnr" className="text-sm font-semibold flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-[#1964d7]" />
                      PNR
                    </Label>
                    <Input
                      id="pnr"
                      type="text"
                      placeholder="e.g., ABC123XYZ"
                      value={pnr}
                      onChange={(e) => setPnr(e.target.value)}
                      disabled={isLoading}
                      className="h-11 text-sm px-4 border-2 focus:border-[#1964d7] focus:ring-[#1964d7]/20"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Your Passenger Name Record or booking reference
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto min-w-[180px] h-11 text-sm font-semibold bg-gradient-to-r from-[#1964d7] to-[#1582b0] hover:from-[#1582b0] hover:to-[#8B1015] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={!hasValidInput || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search Document
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Enter at least one field to search
                  </p>
                </div>
              </form>

              {/* Loader */}
              {isLoading && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-red-200 dark:bg-red-900/30 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-[#1964d7] to-[#1582b0] p-4 rounded-full">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    </div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      Searching for your document...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Please wait while we locate your Invoice, Credit Note, or Debit Note
                    </p>
                  </div>
                </div>
              )}

              {/* Document Card with Download Button */}
              {documentFound && !isLoading && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col gap-4">
                    {/* Success Message */}
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100 text-sm">
                          Document Found Successfully!
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Your {getDocumentTypeLabel(documentType).toLowerCase()} is ready to download
                        </p>
                      </div>
                    </div>

                    {/* Document Card */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Card className="flex-1 border-2 border-[#1964d7]/30 dark:border-[#1964d7]/40 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-red-200 dark:bg-red-900/30 rounded-lg blur-md opacity-50"></div>
                              <div className="relative bg-gradient-to-br from-[#1964d7] to-[#1582b0] p-3 rounded-lg shadow-md">
                                <DocumentIcon className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="h-3 w-3 text-[#1964d7] dark:text-red-400" />
                                <p className="text-xs font-semibold text-[#1964d7] dark:text-red-400 uppercase tracking-wide">
                                  {getDocumentTypeLabel(documentType)}
                                </p>
                              </div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={documentFileName}>
                                {documentFileName}
                              </p>
                              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  PDF
                                </span>
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                                  Verified
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={handleDownload}
                          className="sm:w-auto h-auto py-4 px-6 bg-gradient-to-r from-[#1964d7] to-[#1582b0] hover:from-[#1582b0] hover:to-[#8B1015] text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-semibold"
                          size="lg"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        
                        {/* Raise Ticket Button */}
                        <Button
                          onClick={() => setIsRaiseTicketOpen(true)}
                          variant="outline"
                          className="sm:w-auto h-auto py-4 px-6 border-2 border-[#1964d7] text-[#1964d7] hover:bg-[#1964d7] hover:text-white transition-all duration-200 text-sm font-semibold"
                          size="lg"
                        >
                          <Ticket className="mr-2 h-4 w-4" />
                          Raise Ticket
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Agent-Specific Download Section */}
        {isAgent && (
          <Card className="relative overflow-hidden border-2 border-[#1964d7]/20 dark:border-[#1964d7]/40 shadow-lg">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1964d7] via-[#1582b0] to-[#1964d7]"></div>
            
            <CardHeader className="bg-gradient-to-r from-red-50/50 to-rose-50/50 dark:from-red-900/10 dark:to-rose-900/10 border-b border-[#1964d7]/20 dark:border-[#1964d7]/30 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#1964d7] to-[#1582b0]">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Bulk Download by GSTN or Period</CardTitle>
                  <CardDescription className="text-sm mt-0.5">
                    Download invoices by GSTN, Period Range, or both (Maximum 21 months)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleAgentFetch(); }} className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* GSTN Input */}
                  <div className="space-y-2">
                    <Label htmlFor="agentGstn" className="text-sm font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#1964d7]" />
                      GSTN
                    </Label>
                    <Input
                      id="agentGstn"
                      type="text"
                      placeholder="e.g., 27ABCDE1234F1Z5, 27XYZ1234567A1B2"
                      value={agentGstn}
                      onChange={(e) => handleGstnChange(e.target.value)}
                      disabled={isAgentFetching}
                      className="h-11 text-sm px-4 border-2 focus:border-[#1964d7] focus:ring-[#1964d7]/20 uppercase"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Enter one or more GST Identification Numbers separated by commas (optional)
                    </p>
                  </div>

                  {/* Period Range Section */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-[#1964d7]" />
                      Period Range
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* From Date */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-11 justify-start text-left font-normal border-2",
                              !fromDate && "text-muted-foreground",
                              fromDate && "border-[#1964d7]"
                            )}
                            disabled={isAgentFetching}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fromDate ? format(fromDate, "MMM dd, yyyy") : "From Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={fromDate}
                            onSelect={handleFromDateChange}
                            disabled={(date) => {
                              const today = getToday();
                              const minDate = getMinDate();
                              if (date > today) return true;
                              if (date < minDate) return true;
                              if (toDate) {
                                return date > toDate || getMonthsDifference(date, toDate) > 21;
                              }
                              return false;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {/* To Date */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-11 justify-start text-left font-normal border-2",
                              !toDate && "text-muted-foreground",
                              toDate && "border-[#1964d7]"
                            )}
                            disabled={isAgentFetching}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {toDate ? format(toDate, "MMM dd, yyyy") : "To Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={toDate}
                            onSelect={handleToDateChange}
                            disabled={(date) => {
                              const today = getToday();
                              if (date > today) return true;
                              if (fromDate) {
                                const minDate = getMinDate();
                                if (fromDate < minDate) return true;
                                return date < fromDate || getMonthsDifference(fromDate, date) > 21;
                              }
                              return false;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {dateRangeError && (
                      <p className="text-sm text-red-600 dark:text-red-400">{dateRangeError}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Select date range (maximum 21 months from past, up to today)
                    </p>
                  </div>
                </div>

                {/* Fetch Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto min-w-[180px] h-11 text-sm font-semibold bg-gradient-to-r from-[#1964d7] to-[#1582b0] hover:from-[#1582b0] hover:to-[#8B1015] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isAgentFetching || (!agentGstn.trim() && (!fromDate || !toDate))}
                  >
                    {isAgentFetching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Fetch Invoices
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Enter GSTN or select period range (or both)
                  </p>
                </div>
              </form>

              {/* Invoice Counts Display */}
              {invoiceCounts && !isAgentFetching && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Invoice Summary
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Invoices Card */}
                      <Card className="border-2 border-red-200 dark:border-red-800/50 hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                                <Receipt className="h-5 w-5 text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Invoices</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{invoiceCounts.invoices.count}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Total Files:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{invoiceCounts.invoices.totalFiles}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Download Size:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{invoiceCounts.invoices.totalSize}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Est. Time:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{invoiceCounts.invoices.estimatedTime}</span>
                            </div>
                          </div>
                          {invoiceCounts.invoices.count > 0 && (
                            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <Button
                                onClick={() => handleDownloadClick('invoices')}
                                variant="outline"
                                className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                                size="sm"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Credit Notes Card */}
                      <Card className="border-2 border-green-200 dark:border-green-800/50 hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                                <FileMinus className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Credit Notes</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{invoiceCounts.creditNotes.count}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Total Files:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{invoiceCounts.creditNotes.totalFiles}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Download Size:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{invoiceCounts.creditNotes.totalSize}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Est. Time:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{invoiceCounts.creditNotes.estimatedTime}</span>
                            </div>
                          </div>
                          {invoiceCounts.creditNotes.count > 0 && (
                            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <Button
                                onClick={() => handleDownloadClick('creditNotes')}
                                variant="outline"
                                className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                                size="sm"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Debit Notes Card */}
                      <Card className="border-2 border-amber-200 dark:border-amber-800/50 hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                                <FilePlus className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Debit Notes</p>
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{invoiceCounts.debitNotes.count}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Total Files:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{invoiceCounts.debitNotes.totalFiles}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Download Size:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{invoiceCounts.debitNotes.totalSize}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Est. Time:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{invoiceCounts.debitNotes.estimatedTime}</span>
                            </div>
                          </div>
                          {invoiceCounts.debitNotes.count > 0 && (
                            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <Button
                                onClick={() => handleDownloadClick('debitNotes')}
                                variant="outline"
                                className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                                size="sm"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isAgentFetching && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-red-200 dark:bg-red-900/30 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-[#1964d7] to-[#1582b0] p-4 rounded-full">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    </div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      Fetching invoice counts...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Please wait while we retrieve your invoice information
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Raise Ticket Modal */}
      <EARaiseTicketModal
        open={isRaiseTicketOpen}
        onOpenChange={setIsRaiseTicketOpen}
        prefilledInvoiceId={documentFound ? getInvoiceId() : undefined}
      />

      {/* Download Confirmation Modal */}
      {invoiceCounts && (
        <DownloadConfirmationModal
          open={confirmationModal.open}
          onOpenChange={(open) => setConfirmationModal({ ...confirmationModal, open })}
          onConfirm={handleDownloadConfirm}
          documentType={confirmationModal.documentType}
          count={
            confirmationModal.documentType === 'invoices'
              ? invoiceCounts.invoices.count
              : confirmationModal.documentType === 'creditNotes'
              ? invoiceCounts.creditNotes.count
              : invoiceCounts.debitNotes.count
          }
          totalFiles={
            confirmationModal.documentType === 'invoices'
              ? invoiceCounts.invoices.totalFiles
              : confirmationModal.documentType === 'creditNotes'
              ? invoiceCounts.creditNotes.totalFiles
              : invoiceCounts.debitNotes.totalFiles
          }
          totalSize={
            confirmationModal.documentType === 'invoices'
              ? invoiceCounts.invoices.totalSize
              : confirmationModal.documentType === 'creditNotes'
              ? invoiceCounts.creditNotes.totalSize
              : invoiceCounts.debitNotes.totalSize
          }
          estimatedTime={
            confirmationModal.documentType === 'invoices'
              ? invoiceCounts.invoices.estimatedTime
              : confirmationModal.documentType === 'creditNotes'
              ? invoiceCounts.creditNotes.estimatedTime
              : invoiceCounts.debitNotes.estimatedTime
          }
        />
      )}

      {/* Download Progress Bar */}
      <DownloadProgressBar
        downloads={downloads}
        onRemove={handleRemoveDownload}
        onCancel={handleCancelDownload}
      />
    </>
  );
}
