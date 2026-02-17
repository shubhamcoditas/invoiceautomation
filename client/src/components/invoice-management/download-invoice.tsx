import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { Receipt, Download, Loader2, Ticket, Search, FileText, CheckCircle2, Info, Sparkles, FileMinus, FilePlus } from "lucide-react";
import { RaiseTicketModal } from "./raise-ticket-modal";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

export function DownloadInvoice() {
  const [isRaiseTicketOpen, setIsRaiseTicketOpen] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const [pnr, setPnr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documentFound, setDocumentFound] = useState(false);
  const [documentFileName] = useState("2025-11-12_NA_176-212342123_Invoice_KAINMD55682.pdf");
  
  // Determine document type from filename
  const documentType = getDocumentType(documentFileName);
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

    // Simulate API call with dummy loader
    setTimeout(() => {
      setIsLoading(false);
      setDocumentFound(true);
    }, 2000);
  };

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement("a");
    link.href = "#"; // In real implementation, this would be the actual file URL
    link.download = documentFileName;
    link.click();
  };

  return (
    <>
      <div className="space-y-6 w-full">
        {/* Hero Section - Full Width */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 via-purple-100/50 to-indigo-50 dark:from-purple-900/20 dark:via-purple-800/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-800/50 p-6 lg:p-8">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/30 dark:bg-purple-800/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-xl shadow-xl">
                  <Receipt className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Download Your Documents
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
                Quickly retrieve your Invoices, Credit Notes, or Debit Notes by entering Document ID or PNR
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300">
                  <Receipt className="h-3 w-3 mr-1" />
                  Invoices
                </Badge>
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">
                  <FileMinus className="h-3 w-3 mr-1" />
                  Credit Notes
                </Badge>
                <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300">
                  <FilePlus className="h-3 w-3 mr-1" />
                  Debit Notes
                </Badge>
              </div>
            </div>
            {/* Info Cards - Inline on larger screens */}
            <div className="hidden xl:flex gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-purple-200 dark:border-purple-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Secure & Fast</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-purple-200 dark:border-purple-700">
                <Download className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Instant Download</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-purple-200 dark:border-purple-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">24/7 Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Search Card - Takes 2 columns on xl */}
          <Card className="relative overflow-hidden border-2 border-purple-100 dark:border-purple-900/50 shadow-lg xl:col-span-2">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>
            
            <CardHeader className="bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-900/10 dark:to-indigo-900/10 border-b border-purple-100 dark:border-purple-800/50 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Search Documents</CardTitle>
                  <CardDescription className="text-sm mt-0.5">
                    Enter Document ID or PNR to find your Invoice, Credit Note, or Debit Note
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                  <div className="space-y-2">
                    <Label htmlFor="documentId" className="text-sm font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      Document ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="documentId"
                        type="text"
                        placeholder="e.g., INV-001234, CN-001234, DN-001234"
                        value={documentId}
                        onChange={(e) => setDocumentId(e.target.value)}
                        disabled={isLoading}
                        className="h-11 text-sm pl-4 pr-10 border-2 focus:border-purple-500 focus:ring-purple-500/20"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Enter Invoice, Credit Note, or Debit Note ID
                    </p>
                  </div>

                  {/* OR Separator - Desktop */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-full border-2 border-purple-200 dark:border-purple-800 shadow-md">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">OR</span>
                    </div>
                  </div>

                  {/* OR Separator - Mobile */}
                  <div className="flex lg:hidden items-center justify-center">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent dark:via-purple-700"></div>
                    <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full mx-3">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">OR</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent dark:via-purple-700"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pnr" className="text-sm font-semibold flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-purple-600" />
                      PNR
                    </Label>
                    <div className="relative">
                      <Input
                        id="pnr"
                        type="text"
                        placeholder="e.g., ABC123XYZ"
                        value={pnr}
                        onChange={(e) => setPnr(e.target.value)}
                        disabled={isLoading}
                        className="h-11 text-sm pl-4 pr-10 border-2 focus:border-purple-500 focus:ring-purple-500/20"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Receipt className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Your Passenger Name Record or booking reference
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto min-w-[180px] h-11 text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={!hasValidInput}
                    loading={isLoading}
                    loadingText="Searching..."
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search Document
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
                      <div className="absolute inset-0 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-full">
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
                      <Card className="flex-1 border-2 border-purple-200 dark:border-purple-800/50 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-purple-200 dark:bg-purple-900/30 rounded-lg blur-md opacity-50"></div>
                              <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-lg shadow-md">
                                <DocumentIcon className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
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
                      
                      <Button
                        onClick={handleDownload}
                        className="sm:w-auto h-auto py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-semibold"
                        size="lg"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Side Info Panel - Takes 1 column on xl */}
          <div className="space-y-4">
            {/* Quick Info Cards - Visible on smaller screens */}
            <div className="xl:hidden grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-purple-100 dark:border-purple-900/50 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                      <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">All Types</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Invoice, CN, DN</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900/50 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                      <Download className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Instant</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Quick download</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900/50 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">24/7</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Always available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel Cards - Visible on xl screens */}
            <div className="hidden xl:block space-y-4">
              <Card className="border-purple-100 dark:border-purple-900/50 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                      <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">All Document Types</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Search Invoices, Credit Notes & Debit Notes in one place
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900/50 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                      <Download className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Instant Download</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get your documents immediately after verification
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900/50 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Always Available</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Access your documents 24/7 from anywhere
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Need Help Card */}
              <Card className="border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                      <Ticket className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Need Help?</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Can't find your document? Raise a ticket for assistance.
                      </p>
                      <Button
                        onClick={() => setIsRaiseTicketOpen(true)}
                        variant="outline"
                        size="sm"
                        className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                      >
                        <Ticket className="h-4 w-4 mr-2" />
                        Raise Ticket
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Raise Ticket Button - Only visible on non-xl screens */}
      <Button
        onClick={() => setIsRaiseTicketOpen(true)}
        className={cn(
          "xl:hidden fixed bottom-6 right-6 z-50 rounded-full shadow-lg",
          "bg-purple-600 hover:bg-purple-700 text-white",
          "h-14 w-14 p-0 flex items-center justify-center",
          "transition-all duration-200 hover:scale-110"
        )}
        size="lg"
      >
        <Ticket className="h-6 w-6" />
        <span className="sr-only">Raise Ticket</span>
      </Button>

      {/* Raise Ticket Modal */}
      <RaiseTicketModal
        open={isRaiseTicketOpen}
        onOpenChange={setIsRaiseTicketOpen}
      />
    </>
  );
}
