import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Mail, 
  Database, 
  Shield, 
  Cloud,
  CheckCircle,
  XCircle,
  Link,
  Unlink
} from "lucide-react";

const integrations = [
  {
    id: 'kigs',
    name: 'KIGS',
    domain: 'kigs.gov.in',
    icon: Database,
    color: 'bg-blue-600',
    status: 'active',
    category: 'Government'
  },
  {
    id: 'gsp',
    name: 'GSP',
    domain: 'gsp.gov.in',
    icon: Shield,
    color: 'bg-green-600',
    status: 'active',
    category: 'Government'
  },
  {
    id: 'cygnet',
    name: 'Cygnet',
    domain: 'cygnet.com',
    icon: Cloud,
    color: 'bg-purple-600',
    status: 'inactive',
    category: 'Enterprise'
  },
  {
    id: 'mail-integration',
    name: 'Mail Integration',
    domain: 'smtp.gmail.com',
    icon: Mail,
    color: 'bg-red-600',
    status: 'active',
    category: 'Communication'
  }
];


export function Integrations() {
  const [integrationStates, setIntegrationStates] = useState<{[key: string]: boolean}>({
    'kigs': true,
    'gsp': true,
    'cygnet': false,
    'mail-integration': true
  });

  const [connectionModal, setConnectionModal] = useState<{
    isOpen: boolean;
    integrationId: string | null;
    clientKey: string;
    clientSecret: string;
  }>({
    isOpen: false,
    integrationId: null,
    clientKey: '',
    clientSecret: ''
  });

  const handleToggleIntegration = (integrationId: string) => {
    if (integrationStates[integrationId]) {
      // Disconnect directly
      setIntegrationStates(prev => ({
        ...prev,
        [integrationId]: false
      }));
    } else {
      // Open connection modal
      setConnectionModal({
        isOpen: true,
        integrationId,
        clientKey: '',
        clientSecret: ''
      });
    }
  };

  const handleConnect = () => {
    if (connectionModal.clientKey && connectionModal.clientSecret && connectionModal.integrationId) {
      setIntegrationStates(prev => ({
        ...prev,
        [connectionModal.integrationId]: true
      }));
      setConnectionModal({
        isOpen: false,
        integrationId: null,
        clientKey: '',
        clientSecret: ''
      });
    }
  };

  const isConnectButtonEnabled = connectionModal.clientKey.trim() !== '' && connectionModal.clientSecret.trim() !== '';

  return (
    <div className="w-full space-y-8" data-testid="integrations">
      {/* Integrations Container */}
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <CardTitle className="modern-card-title">
            Integrations
          </CardTitle>
          <p className="modern-card-subtitle">
            Manage your system integrations and third-party connections
          </p>
        </CardHeader>
        <CardContent>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {integrations.map((integration) => {
              const IconComponent = integration.icon;
              const isActive = integrationStates[integration.id];
          
          return (
            <Card key={integration.id} className="group hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${integration.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {integration.domain}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={isActive ? "default" : "secondary"}
                      className={`text-xs ${
                        isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                    
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {integration.category}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant={isActive ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleIntegration(integration.id)}
                    className={`flex items-center space-x-2 ${
                      isActive 
                        ? 'text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Unlink className="h-4 w-4" />
                        <span>Disconnect</span>
                      </>
                    ) : (
                      <>
                        <Link className="h-4 w-4" />
                        <span>Connect</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Connection Modal */}
      <Dialog open={connectionModal.isOpen} onOpenChange={(open) => setConnectionModal(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Integration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientKey">Client Key</Label>
              <Input
                id="clientKey"
                placeholder="Enter your client key"
                value={connectionModal.clientKey}
                onChange={(e) => setConnectionModal(prev => ({ ...prev, clientKey: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                placeholder="Enter your client secret"
                value={connectionModal.clientSecret}
                onChange={(e) => setConnectionModal(prev => ({ ...prev, clientSecret: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setConnectionModal(prev => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConnect}
                disabled={!isConnectButtonEnabled}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
