import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RaiseTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Dummy Invoice IDs for search - in real implementation, this would come from an API
const dummyInvoiceIds = [
  "INV-2024-001234",
  "INV-2024-001235",
  "INV-2024-001236",
  "INV-2024-001237",
  "INV-2024-001238",
  "INV-2024-001239",
  "INV-2024-001240",
  "INV-2024-001241",
  "INV-2024-001242",
  "INV-2024-001243",
];

// Function to generate a unique Ticket ID
const generateTicketId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKT-${new Date().getFullYear()}-${timestamp}${random}`;
};

export function RaiseTicketModal({ open, onOpenChange }: RaiseTicketModalProps) {
  const { toast } = useToast();
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceIdSearch, setInvoiceIdSearch] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInvoiceDropdown, setShowInvoiceDropdown] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState<string[]>([]);

  // Filter invoices based on search input
  useEffect(() => {
    if (invoiceIdSearch.trim()) {
      const filtered = dummyInvoiceIds.filter((invoice) =>
        invoice.toLowerCase().includes(invoiceIdSearch.toLowerCase())
      );
      setFilteredInvoices(filtered);
      setShowInvoiceDropdown(filtered.length > 0);
    } else {
      setFilteredInvoices([]);
      setShowInvoiceDropdown(false);
    }
  }, [invoiceIdSearch]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setInvoiceId("");
      setInvoiceIdSearch("");
      setComments("");
      setShowInvoiceDropdown(false);
    }
  }, [open]);

  const handleInvoiceSelect = (selectedInvoice: string) => {
    setInvoiceId(selectedInvoice);
    setInvoiceIdSearch(selectedInvoice);
    setShowInvoiceDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceId.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select an Invoice ID",
        variant: "destructive",
      });
      return;
    }

    if (!comments.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter comments",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Generate Ticket ID automatically
    const generatedTicketId = generateTicketId();

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      toast({
        title: "Ticket Created Successfully",
        description: `Your ticket ${generatedTicketId} has been submitted for Invoice ${invoiceId}`,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Raise Ticket</DialogTitle>
          <DialogDescription>
            Submit a ticket for assistance with your invoice. A unique Ticket ID will be generated automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Invoice ID with Search */}
            <div className="space-y-2 relative">
              <Label htmlFor="invoiceId">Invoice ID *</Label>
              <div className="relative">
                <Input
                  id="invoiceId"
                  type="text"
                  placeholder="Search and select Invoice ID"
                  value={invoiceIdSearch}
                  onChange={(e) => {
                    setInvoiceIdSearch(e.target.value);
                    if (e.target.value !== invoiceId) {
                      setInvoiceId("");
                    }
                  }}
                  onFocus={() => {
                    if (invoiceIdSearch.trim()) {
                      setShowInvoiceDropdown(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay to allow click on dropdown item
                    setTimeout(() => setShowInvoiceDropdown(false), 200);
                  }}
                  required
                  disabled={isSubmitting}
                />
                {invoiceId && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                )}
              </div>

              {/* Dropdown for invoice suggestions */}
              {showInvoiceDropdown && filteredInvoices.length > 0 && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-white dark:bg-gray-900 shadow-lg max-h-60 overflow-auto">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No invoices found</CommandEmpty>
                      <CommandGroup>
                        {filteredInvoices.map((invoice) => (
                          <CommandItem
                            key={invoice}
                            value={invoice}
                            onSelect={() => handleInvoiceSelect(invoice)}
                            className="cursor-pointer"
                          >
                            {invoice}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments">Comments *</Label>
              <Textarea
                id="comments"
                placeholder="Enter your comments or issue description"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
