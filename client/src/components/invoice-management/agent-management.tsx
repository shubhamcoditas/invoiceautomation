import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Mail, Clock, CheckCircle, AlertTriangle, User, Building2, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatDateTime } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface Agent {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  department?: string;
  status: string;
  notes?: string;
  comments?: string;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

export function AgentManagement() {
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [isEditAgentOpen, setIsEditAgentOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAgent, setNewAgent] = useState({
    username: "",
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    department: "",
    status: "active",
    notes: "",
    comments: "",
  });
  const { toast } = useToast();

  // Fetch agents from API
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agents');
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      console.log('[AgentManagement] Raw API response:', data);
      console.log('[AgentManagement] Number of agents:', data?.length || 0);
      
      // Parse metadata to extract firstName, lastName, and comments
      const agentsWithParsedMetadata = (data || []).map((agent: any) => {
        console.log('[AgentManagement] Processing agent:', agent.username, 'metadata:', agent.metadata);
        
        let metadata = {};
        if (agent.metadata) {
          try {
            metadata = typeof agent.metadata === 'string' ? JSON.parse(agent.metadata) : agent.metadata;
            console.log('[AgentManagement] Parsed metadata for', agent.username, ':', metadata);
          } catch (e) {
            console.warn('[AgentManagement] Failed to parse metadata for agent:', agent.id, e);
            metadata = {};
          }
        } else {
          console.log('[AgentManagement] No metadata for agent:', agent.username);
        }
        
        // Extract firstName and lastName from metadata, or try to derive from username
        let firstName = metadata?.firstName || '';
        let lastName = metadata?.lastName || '';
        
        console.log('[AgentManagement] Extracted from metadata - firstName:', firstName, 'lastName:', lastName);
        
        // If metadata doesn't have names, try to extract from username (e.g., "agent_smith" -> "Smith")
        if (!firstName && !lastName && agent.username) {
          const nameParts = agent.username.replace(/^agent_/, '').split('_');
          console.log('[AgentManagement] Extracting from username:', agent.username, 'parts:', nameParts);
          if (nameParts.length >= 1 && nameParts[0]) {
            firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
          }
          if (nameParts.length >= 2 && nameParts[1]) {
            lastName = nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1);
          }
          console.log('[AgentManagement] Extracted from username - firstName:', firstName, 'lastName:', lastName);
        }
        
        const result = {
          ...agent,
          firstName: firstName || '',
          lastName: lastName || '',
          comments: metadata?.comments || agent.notes || '',
        };
        
        console.log('[AgentManagement] Final agent data:', result.username, 'firstName:', result.firstName, 'lastName:', result.lastName);
        
        return result;
      });
      console.log('[AgentManagement] All parsed agents:', agentsWithParsedMetadata);
      setAgents(agentsWithParsedMetadata);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch agents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Handle add agent
  const handleAddAgent = async () => {
    if (!newAgent.username || !newAgent.companyName) {
      toast({
        title: "Validation Error",
        description: "Please fill in username and company name",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newAgent.username,
          companyName: newAgent.companyName,
          email: newAgent.email || null,
          phone: newAgent.phone || null,
          department: newAgent.department || null,
          status: newAgent.status,
          notes: newAgent.notes || null,
          metadata: {
            firstName: newAgent.firstName || '',
            lastName: newAgent.lastName || '',
            comments: newAgent.comments || '',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Failed to create agent');
      }

      toast({
        title: "Success",
        description: "Agent created successfully",
      });

      // Reset form
      setNewAgent({
        username: "",
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        phone: "",
        department: "",
        status: "active",
        notes: "",
        comments: "",
      });
      setIsAddAgentOpen(false);
      fetchAgents();
    } catch (error: any) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle edit agent
  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setNewAgent({
      username: agent.username,
      firstName: agent.firstName || "",
      lastName: agent.lastName || "",
      companyName: agent.companyName || "",
      email: agent.email || "",
      phone: agent.phone || "",
      department: agent.department || "",
      status: agent.status || "active",
      notes: agent.notes || "",
      comments: agent.comments || "",
    });
    setIsEditAgentOpen(true);
  };

  // Handle update agent
  const handleUpdateAgent = async () => {
    if (!editingAgent || !newAgent.username || !newAgent.companyName) {
      toast({
        title: "Validation Error",
        description: "Please fill in username and company name",
        variant: "destructive",
      });
      return;
    }

    try {
      const updateData: any = {
        username: newAgent.username,
        companyName: newAgent.companyName,
        email: newAgent.email || null,
        phone: newAgent.phone || null,
        department: newAgent.department || null,
        status: newAgent.status,
        notes: newAgent.notes || null,
        metadata: {
          firstName: newAgent.firstName || '',
          lastName: newAgent.lastName || '',
          comments: newAgent.comments || '',
        },
      };

      const response = await fetch(`/api/agents/${editingAgent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Failed to update agent');
      }

      toast({
        title: "Success",
        description: "Agent updated successfully",
      });

      setIsEditAgentOpen(false);
      setEditingAgent(null);
      setNewAgent({
        username: "",
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        phone: "",
        department: "",
        status: "active",
        notes: "",
        comments: "",
      });
      fetchAgents();
    } catch (error: any) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete agent
  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Failed to delete agent');
      }

      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });

      fetchAgents();
    } catch (error: any) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Inactive
          </Badge>
        );
      case 'invited':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            Invited
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="w-full" data-testid="agent-management">
      <Card className="im-card">
        <CardHeader className="im-card-header">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="im-card-title">
                Agent Management
              </CardTitle>
              <p className="im-card-subtitle">
                Manage agents, their company information, and notes
              </p>
            </div>
            <Dialog open={isAddAgentOpen} onOpenChange={setIsAddAgentOpen}>
              <DialogTrigger asChild>
                <Button className="im-button-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Onboard Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Agent</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newAgent.firstName}
                        onChange={(e) => setNewAgent({...newAgent, firstName: e.target.value})}
                        placeholder="Enter first name"
                        className="im-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newAgent.lastName}
                        onChange={(e) => setNewAgent({...newAgent, lastName: e.target.value})}
                        placeholder="Enter last name"
                        className="im-input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      value={newAgent.username}
                      onChange={(e) => setNewAgent({...newAgent, username: e.target.value})}
                      placeholder="Enter username"
                      className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={newAgent.companyName}
                      onChange={(e) => setNewAgent({...newAgent, companyName: e.target.value})}
                      placeholder="Enter company name"
                      className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newAgent.email}
                        onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                        placeholder="Enter email address"
                        className="im-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newAgent.phone}
                        onChange={(e) => setNewAgent({...newAgent, phone: e.target.value})}
                        placeholder="Enter phone number"
                        className="im-input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={newAgent.department}
                        onChange={(e) => setNewAgent({...newAgent, department: e.target.value})}
                        placeholder="Enter department"
                        className="im-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={newAgent.status} onValueChange={(value) => setNewAgent({...newAgent, status: value})}>
                        <SelectTrigger className="im-select-trigger">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="im-select-content">
                          <SelectItem value="active" className="im-select-item">Active</SelectItem>
                          <SelectItem value="inactive" className="im-select-item">Inactive</SelectItem>
                          <SelectItem value="invited" className="im-select-item">Invited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      value={newAgent.comments}
                      onChange={(e) => setNewAgent({...newAgent, comments: e.target.value})}
                      placeholder="Enter comments about this agent"
                      className="im-textarea"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Optional: Comments about this agent</p>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newAgent.notes}
                      onChange={(e) => setNewAgent({...newAgent, notes: e.target.value})}
                      placeholder="Enter any additional notes about this agent"
                      className="im-textarea"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Optional: Additional notes about this agent</p>
                  </div>
                  <Button onClick={handleAddAgent} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Agent
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No agents found. Add your first agent to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50">
                    <TableHead className="font-semibold text-foreground">First Name</TableHead>
                    <TableHead className="font-semibold text-foreground">Last Name</TableHead>
                    <TableHead className="font-semibold text-foreground">Username</TableHead>
                    <TableHead className="font-semibold text-foreground">Company</TableHead>
                    <TableHead className="font-semibold text-foreground">Contact</TableHead>
                    <TableHead className="font-semibold text-foreground">Department</TableHead>
                    <TableHead className="font-semibold text-foreground w-32">Comments</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground">Created</TableHead>
                    <TableHead className="font-semibold text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id} className="im-table-row-hover">
                      <TableCell className="font-medium text-foreground py-4">
                        {agent.firstName || '-'}
                      </TableCell>
                      <TableCell className="font-medium text-foreground py-4">
                        {agent.lastName || '-'}
                      </TableCell>
                      <TableCell className="font-medium text-foreground py-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {agent.username}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {agent.companyName || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground py-4">
                        <div className="space-y-1">
                          {agent.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {agent.email}
                            </div>
                          )}
                          {agent.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {agent.phone}
                            </div>
                          )}
                          {!agent.email && !agent.phone && <span className="text-muted-foreground">-</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground py-4">{agent.department || '-'}</TableCell>
                      <TableCell className="text-foreground py-4 w-32">
                        <div className="truncate max-w-[120px]" title={agent.comments || ''}>
                          {agent.comments || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(agent.status)}
                      </TableCell>
                      <TableCell className="text-sm py-4">
                        {agent.createdAt ? (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-foreground font-mono">{formatDateTime(agent.createdAt)}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditAgent(agent)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteAgent(agent.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Edit Agent Dialog */}
      <Dialog open={isEditAgentOpen} onOpenChange={setIsEditAgentOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  value={newAgent.firstName}
                  onChange={(e) => setNewAgent({...newAgent, firstName: e.target.value})}
                  placeholder="Enter first name"
                  className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  value={newAgent.lastName}
                  onChange={(e) => setNewAgent({...newAgent, lastName: e.target.value})}
                  placeholder="Enter last name"
                  className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-username">Username *</Label>
              <Input
                id="edit-username"
                value={newAgent.username}
                onChange={(e) => setNewAgent({...newAgent, username: e.target.value})}
                placeholder="Enter username"
                className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <Label htmlFor="edit-companyName">Company Name *</Label>
              <Input
                id="edit-companyName"
                value={newAgent.companyName}
                onChange={(e) => setNewAgent({...newAgent, companyName: e.target.value})}
                placeholder="Enter company name"
                className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                  placeholder="Enter email address"
                  className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={newAgent.phone}
                  onChange={(e) => setNewAgent({...newAgent, phone: e.target.value})}
                  placeholder="Enter phone number"
                  className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={newAgent.department}
                  onChange={(e) => setNewAgent({...newAgent, department: e.target.value})}
                  placeholder="Enter department"
                  className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={newAgent.status} onValueChange={(value) => setNewAgent({...newAgent, status: value})}>
                  <SelectTrigger className="h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-gray-300 shadow-2xl rounded-lg z-[100] p-2">
                    <SelectItem value="active" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150">Active</SelectItem>
                    <SelectItem value="inactive" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150">Inactive</SelectItem>
                    <SelectItem value="invited" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150">Invited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-comments">Comments</Label>
              <Textarea
                id="edit-comments"
                value={newAgent.comments}
                onChange={(e) => setNewAgent({...newAgent, comments: e.target.value})}
                placeholder="Enter comments about this agent"
                className="min-h-[80px] bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-xs text-muted-foreground mt-1">Optional: Comments about this agent</p>
            </div>
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={newAgent.notes}
                onChange={(e) => setNewAgent({...newAgent, notes: e.target.value})}
                placeholder="Enter any additional notes about this agent"
                className="min-h-[80px] bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-xs text-muted-foreground mt-1">Optional: Additional notes about this agent</p>
            </div>
            <Button onClick={handleUpdateAgent} className="w-full">
              <Edit className="mr-2 h-4 w-4" />
              Update Agent
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

