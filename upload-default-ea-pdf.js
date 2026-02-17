/**
 * Script to upload the default EA PDF that will always be downloaded
 * 
 * Usage:
 *   node upload-default-ea-pdf.js <path-to-pdf-file>
 * 
 * The PDF file should be named: 2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf
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
  console.error('Usage: node upload-default-ea-pdf.js <path-to-pdf-file>');
  console.error('');
  console.error('Example:');
  console.error('  node upload-default-ea-pdf.js "./2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf"');
  process.exit(1);
}

const pdfPath = resolve(args[0]);
const defaultFileName = '2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf';

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
    // Use the default filename regardless of the actual filename
    const fileName = defaultFileName;
    const invoiceNo = 'KAINMD55682'; // Extract from filename
    const date = '2025-11-12'; // Extract from filename
    
    const url = new URL('http://localhost:5000/api/ea/upload-pdf');
    url.searchParams.append('fileName', fileName);
    url.searchParams.append('invoiceNo', invoiceNo);
    url.searchParams.append('date', date);
    url.searchParams.append('irn', '');
    url.searchParams.append('gstin', '');
    url.searchParams.append('amount', '0');

    console.log(`\nUploading default EA PDF...`);
    console.log(`File Name: ${fileName}`);
    console.log(`Invoice No: ${invoiceNo}`);
    console.log(`Date: ${date}`);
    console.log(`URL: ${url.toString()}`);

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

    console.log('\n✓ Default EA PDF uploaded successfully!');
    console.log(`  ID: ${result.id}`);
    console.log(`  File Name: ${result.fileName}`);
    console.log(`  Invoice No: ${result.invoiceNo}`);
    console.log(`  Entity: ${result.entityId}`);
    console.log(`\nThis PDF will now be downloaded every time users click the download button.`);
    console.log(`Users can also search for it using Invoice No: ${invoiceNo}`);
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

