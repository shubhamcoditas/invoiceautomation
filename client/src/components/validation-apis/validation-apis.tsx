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
import { useToast } from "@/hooks/use-toast";
import { Code, Play, Upload, Copy, FileSpreadsheet, Clock } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const apiEndpoints = [
  { value: 'search-taxpayer', label: 'Search Taxpayer', fields: ['gstin', 'action'] },
  { value: 'pan-to-gstin', label: 'PAN to GSTIN', fields: ['pan', 'action'] },
  { value: 'view-track-returns', label: 'View & Track Returns', fields: ['gstin', 'fy', 'type'] },
  { value: 'get-preference', label: 'Get Preference', fields: ['gstin', 'fy'] },
  { value: 'msme-validation', label: 'MSME Validation', fields: ['msmeId'] },
  { value: 'cin-validation', label: 'CIN Validation', fields: ['cin'] }
];

interface FormData {
  [key: string]: string;
}

export function ValidationAPIs() {
  const [inputMethod, setInputMethod] = useState("form");
  const [selectedAPI, setSelectedAPI] = useState("search-taxpayer");
  const [formData, setFormData] = useState<FormData>({
    gstin: "27ABCDE1234F1Z5",
    action: "TP",
    pan: "ABCDE1234F",
    fy: "2024-25",
    type: "GSTR1",
    msmeId: "MSME123456",
    cin: "L74999DL2010PTC123456"
  });
  const [apiResponse, setApiResponse] = useState<string>("No response yet. Run an API to see results.");
  const { toast } = useToast();

  // Fetch API logs
  const { data: apiLogs = [] } = useQuery({
    queryKey: ['/api/api-logs'],
    enabled: true
  });

  // Run API mutation
  const runAPIMutation = useMutation({
    mutationFn: async (params: { apiType: string; data: FormData }) => {
      const response = await apiRequest('POST', `/api/validation/${params.apiType}`, params.data);
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

    const apiData: FormData = {};
    selectedEndpoint.fields.forEach(field => {
      apiData[field] = formData[field] || '';
    });

    runAPIMutation.mutate({ apiType: selectedAPI, data: apiData });
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
        description: "Excel file uploaded successfully! Processing data...",
      });
      // Simulate processing
      setTimeout(() => {
        document.getElementById('excel-preview')?.classList.remove('hidden');
      }, 1000);
    }
  };

  const selectedEndpoint = apiEndpoints.find(api => api.value === selectedAPI);

  return (
    <div className="max-w-6xl space-y-6" data-testid="validation-apis">
      {/* API Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Validation APIs Playground</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Method Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block">Input Method</Label>
              <RadioGroup value={inputMethod} onValueChange={setInputMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="form" id="form-method" data-testid="radio-form-method" />
                  <Label htmlFor="form-method">Form-based Input</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="excel-method" data-testid="radio-excel-method" />
                  <Label htmlFor="excel-method">Excel Upload</Label>
                </div>
              </RadioGroup>
            </div>

            {/* API Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block">Select API</Label>
              <Select value={selectedAPI} onValueChange={setSelectedAPI}>
                <SelectTrigger data-testid="select-api">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {apiEndpoints.map((api) => (
                    <SelectItem key={api.value} value={api.value}>
                      {api.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Input */}
      {inputMethod === "form" && (
        <Card data-testid="form-input-section">
          <CardHeader>
            <CardTitle>API Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {selectedEndpoint?.fields.map((field) => (
                <div key={field}>
                  <Label className="capitalize mb-2 block">{field.replace(/([A-Z])/g, ' $1')}</Label>
                  {field === 'action' || field === 'type' ? (
                    <Select 
                      value={formData[field] || ''} 
                      onValueChange={(value) => setFormData({ ...formData, [field]: value })}
                    >
                      <SelectTrigger data-testid={`select-${field}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {field === 'action' ? (
                          <>
                            <SelectItem value="TP">Taxpayer</SelectItem>
                            <SelectItem value="ST">Status</SelectItem>
                            <SelectItem value="DT">Details</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="GSTR1">GSTR1</SelectItem>
                            <SelectItem value="GSTR3B">GSTR3B</SelectItem>
                            <SelectItem value="GSTR9">GSTR9</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      placeholder={field === 'gstin' ? '27ABCDE1234F1Z5' : field.toUpperCase()}
                      data-testid={`input-${field}`}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <Button 
              onClick={handleRunAPI}
              disabled={runAPIMutation.isPending}
              data-testid="button-run-api"
            >
              <Play className="mr-2 h-4 w-4" />
              Run API
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Excel Upload */}
      {inputMethod === "excel" && (
        <Card data-testid="excel-input-section">
          <CardHeader>
            <CardTitle>Excel Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center mb-4">
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
              <h5 className="font-medium mb-3">Preview Data</h5>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row</TableHead>
                    <TableHead>GSTIN</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow data-testid="excel-preview-row-0">
                    <TableCell>1</TableCell>
                    <TableCell>27ABCDE1234F1Z5</TableCell>
                    <TableCell>TP</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button className="mt-4" data-testid="button-process-excel">
                <Play className="mr-2 h-4 w-4" />
                Process All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response and Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Response */}
        <Card data-testid="api-response-section">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>API Response</CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopyResponse} data-testid="button-copy-response">
                <Copy className="mr-1 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 min-h-64">
              <pre className="text-sm text-muted-foreground overflow-auto whitespace-pre-wrap" data-testid="api-response-text">
                {apiResponse}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* API Logs */}
        <Card data-testid="api-logs-section">
          <CardHeader>
            <CardTitle>Recent API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {(apiLogs as any[]).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No API calls yet
                </div>
              ) : (
                (apiLogs as any[]).slice(0, 5).map((log: any, index: number) => (
                  <div key={log.id} className="border border-border rounded p-3" data-testid={`api-log-${index}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium capitalize">
                        {log.apiName.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Object.entries(log.parameters || {}).map(([key, value]) => 
                        `${key}: ${value}`
                      ).join(', ')}
                    </p>
                    <Badge 
                      variant={log.status === 'success' ? 'default' : 'destructive'}
                      className="mt-1"
                    >
                      {log.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
