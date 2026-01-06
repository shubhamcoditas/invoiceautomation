/**
 * Default EA PDF Configuration
 * 
 * This file handles the default PDF that is always available for download
 * in the Emirates Airlines module.
 * 
 * To use your own PDF:
 * 1. Place your PDF file in the 'assets' directory with the exact filename:
 *    '2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf'
 * 2. The system will automatically serve it
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default PDF configuration
export const DEFAULT_EA_PDF = {
  fileName: '2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf',
  invoiceNo: 'KAINMD55682',
  date: '2025-11-12',
  entityId: 'emirates',
  id: 'default-ea-pdf-001', // Static ID for the default PDF
};

// Get the path to the default PDF file
export function getDefaultPDFPath(): string {
  // Try multiple possible locations
  // Since this file is in server/routes/, we need to go up two levels to reach project root
  const possiblePaths = [
    join(__dirname, '..', '..', 'assets', DEFAULT_EA_PDF.fileName),
    join(__dirname, '..', '..', 'storage', 'pdfs', 'emirates', DEFAULT_EA_PDF.fileName),
    join(__dirname, '..', '..', 'public', DEFAULT_EA_PDF.fileName),
    join(__dirname, '..', '..', DEFAULT_EA_PDF.fileName),
  ];

  for (const pdfPath of possiblePaths) {
    if (existsSync(pdfPath)) {
      return pdfPath;
    }
  }

  return possiblePaths[0]; // Return first path even if it doesn't exist (for error handling)
}

// Check if default PDF exists
export function defaultPDFExists(): boolean {
  return existsSync(getDefaultPDFPath());
}

// Get default PDF as buffer
export function getDefaultPDFBuffer(): Buffer | null {
  const pdfPath = getDefaultPDFPath();
  if (!existsSync(pdfPath)) {
    return null;
  }
  try {
    return readFileSync(pdfPath);
  } catch (error) {
    console.error('Error reading default PDF:', error);
    return null;
  }
}

// Get default PDF metadata (always available, even if file doesn't exist)
export function getDefaultPDFMetadata() {
  return {
    id: DEFAULT_EA_PDF.id,
    entityId: DEFAULT_EA_PDF.entityId,
    fileName: DEFAULT_EA_PDF.fileName,
    filePath: getDefaultPDFPath(),
    invoiceNo: DEFAULT_EA_PDF.invoiceNo,
    date: DEFAULT_EA_PDF.date,
    irn: '',
    gstin: '',
    amount: '0',
    status: 'processed',
    extractedAt: new Date().toISOString(),
  };
}

