/**
 * Helper script to upload a PDF file to Emirates Airlines module
 * 
 * Usage:
 *   node upload-ea-pdf.js <path-to-pdf-file> [invoiceNo] [date] [irn] [gstin] [amount]
 * 
 * Example:
 *   node upload-ea-pdf.js ./my-invoice.pdf INV-2025-001 2025-01-15 ABC123XYZ 27ABCDE1234F1Z5 10000.00
 */

import { readFileSync } from 'fs';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, basename } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: node upload-ea-pdf.js <path-to-pdf-file> [invoiceNo] [date] [irn] [gstin] [amount]');
  console.error('');
  console.error('Example:');
  console.error('  node upload-ea-pdf.js ./invoice.pdf INV-2025-001 2025-01-15 ABC123XYZ 27ABCDE1234F1Z5 10000.00');
  process.exit(1);
}

const pdfPath = resolve(args[0]);
const invoiceNo = args[1] || basename(pdfPath, '.pdf');
const date = args[2] || new Date().toISOString().split('T')[0];
const irn = args[3] || '';
const gstin = args[4] || '';
const amount = args[5] || '0';

// Validate PDF file exists
if (!existsSync(pdfPath)) {
  console.error(`Error: PDF file not found: ${pdfPath}`);
  process.exit(1);
}

// Check if it's a PDF file
if (!pdfPath.toLowerCase().endsWith('.pdf')) {
  console.error('Error: File must be a PDF (.pdf)');
  process.exit(1);
}

// Read the PDF file
let pdfBuffer;
try {
  pdfBuffer = readFileSync(pdfPath);
  console.log(`✓ Read PDF file: ${basename(pdfPath)} (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
} catch (error) {
  console.error(`Error reading PDF file:`, error.message);
  process.exit(1);
}

// Upload to API
async function uploadPDF() {
  try {
    const fileName = basename(pdfPath);
    const url = new URL('http://localhost:5000/api/ea/upload-pdf');
    url.searchParams.append('fileName', fileName);
    url.searchParams.append('invoiceNo', invoiceNo);
    url.searchParams.append('date', date);
    if (irn) url.searchParams.append('irn', irn);
    if (gstin) url.searchParams.append('gstin', gstin);
    if (amount) url.searchParams.append('amount', amount);

    console.log(`\nUploading to: ${url.toString()}`);
    console.log(`Invoice No: ${invoiceNo}`);
    console.log(`Date: ${date}`);
    if (irn) console.log(`IRN: ${irn}`);
    if (gstin) console.log(`GSTIN: ${gstin}`);
    if (amount) console.log(`Amount: ${amount}`);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/pdf',
      },
      body: pdfBuffer,
    });

    // Get response text first to check content type
    const responseText = await response.text();
    
    if (!response.ok) {
      // Try to parse as JSON, but handle HTML errors
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(responseText);
        errorMessage = errorJson.error || errorMessage;
      } catch (e) {
        // If it's not JSON, it's probably an HTML error page
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
          errorMessage = `Server returned HTML error page. The endpoint might not exist or the server might not be running correctly.`;
          console.error(`\nServer response (first 500 chars):\n${responseText.substring(0, 500)}`);
        } else {
          errorMessage = responseText.substring(0, 200);
        }
      }
      throw new Error(errorMessage);
    }

    // Parse successful response
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 200)}`);
    }
    console.log('\n✓ PDF uploaded successfully!');
    console.log(`  ID: ${result.id}`);
    console.log(`  File Name: ${result.fileName}`);
    console.log(`  Invoice No: ${result.invoiceNo}`);
    console.log(`  Entity: ${result.entityId}`);
    console.log(`\nThe PDF is now available in the Emirates Airlines module.`);
    console.log(`Users can search for it using Invoice No: ${invoiceNo}`);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('\n✗ Error: Could not connect to server.');
      console.error('  Make sure the server is running: npm run dev');
    } else {
      console.error('\n✗ Error uploading PDF:', error.message);
    }
    process.exit(1);
  }
}

uploadPDF();

