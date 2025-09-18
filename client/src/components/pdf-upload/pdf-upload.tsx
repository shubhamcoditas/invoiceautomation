import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/use-app-state";
import { FileText, Upload, Edit, Save, FileSpreadsheet } from "lucide-react";
import { generateDummyPDFData } from "@/lib/dummy-data";
import { exportPDFDataToExcel } from "@/lib/excel-export";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ProcessingFile {
  name: string;
  progress: number;
  status: 'processing' | 'complete' | 'error';
}

export function PDFUpload() {
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any[]>([]);
  const { state, dispatch } = useAppState();
  const { toast } = useToast();

  const processPDFMutation = useMutation({
    mutationFn: async (pdfData: any) => {
      const response = await apiRequest('POST', '/api/pdf-data', pdfData);
      return response.json();
    },
    onSuccess: (data) => {
      const currentData = state.extractedPDFData || [];
      dispatch({ type: 'SET_PDF_DATA', payload: [...currentData, data] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process PDF",
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Initialize processing state
    const initialFiles = Array.from(files).map(file => ({
      name: file.name,
      progress: 0,
      status: 'processing' as const
    }));
    
    setProcessingFiles(initialFiles);

    // Generate dummy data for all files
    const dummyData = generateDummyPDFData(files);
    
    // Simulate processing each file
    Array.from(files).forEach((file, index) => {
      const interval = setInterval(() => {
        setProcessingFiles(prev => {
          const updated = [...prev];
          updated[index].progress += Math.random() * 20;
          
          if (updated[index].progress >= 100) {
            updated[index].progress = 100;
            updated[index].status = 'complete';
            clearInterval(interval);
            
            // Process the PDF data
            processPDFMutation.mutate(dummyData[index]);
            
            // Check if all files are complete
            if (updated.every(f => f.status === 'complete')) {
              setTimeout(() => {
                setProcessingFiles([]);
                toast({
                  title: "Success",
                  description: `${files.length} PDF files processed successfully!`,
                });
              }, 500);
            }
          }
          
          return updated;
        });
      }, 100);
    });
    
    // Clear the input
    event.target.value = '';
  };

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      dispatch({ type: 'SET_PDF_DATA', payload: editedData });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Data updated successfully!",
      });
    } else {
      setIsEditing(true);
      setEditedData([...state.extractedPDFData]);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData([]);
  };

  const updateEditedData = (index: number, field: string, value: string) => {
    const updated = [...editedData];
    updated[index] = { ...updated[index], [field]: value };
    setEditedData(updated);
  };

  const handleExport = () => {
    if (state.extractedPDFData.length > 0) {
      const success = exportPDFDataToExcel(state.extractedPDFData);
      if (success) {
        toast({
          title: "Success",
          description: "PDF data exported to Excel successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to export data",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="max-w-6xl space-y-6" data-testid="pdf-upload">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>PDF Invoice Processing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
            <FileText className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <p className="text-lg font-medium">Upload PDF Invoices</p>
              <p className="text-muted-foreground">Drag and drop PDF files or click to browse (Multiple files supported)</p>
            </div>
            
            <Button onClick={() => document.getElementById('pdf-file-input')?.click()} data-testid="button-browse-pdf">
              <Upload className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
            
            <input
              id="pdf-file-input"
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              data-testid="input-pdf-file"
            />
          </div>

          {/* Processing Progress */}
          {processingFiles.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Processing Files...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processingFiles.map((file, index) => (
                    <div key={index} className="space-y-2" data-testid={`processing-file-${index}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {file.status === 'complete' ? 'Complete' : 'Processing...'}
                        </span>
                      </div>
                      <Progress value={file.progress} className="w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Extracted Data */}
      {state.extractedPDFData.length > 0 && (
        <Card data-testid="pdf-extracted-data">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Extracted Invoice Data</CardTitle>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit} data-testid="button-cancel-edit">
                      Cancel
                    </Button>
                    <Button onClick={handleEdit} data-testid="button-save-changes">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleEdit} data-testid="button-edit-data">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Data
                    </Button>
                    <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700" data-testid="button-export-excel">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export to Excel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>IRN</TableHead>
                    <TableHead>GSTIN</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(isEditing ? editedData : state.extractedPDFData).map((item, index) => (
                    <TableRow key={index} data-testid={`pdf-row-${index}`}>
                      <TableCell>{item.fileName}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={item.invoiceNo}
                            onChange={(e) => updateEditedData(index, 'invoiceNo', e.target.value)}
                            data-testid={`input-invoice-${index}`}
                          />
                        ) : (
                          item.invoiceNo
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={item.date}
                            onChange={(e) => updateEditedData(index, 'date', e.target.value)}
                            data-testid={`input-date-${index}`}
                          />
                        ) : (
                          item.date
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={item.irn}
                            onChange={(e) => updateEditedData(index, 'irn', e.target.value)}
                            data-testid={`input-irn-${index}`}
                          />
                        ) : (
                          item.irn
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={item.gstin}
                            onChange={(e) => updateEditedData(index, 'gstin', e.target.value)}
                            data-testid={`input-gstin-${index}`}
                          />
                        ) : (
                          item.gstin
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={item.amount}
                            onChange={(e) => updateEditedData(index, 'amount', e.target.value)}
                            data-testid={`input-amount-${index}`}
                          />
                        ) : (
                          item.amount
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'Processed' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
