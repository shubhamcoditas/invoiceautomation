import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], filename: string) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    // Auto-adjust column widths
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    const columnWidths = [];
    
    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxWidth = 10;
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          const cellWidth = cell.v.toString().length;
          maxWidth = Math.max(maxWidth, cellWidth);
        }
      }
      columnWidths.push({ wch: Math.min(maxWidth + 2, 50) });
    }
    
    worksheet['!cols'] = columnWidths;
    
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

export const exportQRDataToExcel = (qrData: any) => {
  const data = [{
    IRN: qrData.irn,
    GSTIN: qrData.gstin,
    'Invoice No': qrData.invoiceNo,
    Date: qrData.date,
    'Total Amount': qrData.totalAmount,
    'Buyer GSTIN': qrData.buyerGstin,
    'Seller GSTIN': qrData.sellerGstin,
    'Invoice Type': qrData.invoiceType
  }];
  
  return exportToExcel(data, 'qr-extracted-data');
};

export const exportPDFDataToExcel = (pdfData: any[]) => {
  const data = pdfData.map(item => ({
    'File Name': item.fileName,
    'Invoice No': item.invoiceNo,
    Date: item.date,
    IRN: item.irn,
    GSTIN: item.gstin,
    Amount: item.amount,
    Status: item.status
  }));
  
  return exportToExcel(data, 'pdf-extracted-data');
};

export const exportReconciliationToExcel = (reconciliationData: any[]) => {
  const data = reconciliationData.map(item => ({
    Status: item.status,
    IRN: item.irn,
    'Invoice No': item.invoiceNo,
    Source: item.source,
    'EGAM Amount': item.egamAmount || 'N/A',
    'Extracted Amount': item.extractedAmount,
    Difference: item.difference || 'N/A'
  }));
  
  return exportToExcel(data, 'reconciliation-results');
};

export const exportEmailDataToExcel = (emailData: any[], category: string = 'emails') => {
  const data = emailData.map(item => ({
    Sender: item.sender,
    Subject: item.subject,
    'Received At': item.receivedAt,
    Attachments: item.attachments,
    'Processing Status': item.processingStatus,
    'Invoice Type': item.invoiceType,
    'Has QR in EGAM': item.hasQrInEgam,
    'Invoice No': item.invoiceNo,
    Amount: item.amount,
    'Vendor Name': item.vendorName
  }));
  
  return exportToExcel(data, `${category}-email-data`);
};

export const exportValidationAPIResultsToExcel = (results: any[], apiName: string) => {
  const data = results.map(result => ({
    Row: result.row,
    Status: result.status,
    'Error Message': result.errorMessage || '',
    'Input Data': JSON.stringify(result.inputData || {}),
    'Response Data': JSON.stringify(result.responseData || {}),
    'Success': result.status === 'success' ? 'Yes' : 'No'
  }));
  
  return exportToExcel(data, `${apiName.replace(/\s+/g, '_').toLowerCase()}_validation_results`);
};

/** Verticals bulk upload template: Name, Description, Status (with one sample row) */
export function downloadVerticalsTemplate() {
  const templateData = [
    { Name: 'Information Technology', Description: 'IT department managing technology and systems', Status: 'active' },
  ];
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Verticals');
  const colWidths = [{ wch: 25 }, { wch: 50 }, { wch: 12 }];
  worksheet['!cols'] = colWidths;
  XLSX.writeFile(workbook, 'verticals_template.xlsx');
}
