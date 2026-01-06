# Manual Steps to Fix PDF Processing History API

## Problem
The `/api/pdf-processing-history` API is not returning any data because:
1. The database table is empty
2. The server needs to be built before starting

## Solution Steps

### Step 1: Build the Project
```bash
npm run build
```
This will create the `dist/` directory with the compiled server code.

### Step 2: Add PDF Processing History Data

#### Option A: Using SQL Script (Recommended)
1. Open a SQLite client or command line
2. Navigate to your project directory
3. Run the SQL script:
```bash
sqlite3 "DB/invoice_automation.db" < add-pdf-history-data.sql
```

#### Option B: Using Node.js Script
```bash
node add-pdf-history-data.js
```

#### Option C: Using Existing Populate Script
```bash
npm run db:populate
```

### Step 3: Start the Server
```bash
npm start
```

### Step 4: Test the API
Open your browser or use a tool like Postman/curl to test:
```
GET http://localhost:5000/api/pdf-processing-history
```

## Expected Result
The API should now return 25 sample PDF processing history records with:
- Various document types (invoice, delivery-challan, boe, shipping-bill)
- Different EWB statuses (success, failed, not_attempted)
- Realistic vendor and buyer names
- Proper timestamps and amounts

## Sample API Response
```json
[
  {
    "id": "pdf-001",
    "entityId": "hsbc",
    "fileName": "invoice_001.pdf",
    "documentType": "invoice",
    "processedBy": "admin",
    "ewbStatus": "success",
    "processedAt": "2024-01-15T10:30:00.000Z",
    "invoiceNo": "INV-2024-001",
    "amount": "₹125,000.00",
    "vendorName": "ABC Technologies Pvt Ltd",
    "buyerName": "XYZ Corporation Ltd"
  },
  // ... more records
]
```

## Troubleshooting

### If the server still doesn't start:
1. Check if `dist/index.js` exists
2. If not, run `npm run build` again
3. Check for any TypeScript compilation errors

### If the API still returns empty data:
1. Check if the database file exists: `DB/invoice_automation.db`
2. Verify the table has data: `SELECT COUNT(*) FROM pdf_processing_history;`
3. Check the server logs for any errors

### If you get antivirus warnings:
1. Temporarily disable antivirus for the project folder
2. Or run the SQL script directly using a SQLite client
3. Or manually insert data using the database service

## Files Created
- `add-pdf-history-data.js` - Node.js script to add data
- `add-pdf-history-data.sql` - SQL script to add data
- `fix-and-start-server.js` - Complete fix script
- `test-api.html` - Simple HTML page to test the API

## Database Schema
The `pdf_processing_history` table has these columns:
- `id` - Primary key
- `entity_id` - Entity identifier (default: 'hsbc')
- `file_name` - Name of the PDF file
- `document_type` - Type of document (invoice, delivery-challan, boe, shipping-bill)
- `processed_by` - User who processed the document
- `ewb_status` - E-Way Bill status (success, failed, not_attempted)
- `processed_at` - Timestamp when processed
- `invoice_no` - Invoice number
- `amount` - Invoice amount
- `vendor_name` - Vendor company name
- `buyer_name` - Buyer company name
