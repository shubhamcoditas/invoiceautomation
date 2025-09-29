import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings, User, Calendar, Mail, Save, Edit3, X, Building2 } from "lucide-react";

export function SettingsAndConfig() {
  const { toast } = useToast();
  
  
  // Configuration state
  const [egamSyncFrequency, setEgamSyncFrequency] = useState("daily");
  const [emailInbox, setEmailInbox] = useState("invoices@company.com");
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [tempConfig, setTempConfig] = useState({
    egamSyncFrequency: egamSyncFrequency,
    emailInbox: emailInbox
  });

  // Entity Details state
  const [entityDetails] = useState({
    name: "HSBC",
    onboardingDate: "23 Jan '24"
  });

  // Licensing information state
  const [licensingInfo] = useState({
    licenseType: "Enterprise",
    licenseKey: "ENT-2024-HSBC-789456123",
    maxUsers: 100,
    currentUsers: 6,
    expiryDate: "2024-12-31",
    features: [
      "Advanced PDF Processing",
      "GSTN API Integration", 
      "QR Code Scanning",
      "Email Review Queue",
      "Custom Reporting",
      "API Rate Limiting"
    ],
    supportLevel: "Premium Support",
    lastRenewal: "2024-01-15"
  });


  const frequencyOptions = [
    { value: "hourly", label: "Every Hour", description: "Sync every hour" },
    { value: "daily", label: "Daily", description: "Sync once per day at 9:00 AM" },
    { value: "weekly", label: "Weekly", description: "Sync every Monday at 9:00 AM" },
    { value: "monthly", label: "Monthly", description: "Sync on the 1st of each month" },
    { value: "custom", label: "Custom", description: "Set custom schedule" }
  ];


  const handleEditConfig = () => {
    setTempConfig({
      egamSyncFrequency: egamSyncFrequency,
      emailInbox: emailInbox
    });
    setIsEditingConfig(true);
  };

  const handleCancelEditConfig = () => {
    setTempConfig({
      egamSyncFrequency: egamSyncFrequency,
      emailInbox: emailInbox
    });
    setIsEditingConfig(false);
  };

  const handleSaveConfig = () => {
    setEgamSyncFrequency(tempConfig.egamSyncFrequency);
    setEmailInbox(tempConfig.emailInbox);
    setIsEditingConfig(false);
    toast({
      title: "Configuration Updated",
      description: "System configuration has been updated successfully",
    });
  };

  const getFrequencyDescription = (frequency: string) => {
    const option = frequencyOptions.find(opt => opt.value === frequency);
    return option ? option.description : "";
  };



  return (
    <div className="w-full" data-testid="settings-config">

      <div className="space-y-4">
        {/* Configuration Section */}
        <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="modern-card-title flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                System Configuration
              </CardTitle>
              <p className="modern-card-subtitle">
                Configure system settings and preferences
              </p>
            </div>
            {!isEditingConfig ? (
              <Button 
                variant="outline" 
                onClick={handleEditConfig}
                className="flex items-center"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Config
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleCancelEditConfig}
                  className="flex items-center"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveConfig}
                  className="flex items-center"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 p-4">
          <div className="space-y-4">
            {/* EGAM Sync Frequency */}
            <div className="form-field-group">
              <Label className="form-label-large">EGAM Sync Frequency</Label>
              <div className="form-field-group">
                {isEditingConfig ? (
                  <Select 
                    value={tempConfig.egamSyncFrequency} 
                    onValueChange={(value) => setTempConfig({...tempConfig, egamSyncFrequency: value})}
                  >
                    <SelectTrigger className="form-select w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col space-y-1">
                            <span className="form-display-text-semibold text-base">{option.label}</span>
                            <span className="form-display-text leading-relaxed">{option.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="form-display-value">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="form-display-text-semibold">
                          {frequencyOptions.find(opt => opt.value === egamSyncFrequency)?.label}
                        </p>
                        <p className="form-display-text">
                          {getFrequencyDescription(egamSyncFrequency)}
                        </p>
                      </div>
                      <Calendar className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Email Inbox for PDF Processing */}
            <div className="form-field-group">
              <Label className="form-label-large">Email Inbox for PDF Processing</Label>
              <div className="form-field-group">
                {isEditingConfig ? (
                  <div className="form-field-group">
                    <Input
                      value={tempConfig.emailInbox}
                      onChange={(e) => setTempConfig({...tempConfig, emailInbox: e.target.value})}
                      placeholder="Enter email address"
                      type="email"
                      className="form-input"
                      data-testid="input-email-inbox"
                    />
                    <p className="form-help-text">
                      This email will be monitored for incoming PDF documents
                    </p>
                  </div>
                ) : (
                  <div className="form-display-value">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-5 w-5 text-gray-500" />
                        <span className="form-display-text-semibold">{emailInbox}</span>
                      </div>
                      <div className="form-help-text">
                        Active
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entity Details Section */}
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="modern-card-title flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Entity Details
              </CardTitle>
              <p className="modern-card-subtitle">
                Organization information and licensing management
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 p-4">
          {/* Entity Info */}
          <div className="form-grid-2">
            <div className="form-field-group">
              <Label className="form-label">Entity Name</Label>
              <div className="form-display-value">
                <span className="form-display-text-semibold">{entityDetails.name}</span>
              </div>
            </div>
            
            <div className="form-field-group">
              <Label className="form-label">Onboarding Date</Label>
              <div className="form-display-value">
                <span className="form-display-text-semibold">{entityDetails.onboardingDate}</span>
              </div>
            </div>
          </div>

            {/* Licensing Information */}
            <div className="space-y-6">
              <div className="form-section-header">
                License Information
              </div>
              
              {/* License Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* License Type and Key */}
                <div className="space-y-4">
                  <div className="form-field-group">
                    <Label className="form-label">License Type</Label>
                    <div className="form-display-value">
                      <div className="flex items-center justify-between">
                        <span className="form-display-text-semibold">{licensingInfo.licenseType}</span>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
            </div>
            </div>
          </div>
                  
                  <div className="form-field-group">
                    <Label className="form-label">License Key</Label>
                    <div className="form-display-value">
                      <span className="form-display-text-mono">{licensingInfo.licenseKey}</span>
            </div>
          </div>
                </div>

                {/* User Limits and Expiry */}
                <div className="space-y-4">
                  <div className="form-field-group">
                    <Label className="form-label">User Capacity</Label>
                    <div className="form-display-value">
                      <div className="flex items-center justify-between">
                        <span className="form-display-text-semibold">
                          {licensingInfo.currentUsers} / {licensingInfo.maxUsers} users
                  </span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(licensingInfo.currentUsers / licensingInfo.maxUsers) * 100}%` }}
                          ></div>
                </div>
              </div>
            </div>
          </div>

                  <div className="form-field-group">
                    <Label className="form-label">Expiry Date</Label>
                    <div className="form-display-value">
                      <span className="form-display-text-semibold">{licensingInfo.expiryDate}</span>
                </div>
              </div>
            </div>
          </div>

            {/* Features and Support */}
            <div className="space-y-4">
              <div className="form-field-group">
                <Label className="form-label">Included Features</Label>
                <div className="form-display-value">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {licensingInfo.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="form-display-text">{feature}</span>
            </div>
                    ))}
              </div>
            </div>
          </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-field-group">
                  <Label className="form-label">Support Level</Label>
                  <div className="form-display-value">
                    <span className="form-display-text-semibold">{licensingInfo.supportLevel}</span>
            </div>
                </div>
                
                <div className="form-field-group">
                  <Label className="form-label">Last Renewal</Label>
                  <div className="form-display-value">
                    <span className="form-display-text-semibold">{licensingInfo.lastRenewal}</span>
              </div>
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
