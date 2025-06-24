
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import { Circuit } from './Dashboard';
import { useToast } from '@/hooks/use-toast';

interface CircuitDetailsProps {
  circuit: Circuit;
  onBack: () => void;
  onUpdate: (updatedCircuit: Circuit) => void;
}

const CircuitDetails = ({ circuit, onBack, onUpdate }: CircuitDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCircuit, setEditedCircuit] = useState<Circuit>(circuit);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    // Validate IP addresses
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    
    if (!ipRegex.test(editedCircuit.client_ip)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid IP address format.",
        variant: "destructive",
      });
      return;
    }

    if (!editedCircuit.client_name.trim() || !editedCircuit.circuit_id.trim()) {
      toast({
        title: "Validation Error", 
        description: "Client name and circuit ID are required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      const updatedCircuit = {
        ...editedCircuit,
        last_updated: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      
      onUpdate(updatedCircuit);
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);
  };

  const handleCancel = () => {
    setEditedCircuit(circuit);
    setIsEditing(false);
  };

  const handleFieldChange = (field: keyof Circuit, value: string) => {
    setEditedCircuit(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const currentData = isEditing ? editedCircuit : circuit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Circuit Details</h1>
            <p className="text-slate-600">Circuit ID: {currentData.circuit_id}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Configuration
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Circuit Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core circuit identification and client details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="client_name">Client Name</Label>
              {isEditing ? (
                <Input
                  id="client_name"
                  value={currentData.client_name}
                  onChange={(e) => handleFieldChange('client_name', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 p-2 bg-slate-50 rounded border text-sm">{currentData.client_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={currentData.location}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 p-2 bg-slate-50 rounded border text-sm">{currentData.location}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Network Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Network Configuration</CardTitle>
            <CardDescription>IP addressing and network parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="client_ip">Client IP Address</Label>
              {isEditing ? (
                <Input
                  id="client_ip"
                  value={currentData.client_ip}
                  onChange={(e) => handleFieldChange('client_ip', e.target.value)}
                  placeholder="192.168.1.100"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 p-2 bg-slate-50 rounded border text-sm font-mono">{currentData.client_ip}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subnet">Subnet Mask</Label>
                {isEditing ? (
                  <Input
                    id="subnet"
                    value={currentData.subnet}
                    onChange={(e) => handleFieldChange('subnet', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-slate-50 rounded border text-sm font-mono">{currentData.subnet}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="gateway">Gateway</Label>
                {isEditing ? (
                  <Input
                    id="gateway"
                    value={currentData.gateway}
                    onChange={(e) => handleFieldChange('gateway', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-slate-50 rounded border text-sm font-mono">{currentData.gateway}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="dns">DNS Servers</Label>
              {isEditing ? (
                <Input
                  id="dns"
                  value={currentData.dns}
                  onChange={(e) => handleFieldChange('dns', e.target.value)}
                  placeholder="8.8.8.8, 8.8.4.4"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 p-2 bg-slate-50 rounded border text-sm font-mono">{currentData.dns}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vlan">VLAN ID</Label>
                {isEditing ? (
                  <Input
                    id="vlan"
                    value={currentData.vlan}
                    onChange={(e) => handleFieldChange('vlan', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-slate-50 rounded border text-sm">{currentData.vlan}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="bandwidth">Bandwidth</Label>
                {isEditing ? (
                  <Input
                    id="bandwidth"
                    value={currentData.bandwidth}
                    onChange={(e) => handleFieldChange('bandwidth', e.target.value)}
                    placeholder="100 Mbps"
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-slate-50 rounded border text-sm">{currentData.bandwidth}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
            <CardDescription>Infrastructure information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mux_id">MUX ID</Label>
                {isEditing ? (
                  <Input
                    id="mux_id"
                    value={currentData.mux_id}
                    onChange={(e) => handleFieldChange('mux_id', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-slate-50 rounded border text-sm">{currentData.mux_id}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="port_id">Port ID</Label>
                {isEditing ? (
                  <Input
                    id="port_id"
                    value={currentData.port_id}
                    onChange={(e) => handleFieldChange('port_id', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-slate-50 rounded border text-sm">{currentData.port_id}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card>
          <CardHeader>
            <CardTitle>Status Information</CardTitle>
            <CardDescription>Circuit status and maintenance details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Last Updated</Label>
              <p className="mt-1 p-2 bg-slate-50 rounded border text-sm">
                {new Date(currentData.last_updated).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CircuitDetails;
