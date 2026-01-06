# Emirates Airlines PDF Upload Guide

This guide explains how to add PDF files to the Emirates Airlines module so they can be searched and downloaded by users.

## Default PDF Configuration

The system is configured to always download a specific default PDF when users click the download button:
- **File Name**: `2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf`
- **Invoice No**: `KAINMD55682`

This PDF will be downloaded regardless of what the user searches for. To set up the default PDF, use the dedicated upload script (see below).

## Overview

The system now supports:
- **Searching** for PDFs by Document ID or PNR in the Emirates Airlines module
- **Downloading** PDF files directly from the search results
- **Uploading** PDF files to be associated with the Emirates Airlines entity

## How It Works

1. **PDF Storage**: PDF files are stored in `storage/pdfs/emirates/` directory
2. **Database**: PDF metadata (filename, invoice number, etc.) is stored in the `pdf_data` table with `entity_id = 'emirates'`
3. **Search**: Users can search by Document ID or PNR, and the system will find matching PDFs
4. **Download**: Users can download PDFs directly from the search results

## Setting Up the Default PDF

The default PDF (`2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf`) will always be downloaded when users click the download button. To upload it:

```bash
node upload-default-ea-pdf.js <path-to-pdf-file>
```

**Example:**
```bash
node upload-default-ea-pdf.js "./2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf"
```

**Note**: The file must be named exactly `2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf` for it to work as the default PDF.

## Adding Your PDF

### Method 1: Using the Upload Script (Recommended)

1. **Start the server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Upload your PDF** using the helper script:
   ```bash
   node upload-ea-pdf.js <path-to-your-pdf> [invoiceNo] [date] [irn] [gstin] [amount]
   ```

   **Example:**
   ```bash
   node upload-ea-pdf.js ./my-invoice.pdf INV-2025-001 2025-01-15 ABC123XYZ 27ABCDE1234F1Z5 10000.00
   ```

   **Parameters:**
   - `path-to-your-pdf` (required): Path to your PDF file
   - `invoiceNo` (optional): Invoice number (defaults to filename without extension)
   - `date` (optional): Date in YYYY-MM-DD format (defaults to today)
   - `irn` (optional): Invoice Reference Number
   - `gstin` (optional): GST Identification Number
   - `amount` (optional): Invoice amount

### Method 2: Using the API Directly

You can also upload PDFs using the API endpoint:

```bash
curl -X POST "http://localhost:5000/api/ea/upload-pdf?fileName=invoice.pdf&invoiceNo=INV-001&date=2025-01-15" \
  --data-binary "@./invoice.pdf" \
  -H "Content-Type: application/pdf"
```

## Searching for PDFs

Once your PDF is uploaded, users can search for it in the Emirates Airlines module:

1. Go to the **Emirates Invoice Downloader** section
2. Enter either:
   - **Ticket ID** (Document ID) - e.g., the invoice number
   - **PNR** (Passenger Name Record)
3. Click **Search Document**
4. If found, the PDF will be displayed with a download button

## API Endpoints

### Search Documents
```
GET /api/ea/search-document?documentId=<id>&pnr=<pnr>
```

### Download PDF
```
GET /api/ea/download/:id
```

### Upload PDF
```
POST /api/ea/upload-pdf?fileName=<name>&invoiceNo=<no>&date=<date>&irn=<irn>&gstin=<gstin>&amount=<amount>
Content-Type: application/pdf
[PDF binary data]
```

## Database Schema

The `pdf_data` table now includes:
- `file_path`: Path to the actual PDF file on disk
- `entity_id`: Set to `'emirates'` for Emirates Airlines PDFs

## File Storage

PDFs are stored in:
```
storage/pdfs/emirates/
```

Each file is given a unique UUID filename to prevent conflicts.

## Troubleshooting

### PDF not found in search
- Verify the PDF was uploaded with the correct `entity_id = 'emirates'`
- Check that the invoice number or PNR matches what you're searching for
- Ensure the server is running and the database is accessible

### Download fails
- Check that the file exists at the path stored in the database
- Verify file permissions on the storage directory
- Check server logs for errors

### Upload fails
- Ensure the server is running
- Check that the storage directory is writable
- Verify the PDF file is not corrupted
- Check file size (limit is 50MB)

## Notes

- All PDFs uploaded through the EA module are automatically associated with `entity_id = 'emirates'`
- The system supports searching by partial matches (LIKE queries)
- Multiple PDFs can match the same search criteria - the first result is shown
- File paths are stored relative to the server root

