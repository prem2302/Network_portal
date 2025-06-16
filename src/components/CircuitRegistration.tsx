
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Circuit } from './Dashboard';
import { useToast } from '@/hooks/use-toast';

interface CircuitRegistrationProps {
  onCancel: () => void;
  onSuccess: (newCircuit: Circuit) => void;
}

const CircuitRegistration = ({ onCancel, onSuccess }: CircuitRegistrationProps) => {
  const [formData, setFormData] = useState<Omit<Circuit, 'last_updated'>>({
    service_no: '',
    circuit_id: '',
    client_name: '',
    client_ip: '',
    subnet: '255.255.255.0',
    gateway: '',
    dns: '8.8.8.8, 8.8.4.4',
    vlan: '',
    bandwidth: '',
    location: '',
    mux_id: '',
    port_id: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.service_no.trim()) newErrors.service_no = 'Service number is required';
    if (!formData.circuit_id.trim()) newErrors.circuit_id = 'Circuit ID is required';
    if (!formData.client_name.trim()) newErrors.client_name = 'Client name is required';
    if (!formData.client_ip.trim()) newErrors.client_ip = 'Client IP is required';
    if (!formData.gateway.trim()) newErrors.gateway = 'Gateway is required';
    if (!formData.vlan.trim()) newErrors.vlan = 'VLAN ID is required';
    if (!formData.bandwidth.trim()) newErrors.bandwidth = 'Bandwidth is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.mux_id.trim()) newErrors.mux_id = 'MUX ID is required';
    if (!formData.port_id.trim()) newErrors.port_id = 'Port ID is required';

    // IP address validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (formData.client_ip && !ipRegex.test(formData.client_ip)) {
      newErrors.client_ip = 'Please enter a valid IP address';
    }
    if (formData.gateway && !ipRegex.test(formData.gateway)) {
      newErrors.gateway = 'Please enter a valid gateway IP address';
    }

    // VLAN validation (should be number)
    if (formData.vlan && (isNaN(Number(formData.vlan)) || Number(formData.vlan) < 1 || Number(formData.vlan) > 4094)) {
      newErrors.vlan = 'VLAN ID must be a number between 1 and 4094';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      const newCircuit: Circuit = {
        ...formData,
        last_updated: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      
      toast({
        title: "Registration Successful",
        description: `Circuit ${formData.service_no} has been registered successfully.`,
      });
      
      onSuccess(newCircuit);
      setIsSaving(false);
    }, 1500);
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Register New Circuit</h1>
            <p className="text-slate-600">Create a new client circuit configuration</p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core circuit identification and client details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service_no">Service Number *</Label>
                  <Input
                    id="service_no"
                    value={formData.service_no}
                    onChange={(e) => handleFieldChange('service_no', e.target.value)}
                    placeholder="SVC001"
                    className={`mt-1 ${errors.service_no ? 'border-red-500' : ''}`}
                  />
                  {errors.service_no && <p className="text-red-500 text-xs mt-1">{errors.service_no}</p>}
                </div>
                
                <div>
                  <Label htmlFor="circuit_id">Circuit ID *</Label>
                  <Input
                    id="circuit_id"
                    value={formData.circuit_id}
                    onChange={(e) => handleFieldChange('circuit_id', e.target.value)}
                    placeholder="CIR-001-NYC"
                    className={`mt-1 ${errors.circuit_id ? 'border-red-500' : ''}`}
                  />
                  {errors.circuit_id && <p className="text-red-500 text-xs mt-1">{errors.circuit_id}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => handleFieldChange('client_name', e.target.value)}
                  placeholder="Enter client company name"
                  className={`mt-1 ${errors.client_name ? 'border-red-500' : ''}`}
                />
                {errors.client_name && <p className="text-red-500 text-xs mt-1">{errors.client_name}</p>}
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  placeholder="City, State"
                  className={`mt-1 ${errors.location ? 'border-red-500' : ''}`}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
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
                <Label htmlFor="client_ip">Client IP Address *</Label>
                <Input
                  id="client_ip"
                  value={formData.client_ip}
                  onChange={(e) => handleFieldChange('client_ip', e.target.value)}
                  placeholder="192.168.1.100"
                  className={`mt-1 ${errors.client_ip ? 'border-red-500' : ''}`}
                />
                {errors.client_ip && <p className="text-red-500 text-xs mt-1">{errors.client_ip}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subnet">Subnet Mask</Label>
                  <Input
                    id="subnet"
                    value={formData.subnet}
                    onChange={(e) => handleFieldChange('subnet', e.target.value)}
                    placeholder="255.255.255.0"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gateway">Gateway *</Label>
                  <Input
                    id="gateway"
                    value={formData.gateway}
                    onChange={(e) => handleFieldChange('gateway', e.target.value)}
                    placeholder="192.168.1.1"
                    className={`mt-1 ${errors.gateway ? 'border-red-500' : ''}`}
                  />
                  {errors.gateway && <p className="text-red-500 text-xs mt-1">{errors.gateway}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="dns">DNS Servers</Label>
                <Input
                  id="dns"
                  value={formData.dns}
                  onChange={(e) => handleFieldChange('dns', e.target.value)}
                  placeholder="8.8.8.8, 8.8.4.4"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
              <CardDescription>VLAN, bandwidth, and infrastructure information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="vlan">VLAN ID *</Label>
                  <Input
                    id="vlan"
                    value={formData.vlan}
                    onChange={(e) => handleFieldChange('vlan', e.target.value)}
                    placeholder="100"
                    className={`mt-1 ${errors.vlan ? 'border-red-500' : ''}`}
                  />
                  {errors.vlan && <p className="text-red-500 text-xs mt-1">{errors.vlan}</p>}
                </div>
                
                <div>
                  <Label htmlFor="bandwidth">Bandwidth *</Label>
                  <Input
                    id="bandwidth"
                    value={formData.bandwidth}
                    onChange={(e) => handleFieldChange('bandwidth', e.target.value)}
                    placeholder="100 Mbps"
                    className={`mt-1 ${errors.bandwidth ? 'border-red-500' : ''}`}
                  />
                  {errors.bandwidth && <p className="text-red-500 text-xs mt-1">{errors.bandwidth}</p>}
                </div>

                <div>
                  <Label htmlFor="mux_id">MUX ID *</Label>
                  <Input
                    id="mux_id"
                    value={formData.mux_id}
                    onChange={(e) => handleFieldChange('mux_id', e.target.value)}
                    placeholder="MUX-NY-001"
                    className={`mt-1 ${errors.mux_id ? 'border-red-500' : ''}`}
                  />
                  {errors.mux_id && <p className="text-red-500 text-xs mt-1">{errors.mux_id}</p>}
                </div>
                
                <div>
                  <Label htmlFor="port_id">Port ID *</Label>
                  <Input
                    id="port_id"
                    value={formData.port_id}
                    onChange={(e) => handleFieldChange('port_id', e.target.value)}
                    placeholder="PORT-12"
                    className={`mt-1 ${errors.port_id ? 'border-red-500' : ''}`}
                  />
                  {errors.port_id && <p className="text-red-500 text-xs mt-1">{errors.port_id}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Registering...' : 'Register Circuit'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CircuitRegistration;
