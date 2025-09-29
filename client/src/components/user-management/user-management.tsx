import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Mail, Clock, CheckCircle, AlertTriangle, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatDateTime } from "@/lib/utils";

export function UserManagement() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    department: "",
    role: ""
  });
  const { toast } = useToast();

  // Generate dummy users data
  const generateDummyUsers = () => {
    const now = new Date();
    const baseTime = now.getTime();
    
    return [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@company.com",
        status: "active",
        department: "Accounts Payable",
        role: "Admin",
        lastActivity: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "2", 
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        status: "active",
        department: "Tax Compliance",
        role: "Application Admin",
        lastActivity: new Date(baseTime - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "3",
        name: "Mike Chen",
        email: "mike.chen@company.com", 
        status: "invited",
        department: "Financial Reporting",
        role: "Business User",
        lastActivity: new Date(baseTime - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "4",
        name: "Emily Davis",
        email: "emily.davis@company.com",
        status: "active", 
        department: "Accounts Receivable",
        role: "Business User",
        lastActivity: new Date(baseTime - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "5",
        name: "Robert Wilson",
        email: "robert.wilson@company.com",
        status: "inactive",
        department: "Budget Planning",
        role: "Application Admin",
        lastActivity: new Date(baseTime - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "6",
        name: "Lisa Brown",
        email: "lisa.brown@company.com",
        status: "active",
        department: "Internal Audit", 
        role: "Business User",
        lastActivity: new Date(baseTime - 30 * 60 * 1000).toISOString()
      }
    ];
  };

  const users = generateDummyUsers();
  const departments = ["Accounts Payable", "Accounts Receivable", "Tax Compliance", "Financial Reporting", "Budget Planning", "Internal Audit", "Treasury Management", "Cost Accounting"];
  const roles = ["Admin", "Application Admin", "Business User"];

  // User management functions
  const getUserRoleBadge = (role: string) => {
    return (
      <span className="text-sm font-medium text-gray-900">
        {role}
      </span>
    );
  };

  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        );
      case 'invited':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            Invited
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Unknown
          </Badge>
        );
    }
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.department || !newUser.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Simulate adding user
    toast({
      title: "Invite Sent",
      description: `Invitation sent to ${newUser.email}`,
    });

    // Reset form
    setNewUser({ name: "", email: "", department: "", role: "" });
    setIsAddUserOpen(false);
  };

  const handleEditUser = (userId: string) => {
    toast({
      title: "Edit User",
      description: `Edit functionality for user ${userId} would open here`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "Delete User",
      description: `Delete functionality for user ${userId} would open here`,
    });
  };

  return (
    <div className="w-full" data-testid="user-management">
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="modern-card-title">
                User Management
              </CardTitle>
              <p className="modern-card-subtitle">
                Manage system users and permissions
              </p>
            </div>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="Enter full name"
                      className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="Enter email address"
                      className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                      <SelectTrigger className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-300 shadow-2xl rounded-lg z-[100] p-2">
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept} className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">{dept}</SelectItem>
              ))}
            </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="role">User Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                      <SelectTrigger className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-300 shadow-2xl rounded-lg z-[100] p-2">
              {roles.map((role) => (
                <SelectItem key={role} value={role} className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">{role}</SelectItem>
              ))}
            </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddUser} className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invite
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Users Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50">
                  <TableHead className="font-semibold text-foreground">Name</TableHead>
                  <TableHead className="font-semibold text-foreground">Email</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">Department</TableHead>
                  <TableHead className="font-semibold text-foreground">User Role</TableHead>
                  <TableHead className="font-semibold text-foreground">Last Activity</TableHead>
                  <TableHead className="font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any, index: number) => (
                  <TableRow key={user.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 transition-all duration-200">
                    <TableCell className="font-medium text-foreground py-4">{user.name}</TableCell>
                    <TableCell className="text-foreground py-4">{user.email}</TableCell>
                    <TableCell className="py-4">
                      {getUserStatusBadge(user.status)}
                    </TableCell>
                    <TableCell className="text-foreground py-4">{user.department}</TableCell>
                    <TableCell className="py-4">
                      {getUserRoleBadge(user.role)}
                    </TableCell>
                    <TableCell className="text-sm py-4">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-foreground font-mono">{formatDateTime(user.lastActivity)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
