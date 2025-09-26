import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Settings, User, Calendar, Mail, Save, Edit3, X } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export function SettingsAndConfig() {
  const { toast } = useToast();
  
  // User details state
  const [userDetails, setUserDetails] = useState({
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Accounts Payable"
  });
  
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [tempUserDetails, setTempUserDetails] = useState(userDetails);
  
  // Configuration state
  const [egamSyncFrequency, setEgamSyncFrequency] = useState("daily");
  const [emailInbox, setEmailInbox] = useState("invoices@company.com");
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [tempConfig, setTempConfig] = useState({
    egamSyncFrequency: egamSyncFrequency,
    emailInbox: emailInbox
  });

  const frequencyOptions = [
    { value: "hourly", label: "Every Hour", description: "Sync every hour" },
    { value: "daily", label: "Daily", description: "Sync once per day at 9:00 AM" },
    { value: "weekly", label: "Weekly", description: "Sync every Monday at 9:00 AM" },
    { value: "monthly", label: "Monthly", description: "Sync on the 1st of each month" },
    { value: "custom", label: "Custom", description: "Set custom schedule" }
  ];

  const departments = [
    "Accounts Payable",
    "Accounts Receivable", 
    "Tax Compliance",
    "Financial Reporting",
    "Budget Planning",
    "Internal Audit",
    "Treasury Management",
    "Cost Accounting"
  ];

  const handleEditUser = () => {
    setTempUserDetails(userDetails);
    setIsEditingUser(true);
  };

  const handleCancelEditUser = () => {
    setTempUserDetails(userDetails);
    setIsEditingUser(false);
  };

  const handleSaveUser = () => {
    setUserDetails(tempUserDetails);
    setIsEditingUser(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

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
        {/* User Details Section */}
        <Card className="modern-card animate-fade-in">
          <CardHeader className="modern-card-header">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="modern-card-title flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  User Details
                </CardTitle>
                <p className="modern-card-subtitle">
                  Manage your personal information and profile
                </p>
              </div>
            {!isEditingUser ? (
              <Button 
                variant="outline" 
                onClick={handleEditUser}
                className="flex items-center"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleCancelEditUser}
                  className="flex items-center"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveUser}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Full Name</Label>
              <Input
                id="user-name"
                value={isEditingUser ? tempUserDetails.name : userDetails.name}
                onChange={(e) => isEditingUser && setTempUserDetails({...tempUserDetails, name: e.target.value})}
                disabled={!isEditingUser}
                className={`h-12 border-2 ${!isEditingUser ? "bg-gray-50 text-gray-500" : "bg-white border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
                data-testid="input-user-name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-email">Email Address</Label>
              <Input
                id="user-email"
                value={userDetails.email}
                disabled
                className="h-12 bg-gray-50 text-gray-500 border-2 border-gray-200"
                data-testid="input-user-email"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-department">Department</Label>
              {isEditingUser ? (
                <Select 
                  value={tempUserDetails.department} 
                  onValueChange={(value) => setTempUserDetails({...tempUserDetails, department: value})}
                >
                  <SelectTrigger className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem 
                        key={dept} 
                        value={dept}
                        className="cursor-pointer"
                      >
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={userDetails.department}
                  disabled
                  className="h-12 bg-gray-50 text-gray-500 border-2 border-gray-200"
                  data-testid="input-user-department"
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Last Updated</Label>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {formatDateTime(new Date().toISOString())}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <div className="space-y-2">
              <Label className="text-base font-semibold">EGAM Sync Frequency</Label>
              <div className="space-y-2">
                {isEditingConfig ? (
                  <Select 
                    value={tempConfig.egamSyncFrequency} 
                    onValueChange={(value) => setTempConfig({...tempConfig, egamSyncFrequency: value})}
                  >
                    <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
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
                            <span className="font-semibold text-gray-900 text-base">{option.label}</span>
                            <span className="text-sm text-gray-600 leading-relaxed">{option.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {frequencyOptions.find(opt => opt.value === egamSyncFrequency)?.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getFrequencyDescription(egamSyncFrequency)}
                        </p>
                      </div>
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Email Inbox for PDF Processing */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Email Inbox for PDF Processing</Label>
              <div className="space-y-2">
                {isEditingConfig ? (
                  <div className="space-y-2">
                    <Input
                      value={tempConfig.emailInbox}
                      onChange={(e) => setTempConfig({...tempConfig, emailInbox: e.target.value})}
                      placeholder="Enter email address"
                      type="email"
                      className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      data-testid="input-email-inbox"
                    />
                    <p className="text-xs text-muted-foreground">
                      This email will be monitored for incoming PDF documents
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{emailInbox}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
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
      </div>
    </div>
  );
}
