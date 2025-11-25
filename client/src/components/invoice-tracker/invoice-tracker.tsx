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
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Copy,
  Save,
  Edit
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
  status: 'success' | 'failure' | 'processing' | 'processed' | 'ready_for_review' | 'ewb_generated' | 'fail';
  processingDate: string;
  qrCode?: string;
  irn?: string;
  ewbNumber?: string;
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
      status: 'success',
      processingDate: "2024-01-18T10:30:00Z",
      qrCode: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n",
      irn: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n",
      ewbNumber: "EWB123456789012",
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
      status: 'failure',
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
      status: 'success',
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
    },
    {
      id: "qr-4",
      invoiceNumber: "INV-2024-020",
      vendorName: "Unknown Vendor Ltd",
      vendorEmail: "billing@unknown.com",
      vendorGstin: "29UNKNOWN1234567",
      amount: 32000,
      taxAmount: 5760,
      totalAmount: 37760,
      invoiceDate: "2024-01-16",
      dueDate: "2024-02-16",
      source: 'qr',
      sourceDetails: "QR Scanner - Batch 004",
      status: 'failure',
      processingDate: "2024-01-18T14:20:00Z",
      qrCode: "4d5e6f7g8h9i0j1k2l3m4n5o6p7q",
      irn: "4d5e6f7g8h9i0j1k2l3m4n5o6p7q",
      attachments: ["invoice_020.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Unknown Services",
      quantity: 1,
      unitPrice: 32000,
      cgst: 2880,
      sgst: 2880,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'invalid',
      errorMessage: "QR code not found in EGAM",
      processedBy: "QR Scanner",
      lastModified: "2024-01-18T14:20:00Z"
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
      status: 'processing',
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
      status: 'ready_for_review',
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
    },
    {
      id: "pdf-3",
      invoiceNumber: "INV-2024-005",
      vendorName: "Tech Corp Ltd",
      vendorEmail: "billing@techcorp.com",
      vendorGstin: "29TECHCORP1234567",
      amount: 75000,
      taxAmount: 13500,
      totalAmount: 88500,
      invoiceDate: "2024-01-19",
      dueDate: "2024-02-19",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_005.pdf",
      status: 'ewb_generated',
      processingDate: "2024-01-18T15:45:00Z",
      ewbNumber: "EWB555666777888",
      attachments: ["invoice_005.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Software License",
      quantity: 1,
      unitPrice: 75000,
      cgst: 6750,
      sgst: 6750,
      igst: 0,
      hasQrInEgam: true,
      egamStatus: 'found',
      validationStatus: 'valid',
      processedBy: "OCR Engine",
      lastModified: "2024-01-18T15:45:00Z"
    },
    {
      id: "pdf-4",
      invoiceNumber: "INV-2024-006",
      vendorName: "Failed Corp Ltd",
      vendorEmail: "billing@failed.com",
      vendorGstin: "29FAILED1234567",
      amount: 50000,
      taxAmount: 9000,
      totalAmount: 59000,
      invoiceDate: "2024-01-20",
      dueDate: "2024-02-20",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_006.pdf",
      status: 'fail',
      processingDate: "2024-01-18T16:30:00Z",
      attachments: ["invoice_006.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Failed Services",
      quantity: 1,
      unitPrice: 50000,
      cgst: 4500,
      sgst: 4500,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'invalid',
      errorMessage: "PDF processing failed - corrupted file",
      processedBy: "OCR Engine",
      lastModified: "2024-01-18T16:30:00Z"
    },
    // 10 Dummy records for EWB generation testing
    {
      id: "pdf-dummy-1",
      invoiceNumber: "INV-2024-100",
      vendorName: "Alpha Solutions Ltd",
      vendorEmail: "billing@alphasolutions.com",
      vendorGstin: "29ALPHA1234567A1",
      amount: 45000,
      taxAmount: 8100,
      totalAmount: 53100,
      invoiceDate: "2024-01-21",
      dueDate: "2024-02-21",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_100.pdf",
      status: 'ready_for_review',
      processingDate: "2024-01-21T09:00:00Z",
      attachments: ["invoice_100.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Software Development Services",
      quantity: 1,
      unitPrice: 45000,
      cgst: 4050,
      sgst: 4050,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'valid',
      processedBy: "OCR Engine",
      lastModified: "2024-01-21T09:00:00Z"
    },
    {
      id: "pdf-dummy-2",
      invoiceNumber: "INV-2024-101",
      vendorName: "Beta Technologies Inc",
      vendorEmail: "billing@betatech.com",
      vendorGstin: "07BETA1234567A1B",
      amount: 78000,
      taxAmount: 14040,
      totalAmount: 92040,
      invoiceDate: "2024-01-21",
      dueDate: "2024-02-21",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_101.pdf",
      status: 'ready_for_review',
      processingDate: "2024-01-21T09:15:00Z",
      attachments: ["invoice_101.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Cloud Infrastructure Services",
      quantity: 1,
      unitPrice: 78000,
      cgst: 7020,
      sgst: 7020,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'valid',
      processedBy: "OCR Engine",
      lastModified: "2024-01-21T09:15:00Z"
    },
    {
      id: "pdf-dummy-3",
      invoiceNumber: "INV-2024-102",
      vendorName: "Gamma Systems Pvt Ltd",
      vendorEmail: "billing@gammasystems.com",
      vendorGstin: "19GAMMA1234567A1",
      amount: 125000,
      taxAmount: 22500,
      totalAmount: 147500,
      invoiceDate: "2024-01-21",
      dueDate: "2024-02-21",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_102.pdf",
      status: 'ready_for_review',
      processingDate: "2024-01-21T09:30:00Z",
      attachments: ["invoice_102.pdf"],
      paymentTerms: "Net 45",
      itemDescription: "Enterprise Software Solutions",
      quantity: 1,
      unitPrice: 125000,
      cgst: 11250,
      sgst: 11250,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'valid',
      processedBy: "OCR Engine",
      lastModified: "2024-01-21T09:30:00Z"
    },
    {
      id: "pdf-dummy-4",
      invoiceNumber: "INV-2024-103",
      vendorName: "Delta Consulting Ltd",
      vendorEmail: "billing@deltaconsulting.com",
      vendorGstin: "33DELTA1234567A1",
      amount: 95000,
      taxAmount: 17100,
      totalAmount: 112100,
      invoiceDate: "2024-01-21",
      dueDate: "2024-02-21",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_103.pdf",
      status: 'ready_for_review',
      processingDate: "2024-01-21T09:45:00Z",
      attachments: ["invoice_103.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Business Consulting Services",
      quantity: 1,
      unitPrice: 95000,
      cgst: 8550,
      sgst: 8550,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'valid',
      processedBy: "OCR Engine",
      lastModified: "2024-01-21T09:45:00Z"
    },
    {
      id: "pdf-dummy-5",
      invoiceNumber: "INV-2024-104",
      vendorName: "Epsilon Digital Corp",
      vendorEmail: "billing@epsilondigital.com",
      vendorGstin: "29EPSILON1234567A",
      amount: 65000,
      taxAmount: 11700,
      totalAmount: 76700,
      invoiceDate: "2024-01-21",
      dueDate: "2024-02-21",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_104.pdf",
      status: 'ready_for_review',
      processingDate: "2024-01-21T10:00:00Z",
      attachments: ["invoice_104.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Digital Marketing Services",
      quantity: 1,
      unitPrice: 65000,
      cgst: 5850,
      sgst: 5850,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'valid',
      processedBy: "OCR Engine",
      lastModified: "2024-01-21T10:00:00Z"
    },
    {
      id: "pdf-dummy-6",
      invoiceNumber: "INV-2024-105",
      vendorName: "Zeta Analytics Ltd",
      vendorEmail: "billing@zetaanalytics.com",
      vendorGstin: "07ZETA1234567A1B",
      amount: 110000,
      taxAmount: 19800,
      totalAmount: 129800,
      invoiceDate: "2024-01-21",
      dueDate: "2024-02-21",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_105.pdf",
      status: 'ready_for_review',
      processingDate: "2024-01-21T10:15:00Z",
      attachments: ["invoice_105.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Data Analytics Platform",
      quantity: 1,
      unitPrice: 110000,
      cgst: 9900,
      sgst: 9900,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'valid',
      processedBy: "OCR Engine",
      lastModified: "2024-01-21T10:15:00Z"
    },
    {
      id: "pdf-dummy-7",
      invoiceNumber: "INV-2024-106",
      vendorName: "Eta Security Inc",
      vendorEmail: "billing@etasecurity.com",
      vendorGstin: "19ETA1234567A1B2",
      amount: 85000,
      taxAmount: 15300,
      totalAmount: 100300,
      invoiceDate: "2024-01-21",
      dueDate: "2024-02-21",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_106.pdf",
      status: 'ready_for_review',
      processingDate: "2024-01-21T10:30:00Z",
      attachments: ["invoice_106.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Cybersecurity Services",
      quantity: 1,
      unitPrice: 85000,
      cgst: 7650,
      sgst: 7650,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'valid',
      processedBy: "OCR Engine",
      lastModified: "2024-01-21T10:30:00Z"
    },
    {
      id: "pdf-dummy-8",
      invoiceNumber: "INV-2024-107",
      vendorName: "Theta Networks Pvt Ltd",
      vendorEmail: "billing@thetanetworks.com",
      vendorGstin: "33THETA1234567A1",
      amount: 72000,
      taxAmount: 12960,
      totalAmount: 84960,
      invoiceDate: "2024-01-21",
      dueDate: "2024-02-21",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_107.pdf",
      status: 'ready_for_review',
      processingDate: "2024-01-21T10:45:00Z",
      attachments: ["invoice_107.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Network Infrastructure Services",
      quantity: 1,
      unitPrice: 72000,
      cgst: 6480,
      sgst: 6480,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'valid',
      processedBy: "OCR Engine",
      lastModified: "2024-01-21T10:45:00Z"
    },
    {
      id: "pdf-dummy-9",
      invoiceNumber: "INV-2024-108",
      vendorName: "Iota Solutions Ltd",
      vendorEmail: "billing@iotasolutions.com",
      vendorGstin: "29IOTA1234567A1B",
      amount: 58000,
      taxAmount: 10440,
      totalAmount: 68440,
      invoiceDate: "2024-01-21",
      dueDate: "2024-02-21",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_108.pdf",
      status: 'ready_for_review',
      processingDate: "2024-01-21T11:00:00Z",
      attachments: ["invoice_108.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "IoT Development Services",
      quantity: 1,
      unitPrice: 58000,
      cgst: 5220,
      sgst: 5220,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'valid',
      processedBy: "OCR Engine",
      lastModified: "2024-01-21T11:00:00Z"
    },
    {
      id: "pdf-dummy-10",
      invoiceNumber: "INV-2024-109",
      vendorName: "Kappa Innovations Inc",
      vendorEmail: "billing@kappainnovations.com",
      vendorGstin: "07KAPPA1234567A1",
      amount: 135000,
      taxAmount: 24300,
      totalAmount: 159300,
      invoiceDate: "2024-01-21",
      dueDate: "2024-02-21",
      source: 'pdf',
      sourceDetails: "PDF Upload - invoice_109.pdf",
      status: 'ready_for_review',
      processingDate: "2024-01-21T11:15:00Z",
      attachments: ["invoice_109.pdf"],
      paymentTerms: "Net 45",
      itemDescription: "AI/ML Platform Development",
      quantity: 1,
      unitPrice: 135000,
      cgst: 12150,
      sgst: 12150,
      igst: 0,
      hasQrInEgam: false,
      egamStatus: 'not_found',
      validationStatus: 'valid',
      processedBy: "OCR Engine",
      lastModified: "2024-01-21T11:15:00Z"
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
      status: 'processing',
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
      status: 'processing',
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
    },
    {
      id: "email-4",
      invoiceNumber: "INV-2024-006",
      vendorName: "Data Analytics Corp",
      vendorEmail: "billing@dataanalytics.com",
      vendorGstin: "29DATA1234567A1B",
      amount: 95000,
      taxAmount: 17100,
      totalAmount: 112100,
      invoiceDate: "2024-01-20",
      dueDate: "2024-02-20",
      source: 'email',
      sourceDetails: "Email Queue - Data Analytics Invoice",
      status: 'processed',
      processingDate: "2024-01-19T11:30:00Z",
      attachments: ["data_analytics_invoice.pdf"],
      paymentTerms: "Net 30",
      itemDescription: "Data Analytics Services",
      quantity: 1,
      unitPrice: 95000,
      cgst: 8550,
      sgst: 8550,
      igst: 0,
      hasQrInEgam: true,
      egamStatus: 'found',
      validationStatus: 'valid',
      processedBy: "Email Processor",
      lastModified: "2024-01-19T11:30:00Z"
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
  const [currentInvoiceIndex, setCurrentInvoiceIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState<ConsolidatedInvoice | null>(null);
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
    const processingInvoices = consolidatedData.filter(inv => inv.status === 'processing').length;
    const failureInvoices = consolidatedData.filter(inv => inv.status === 'failure').length;
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
      processingInvoices,
      failureInvoices,
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
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Success</Badge>;
      case 'failure':
        return <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"><XCircle className="h-3 w-3" />Failure</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1"><Clock className="h-3 w-3" />Processing</Badge>;
      case 'processed':
        return <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Processed</Badge>;
      case 'ready_for_review':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1"><Eye className="h-3 w-3" />Ready for Review</Badge>;
      case 'ewb_generated':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1"><CheckCircle className="h-3 w-3" />EWB Generated</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"><XCircle className="h-3 w-3" />Fail</Badge>;
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
    if (invoice.source === 'qr' && invoice.status === 'failure' && invoice.egamStatus === 'not_found') {
      return;
    }
    const index = filteredInvoices.findIndex(inv => inv.id === invoice.id);
    setCurrentInvoiceIndex(index);
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleNextInvoice = () => {
    const nextIndex = (currentInvoiceIndex + 1) % filteredInvoices.length;
    setCurrentInvoiceIndex(nextIndex);
    setSelectedInvoice(filteredInvoices[nextIndex]);
  };

  const handlePreviousInvoice = () => {
    const prevIndex = currentInvoiceIndex === 0 ? filteredInvoices.length - 1 : currentInvoiceIndex - 1;
    setCurrentInvoiceIndex(prevIndex);
    setSelectedInvoice(filteredInvoices[prevIndex]);
    setIsEditing(false);
    setEditedInvoice(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInvoice({ ...selectedInvoice! });
  };

  const handleSave = () => {
    if (editedInvoice) {
      setSelectedInvoice(editedInvoice);
      setIsEditing(false);
      setEditedInvoice(null);
      toast({
        title: "Invoice Updated",
        description: "Invoice details have been saved successfully.",
        variant: "success",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInvoice(null);
  };

  const handleFieldChange = (field: keyof ConsolidatedInvoice, value: string) => {
    if (editedInvoice) {
      setEditedInvoice({ ...editedInvoice, [field]: value });
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to clipboard.",
      variant: "success",
    });
  };

  const handleGenerateEWB = async () => {
    if (!selectedInvoice) return;

    try {
      // Generate a random EWB number
      const ewbNumber = `EWB${Math.random().toString().substr(2, 12)}`;
      
      // Update the invoice status and EWB number
      const updatedInvoice = {
        ...selectedInvoice,
        status: 'ewb_generated' as const,
        ewbNumber: ewbNumber,
        egamStatus: 'found' as const,
        hasQrInEgam: true
      };

      // Update the selected invoice
      setSelectedInvoice(updatedInvoice);

      // Update the consolidated data
      setConsolidatedData(prevData => 
        prevData.map(invoice => 
          invoice.id === selectedInvoice.id ? updatedInvoice : invoice
        )
      );

      toast({
        title: "EWB Generated Successfully",
        description: `E-Way Bill generated with number: ${ewbNumber}`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate EWB. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDisplayIRN = (invoice: ConsolidatedInvoice) => {
    // If EWB is generated, EGAM must be found, so ensure IRN is not null/NA
    if (invoice.ewbNumber && invoice.egamStatus === 'found') {
      return invoice.irn || invoice.qrCode || `IRN${Math.random().toString().substr(2, 12)}`;
    }
    return invoice.irn || invoice.qrCode || 'N/A';
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
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failure">Failure</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="ready_for_review">Ready for Review</SelectItem>
                  <SelectItem value="ewb_generated">EWB Generated</SelectItem>
                  <SelectItem value="fail">Fail</SelectItem>
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
                      IRN
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
                  <TableHead className="font-semibold text-foreground">EWB</TableHead>
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
                      !(invoice.source === 'qr' && invoice.status === 'failure' && invoice.egamStatus === 'not_found') 
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
                    <TableCell>
                      {invoice.ewbNumber ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono">{invoice.ewbNumber}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyToClipboard(invoice.ewbNumber!);
                            }}
                            className="p-1 h-6 w-6"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{formatDateTime(invoice.processingDate)}</TableCell>
                    <TableCell>
                      {!(invoice.source === 'qr' && invoice.status === 'failure' && invoice.egamStatus === 'not_found') && (
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
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
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
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousInvoice}
                  disabled={filteredInvoices.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextInvoice}
                  disabled={filteredInvoices.length <= 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              {/* Document Preview - Left Panel */}
                  <Card>
                    <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Document Preview</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                      </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {selectedInvoice.attachments[0] || 'invoice.pdf'} • Processed by: {selectedInvoice.processedBy}
                  </div>
                    </CardHeader>
                <CardContent>
                  {/* Invoice Preview */}
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="text-center mb-4">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">TAX INVOICE</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">GST Invoice</p>
                      </div>
                    
                    {/* From Section */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">From:</h3>
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <p className="font-medium">{selectedInvoice.vendorName}</p>
                        <p>123 Business Park, Mumbai, Maharashtra 400001</p>
                        <p>GSTIN: {selectedInvoice.vendorGstin}</p>
                        </div>
                        </div>
                    
                    {/* Bill To Section */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Bill To:</h3>
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <p className="font-medium">XYZ Corporation Ltd</p>
                        <p>456 Corporate Plaza, Delhi, Delhi 110001</p>
                      </div>
                      </div>
                    
                    {/* Invoice Details */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Invoice Details:</h3>
                       <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                         <p><span className="font-medium">Invoice No:</span> {selectedInvoice.invoiceNumber}</p>
                         <p><span className="font-medium">Date:</span> {formatDateTime(selectedInvoice.invoiceDate)}</p>
                         <p><span className="font-medium">IRN:</span> {getDisplayIRN(selectedInvoice)}</p>
                         {selectedInvoice.ewbNumber && (
                           <p><span className="font-medium">EWB:</span> {selectedInvoice.ewbNumber}</p>
                         )}
                        </div>
                        </div>
                    
                    {/* Line Items Table */}
                    <div className="mb-4">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1">Description</th>
                            <th className="text-center py-1">Qty</th>
                            <th className="text-right py-1">Rate</th>
                            <th className="text-right py-1">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-1">{selectedInvoice.itemDescription}</td>
                            <td className="text-center py-1">{selectedInvoice.quantity}</td>
                            <td className="text-right py-1">{formatCurrency(selectedInvoice.unitPrice)}</td>
                            <td className="text-right py-1">{formatCurrency(selectedInvoice.amount)}</td>
                          </tr>
                        </tbody>
                      </table>
                      </div>
                    
                    {/* Summary */}
                    <div className="text-right text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>CGST (9%):</span>
                        <span>{formatCurrency(selectedInvoice.cgst)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SGST (9%):</span>
                        <span>{formatCurrency(selectedInvoice.sgst)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-1">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-4 text-center text-xs text-gray-600 dark:text-gray-400">
                      <p>Thank you for your business!</p>
                      <p>Payment Terms: {selectedInvoice.paymentTerms}</p>
                    </div>
                      </div>
                    </CardContent>
                  </Card>

              {/* Document Details - Right Panel */}
                  <Card>
                    <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Document Details</span>
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <Button variant="outline" size="sm" onClick={handleCancel}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" onClick={handleEdit}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          {selectedInvoice.status === 'ready_for_review' && (
                            <Button size="sm" onClick={handleGenerateEWB} className="bg-purple-600 hover:bg-purple-700">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Generate EWB
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">Basic Information</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Invoice No*</label>
                        <Input 
                          value={isEditing ? editedInvoice?.invoiceNumber || '' : selectedInvoice.invoiceNumber} 
                          onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
                          readOnly={!isEditing}
                        />
                              </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date*</label>
                        <Input 
                          value={isEditing ? editedInvoice?.invoiceDate || '' : formatDateTime(selectedInvoice.invoiceDate)} 
                          onChange={(e) => handleFieldChange('invoiceDate', e.target.value)}
                          readOnly={!isEditing}
                        />
                              </div>
                              </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">IRN*</label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            value={isEditing ? editedInvoice?.irn || '' : getDisplayIRN(selectedInvoice)} 
                            onChange={(e) => handleFieldChange('irn', e.target.value)}
                            readOnly={!isEditing}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToClipboard(getDisplayIRN(selectedInvoice))}
                            className="p-1"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                              </div>
                              </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">GSTIN*</label>
                        <Input 
                          value={isEditing ? editedInvoice?.vendorGstin || '' : selectedInvoice.vendorGstin} 
                          onChange={(e) => handleFieldChange('vendorGstin', e.target.value)}
                          readOnly={!isEditing}
                        />
                              </div>
                              </div>

                    {/* EWB Number Display */}
                    {selectedInvoice.ewbNumber && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">EWB Number</label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            value={selectedInvoice.ewbNumber} 
                            readOnly
                            className="bg-green-50 border-green-200"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToClipboard(selectedInvoice.ewbNumber!)}
                            className="p-1"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                            </div>
                      </div>
                    )}
                          </div>

                  {/* Parties */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">Parties</h4>
                    
                            <div className="space-y-2">
                      <label className="text-sm font-medium">Vendor Name*</label>
                      <Input 
                        value={isEditing ? editedInvoice?.vendorName || '' : selectedInvoice.vendorName} 
                        onChange={(e) => handleFieldChange('vendorName', e.target.value)}
                        readOnly={!isEditing}
                      />
                              </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vendor Address</label>
                      <Input 
                        value="123 Business Park, Mumbai, Maharashtra 400001" 
                        readOnly
                      />
                              </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Buyer Name*</label>
                      <Input 
                        value="XYZ Corporation Ltd" 
                        readOnly
                      />
                          </div>

                            <div className="space-y-2">
                      <label className="text-sm font-medium">Buyer Address</label>
                      <Input 
                        value="456 Corporate Plaza, Delhi, Delhi 110001" 
                        readOnly
                      />
                              </div>
                              </div>

                  {/* Financial Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">Financial Details</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount*</label>
                        <Input 
                          value={isEditing ? editedInvoice?.amount?.toString() || '' : formatCurrency(selectedInvoice.amount)} 
                          onChange={(e) => handleFieldChange('amount', e.target.value)}
                          readOnly={!isEditing}
                        />
                            </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tax Amount</label>
                        <Input 
                          value={isEditing ? editedInvoice?.taxAmount?.toString() || '' : formatCurrency(selectedInvoice.taxAmount)} 
                          onChange={(e) => handleFieldChange('taxAmount', e.target.value)}
                          readOnly={!isEditing}
                        />
                          </div>
                            </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Payment Terms</label>
                        <Input 
                          value={isEditing ? editedInvoice?.paymentTerms || '' : selectedInvoice.paymentTerms} 
                          onChange={(e) => handleFieldChange('paymentTerms', e.target.value)}
                          readOnly={!isEditing}
                        />
                          </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Due Date</label>
                        <Input 
                          value={isEditing ? editedInvoice?.dueDate || '' : formatDateTime(selectedInvoice.dueDate)} 
                          onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                          readOnly={!isEditing}
                        />
                        </div>
                </div>
                      </div>

                  {/* Processing Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">Processing Information</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Source</label>
                        <div className="flex items-center space-x-2">
                          {getSourceIcon(selectedInvoice.source)}
                          <span className="text-sm">{getSourceLabel(selectedInvoice.source)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <div>{getStatusBadge(selectedInvoice.status)}</div>
                      </div>
                      </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Validation Status</label>
                        <div>{getValidationBadge(selectedInvoice.validationStatus)}</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">EGAM Status</label>
                        <div>{getEgamBadge(selectedInvoice.egamStatus)}</div>
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
