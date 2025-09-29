import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail } from "lucide-react";

export function EmailSettings() {
  const { toast } = useToast();
  
  // Alert Settings state
  const [alertSettings, setAlertSettings] = useState({
    egamSyncAlert: true,
    gstnApiCalls: {
      weeklySummary: true,
      quarterlySummary: false
    },
    qrScanner: {
      weeklySummary: true,
      quarterlySummary: true
    },
    pdfScan: {
      weeklySummary: false,
      quarterlySummary: true
    },
    emailReview: {
      weeklySummary: true,
      quarterlySummary: false
    }
  });

  const handleAlertSettingChange = (path: string, value: boolean) => {
    setAlertSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
    
    toast({
      title: "Alert Settings Updated",
      description: "Your alert preferences have been saved",
    });
  };

  return (
    <div className="w-full" data-testid="email-settings">
      <div className="space-y-4">
        {/* Alert Settings Section */}
        <Card className="modern-card animate-fade-in">
          <CardHeader className="modern-card-header">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="modern-card-title flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Alert Settings
                </CardTitle>
                <p className="modern-card-subtitle">
                  Configure notification preferences and alert schedules
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 p-4">
            {/* EGAM Sync Alert */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="space-y-1">
                <Label className="text-base font-semibold text-gray-900">EGAM Sync Alert</Label>
                <p className="text-sm text-gray-600">Receive notifications when EGAM sync completes or fails</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${alertSettings.egamSyncAlert ? 'text-green-600' : 'text-gray-500'}`}>
                  {alertSettings.egamSyncAlert ? 'Enabled' : 'Disabled'}
                </span>
                <Switch
                  checked={alertSettings.egamSyncAlert}
                  onCheckedChange={(checked) => handleAlertSettingChange("egamSyncAlert", checked)}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 [&>span]:shadow-lg [&>span]:transition-all [&>span]:duration-200 data-[state=checked]:[&>span]:shadow-blue-200 data-[state=unchecked]:[&>span]:shadow-gray-200"
                />
              </div>
            </div>

            {/* GSTN API Calls Summary */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="space-y-1">
                <Label className="text-base font-semibold text-gray-900">GSTN API Calls Summary</Label>
                <p className="text-sm text-gray-600">Receive summary reports of GSTN API usage</p>
              </div>
              <div className="space-y-4 pl-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                  <Label className="text-sm font-medium text-gray-900">Weekly Summary</Label>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${alertSettings.gstnApiCalls.weeklySummary ? 'text-green-600' : 'text-gray-500'}`}>
                      {alertSettings.gstnApiCalls.weeklySummary ? 'Enabled' : 'Disabled'}
                    </span>
                    <Switch
                      checked={alertSettings.gstnApiCalls.weeklySummary}
                      onCheckedChange={(checked) => handleAlertSettingChange("gstnApiCalls.weeklySummary", checked)}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 [&>span]:shadow-lg [&>span]:transition-all [&>span]:duration-200 data-[state=checked]:[&>span]:shadow-blue-200 data-[state=unchecked]:[&>span]:shadow-gray-200"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                  <Label className="text-sm font-medium text-gray-900">Quarterly Summary</Label>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${alertSettings.gstnApiCalls.quarterlySummary ? 'text-green-600' : 'text-gray-500'}`}>
                      {alertSettings.gstnApiCalls.quarterlySummary ? 'Enabled' : 'Disabled'}
                    </span>
                    <Switch
                      checked={alertSettings.gstnApiCalls.quarterlySummary}
                      onCheckedChange={(checked) => handleAlertSettingChange("gstnApiCalls.quarterlySummary", checked)}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 [&>span]:shadow-lg [&>span]:transition-all [&>span]:duration-200 data-[state=checked]:[&>span]:shadow-blue-200 data-[state=unchecked]:[&>span]:shadow-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* QR Scanner Summary */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="space-y-1">
                <Label className="text-base font-semibold text-gray-900">QR Scanner Summary</Label>
                <p className="text-sm text-gray-600">Receive summary reports of QR code processing activities</p>
              </div>
              <div className="space-y-4 pl-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                  <Label className="text-sm font-medium text-gray-900">Weekly Summary</Label>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${alertSettings.qrScanner.weeklySummary ? 'text-green-600' : 'text-gray-500'}`}>
                      {alertSettings.qrScanner.weeklySummary ? 'Enabled' : 'Disabled'}
                    </span>
                    <Switch
                      checked={alertSettings.qrScanner.weeklySummary}
                      onCheckedChange={(checked) => handleAlertSettingChange("qrScanner.weeklySummary", checked)}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 [&>span]:shadow-lg [&>span]:transition-all [&>span]:duration-200 data-[state=checked]:[&>span]:shadow-blue-200 data-[state=unchecked]:[&>span]:shadow-gray-200"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                  <Label className="text-sm font-medium text-gray-900">Quarterly Summary</Label>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${alertSettings.qrScanner.quarterlySummary ? 'text-green-600' : 'text-gray-500'}`}>
                      {alertSettings.qrScanner.quarterlySummary ? 'Enabled' : 'Disabled'}
                    </span>
                    <Switch
                      checked={alertSettings.qrScanner.quarterlySummary}
                      onCheckedChange={(checked) => handleAlertSettingChange("qrScanner.quarterlySummary", checked)}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 [&>span]:shadow-lg [&>span]:transition-all [&>span]:duration-200 data-[state=checked]:[&>span]:shadow-blue-200 data-[state=unchecked]:[&>span]:shadow-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PDF Scan Summary */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="space-y-1">
                <Label className="text-base font-semibold text-gray-900">PDF Scan Summary</Label>
                <p className="text-sm text-gray-600">Receive summary reports of PDF processing activities</p>
              </div>
              <div className="space-y-4 pl-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                  <Label className="text-sm font-medium text-gray-900">Weekly Summary</Label>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${alertSettings.pdfScan.weeklySummary ? 'text-green-600' : 'text-gray-500'}`}>
                      {alertSettings.pdfScan.weeklySummary ? 'Enabled' : 'Disabled'}
                    </span>
                    <Switch
                      checked={alertSettings.pdfScan.weeklySummary}
                      onCheckedChange={(checked) => handleAlertSettingChange("pdfScan.weeklySummary", checked)}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 [&>span]:shadow-lg [&>span]:transition-all [&>span]:duration-200 data-[state=checked]:[&>span]:shadow-blue-200 data-[state=unchecked]:[&>span]:shadow-gray-200"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                  <Label className="text-sm font-medium text-gray-900">Quarterly Summary</Label>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${alertSettings.pdfScan.quarterlySummary ? 'text-green-600' : 'text-gray-500'}`}>
                      {alertSettings.pdfScan.quarterlySummary ? 'Enabled' : 'Disabled'}
                    </span>
                    <Switch
                      checked={alertSettings.pdfScan.quarterlySummary}
                      onCheckedChange={(checked) => handleAlertSettingChange("pdfScan.quarterlySummary", checked)}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 [&>span]:shadow-lg [&>span]:transition-all [&>span]:duration-200 data-[state=checked]:[&>span]:shadow-blue-200 data-[state=unchecked]:[&>span]:shadow-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Email Review Summary */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="space-y-1">
                <Label className="text-base font-semibold text-gray-900">Email Review Summary</Label>
                <p className="text-sm text-gray-600">Receive summary reports of email review queue activities</p>
              </div>
              <div className="space-y-4 pl-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                  <Label className="text-sm font-medium text-gray-900">Weekly Summary</Label>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${alertSettings.emailReview.weeklySummary ? 'text-green-600' : 'text-gray-500'}`}>
                      {alertSettings.emailReview.weeklySummary ? 'Enabled' : 'Disabled'}
                    </span>
                    <Switch
                      checked={alertSettings.emailReview.weeklySummary}
                      onCheckedChange={(checked) => handleAlertSettingChange("emailReview.weeklySummary", checked)}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 [&>span]:shadow-lg [&>span]:transition-all [&>span]:duration-200 data-[state=checked]:[&>span]:shadow-blue-200 data-[state=unchecked]:[&>span]:shadow-gray-200"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                  <Label className="text-sm font-medium text-gray-900">Quarterly Summary</Label>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${alertSettings.emailReview.quarterlySummary ? 'text-green-600' : 'text-gray-500'}`}>
                      {alertSettings.emailReview.quarterlySummary ? 'Enabled' : 'Disabled'}
                    </span>
                    <Switch
                      checked={alertSettings.emailReview.quarterlySummary}
                      onCheckedChange={(checked) => handleAlertSettingChange("emailReview.quarterlySummary", checked)}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 [&>span]:shadow-lg [&>span]:transition-all [&>span]:duration-200 data-[state=checked]:[&>span]:shadow-blue-200 data-[state=unchecked]:[&>span]:shadow-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
