# Enhancements Usage Guide

This document explains how to use all the new enhancements that have been added to the Invoice Automation Portal.

## 📋 Table of Contents

1. [Date & Currency Formatting](#date--currency-formatting)
2. [Status Badges with Icons](#status-badges-with-icons)
3. [Enhanced Toast Notifications](#enhanced-toast-notifications)
4. [Chart Components](#chart-components)
5. [Enhanced Table Component](#enhanced-table-component)
6. [File Upload with Drag & Drop](#file-upload-with-drag--drop)
7. [Error Messages](#error-messages)
8. [Skeleton Loaders](#skeleton-loaders)
9. [Export Functionality](#export-functionality)

---

## 📅 Date & Currency Formatting

### Usage

```tsx
import { formatCurrency, formatDate, formatDateTime, formatRelativeTime, formatNumber, formatPercentage } from "@/lib/utils";

// Currency formatting
const amount = 125000.50;
formatCurrency(amount); // ₹1,25,000.50
formatCurrency(amount, false); // 1,25,000.50 (without ₹ symbol)

// Date formatting
const date = new Date();
formatDate(date); // "22 Jan '24"
formatDateTime(date); // "22 Jan '24 14:30:00"
formatRelativeTime(date); // "2 hours ago"

// Number formatting
formatNumber(1234567); // "12,34,567"
formatPercentage(85.5); // "85.5%"
```

---

## 🏷️ Status Badges with Icons

### Usage

```tsx
import { Badge } from "@/components/ui/badge";

// Badge with status variant (includes icon automatically)
<Badge variant="success" showIcon>Success</Badge>
<Badge variant="error" showIcon>Error</Badge>
<Badge variant="pending" showIcon>Pending</Badge>
<Badge variant="processing" showIcon>Processing</Badge>
<Badge variant="ready_for_review" showIcon>Ready for Review</Badge>
<Badge variant="queued" showIcon>Queued</Badge>
<Badge variant="in_progress" showIcon>In Progress</Badge>

// Custom badge without icon
<Badge variant="success" showIcon={false}>Success</Badge>

// Custom icon styling
<Badge variant="success" iconClassName="h-4 w-4">Success</Badge>
```

### Available Variants
- `success` - Green with checkmark icon
- `error` / `failed` - Red with alert icon
- `pending` - Yellow with clock icon
- `processing` - Blue with spinning loader
- `ready_for_review` - Purple with eye icon
- `queued` - Gray with clock icon
- `in_progress` - Indigo with spinning loader
- `not_attempted` - Gray with minus icon

---

## 🍞 Enhanced Toast Notifications

### Usage

```tsx
import { useToast, successToast, errorToast, infoToast, warningToast } from "@/hooks/use-toast";

function MyComponent() {
  const { toast } = useToast();

  // Basic toast
  toast({
    title: "Success",
    description: "Operation completed successfully",
    variant: "default",
  });

  // Using helper functions
  successToast("Success!", "Operation completed successfully");
  errorToast("Error!", "Something went wrong");
  infoToast("Info", "Here's some information");
  warningToast("Warning", "Please be careful");

  // Toast with action
  toast({
    title: "File uploaded",
    description: "invoice.pdf has been uploaded",
    action: (
      <ToastAction altText="Undo">Undo</ToastAction>
    ),
  });
}
```

### Helper Functions
- `successToast(title, description?, action?)` - Green toast
- `errorToast(title, description?, action?)` - Red toast
- `infoToast(title, description?, action?)` - Blue toast
- `warningToast(title, description?, action?)` - Yellow toast

---

## 📊 Chart Components

### Usage

```tsx
import { 
  SimpleLineChart, 
  SimpleBarChart, 
  SimplePieChart, 
  SimpleAreaChart,
  SimpleComposedChart 
} from "@/components/ui/charts";

const data = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 150 },
  { month: "Mar", value: 200 },
];

// Line Chart
<SimpleLineChart
  data={data}
  dataKey="value"
  xAxisKey="month"
  title="Monthly Trends"
  description="Revenue over time"
  strokeColor="#3b82f6"
/>

// Bar Chart
<SimpleBarChart
  data={data}
  dataKey="value"
  xAxisKey="month"
  title="Monthly Comparison"
  barColor="#10b981"
/>

// Pie Chart
<SimplePieChart
  data={[
    { name: "Success", value: 75 },
    { name: "Failed", value: 25 }
  ]}
  title="Status Distribution"
/>

// Area Chart
<SimpleAreaChart
  data={data}
  dataKey="value"
  xAxisKey="month"
  title="Area Chart"
/>

// Composed Chart (Bar + Line)
<SimpleComposedChart
  data={data}
  barDataKey="value"
  lineDataKey="value"
  xAxisKey="month"
  title="Composed Chart"
/>
```

---

## 📋 Enhanced Table Component

### Usage

```tsx
import { EnhancedTable, Column } from "@/components/ui/enhanced-table";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  status: string;
}

const columns: Column<Invoice>[] = [
  {
    id: "invoiceNumber",
    header: "Invoice Number",
    accessorKey: "invoiceNumber",
    sortable: true,
    filterable: true,
    type: "text",
  },
  {
    id: "amount",
    header: "Amount",
    accessorKey: "amount",
    sortable: true,
    type: "currency",
  },
  {
    id: "date",
    header: "Date",
    accessorKey: "date",
    sortable: true,
    type: "datetime",
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    sortable: true,
    type: "status",
  },
];

function MyTable() {
  const data: Invoice[] = [
    { id: "1", invoiceNumber: "INV-001", amount: 125000, date: "2024-01-15", status: "success" },
    // ...
  ];

  return (
    <EnhancedTable
      data={data}
      columns={columns}
      searchable={true}
      filterable={true}
      exportable={true}
      loading={false}
      pageSize={10}
      showPagination={true}
      onRowClick={(row) => console.log("Clicked:", row)}
      onExport={(data) => console.log("Export:", data)}
    />
  );
}
```

### Features
- ✅ Search across all columns
- ✅ Sort by clicking column headers
- ✅ Filter by column
- ✅ Show/hide columns
- ✅ Pagination
- ✅ Export to CSV
- ✅ Custom cell rendering
- ✅ Loading states
- ✅ Row click handlers

### Column Types
- `text` - Plain text
- `number` - Numeric values
- `currency` - Formatted currency (₹)
- `date` - Date formatting
- `datetime` - Date and time
- `relativeTime` - Relative time ("2 hours ago")
- `status` - Status badge with icon
- `custom` - Custom cell renderer

---

## 📤 File Upload with Drag & Drop

### Usage

```tsx
import { FileUpload } from "@/components/ui/file-upload";

function MyUploadComponent() {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, "uploading" | "success" | "error">>({});

  const handleFilesSelected = async (files: File[]) => {
    // Handle file upload
    files.forEach(async (file, index) => {
      const fileId = `${file.name}-${file.size}-${index}`;
      setUploadStatus(prev => ({ ...prev, [fileId]: "uploading" }));

      try {
        // Upload file
        // ... upload logic ...
        
        setUploadStatus(prev => ({ ...prev, [fileId]: "success" }));
      } catch (error) {
        setUploadStatus(prev => ({ ...prev, [fileId]: "error" }));
      }
    });
  };

  return (
    <FileUpload
      onFilesSelected={handleFilesSelected}
      accept={{
        "application/pdf": [".pdf"],
        "image/*": [".png", ".jpg", ".jpeg"],
      }}
      maxFiles={10}
      maxSize={10 * 1024 * 1024} // 10MB
      multiple={true}
      showPreview={true}
      uploadProgress={uploadProgress}
      uploadStatus={uploadStatus}
    />
  );
}
```

### Features
- ✅ Drag & drop support
- ✅ File type validation
- ✅ File size validation
- ✅ Multiple file upload
- ✅ Upload progress tracking
- ✅ Upload status indicators
- ✅ File preview
- ✅ Remove files

---

## ⚠️ Error Messages

### Usage

```tsx
import { ErrorMessage, InlineError } from "@/components/ui/error-message";

// Full error message with actions
<ErrorMessage
  title="Upload Failed"
  message="The file could not be uploaded. Please check your connection and try again."
  type="error"
  onRetry={() => handleRetry()}
  onDismiss={() => setError(null)}
  actionLabel="Learn More"
  actionUrl="https://help.example.com"
/>

// Inline error for form fields
<InlineError message="This field is required" />
```

### Error Types
- `error` - Red destructive styling
- `warning` - Yellow warning styling
- `info` - Blue info styling

---

## 💀 Skeleton Loaders

### Usage

```tsx
import { 
  Loading, 
  TableLoading, 
  CardLoading, 
  Skeleton,
  TableRowSkeleton 
} from "@/components/ui/loading";

// Basic loading spinner
<Loading text="Loading data..." size="lg" fullHeight />

// Table skeleton
<TableLoading columns={5} rows={3} />

// Card skeleton
<CardLoading lines={3} />

// Custom skeleton
<Skeleton variant="rectangular" width="100%" height="20px" />
<Skeleton variant="circular" width="40px" height="40px" />
<Skeleton variant="text" width="80%" />
```

---

## 📥 Export Functionality

### Usage

```tsx
import { exportToCSV, exportToExcel, exportToJSON, copyToClipboard, printData } from "@/lib/export-utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
}

const data: Invoice[] = [
  { id: "1", invoiceNumber: "INV-001", amount: 125000 },
];

const columns = [
  {
    key: "invoiceNumber",
    header: "Invoice Number",
    accessor: (row: Invoice) => row.invoiceNumber,
  },
  {
    key: "amount",
    header: "Amount",
    accessor: (row: Invoice) => row.amount,
    formatter: (value: number) => `₹${value.toLocaleString('en-IN')}`,
  },
];

// Export to CSV
exportToCSV(data, columns, "invoices.csv");

// Export to Excel
exportToExcel(data, columns, "invoices.xlsx", "Invoices");

// Export to JSON
exportToJSON(data, "invoices.json");

// Copy to clipboard
await copyToClipboard(data, columns);

// Print
printData(data, columns, "Invoice Report");
```

---

## 🎨 Best Practices

### 1. Always use formatting utilities
```tsx
// ❌ Bad
<div>{amount}</div>

// ✅ Good
<div>{formatCurrency(amount)}</div>
```

### 2. Use status badges for status fields
```tsx
// ❌ Bad
<span>{status}</span>

// ✅ Good
<Badge variant={status as any} showIcon>{status}</Badge>
```

### 3. Show loading states
```tsx
// ✅ Good
{loading ? <TableLoading columns={5} /> : <Table data={data} />}
```

### 4. Provide helpful error messages
```tsx
// ✅ Good
{error && (
  <ErrorMessage
    message={error}
    onRetry={handleRetry}
    actionLabel="Contact Support"
  />
)}
```

### 5. Use enhanced table for data display
```tsx
// ✅ Good - Enhanced table with all features
<EnhancedTable data={invoices} columns={columns} />
```

---

## 📚 Additional Resources

- [Recharts Documentation](https://recharts.org/)
- [Radix UI Components](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 🐛 Troubleshooting

### Charts not rendering
- Ensure `recharts` is installed: `npm install recharts`
- Check that data array is not empty
- Verify data keys match the chart configuration

### Table not showing data
- Check that column `accessorKey` matches data property names
- Ensure data array is not empty
- Check console for errors

### File upload not working
- Verify file size is within limits
- Check file type is in accepted types
- Ensure `onFilesSelected` handler is provided

### Export not working
- For Excel export, ensure `xlsx` package is installed
- Check browser console for errors
- Verify data is not empty

---

For more help, refer to the component source files in `client/src/components/ui/`.

