import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/use-app-state";
import { QrCode, Upload, Edit, Save, X, FileSpreadsheet } from "lucide-react";
import { generateDummyQRData } from "@/lib/dummy-data";
import { exportQRDataToExcel } from "@/lib/excel-export";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function QRScanner() {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualData, setManualData] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const { state, dispatch } = useAppState();
  const { toast } = useToast();

  const processQRMutation = useMutation({
    mutationFn: async (qrData: any) => {
      const response = await apiRequest('POST', '/api/qr-data', qrData);
      return response.json();
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_QR_DATA', payload: data });
      toast({
        title: "Success",
        description: "QR Code processed successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process QR code",
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate QR code processing
      const dummyData = generateDummyQRData();
      processQRMutation.mutate(dummyData);
    }
  };

  const handleManualInput = () => {
    try {
      let qrData;
      if (manualData.trim()) {
        qrData = JSON.parse(manualData);
      } else {
        qrData = generateDummyQRData();
      }
      
      processQRMutation.mutate(qrData);
      setShowManualInput(false);
      setManualData("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      const updatedData = { ...state.extractedQRData, ...editedData };
      dispatch({ type: 'SET_QR_DATA', payload: updatedData });
      setIsEditing(false);
      setEditedData({});
      toast({
        title: "Success",
        description: "Data updated successfully!",
      });
    } else {
      setIsEditing(true);
      setEditedData(state.extractedQRData || {});
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleExport = () => {
    if (state.extractedQRData) {
      const success = exportQRDataToExcel(state.extractedQRData);
      if (success) {
        toast({
          title: "Success",
          description: "Data exported to Excel successfully!",
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

  const qrFields = state.extractedQRData ? Object.entries(state.extractedQRData) : [];

  return (
    <div className="max-w-4xl space-y-6" data-testid="qr-scanner">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>QR Code Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
            <QrCode className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-medium">Upload QR Code Image or Enter QR Data</p>
              <p className="text-muted-foreground">Drag and drop a QR code image or click to browse</p>
            </div>
            
            <div className="flex justify-center space-x-3">
              <Button onClick={() => document.getElementById('qr-file-input')?.click()} data-testid="button-browse-qr">
                <Upload className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
              <Button variant="outline" onClick={() => setShowManualInput(true)} data-testid="button-manual-input">
                Manual Input
              </Button>
            </div>
            
            <input
              id="qr-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              data-testid="input-qr-file"
            />
          </div>

          {/* Manual Input Form */}
          {showManualInput && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      QR Code Data (JSON format)
                    </label>
                    <Textarea
                      value={manualData}
                      onChange={(e) => setManualData(e.target.value)}
                      placeholder='{"IRN":"1a2b3c4d5e6f","GSTIN":"27ABCDE1234F1Z5","invoiceNo":"INV-2024-001",...}'
                      className="h-32 resize-none"
                      data-testid="textarea-qr-data"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowManualInput(false)} data-testid="button-cancel-manual">
                      Cancel
                    </Button>
                    <Button onClick={handleManualInput} data-testid="button-process-manual">
                      Process Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Extracted Data */}
      {state.extractedQRData && (
        <Card data-testid="qr-extracted-data">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Extracted QR Data</CardTitle>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit} data-testid="button-cancel-edit">
                      <X className="mr-2 h-4 w-4" />
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
                    <Button onClick={handleExport} data-testid="button-export-excel">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export to Excel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qrFields.map(([field, value]) => (
                  <TableRow key={field} data-testid={`qr-field-${field}`}>
                    <TableCell className="font-medium">{field}</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editedData[field] || value}
                          onChange={(e) => setEditedData({ ...editedData, [field]: e.target.value })}
                          data-testid={`input-edit-${field}`}
                        />
                      ) : (
                        <span data-testid={`value-${field}`}>{String(value)}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
