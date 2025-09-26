import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Code, Play, Upload, Copy, FileSpreadsheet, Clock, Download, Search, Building2, FileText, Settings, Users, Shield, Info } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { exportToExcel, exportValidationAPIResultsToExcel } from "@/lib/excel-export";
import { formatDateTime } from "@/lib/utils";

const apiEndpoints = [
  { 
    value: 'search-taxpayer', 
    label: 'Search Taxpayer', 
    icon: Search,
    description: 'Search and retrieve detailed information about a taxpayer using their GSTIN. This API provides comprehensive taxpayer details including registration status, business type, and compliance information.',
    fields: ['gstin', 'action', 'fy', 'type', 'stateCode', 'taxPayerType', 'registrationStatus'] 
  },
  { 
    value: 'pan-to-gstin', 
    label: 'PAN to GSTIN', 
    icon: Building2,
    description: 'Convert PAN (Permanent Account Number) to corresponding GSTIN numbers. This API helps identify all GST registrations associated with a particular PAN across different states.',
    fields: ['pan', 'action', 'fy', 'businessType', 'registrationType', 'stateCode', 'status'] 
  },
  { 
    value: 'view-track-returns', 
    label: 'View & Track Returns', 
    icon: FileText,
    description: 'View and track GST return filing status for a specific taxpayer. This API provides detailed information about return filing history, compliance status, and pending returns.',
    fields: ['gstin', 'fy', 'type', 'retPeriod', 'returnStatus', 'filingStatus', 'taxPayerType'] 
  },
  { 
    value: 'get-preference', 
    label: 'Get Preference', 
    icon: Settings,
    description: 'Retrieve taxpayer preferences and settings for GST compliance. This API provides information about notification preferences, filing preferences, and other taxpayer-specific configurations.',
    fields: ['gstin', 'fy', 'preferenceType', 'category', 'subCategory', 'priority', 'status'] 
  },
  { 
    value: 'msme-validation', 
    label: 'MSME Validation', 
    icon: Users,
    description: 'Validate Micro, Small, and Medium Enterprise (MSME) status of a business. This API checks MSME registration, enterprise type, investment limits, and turnover thresholds.',
    fields: ['msmeId', 'gstin', 'businessType', 'enterpriseType', 'investmentLimit', 'turnoverLimit', 'status'] 
  },
  { 
    value: 'cin-validation', 
    label: 'CIN Validation', 
    icon: Shield,
    description: 'Validate Corporate Identification Number (CIN) and retrieve company information. This API provides details about company registration, type, and business classification.',
    fields: ['cin', 'gstin', 'companyType', 'registrationType', 'stateCode', 'businessType', 'status'] 
  }
];

interface FormData {
  [key: string]: string;
}

export function ValidationAPIs() {
  const [selectedAPI, setSelectedAPI] = useState("search-taxpayer");
  const [activeSubTab, setActiveSubTab] = useState<{[key: string]: string}>({
    'search-taxpayer': 'single',
    'pan-to-gstin': 'single',
    'view-track-returns': 'single',
    'get-preference': 'single',
    'msme-validation': 'single',
    'cin-validation': 'single'
  });
  const [formData, setFormData] = useState<FormData>({
    gstin: "27ABCDE1234F1Z5",
    action: "TP",
    pan: "ABCDE1234F",
    fy: "2024-25",
    type: "GSTR1",
    msmeId: "MSME123456",
    cin: "L74999DL2010PTC123456",
    retPeriod: "012024",
    status: "Active",
    stateCode: "27",
    taxPayerType: "Regular",
    registrationStatus: "Active",
    businessType: "Manufacturing",
    registrationType: "Regular",
    returnStatus: "Filed",
    filingStatus: "On Time",
    preferenceType: "General",
    category: "Business",
    subCategory: "Retail",
    priority: "High",
    enterpriseType: "Micro",
    investmentLimit: "1000000",
    turnoverLimit: "5000000",
    companyType: "Private Limited",
    gstinList: "GSTIN1,GSTIN2,GSTIN3"
  });
  const [apiResponse, setApiResponse] = useState<string>("");
  const [excelPreviewData, setExcelPreviewData] = useState<any[]>([]);
  const [hasApiBeenCalled, setHasApiBeenCalled] = useState<boolean>(false);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [excelProcessingState, setExcelProcessingState] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [excelResponseData, setExcelResponseData] = useState<any[]>([]);
  const { toast } = useToast();

  // Handle sub-tab changes
  const handleSubTabChange = (apiValue: string, subTab: string) => {
    setActiveSubTab(prev => ({
      ...prev,
      [apiValue]: subTab
    }));
  };

  // Get current sub-tab for selected API
  const currentSubTab = activeSubTab[selectedAPI] || 'single';

  // Fetch API logs
  const { data: apiLogs = [] } = useQuery({
    queryKey: ['/api/api-logs'],
    enabled: true
  });

  // Filter API logs for the selected API
  const filteredApiLogs = (apiLogs as any[]).filter((log: any) => log.apiType === selectedAPI);

  // Run API mutation
  const runAPIMutation = useMutation({
    mutationFn: async (params: { apiType: string; data: FormData; startTime: number }) => {
      const response = await apiRequest('POST', `/api/validation/${params.apiType}`, params.data);
      const endTime = Date.now();
      const responseTimeMs = endTime - params.startTime;
      
      setHttpStatus(response.status);
      setResponseTime(responseTimeMs);
      setIsLoading(false);
      
      return response.json();
    },
    onSuccess: (data) => {
      setApiResponse(JSON.stringify(data, null, 2));
      if (data.status === 'success') {
        toast({
          title: "API Call Successful",
          description: "API call completed successfully!",
        });
      } else {
        toast({
          title: "API Call Failed",
          description: data.message || "API call failed",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      setHttpStatus(500);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "API call failed",
        variant: "destructive",
      });
    }
  });

  const handleRunAPI = () => {
    const selectedEndpoint = apiEndpoints.find(api => api.value === selectedAPI);
    if (!selectedEndpoint) return;

    setHasApiBeenCalled(true);
    setIsLoading(true);
    setResponseTime(null);
    setHttpStatus(null);
    
    const startTime = Date.now();

    const apiData: FormData = {};
    selectedEndpoint.fields.forEach(field => {
      apiData[field] = formData[field] || '';
    });

    runAPIMutation.mutate({ 
      apiType: selectedAPI, 
      data: apiData,
      startTime 
    });
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(apiResponse).then(() => {
      toast({
        title: "Copied",
        description: "Response copied to clipboard!",
      });
    });
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File Uploaded",
        description: "Excel file uploaded successfully! Generating preview...",
      });
      
      // Generate sample preview data based on selected API
      const selectedEndpoint = apiEndpoints.find(api => api.value === selectedAPI);
      if (selectedEndpoint) {
        const sampleData = [
          {
            row: 1,
            ...selectedEndpoint.fields.reduce((acc, field) => {
              acc[field] = getSampleValue(field);
              return acc;
            }, {} as any)
          },
          {
            row: 2,
            ...selectedEndpoint.fields.reduce((acc, field) => {
              acc[field] = getSampleValue(field, 2);
              return acc;
            }, {} as any)
          },
          {
            row: 3,
            ...selectedEndpoint.fields.reduce((acc, field) => {
              acc[field] = getSampleValue(field, 3);
              return acc;
            }, {} as any)
          }
        ];
        
        setExcelPreviewData(sampleData);
      setTimeout(() => {
        document.getElementById('excel-preview')?.classList.remove('hidden');
        }, 500);
      }
    }
  };

  const getFieldLabel = (field: string) => {
    const fieldLabels: { [key: string]: string } = {
      gstin: 'GSTIN',
      pan: 'PAN Number',
      action: 'Action Type',
      fy: 'Financial Year',
      type: 'Return Type',
      msmeId: 'MSME ID',
      cin: 'CIN Number',
      retPeriod: 'Return Period',
      status: 'Status',
      gstinList: 'GSTIN List',
      stateCode: 'State Code',
      taxPayerType: 'Taxpayer Type',
      registrationStatus: 'Registration Status',
      businessType: 'Business Type',
      registrationType: 'Registration Type',
      returnStatus: 'Return Status',
      filingStatus: 'Filing Status',
      preferenceType: 'Preference Type',
      category: 'Category',
      subCategory: 'Sub Category',
      priority: 'Priority',
      enterpriseType: 'Enterprise Type',
      investmentLimit: 'Investment Limit',
      turnoverLimit: 'Turnover Limit',
      companyType: 'Company Type'
    };
    
    return fieldLabels[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const getPlaceholderText = (field: string) => {
    const placeholders: { [key: string]: string } = {
      gstin: '27ABCDE1234F1Z5',
      pan: 'ABCDE1234F',
      action: 'Select Action Type',
      fy: '2024-25',
      type: 'Select Return Type',
      msmeId: 'MSME123456',
      cin: 'L74999DL2010PTC123456',
      retPeriod: '012024',
      status: 'Active',
      gstinList: 'GSTIN1,GSTIN2,GSTIN3',
      stateCode: '27',
      taxPayerType: 'Regular',
      registrationStatus: 'Active',
      businessType: 'Manufacturing',
      registrationType: 'Regular',
      returnStatus: 'Filed',
      filingStatus: 'On Time',
      preferenceType: 'General',
      category: 'Business',
      subCategory: 'Retail',
      priority: 'High',
      enterpriseType: 'Micro',
      investmentLimit: '1000000',
      turnoverLimit: '5000000',
      companyType: 'Private Limited'
    };
    
    return placeholders[field] || getFieldLabel(field);
  };

  const getSampleValue = (field: string, rowIndex: number = 1) => {
    const baseValues: { [key: string]: string[] } = {
      gstin: ['27ABCDE1234F1Z5', '29XYZAB5678P1Q2', '33MNPQR9012S3T4'],
      pan: ['ABCDE1234F', 'FGHIJ5678K', 'LMNOP9012Q'],
      action: ['TP', 'ST', 'DT'],
      fy: ['2024-25', '2023-24', '2022-23'],
      type: ['GSTR1', 'GSTR3B', 'GSTR9'],
      msmeId: ['MSME123456', 'MSME789012', 'MSME345678'],
      cin: ['L74999DL2010PTC123456', 'U12345MH2020PTC789012', 'U67890KA2021PTC345678'],
      retPeriod: ['012024', '022024', '032024'],
      status: ['Active', 'Pending', 'Completed'],
      stateCode: ['27', '29', '33'],
      taxPayerType: ['Regular', 'Composition', 'SEZ'],
      registrationStatus: ['Active', 'Suspended', 'Cancelled'],
      businessType: ['Manufacturing', 'Trading', 'Services'],
      registrationType: ['Regular', 'Composition', 'SEZ'],
      returnStatus: ['Filed', 'Not Filed', 'Late Filed'],
      filingStatus: ['On Time', 'Late', 'Pending'],
      preferenceType: ['General', 'Priority', 'Express'],
      category: ['Business', 'Individual', 'Government'],
      subCategory: ['Retail', 'Wholesale', 'E-commerce'],
      priority: ['High', 'Medium', 'Low'],
      enterpriseType: ['Micro', 'Small', 'Medium'],
      investmentLimit: ['1000000', '2000000', '5000000'],
      turnoverLimit: ['5000000', '10000000', '50000000'],
      companyType: ['Private Limited', 'Public Limited', 'Partnership'],
      gstinList: ['GSTIN1,GSTIN2', 'GSTIN3,GSTIN4', 'GSTIN5,GSTIN6']
    };
    
    const values = baseValues[field] || [field.toUpperCase()];
    return values[(rowIndex - 1) % values.length];
  };

  const formatJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      
      return formatted
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
          let cls = 'text-gray-300'; // default
          
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'text-blue-400'; // keys
            } else {
              cls = 'text-green-400'; // string values
            }
          } else if (/true|false/.test(match)) {
            cls = 'text-yellow-400'; // booleans
          } else if (/null/.test(match)) {
            cls = 'text-gray-500'; // null
          } else if (/^\d/.test(match)) {
            cls = 'text-orange-400'; // numbers
          }
          
          return `<span class="${cls}">${match}</span>`;
        });
    } catch (e) {
      return jsonString
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  };

  const handleDownloadTemplate = () => {
    if (!selectedEndpoint) return;

    // Create sample data based on the selected API
    const sampleData = selectedEndpoint.fields.map(field => getSampleValue(field));

    // Create CSV content
    const csvContent = [
      selectedEndpoint.fields.join(','),
      sampleData.join(','),
      // Add a few more sample rows
      selectedEndpoint.fields.map(field => getSampleValue(field, 2)).join(','),
      selectedEndpoint.fields.map(field => getSampleValue(field, 3)).join(',')
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedEndpoint.label.replace(/\s+/g, '_').toLowerCase()}_template.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Template Downloaded",
      description: `${selectedEndpoint.label} template has been downloaded successfully.`,
    });
  };

  const handleRunExcelAPI = async () => {
    if (excelPreviewData.length === 0) {
      toast({
        title: "No Data",
        description: "Please upload an Excel file first.",
        variant: "destructive"
      });
      return;
    }

    setHasApiBeenCalled(true);
    setIsLoading(true);
    setExcelProcessingState('processing');
    setResponseTime(null);
    setHttpStatus(null);
    setExcelResponseData([]);
    
    const startTime = Date.now();
    
    toast({
      title: "Processing Excel Data",
      description: `Running ${selectedEndpoint?.label} for ${excelPreviewData.length} records...`,
    });

    try {
      // Process each record through the API
      const results = [];
      for (let i = 0; i < excelPreviewData.length; i++) {
        const record = excelPreviewData[i];
        const apiData: FormData = {};
        selectedEndpoint?.fields.forEach(field => {
          apiData[field] = record[field] || '';
        });

        try {
          const response = await apiRequest('POST', `/api/validation/${selectedAPI}`, apiData);
          const responseData = await response.json();
          
          results.push({
            row: record.row,
            status: responseData.status === 'success' ? 'success' : 'error',
            inputData: record,
            responseData: responseData,
            errorMessage: responseData.status !== 'success' ? responseData.message : null
          });
        } catch (error) {
          results.push({
            row: record.row,
            status: 'error',
            inputData: record,
            responseData: null,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;
      
      const response = {
        success: true,
        processedRecords: excelPreviewData.length,
        successfulRecords: results.filter(r => r.status === 'success').length,
        failedRecords: results.filter(r => r.status === 'error').length,
        results: results
      };

      setApiResponse(JSON.stringify(response, null, 2));
      setExcelResponseData(results);
      setHttpStatus(200);
      setResponseTime(responseTimeMs);
      setIsLoading(false);
      setExcelProcessingState('completed');
      
      toast({
        title: "Excel Processing Complete",
        description: `Successfully processed ${response.successfulRecords}/${response.processedRecords} records.`,
      });
    } catch (error) {
      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;
      
      setHttpStatus(500);
      setResponseTime(responseTimeMs);
      setIsLoading(false);
      setExcelProcessingState('error');
      
      toast({
        title: "Excel Processing Failed",
        description: "Failed to process Excel data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadExcelResponse = () => {
    if (excelResponseData.length === 0) {
      toast({
        title: "No Data",
        description: "No response data available to download.",
        variant: "destructive"
      });
      return;
    }

    const success = exportValidationAPIResultsToExcel(excelResponseData, selectedEndpoint?.label || 'validation');
    
    if (success) {
      toast({
        title: "Download Complete",
        description: "Excel file with validation results has been downloaded.",
      });
    } else {
      toast({
        title: "Download Failed",
        description: "Failed to download Excel file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const selectedEndpoint = apiEndpoints.find(api => api.value === selectedAPI);

  return (
    <div className="w-full space-y-8" data-testid="validation-apis">
      {/* Validation APIs Playground - Main View */}
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <CardTitle className="modern-card-title">
            Validation APIs Playground
          </CardTitle>
          <p className="modern-card-subtitle">
            Test and validate various API endpoints for invoice processing
          </p>
        </CardHeader>
        <CardContent>
          {/* Main API Tabs */}
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Select API</Label>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex overflow-x-auto bg-muted/30 w-fit max-w-full">
                  {apiEndpoints.map((api, index) => {
                    const IconComponent = api.icon;
                    const isLast = index === apiEndpoints.length - 1;
                    return (
                      <button
                        key={api.value}
                        onClick={() => setSelectedAPI(api.value)}
                        className={`flex-shrink-0 py-3 text-sm transition-all duration-200 border-r border-border last:border-r-0 flex items-center space-x-2 min-w-0 ${
                          selectedAPI === api.value
                            ? `bg-primary text-primary-foreground border-b-2 border-primary shadow-sm font-semibold pl-4 ${isLast ? 'pr-2' : 'pr-4'}`
                            : `bg-background text-muted-foreground hover:bg-muted hover:text-foreground font-medium pl-4 ${isLast ? 'pr-2' : 'pr-4'}`
                        }`}
                        data-testid={`api-tab-${api.value}`}
                      >
                        <IconComponent className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{api.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {selectedEndpoint && (
                <div className="mt-3 flex items-start space-x-2">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedEndpoint.description}
                  </p>
                </div>
              )}
            </div>

            {/* Sub-tabs for Single/Bulk */}
            <Tabs value={currentSubTab} onValueChange={(value) => handleSubTabChange(selectedAPI, value)}>
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
                <TabsTrigger 
                  value="single" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Single API Call
                </TabsTrigger>
                <TabsTrigger 
                  value="bulk" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Bulk Processing
                </TabsTrigger>
              </TabsList>

            {/* Single API Call Tab */}
            <TabsContent value="single" className="space-y-6 mt-6">
              {/* API Parameters */}
              <div className="space-y-4" data-testid="form-input-section">
                <h3 className="text-lg font-semibold text-foreground">API Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedEndpoint?.fields.map((field) => (
                <div key={field}>
                      <Label className="mb-2 block">{getFieldLabel(field)}</Label>
                      {field === 'action' || field === 'type' || field === 'taxPayerType' || field === 'registrationStatus' || field === 'businessType' || field === 'registrationType' || field === 'returnStatus' || field === 'filingStatus' || field === 'preferenceType' || field === 'category' || field === 'subCategory' || field === 'priority' || field === 'enterpriseType' || field === 'companyType' ? (
                    <Select 
                      value={formData[field] || ''} 
                      onValueChange={(value) => setFormData({ ...formData, [field]: value })}
                    >
                      <SelectTrigger data-testid={`select-${field}`} className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-300 shadow-2xl rounded-lg z-[100] p-2">
                        {field === 'action' ? (
                          <>
                            <SelectItem value="TP" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">Taxpayer</SelectItem>
                            <SelectItem value="ST" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">Status</SelectItem>
                            <SelectItem value="DT" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">Details</SelectItem>
                          </>
                            ) : field === 'type' ? (
                          <>
                            <SelectItem value="GSTR1" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">GSTR1</SelectItem>
                            <SelectItem value="GSTR3B" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">GSTR3B</SelectItem>
                            <SelectItem value="GSTR9" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">GSTR9</SelectItem>
                          </>
                            ) : field === 'taxPayerType' ? (
                              <>
                                <SelectItem value="Regular" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">Regular</SelectItem>
                                <SelectItem value="Composition" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">Composition</SelectItem>
                                <SelectItem value="SEZ" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">SEZ</SelectItem>
                              </>
                            ) : field === 'registrationStatus' ? (
                              <>
                                <SelectItem value="Active" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">Active</SelectItem>
                                <SelectItem value="Suspended">Suspended</SelectItem>
                                <SelectItem value="Cancelled" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">Cancelled</SelectItem>
                              </>
                            ) : field === 'businessType' ? (
                              <>
                                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="Trading">Trading</SelectItem>
                                <SelectItem value="Services">Services</SelectItem>
                              </>
                            ) : field === 'registrationType' ? (
                              <>
                                <SelectItem value="Regular">Regular</SelectItem>
                                <SelectItem value="Composition">Composition</SelectItem>
                                <SelectItem value="SEZ" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">SEZ</SelectItem>
                              </>
                            ) : field === 'returnStatus' ? (
                              <>
                                <SelectItem value="Filed">Filed</SelectItem>
                                <SelectItem value="Not Filed">Not Filed</SelectItem>
                                <SelectItem value="Late Filed">Late Filed</SelectItem>
                              </>
                            ) : field === 'filingStatus' ? (
                              <>
                                <SelectItem value="On Time">On Time</SelectItem>
                                <SelectItem value="Late">Late</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                              </>
                            ) : field === 'preferenceType' ? (
                              <>
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="Priority">Priority</SelectItem>
                                <SelectItem value="Express">Express</SelectItem>
                              </>
                            ) : field === 'category' ? (
                              <>
                                <SelectItem value="Business">Business</SelectItem>
                                <SelectItem value="Individual">Individual</SelectItem>
                                <SelectItem value="Government">Government</SelectItem>
                              </>
                            ) : field === 'subCategory' ? (
                              <>
                                <SelectItem value="Retail">Retail</SelectItem>
                                <SelectItem value="Wholesale">Wholesale</SelectItem>
                                <SelectItem value="E-commerce">E-commerce</SelectItem>
                              </>
                            ) : field === 'priority' ? (
                              <>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </>
                            ) : field === 'enterpriseType' ? (
                              <>
                                <SelectItem value="Micro">Micro</SelectItem>
                                <SelectItem value="Small">Small</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                              </>
                            ) : field === 'companyType' ? (
                              <>
                                <SelectItem value="Private Limited">Private Limited</SelectItem>
                                <SelectItem value="Public Limited">Public Limited</SelectItem>
                                <SelectItem value="Partnership">Partnership</SelectItem>
                              </>
                            ) : null}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                          placeholder={getPlaceholderText(field)}
                      data-testid={`input-${field}`}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <Button 
              onClick={handleRunAPI}
                  disabled={isLoading}
              data-testid="button-run-api"
                  className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
              <Play className="mr-2 h-4 w-4" />
              Run API
                    </>
                  )}
                </Button>
              </div>

              {/* API Response */}
              {hasApiBeenCalled && (
                <div className="space-y-4" data-testid="api-response-section">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-foreground">API Response</h3>
                      {httpStatus && (
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            httpStatus >= 200 && httpStatus < 300 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : httpStatus >= 400 && httpStatus < 500
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {httpStatus}
                          </span>
                          {responseTime !== null && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              {responseTime}ms
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCopyResponse} data-testid="button-copy-response">
                      <Copy className="mr-1 h-4 w-4" />
                      Copy
            </Button>
                  </div>
                  <div className="bg-black rounded-lg p-4 min-h-64 border border-gray-700">
                    <pre className="text-sm text-gray-100 overflow-auto whitespace-pre-wrap font-mono" data-testid="api-response-text">
                      {apiResponse ? (
                        <code className="json-display" dangerouslySetInnerHTML={{ __html: formatJSON(apiResponse) }} />
                      ) : (
                        <span className="text-gray-400">No response data available.</span>
                      )}
                    </pre>
                  </div>
                </div>
              )}

              {/* Historical Runs Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Historical Runs</h3>
                {filteredApiLogs.length > 0 ? (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Response Time</TableHead>
                          <TableHead>Parameters</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApiLogs.map((log: any, index: number) => (
                          <TableRow key={index} className="table-row-hover">
                            <TableCell className="text-sm">
                              {formatDateTime(log.timestamp)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={log.status === 'success' ? 'default' : 'destructive'}
                                className={
                                  log.status === 'success' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                }
                              >
                                {log.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {log.responseTime ? `${log.responseTime}ms` : '-'}
                            </TableCell>
                            <TableCell className="text-sm max-w-xs truncate">
                              {Object.keys(log.data || {}).length > 0 
                                ? Object.entries(log.data || {})
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(', ')
                                : '-'
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No historical runs found for {selectedEndpoint?.label}</p>
                    <p className="text-sm">Run your first API call to see it here</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Bulk Processing Tab */}
            <TabsContent value="bulk" className="space-y-6 mt-6">

              {/* Template Download Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Excel Template</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        Download Excel Template
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Get the template for {selectedEndpoint?.label} with the correct column structure
                      </p>
                    </div>
                    <Button 
                      onClick={handleDownloadTemplate}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30"
                      data-testid="button-download-template"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Template
                    </Button>
                  </div>
                </div>
              </div>

              {/* Excel Upload Section */}
              <div className="space-y-4" data-testid="excel-input-section">
                <h3 className="text-lg font-semibold text-foreground">Excel Upload</h3>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <FileSpreadsheet className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Upload Excel File</p>
              <p className="text-muted-foreground mb-4">Upload Excel file with API request parameters</p>
              <Button onClick={() => document.getElementById('excel-file-input')?.click()} data-testid="button-browse-excel">
                <Upload className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
              <input
                id="excel-file-input"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleExcelUpload}
                data-testid="input-excel-file"
              />
            </div>
            
            <div id="excel-preview" className="hidden">
                  <h5 className="font-medium mb-3">Request Parameters Preview</h5>
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Preview of data to be processed for <strong>{selectedEndpoint?.label}</strong>:
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {excelPreviewData.length} records ready for processing
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row</TableHead>
                          {selectedEndpoint?.fields.map((field) => (
                            <TableHead key={field}>
                              {getFieldLabel(field)}
                            </TableHead>
                          ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                        {excelPreviewData.map((record, index) => (
                          <TableRow key={index} data-testid={`excel-preview-row-${index}`}>
                            <TableCell className="font-medium">{record.row}</TableCell>
                            {selectedEndpoint?.fields.map((field) => (
                              <TableCell key={field} className="text-sm">
                                {record[field] || '-'}
                    </TableCell>
                            ))}
                  </TableRow>
                        ))}
                </TableBody>
              </Table>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={handleRunExcelAPI}
                      disabled={isLoading || excelProcessingState === 'processing'}
                      data-testid="button-run-excel-api"
                      className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading || excelProcessingState === 'processing' ? (
                        <>
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          Run API
                        </>
                      )}
              </Button>
            </div>
                </div>
              </div>

              {/* Processing State and Results */}
              {hasApiBeenCalled && (
                <div className="space-y-4" data-testid="api-response-section">
            <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {excelProcessingState === 'processing' ? 'Processing...' : 
                         excelProcessingState === 'completed' ? 'Processing Complete' : 
                         excelProcessingState === 'error' ? 'Processing Failed' : 'API Response'}
                      </h3>
                      {httpStatus && (
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            httpStatus >= 200 && httpStatus < 300 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : httpStatus >= 400 && httpStatus < 500
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {httpStatus}
                          </span>
                          {responseTime !== null && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              {responseTime}ms
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {excelProcessingState === 'completed' && (
                      <Button 
                        onClick={handleDownloadExcelResponse}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                        data-testid="button-download-response"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Response
                      </Button>
                    )}
                    {excelProcessingState !== 'completed' && (
              <Button variant="outline" size="sm" onClick={handleCopyResponse} data-testid="button-copy-response">
                <Copy className="mr-1 h-4 w-4" />
                Copy
              </Button>
                    )}
                  </div>
                  
                  {excelProcessingState === 'processing' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="mr-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                      </div>
                      <h4 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Processing Excel Data
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300">
                        Running {selectedEndpoint?.label} validation for {excelPreviewData.length} records...
                      </p>
                    </div>
                  )}
                  
                  {excelProcessingState === 'completed' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="mr-3 h-6 w-6 text-green-600">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium text-green-900 dark:text-green-100">
                          Processing Complete
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {excelResponseData.filter(r => r.status === 'success').length}
                          </div>
                          <div className="text-sm text-green-700 dark:text-green-300">Successful</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {excelResponseData.filter(r => r.status === 'error').length}
                          </div>
                          <div className="text-sm text-red-700 dark:text-red-300">Failed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {excelResponseData.length}
                          </div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">Total</div>
                        </div>
            </div>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Click "Download Response" to get the Excel file with all validation results.
                      </p>
            </div>
                  )}
                  
                  {excelProcessingState === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="mr-3 h-6 w-6 text-red-600">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium text-red-900 dark:text-red-100">
                          Processing Failed
                        </h4>
                      </div>
                      <p className="text-red-700 dark:text-red-300">
                        An error occurred while processing the Excel data. Please try again.
                      </p>
                </div>
                  )}
                  
                  {excelProcessingState === 'idle' && (
                    <div className="bg-black rounded-lg p-4 min-h-64 border border-gray-700">
                      <pre className="text-sm text-gray-100 overflow-auto whitespace-pre-wrap font-mono" data-testid="api-response-text">
                        {apiResponse ? (
                          <code className="json-display" dangerouslySetInnerHTML={{ __html: formatJSON(apiResponse) }} />
                        ) : (
                          <span className="text-gray-400">No response data available.</span>
                        )}
                      </pre>
                    </div>
                  )}
                  </div>
              )}

              {/* Historical Runs Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Historical Runs</h3>
                {filteredApiLogs.length > 0 ? (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Response Time</TableHead>
                          <TableHead>Parameters</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApiLogs.map((log: any, index: number) => (
                          <TableRow key={index} className="table-row-hover">
                            <TableCell className="text-sm">
                              {formatDateTime(log.timestamp)}
                            </TableCell>
                            <TableCell>
                    <Badge 
                      variant={log.status === 'success' ? 'default' : 'destructive'}
                                className={
                                  log.status === 'success' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                }
                    >
                      {log.status}
                    </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {log.responseTime ? `${log.responseTime}ms` : '-'}
                            </TableCell>
                            <TableCell className="text-sm max-w-xs truncate">
                              {Object.keys(log.data || {}).length > 0 
                                ? Object.entries(log.data || {})
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(', ')
                                : '-'
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No historical runs found for {selectedEndpoint?.label}</p>
                    <p className="text-sm">Run your first API call to see it here</p>
                  </div>
              )}
              </div>
            </TabsContent>
            </Tabs>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
