
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus } from 'lucide-react';
import CircuitDetails from './CircuitDetails';
import CircuitRegistration from './CircuitRegistration';
import { useToast } from '@/hooks/use-toast';

export interface Circuit {
  service_no: string;
  circuit_id: string;
  client_name: string;
  client_ip: string;
  subnet: string;
  gateway: string;
  dns: string;
  vlan: string;
  bandwidth: string;
  location: string;
  mux_id: string;
  port_id: string;
  last_updated: string;
}

const Dashboard = () => {
  const [serviceNumber, setServiceNumber] = useState('');
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Demo data - in real implementation, this would come from MySQL database
  const demoCircuits: Circuit[] = [
    {
      service_no: 'SVC001',
      circuit_id: 'CIR-001-NYC',
      client_name: 'Acme Corporation',
      client_ip: '192.168.1.100',
      subnet: '255.255.255.0',
      gateway: '192.168.1.1',
      dns: '8.8.8.8, 8.8.4.4',
      vlan: '100',
      bandwidth: '100 Mbps',
      location: 'New York, NY',
      mux_id: 'MUX-NY-001',
      port_id: 'PORT-12',
      last_updated: '2024-06-15 14:30:00'
    },
    {
      service_no: 'SVC002',
      circuit_id: 'CIR-002-LA',
      client_name: 'TechStart Inc.',
      client_ip: '10.0.1.50',
      subnet: '255.255.255.0',
      gateway: '10.0.1.1',
      dns: '1.1.1.1, 1.0.0.1',
      vlan: '200',
      bandwidth: '500 Mbps',
      location: 'Los Angeles, CA',
      mux_id: 'MUX-LA-003',
      port_id: 'PORT-08',
      last_updated: '2024-06-14 09:15:00'
    },
    {
      service_no: 'SVC003',
      circuit_id: 'CIR-003-CHI',
      client_name: 'Global Finance Ltd.',
      client_ip: '172.16.10.25',
      subnet: '255.255.255.128',
      gateway: '172.16.10.1',
      dns: '8.8.8.8, 1.1.1.1',
      vlan: '300',
      bandwidth: '1 Gbps',
      location: 'Chicago, IL',
      mux_id: 'MUX-CHI-002',
      port_id: 'PORT-24',
      last_updated: '2024-06-16 11:45:00'
    }
  ];

  const handleSearch = () => {
    if (!serviceNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a service number to search.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const circuit = demoCircuits.find(c => c.service_no.toLowerCase() === serviceNumber.toLowerCase());
      
      if (circuit) {
        setSelectedCircuit(circuit);
        toast({
          title: "Circuit Found",
          description: `Circuit details loaded for ${circuit.client_name}`,
        });
      } else {
        setSelectedCircuit(null);
        toast({
          title: "Not Found",
          description: `No circuit found with service number: ${serviceNumber}`,
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCircuitUpdate = (updatedCircuit: Circuit) => {
    setSelectedCircuit(updatedCircuit);
    toast({
      title: "Circuit Updated",
      description: "Circuit configuration has been saved successfully.",
    });
  };

  const handleNewRegistration = (newCircuit: Circuit) => {
    setShowRegistration(false);
    setSelectedCircuit(newCircuit);
    toast({
      title: "Registration Complete",
      description: `New circuit registered for ${newCircuit.client_name}`,
    });
  };

  if (showRegistration) {
    return (
      <CircuitRegistration
        onCancel={() => setShowRegistration(false)}
        onSuccess={handleNewRegistration}
      />
    );
  }

  if (selectedCircuit) {
    return (
      <CircuitDetails
        circuit={selectedCircuit}
        onBack={() => setSelectedCircuit(null)}
        onUpdate={handleCircuitUpdate}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Circuit Search</CardTitle>
          <CardDescription>
            Enter a circuit ID to view and manage circuit configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="service-search">Circuit ID</Label>
              <Input
                id="service-search"
                placeholder="Enter circuit ID (e.g., SVC001)"
                value={serviceNumber}
                onChange={(e) => setServiceNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={isLoading} className="w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={() => setShowRegistration(true)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Register New Circuit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
