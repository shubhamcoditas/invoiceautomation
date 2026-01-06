import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Search, Ticket, FileText, User, Calendar, MessageSquare, AlertCircle, CheckCircle, Clock, XCircle, Cloud, Loader2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TicketData {
  id: string;
  ticketId: string;
  invoiceId: string;
  invoiceNo: string;
  raisedBy: string;
  raisedByRole: string;
  comments: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt?: string;
  lastCloudSyncAt?: string;
}

// Generate dummy ticket data for a given invoice ID
const generateDummyTickets = (invoiceId: string): TicketData[] => {
  const baseDate = new Date();
  return [
    {
      id: 'ticket-1',
      ticketId: `EK-TKT-2024-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      invoiceId: invoiceId,
      invoiceNo: invoiceId,
      raisedBy: 'passenger1@example.com',
      raisedByRole: 'User',
      comments: 'Invoice amount discrepancy noticed. Please verify the total amount.',
      status: 'open',
      priority: 'high',
      createdAt: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastCloudSyncAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ticket-2',
      ticketId: `EK-TKT-2024-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      invoiceId: invoiceId,
      invoiceNo: invoiceId,
      raisedBy: 'passenger2@example.com',
      raisedByRole: 'Business User',
      comments: 'Need clarification on line items in the invoice.',
      status: 'in_progress',
      priority: 'medium',
      createdAt: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastCloudSyncAt: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ticket-3',
      ticketId: `EK-TKT-2024-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      invoiceId: invoiceId,
      invoiceNo: invoiceId,
      raisedBy: 'admin@emirates.com',
      raisedByRole: 'Admin',
      comments: 'Invoice validation issue resolved.',
      status: 'resolved',
      priority: 'low',
      createdAt: new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      lastCloudSyncAt: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

export function AgentTickets() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceIdSearch, setInvoiceIdSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<TicketData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isSearchResultsModalOpen, setIsSearchResultsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tickets');
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tickets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Search tickets by Invoice ID - Show modal with dummy data
  const handleSearchByInvoiceId = () => {
    if (!invoiceIdSearch.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an Invoice ID",
        variant: "destructive",
      });
      return;
    }

    // Validate invoice ID format (EK-INV-2024-XXXXXX)
    const invoiceIdPattern = /^EK-INV-2024-\d{6}$/;
    if (!invoiceIdPattern.test(invoiceIdSearch.trim())) {
      toast({
        title: "Invalid Format",
        description: "Invoice ID must be in format: EK-INV-2024-XXXXXX (e.g., EK-INV-2024-001234)",
        variant: "destructive",
      });
      return;
    }

    setSearchLoading(true);
    setHasSearched(true);
    
    // Generate dummy tickets for the searched invoice ID
    const dummyTickets = generateDummyTickets(invoiceIdSearch.trim());
    setSearchResults(dummyTickets);
    
    // Show modal with search results
    setIsSearchResultsModalOpen(true);
    
    setSearchLoading(false);
    
    toast({
      title: "Search Successful",
      description: `Found ${dummyTickets.length} ticket(s) for Invoice ID "${invoiceIdSearch}"`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return <Badge className="bg-[#FBEAEC] text-[#D71921] dark:bg-[#FBEAEC] dark:text-[#D71921]"><Clock className="h-3 w-3 mr-1" />Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"><AlertCircle className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"><XCircle className="h-3 w-3 mr-1" />Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-[#FBEAEC] text-[#D71921] dark:bg-[#FBEAEC] dark:text-[#D71921]">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Render tickets table
  const renderTicketsTable = (ticketList: TicketData[], emptyMessage: string) => {
    if (loading || searchLoading) {
      return (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 ea-text-primary" />
          <p className="text-muted-foreground">Loading tickets...</p>
        </div>
      );
    }

    if (ticketList.length === 0) {
      return (
        <div className="text-center py-8">
          <Ticket className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="font-semibold">Ticket ID</TableHead>
              <TableHead className="font-semibold">Invoice ID</TableHead>
              <TableHead className="font-semibold">Raised By</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Priority</TableHead>
              <TableHead className="font-semibold">Created At</TableHead>
              <TableHead className="font-semibold">Last Cloud Sync</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticketList.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                    {ticket.ticketId}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {ticket.invoiceId || ticket.invoiceNo}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {ticket.raisedBy}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {ticket.raisedByRole}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-sm">{formatDateTime(ticket.createdAt)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {ticket.lastCloudSyncAt ? (
                    <div className="flex items-center gap-1">
                      <Cloud className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-sm">{formatDateTime(ticket.lastCloudSyncAt)}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">Not synced</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setIsTicketDialogOpen(true);
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card className="ea-card shadow-lg">
        <CardHeader className="ea-card-header text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6" />
            <CardTitle className="text-2xl font-bold">Search Tickets by Invoice ID</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Invoice ID (e.g., EK-INV-2024-001234)"
              value={invoiceIdSearch}
              onChange={(e) => setInvoiceIdSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchByInvoiceId();
                }
              }}
              className="flex-1 h-12 ea-search-input"
              disabled={searchLoading}
            />
            <Button 
              onClick={handleSearchByInvoiceId}
              disabled={searchLoading}
              className="ea-ticket-search-button"
            >
              {searchLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table with Tabs */}
      <Card className="ea-card shadow-lg">
        <CardHeader className="ea-card-header text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Ticket className="h-6 w-6" />
            <CardTitle className="text-2xl font-bold">Tickets Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue={hasSearched ? "search-results" : "all-tickets"} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all-tickets">All Tickets</TabsTrigger>
              <TabsTrigger value="search-results" disabled={!hasSearched}>
                Search Results {hasSearched && searchResults.length > 0 && `(${searchResults.length})`}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-tickets">
              {renderTicketsTable(tickets, "No tickets found.")}
            </TabsContent>
            
            <TabsContent value="search-results">
              {hasSearched ? (
                renderTicketsTable(
                  searchResults, 
                  invoiceIdSearch ? `No tickets found for Invoice ID "${invoiceIdSearch}"` : "Enter an Invoice ID to search"
                )
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-muted-foreground">Search for tickets by Invoice ID to see results here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Search Results Modal */}
      <Dialog open={isSearchResultsModalOpen} onOpenChange={setIsSearchResultsModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 ea-dialog-title-primary">
              <FileText className="h-5 w-5" />
              Ticket History for Invoice ID: {invoiceIdSearch}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Found {searchResults.length} ticket(s) for this invoice
            </div>
            <div className="border rounded-lg overflow-hidden">
              {renderTicketsTable(searchResults, "No tickets found")}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Details Dialog */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 ea-dialog-title-primary">
              <Ticket className="h-5 w-5" />
              Ticket Details: {selectedTicket?.ticketId}
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Invoice ID</label>
                  <p className="text-foreground font-medium">{selectedTicket.invoiceId || selectedTicket.invoiceNo}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Raised By</label>
                  <p className="text-foreground font-medium">{selectedTicket.raisedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Role</label>
                  <p className="text-foreground font-medium capitalize">{selectedTicket.raisedByRole}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Priority</label>
                  <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Created At</label>
                  <p className="text-foreground font-medium">{formatDateTime(selectedTicket.createdAt)}</p>
                </div>
                {selectedTicket.lastCloudSyncAt && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Last Cloud Sync</label>
                    <p className="text-foreground font-medium">{formatDateTime(selectedTicket.lastCloudSyncAt)}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-2 block">Comments</label>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                    <p className="text-foreground whitespace-pre-wrap">{selectedTicket.comments}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
