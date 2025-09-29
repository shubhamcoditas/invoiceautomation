export const generateDummyQRData = (entityId: string = 'hsbc') => {
  const entityData = {
    hsbc: {
      gstin: '27ABCDE1234F1Z5',
      buyerGstin: '29XYZPQ5678R1S2',
      sellerGstin: '27ABCDE1234F1Z5',
      invoiceNo: 'HSBC-INV-2024-001',
      totalAmount: '₹125,000.00'
    },
    swiggy: {
      gstin: '29SWIGGY1234F1Z5',
      buyerGstin: '27CUSTOMER5678R1S2',
      sellerGstin: '29SWIGGY1234F1Z5',
      invoiceNo: 'SWIGGY-INV-2024-001',
      totalAmount: '₹2,500.00'
    },
    flipkart: {
      gstin: '29FLIPKART1234F1Z5',
      buyerGstin: '27CUSTOMER5678R1S2',
      sellerGstin: '29FLIPKART1234F1Z5',
      invoiceNo: 'FLIPKART-INV-2024-001',
      totalAmount: '₹15,000.00'
    }
  };

  const data = entityData[entityId as keyof typeof entityData] || entityData.hsbc;

  return {
    irn: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n',
    gstin: data.gstin,
    invoiceNo: data.invoiceNo,
    date: '2024-01-18',
    totalAmount: data.totalAmount,
    buyerGstin: data.buyerGstin,
    sellerGstin: data.sellerGstin,
    invoiceType: 'Regular'
  };
};

export const generateDummyPDFData = (files: FileList, entityId: string = 'hsbc') => {
  const entityData = {
    hsbc: {
      gstin: '27ABCDE1234F1Z5',
      prefix: 'HSBC-INV',
      baseAmount: 125000
    },
    swiggy: {
      gstin: '29SWIGGY1234F1Z5',
      prefix: 'SWIGGY-INV',
      baseAmount: 2500
    },
    flipkart: {
      gstin: '29FLIPKART1234F1Z5',
      prefix: 'FLIPKART-INV',
      baseAmount: 15000
    }
  };

  const data = entityData[entityId as keyof typeof entityData] || entityData.hsbc;

  return Array.from(files).map((file, index) => ({
    fileName: file.name,
    invoiceNo: `${data.prefix}-2024-${String(index + 1).padStart(3, '0')}`,
    date: '2024-01-18',
    irn: `${index + 1}${'a2b3c4d5e6f7g8h9i0j1k2l3m4n'.substring(1)}`,
    gstin: data.gstin,
    amount: `₹${(data.baseAmount + Math.random() * 50000).toLocaleString()}.00`,
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
