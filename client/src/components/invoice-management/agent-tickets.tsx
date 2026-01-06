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

interface Ticket {
  id: string;
  ticketId: string;
  invoiceId: string;
  invoiceNo: string;
  invoiceSource?: string;
  raisedBy: string;
  raisedByRole: string;
  comments: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  lastCloudSyncAt?: string;
}

// Generate dummy ticket data for a given invoice ID
const generateDummyTickets = (invoiceId: string): Ticket[] => {
  const baseDate = new Date();
  return [
    {
      id: 'ticket-1',
      ticketId: `TKT-2024-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      invoiceId: invoiceId,
      invoiceNo: invoiceId,
      invoiceSource: 'PDF',
      raisedBy: 'john.doe@example.com',
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
      ticketId: `TKT-2024-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      invoiceId: invoiceId,
      invoiceNo: invoiceId,
      invoiceSource: 'PDF',
      raisedBy: 'jane.smith@example.com',
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
      ticketId: `TKT-2024-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      invoiceId: invoiceId,
      invoiceNo: invoiceId,
      invoiceSource: 'QR',
      raisedBy: 'admin@example.com',
      raisedByRole: 'Admin',
      comments: 'Invoice validation issue resolved.',
      status: 'resolved',
      priority: 'low',
      createdAt: new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      resolvedAt: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      resolvedBy: 'admin@example.com',
      lastCloudSyncAt: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

export function AgentTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceIdSearch, setInvoiceIdSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Ticket[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isSearchResultsModalOpen, setIsSearchResultsModalOpen] = useState(false);
  const [totalInvoicesWithTickets, setTotalInvoicesWithTickets] = useState(0);
  const { toast } = useToast();

  // Fetch all tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tickets');
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      const data = await response.json();
      setTickets(data.tickets || []);
      setTotalInvoicesWithTickets(data.totalInvoicesWithTickets || 0);
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

  useEffect(() => {
    fetchTickets();
  }, []);

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

    // Validate invoice ID format (INV-2024-XXXXXX)
    const invoiceIdPattern = /^INV-2024-\d{6}$/;
    if (!invoiceIdPattern.test(invoiceIdSearch.trim())) {
      toast({
        title: "Invalid Format",
        description: "Invoice ID must be in format: INV-2024-XXXXXX (e.g., INV-2024-001234)",
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

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return (
          <Badge className="bg-[#FBEAEC] text-[#D71921] border-[#D71921] flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Open
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'resolved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Resolved
          </Badge>
        );
      case 'closed':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Closed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Urgent
          </Badge>
        );
      case 'high':
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-[#FBEAEC] text-[#D71921] border-[#D71921]">
            Low
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {priority}
          </Badge>
        );
    }
  };

  // Render tickets table
  const renderTicketsTable = (ticketList: Ticket[], emptyMessage: string) => {
    if (loading || searchLoading) {
      return (
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Loading tickets...</p>
        </div>
      );
    }

    if (ticketList.length === 0) {
      return (
        <div className="p-8 text-center">
          <Ticket className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50">
              <TableHead className="font-semibold text-foreground">Ticket ID</TableHead>
              <TableHead className="font-semibold text-foreground">Invoice ID</TableHead>
              <TableHead className="font-semibold text-foreground">Raised By</TableHead>
              <TableHead className="font-semibold text-foreground">Role</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground">Priority</TableHead>
              <TableHead className="font-semibold text-foreground">Created At</TableHead>
              <TableHead className="font-semibold text-foreground">Last Cloud Sync</TableHead>
              <TableHead className="font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticketList.map((ticket) => (
              <TableRow 
                key={ticket.id} 
                className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 transition-all duration-200"
              >
                <TableCell className="font-medium text-foreground py-4">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                    {ticket.ticketId}
                  </div>
                </TableCell>
                <TableCell className="text-foreground py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {ticket.invoiceId || ticket.invoiceNo}
                  </div>
                </TableCell>
                <TableCell className="text-foreground py-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {ticket.raisedBy}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className="capitalize">
                    {ticket.raisedByRole}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  {getStatusBadge(ticket.status)}
                </TableCell>
                <TableCell className="py-4">
                  {getPriorityBadge(ticket.priority)}
                </TableCell>
                <TableCell className="text-sm py-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-foreground font-mono">{formatDateTime(ticket.createdAt)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm py-4">
                  {ticket.lastCloudSyncAt ? (
                    <div className="flex items-center gap-1">
                      <Cloud className="h-3 w-3 text-muted-foreground" />
                      <span className="text-foreground font-mono">{formatDateTime(ticket.lastCloudSyncAt)}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">Not synced</span>
                  )}
                </TableCell>
                <TableCell className="py-4">
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
    <div className="w-full space-y-6" data-testid="agent-tickets">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="modern-card animate-fade-in">
          <CardHeader className="modern-card-header">
            <CardTitle className="modern-card-title flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Total Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{tickets.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Tickets raised by agents and users</p>
          </CardContent>
        </Card>

        <Card className="modern-card animate-fade-in">
          <CardHeader className="modern-card-header">
            <CardTitle className="modern-card-title flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoices with Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalInvoicesWithTickets}</div>
            <p className="text-sm text-muted-foreground mt-1">Unique invoices that have tickets</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Section */}
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <CardTitle className="modern-card-title">Search Tickets by Invoice ID</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Invoice ID (e.g., INV-2024-001234)"
              value={invoiceIdSearch}
              onChange={(e) => setInvoiceIdSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchByInvoiceId();
                }
              }}
              className="flex-1 h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-[#D71921] focus:ring-2 focus:ring-[#FBEAEC]"
              disabled={searchLoading}
            />
            <Button 
              onClick={handleSearchByInvoiceId}
              disabled={searchLoading}
              className="im-button-blue"
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
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="modern-card-title">Tickets Management</CardTitle>
              <p className="modern-card-subtitle">
                View and manage all tickets raised against invoices
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue={hasSearched ? "search-results" : "all-tickets"} className="w-full">
            <TabsList className="m-4 mb-0">
              <TabsTrigger value="all-tickets">All Tickets</TabsTrigger>
              <TabsTrigger value="search-results" disabled={!hasSearched}>
                Search Results {hasSearched && searchResults.length > 0 && `(${searchResults.length})`}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-tickets" className="mt-0">
              {renderTicketsTable(tickets, "No tickets found.")}
            </TabsContent>
            
            <TabsContent value="search-results" className="mt-0">
              {hasSearched ? (
                renderTicketsTable(
                  searchResults, 
                  invoiceIdSearch ? `No tickets found for Invoice ID "${invoiceIdSearch}"` : "Enter an Invoice ID to search"
                )
              ) : (
                <div className="p-8 text-center">
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
            <DialogTitle className="flex items-center gap-2">
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
            <DialogTitle className="flex items-center gap-2">
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
                  <label className="text-sm font-semibold text-muted-foreground">Invoice Source</label>
                  <p className="text-foreground font-medium capitalize">{selectedTicket.invoiceSource || 'N/A'}</p>
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
                {selectedTicket.resolvedAt && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Resolved At</label>
                    <p className="text-foreground font-medium">{formatDateTime(selectedTicket.resolvedAt)}</p>
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
