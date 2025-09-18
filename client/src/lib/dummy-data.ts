export const generateDummyQRData = () => ({
  irn: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n',
  gstin: '27ABCDE1234F1Z5',
  invoiceNo: 'INV-2024-001',
  date: '2024-01-18',
  totalAmount: '₹125,000.00',
  buyerGstin: '29XYZPQ5678R1S2',
  sellerGstin: '27ABCDE1234F1Z5',
  invoiceType: 'Regular'
});

export const generateDummyPDFData = (files: FileList) => {
  return Array.from(files).map((file, index) => ({
    fileName: file.name,
    invoiceNo: `INV-2024-${String(index + 1).padStart(3, '0')}`,
    date: '2024-01-18',
    irn: `${index + 1}${'a2b3c4d5e6f7g8h9i0j1k2l3m4n'.substring(1)}`,
    gstin: '27ABCDE1234F1Z5',
    amount: `₹${(125000 + Math.random() * 50000).toLocaleString()}.00`,
    status: Math.random() > 0.8 ? 'Review Required' : 'Processed'
  }));
};

export const mockValidationAPIResponse = (apiType: string, parameters: any) => {
  const responses: Record<string, any> = {
    'search-taxpayer': {
      status: 'success',
      data: {
        gstin: parameters.gstin,
        tradeName: 'Sample Company Pvt Ltd',
        legalName: 'Sample Company Private Limited',
        status: 'Active',
        registrationDate: '2020-04-15',
        lastReturnDate: '2024-01-15'
      }
    },
    'pan-to-gstin': {
      status: 'success',
      data: {
        pan: parameters.pan,
        gstins: ['27ABCDE1234F1Z5', '29ABCDE1234F2Z6']
      }
    },
    'view-track-returns': {
      status: 'success',
      data: {
        gstin: parameters.gstin,
        financialYear: parameters.fy,
        returns: [
          { period: 'Jan-2024', status: 'Filed', dueDate: '2024-02-20' },
          { period: 'Feb-2024', status: 'Pending', dueDate: '2024-03-20' }
        ]
      }
    },
    'get-preference': {
      status: 'success',
      data: {
        gstin: parameters.gstin,
        preferences: {
          invoiceFrequency: 'Monthly',
          communicationMode: 'Email',
          language: 'English'
        }
      }
    },
    'msme-validation': {
      status: 'success',
      data: {
        msmeId: parameters.msmeId,
        companyName: 'MSME Sample Company',
        registrationDate: '2022-01-15',
        category: 'Micro Enterprise',
        isValid: true
      }
    },
    'cin-validation': {
      status: 'success',
      data: {
        cin: parameters.cin,
        companyName: 'CIN Sample Company Limited',
        incorporationDate: '2019-03-10',
        status: 'Active',
        isValid: true
      }
    }
  };

  return responses[apiType] || { status: 'error', message: 'API not implemented' };
};
