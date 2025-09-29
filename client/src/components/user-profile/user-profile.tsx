import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, Mail, Save, Edit3, X, ArrowLeft } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useAppState } from "@/hooks/use-app-state";

export function UserProfile() {
  const { toast } = useToast();
  const { dispatch } = useAppState();
  
  // User details state
  const [userDetails, setUserDetails] = useState({
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Accounts Payable"
  });
  
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [tempUserDetails, setTempUserDetails] = useState(userDetails);

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

  const handleBackToSettings = () => {
    dispatch({ type: 'SET_CURRENT_TAB', payload: 'settings' });
  };

  return (
    <div className="w-full" data-testid="user-profile">
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={handleBackToSettings}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Settings</span>
        </Button>
      </div>

      <div className="space-y-6">
        {/* User Profile Header */}
        <Card className="modern-card animate-fade-in">
          <CardHeader className="modern-card-header">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="modern-card-title flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  User Settings
                </CardTitle>
                <p className="modern-card-subtitle">
                  Manage your personal information, account details, and profile preferences
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
          
          <CardContent className="space-y-6 p-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{userDetails.name}</h2>
                <p className="text-gray-600">{userDetails.email}</p>
                <p className="text-sm text-gray-500">{userDetails.department}</p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="form-grid-2">
              <div className="form-field-group">
                <Label htmlFor="user-name" className="form-label">Full Name</Label>
                <Input
                  id="user-name"
                  value={isEditingUser ? tempUserDetails.name : userDetails.name}
                  onChange={(e) => isEditingUser && setTempUserDetails({...tempUserDetails, name: e.target.value})}
                  disabled={!isEditingUser}
                  className={!isEditingUser ? "form-input-disabled" : "form-input"}
                  data-testid="input-user-name"
                />
              </div>
              
              <div className="form-field-group">
                <Label htmlFor="user-email" className="form-label">Email Address</Label>
                <Input
                  id="user-email"
                  value={userDetails.email}
                  disabled
                  className="form-input-disabled"
                  data-testid="input-user-email"
                />
                <p className="form-help-text">Email cannot be changed</p>
              </div>
              
              <div className="form-field-group">
                <Label htmlFor="user-department" className="form-label">Department</Label>
                {isEditingUser ? (
                  <Select 
                    value={tempUserDetails.department} 
                    onValueChange={(value) => setTempUserDetails({...tempUserDetails, department: value})}
                  >
                    <SelectTrigger className="form-select">
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
                    className="form-input-disabled"
                    data-testid="input-user-department"
                  />
                )}
              </div>
              
              <div className="form-field-group">
                <Label className="form-label">Last Updated</Label>
                <div className="form-display-value flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="form-display-text">{formatDateTime(new Date().toISOString())}</span>
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="border-t pt-6">
              <h3 className="form-section-header">
                <Mail className="mr-2 h-5 w-5" />
                Account Information
              </h3>
              <div className="form-grid-2">
                <div className="form-field-group">
                  <Label className="form-label">User ID</Label>
                  <div className="form-display-value">
                    <span className="form-display-text-mono">USR-001</span>
                  </div>
                </div>
                
                <div className="form-field-group">
                  <Label className="form-label">Role</Label>
                  <div className="form-display-value">
                    <span className="form-display-text-semibold">Application Admin</span>
                  </div>
                </div>
                
                <div className="form-field-group">
                  <Label className="form-label">Account Status</Label>
                  <div className="form-display-value">
                    <span className="form-status-active">Active</span>
                  </div>
                </div>
                
                <div className="form-field-group">
                  <Label className="form-label">Member Since</Label>
                  <div className="form-display-value">
                    <span className="form-display-text-semibold">January 15, 2024</span>
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
