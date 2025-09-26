import * as XLSX from 'xlsx';

export interface QRStringData {
  qrString: string;
  rowNumber: number;
}

export interface ExcelParseResult {
  qrStrings: QRStringData[];
  totalRows: number;
  fileName: string;
}

export function parseExcelForQRStrings(file: File): Promise<ExcelParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file'));
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const qrStrings: QRStringData[] = [];
        
        // Look for QR strings in the first column or any column that might contain QR data
        jsonData.forEach((row: any[], index) => {
          if (Array.isArray(row)) {
            row.forEach((cell, cellIndex) => {
              if (cell && typeof cell === 'string' && cell.trim()) {
                const trimmedCell = cell.trim();
                // Check if this looks like a QR string (contains common QR patterns)
                if (isQRString(trimmedCell)) {
                  qrStrings.push({
                    qrString: trimmedCell,
                    rowNumber: index + 1
                  });
                }
              }
            });
          }
        });

        resolve({
          qrStrings,
          totalRows: jsonData.length,
          fileName: file.name
        });
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + (error as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
}

function isQRString(str: string): boolean {
  // Common patterns in QR strings for invoices
  const qrPatterns = [
    /^[A-Z0-9]{15,}$/, // GSTIN pattern
    /^[A-Z0-9]{16,}$/, // IRN pattern
    /^[A-Z0-9]{20,}$/, // Long alphanumeric strings
    /.*[A-Z]{2}[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[A-Z0-9]{1}.*/, // GSTIN in QR
    /.*[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[A-Z0-9]{1}.*/, // GSTIN without state code
  ];

  // Check if string is long enough to be a QR string (minimum 15 characters)
  if (str.length < 15) return false;

  // Check against patterns
  return qrPatterns.some(pattern => pattern.test(str));
}

export function validateQRString(qrString: string): { isValid: boolean; error?: string } {
  if (!qrString || qrString.trim().length === 0) {
    return { isValid: false, error: 'QR string cannot be empty' };
  }

  if (qrString.length < 15) {
    return { isValid: false, error: 'QR string too short (minimum 15 characters)' };
  }

  if (qrString.length > 1000) {
    return { isValid: false, error: 'QR string too long (maximum 1000 characters)' };
  }

  return { isValid: true };
}
