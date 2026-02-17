import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Mail, Clock, CheckCircle, AlertTriangle, User, Building2, Phone, Search } from "lucide-react";
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
  slCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function AgentManagement() {
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [isEditAgentOpen, setIsEditAgentOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAgent, setNewAgent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    comments: "",
    slCode: "",
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
      // Map the data to include firstName and lastName if they exist in metadata
      const mappedAgents = (data || []).map((agent: any) => ({
        ...agent,
        firstName: agent.metadata?.firstName || agent.firstName || '',
        lastName: agent.metadata?.lastName || agent.lastName || '',
        comments: agent.notes || agent.comments || '',
        slCode: agent.metadata?.slCode || agent.slCode || '',
      }));
      setAgents(mappedAgents);
      setFilteredAgents(mappedAgents);
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

  // Filter agents based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAgents(agents);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = agents.filter((agent) => {
      return (
        agent.firstName?.toLowerCase().includes(query) ||
        agent.lastName?.toLowerCase().includes(query) ||
        agent.email?.toLowerCase().includes(query) ||
        agent.companyName?.toLowerCase().includes(query) ||
        agent.slCode?.toLowerCase().includes(query) ||
        agent.comments?.toLowerCase().includes(query) ||
        agent.username?.toLowerCase().includes(query)
      );
    });
    setFilteredAgents(filtered);
  }, [searchQuery, agents]);

  // Handle add agent
  const handleAddAgent = async () => {
    if (!newAgent.firstName || !newAgent.lastName || !newAgent.email || !newAgent.companyName) {
      toast({
        title: "Validation Error",
        description: "Please fill in First Name, Last Name, Email, and Company Name",
        variant: "destructive",
      });
      return;
    }

    try {
      const username = `${newAgent.firstName.toLowerCase()}.${newAgent.lastName.toLowerCase()}`;
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          firstName: newAgent.firstName,
          lastName: newAgent.lastName,
          companyName: newAgent.companyName,
          email: newAgent.email || null,
          notes: newAgent.comments || null,
          status: 'active',
          role: 'agent',
          metadata: {
            firstName: newAgent.firstName,
            lastName: newAgent.lastName,
            comments: newAgent.comments,
            slCode: newAgent.slCode,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add agent');
      }

      toast({
        title: "Success",
        description: "Agent onboarded successfully",
      });
      
      setIsAddAgentOpen(false);
      setNewAgent({
        firstName: "",
        lastName: "",
        email: "",
        companyName: "",
        comments: "",
        slCode: "",
      });
      fetchAgents();
    } catch (error) {
      console.error('Error adding agent:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle edit agent
  const handleEditAgent = async () => {
    if (!editingAgent) return;

    if (!editingAgent.firstName || !editingAgent.lastName || !editingAgent.email || !editingAgent.companyName) {
      toast({
        title: "Validation Error",
        description: "Please fill in First Name, Last Name, Email, and Company Name",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/agents/${editingAgent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: editingAgent.firstName,
          lastName: editingAgent.lastName,
          companyName: editingAgent.companyName,
          email: editingAgent.email || null,
          notes: editingAgent.comments || null,
          metadata: {
            firstName: editingAgent.firstName,
            lastName: editingAgent.lastName,
            comments: editingAgent.comments,
            slCode: editingAgent.slCode,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update agent');
      }

      toast({
        title: "Success",
        description: "Agent updated successfully",
      });
      
      setIsEditAgentOpen(false);
      setEditingAgent(null);
      fetchAgents();
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete agent
  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete agent');
      }

      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
      
      fetchAgents();
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"><Clock className="h-3 w-3 mr-1" />Inactive</Badge>;
      case 'invited':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"><AlertTriangle className="h-3 w-3 mr-1" />Invited</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="ea-card shadow-lg">
        <CardHeader className="ea-card-header text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Agent Management</CardTitle>
            <Dialog open={isAddAgentOpen} onOpenChange={setIsAddAgentOpen}>
              <DialogTrigger asChild>
                <Button className="ea-button-white-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Onboard Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="ea-dialog-title-primary">Onboard New Agent</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={newAgent.firstName}
                        onChange={(e) => setNewAgent({ ...newAgent, firstName: e.target.value })}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={newAgent.lastName}
                        onChange={(e) => setNewAgent({ ...newAgent, lastName: e.target.value })}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAgent.email}
                      onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={newAgent.companyName}
                      onChange={(e) => setNewAgent({ ...newAgent, companyName: e.target.value })}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slCode">SL Code</Label>
                    <Input
                      id="slCode"
                      value={newAgent.slCode}
                      onChange={(e) => setNewAgent({ ...newAgent, slCode: e.target.value })}
                      placeholder="Enter SL Code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      value={newAgent.comments}
                      onChange={(e) => setNewAgent({ ...newAgent, comments: e.target.value })}
                      placeholder="Enter any additional comments"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddAgentOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddAgent}
                      className="ea-button-primary"
                    >
                      Onboard Agent
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {!loading && agents.length > 0 && (
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search agents by name, email, company, SL Code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          )}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 ea-spinner"></div>
              <p className="mt-2 text-muted-foreground">Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-muted-foreground">No agents found. Onboard your first agent to get started.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="font-semibold">First Name</TableHead>
                    <TableHead className="font-semibold">Last Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Company Name</TableHead>
                    <TableHead className="font-semibold">SL Code</TableHead>
                    <TableHead className="font-semibold">Comments</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No agents found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.firstName || 'N/A'}</TableCell>
                      <TableCell>{agent.lastName || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {agent.email || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          {agent.companyName || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>{agent.slCode || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate" title={agent.comments || ''}>
                        {agent.comments || 'N/A'}
                      </TableCell>
                      <TableCell>{getStatusBadge(agent.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingAgent(agent);
                              setIsEditAgentOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAgent(agent.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Agent Dialog */}
      <Dialog open={isEditAgentOpen} onOpenChange={setIsEditAgentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="ea-dialog-title-primary">Edit Agent</DialogTitle>
          </DialogHeader>
          {editingAgent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">First Name *</Label>
                  <Input
                    id="editFirstName"
                    value={editingAgent.firstName || ''}
                    onChange={(e) => setEditingAgent({ ...editingAgent, firstName: e.target.value })}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Last Name *</Label>
                  <Input
                    id="editLastName"
                    value={editingAgent.lastName || ''}
                    onChange={(e) => setEditingAgent({ ...editingAgent, lastName: e.target.value })}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email *</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editingAgent.email || ''}
                  onChange={(e) => setEditingAgent({ ...editingAgent, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCompanyName">Company Name *</Label>
                <Input
                  id="editCompanyName"
                  value={editingAgent.companyName || ''}
                  onChange={(e) => setEditingAgent({ ...editingAgent, companyName: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSlCode">SL Code</Label>
                <Input
                  id="editSlCode"
                  value={editingAgent.slCode || ''}
                  onChange={(e) => setEditingAgent({ ...editingAgent, slCode: e.target.value })}
                  placeholder="Enter SL Code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editComments">Comments</Label>
                <Textarea
                  id="editComments"
                  value={editingAgent.comments || ''}
                  onChange={(e) => setEditingAgent({ ...editingAgent, comments: e.target.value })}
                  placeholder="Enter any additional comments"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditAgentOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleEditAgent}
                  className="ea-button-primary"
                >
                  Update Agent
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

