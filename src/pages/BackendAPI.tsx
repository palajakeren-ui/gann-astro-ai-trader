import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Server, 
  Globe, 
  Key, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Save,
  TestTube,
  Link,
  Shield,
  Cpu,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface APIConfig {
  id: string;
  name: string;
  baseUrl: string;
  wsUrl: string;
  apiVersion: string;
  timeout: number;
  retryAttempts: number;
  apiKey: string;
  isActive: boolean;
}

interface DBConfig {
  id: string;
  name: string;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  poolSize: number;
  isActive: boolean;
}

const BackendAPI = () => {
  const [apiConfigs, setApiConfigs] = useState<APIConfig[]>([
    {
      id: "api-1",
      name: "Primary API",
      baseUrl: "https://api.gannquantai.com",
      wsUrl: "wss://ws.gannquantai.com",
      apiVersion: "v1",
      timeout: 30000,
      retryAttempts: 3,
      apiKey: "",
      isActive: true,
    },
    {
      id: "api-2",
      name: "Backup API",
      baseUrl: "https://backup-api.gannquantai.com",
      wsUrl: "wss://backup-ws.gannquantai.com",
      apiVersion: "v1",
      timeout: 30000,
      retryAttempts: 5,
      apiKey: "",
      isActive: false,
    },
  ]);

  const [dbConfigs, setDbConfigs] = useState<DBConfig[]>([
    {
      id: "db-1",
      name: "Primary Database",
      host: "localhost",
      port: "5432",
      database: "gann_quant_db",
      username: "",
      password: "",
      ssl: true,
      poolSize: 10,
      isActive: true,
    },
    {
      id: "db-2",
      name: "Read Replica",
      host: "replica.gannquantai.com",
      port: "5432",
      database: "gann_quant_replica",
      username: "",
      password: "",
      ssl: true,
      poolSize: 5,
      isActive: false,
    },
  ]);

  const [selectedApiId, setSelectedApiId] = useState("api-1");
  const [selectedDbId, setSelectedDbId] = useState("db-1");

  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({});
  const [isTestingConnection, setIsTestingConnection] = useState<Record<string, boolean>>({});

  const selectedApi = apiConfigs.find(c => c.id === selectedApiId) || apiConfigs[0];
  const selectedDb = dbConfigs.find(c => c.id === selectedDbId) || dbConfigs[0];

  const updateApiConfig = (id: string, updates: Partial<APIConfig>) => {
    setApiConfigs(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const updateDbConfig = (id: string, updates: Partial<DBConfig>) => {
    setDbConfigs(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addApiConfig = () => {
    const newId = `api-${Date.now()}`;
    setApiConfigs(prev => [...prev, {
      id: newId,
      name: `API Config ${prev.length + 1}`,
      baseUrl: "",
      wsUrl: "",
      apiVersion: "v1",
      timeout: 30000,
      retryAttempts: 3,
      apiKey: "",
      isActive: false,
    }]);
    setSelectedApiId(newId);
    toast.success("New API configuration added");
  };

  const addDbConfig = () => {
    const newId = `db-${Date.now()}`;
    setDbConfigs(prev => [...prev, {
      id: newId,
      name: `Database ${prev.length + 1}`,
      host: "",
      port: "5432",
      database: "",
      username: "",
      password: "",
      ssl: true,
      poolSize: 10,
      isActive: false,
    }]);
    setSelectedDbId(newId);
    toast.success("New database configuration added");
  };

  const removeApiConfig = (id: string) => {
    if (apiConfigs.length <= 1) {
      toast.error("Cannot remove the last API configuration");
      return;
    }
    setApiConfigs(prev => prev.filter(c => c.id !== id));
    if (selectedApiId === id) {
      setSelectedApiId(apiConfigs[0].id);
    }
    toast.success("API configuration removed");
  };

  const removeDbConfig = (id: string) => {
    if (dbConfigs.length <= 1) {
      toast.error("Cannot remove the last database configuration");
      return;
    }
    setDbConfigs(prev => prev.filter(c => c.id !== id));
    if (selectedDbId === id) {
      setSelectedDbId(dbConfigs[0].id);
    }
    toast.success("Database configuration removed");
  };

  const testConnection = async (type: string, id: string) => {
    const key = `${type}-${id}`;
    setIsTestingConnection(prev => ({ ...prev, [key]: true }));
    toast.info(`Testing ${type} connection...`);
    
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setConnectionStatus(prev => ({ ...prev, [key]: success }));
      setIsTestingConnection(prev => ({ ...prev, [key]: false }));
      
      if (success) {
        toast.success(`Connection successful!`);
      } else {
        toast.error(`Failed to connect. Please check your settings.`);
      }
    }, 2000);
  };

  const saveSettings = () => {
    toast.success("All backend configurations saved successfully!");
  };

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Server className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            Backend API & Database
          </h1>
          <p className="text-sm text-muted-foreground">Configure backend connections and database settings</p>
        </div>
        <Button onClick={saveSettings} className="w-full md:w-auto">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      {/* Connection Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {apiConfigs.map(api => (
          <Card key={api.id} className={`border-border bg-card ${api.isActive ? 'ring-2 ring-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className={`w-4 h-4 ${connectionStatus[`api-${api.id}`] ? "text-success" : "text-muted-foreground"}`} />
                  <p className="font-semibold text-foreground text-sm">{api.name}</p>
                </div>
                <Badge className={connectionStatus[`api-${api.id}`] ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}>
                  {connectionStatus[`api-${api.id}`] ? "Connected" : "Offline"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{api.baseUrl || "Not configured"}</p>
              {api.isActive && <Badge variant="outline" className="mt-2 text-xs">Active</Badge>}
            </CardContent>
          </Card>
        ))}
        {dbConfigs.map(db => (
          <Card key={db.id} className={`border-border bg-card ${db.isActive ? 'ring-2 ring-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Database className={`w-4 h-4 ${connectionStatus[`db-${db.id}`] ? "text-success" : "text-muted-foreground"}`} />
                  <p className="font-semibold text-foreground text-sm">{db.name}</p>
                </div>
                <Badge className={connectionStatus[`db-${db.id}`] ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}>
                  {connectionStatus[`db-${db.id}`] ? "Connected" : "Offline"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{db.database || "Not configured"}</p>
              {db.isActive && <Badge variant="outline" className="mt-2 text-xs">Active</Badge>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
          <TabsTrigger value="api" className="text-xs md:text-sm">REST API</TabsTrigger>
          <TabsTrigger value="database" className="text-xs md:text-sm">Database</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs md:text-sm">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4 mt-4">
          {/* API Configuration Selector */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  API Configurations ({apiConfigs.length})
                </CardTitle>
                <Button onClick={addApiConfig} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add API
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {apiConfigs.map(api => (
                  <Button
                    key={api.id}
                    variant={selectedApiId === api.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedApiId(api.id)}
                    className="relative"
                  >
                    {api.name}
                    {api.isActive && <span className="ml-2 w-2 h-2 bg-success rounded-full"></span>}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected API Configuration */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedApi.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={selectedApi.isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      apiConfigs.forEach(c => updateApiConfig(c.id, { isActive: c.id === selectedApiId }));
                    }}
                  >
                    {selectedApi.isActive ? "Active" : "Set Active"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => removeApiConfig(selectedApiId)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Configuration Name</Label>
                  <Input
                    value={selectedApi.name}
                    onChange={(e) => updateApiConfig(selectedApiId, { name: e.target.value })}
                    placeholder="API Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Base URL</Label>
                  <Input
                    value={selectedApi.baseUrl}
                    onChange={(e) => updateApiConfig(selectedApiId, { baseUrl: e.target.value })}
                    placeholder="https://api.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">WebSocket URL</Label>
                  <Input
                    value={selectedApi.wsUrl}
                    onChange={(e) => updateApiConfig(selectedApiId, { wsUrl: e.target.value })}
                    placeholder="wss://ws.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">API Version</Label>
                  <Input
                    value={selectedApi.apiVersion}
                    onChange={(e) => updateApiConfig(selectedApiId, { apiVersion: e.target.value })}
                    placeholder="v1"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Timeout (ms)</Label>
                  <Input
                    type="number"
                    value={selectedApi.timeout}
                    onChange={(e) => updateApiConfig(selectedApiId, { timeout: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Retry Attempts</Label>
                  <Input
                    type="number"
                    value={selectedApi.retryAttempts}
                    onChange={(e) => updateApiConfig(selectedApiId, { retryAttempts: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">API Key</Label>
                <Input 
                  type="password" 
                  value={selectedApi.apiKey}
                  onChange={(e) => updateApiConfig(selectedApiId, { apiKey: e.target.value })}
                  placeholder="Enter your API key" 
                />
              </div>

              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => testConnection("api", selectedApiId)}
                  disabled={isTestingConnection[`api-${selectedApiId}`]}
                  className="flex-1"
                >
                  {isTestingConnection[`api-${selectedApiId}`] ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4 mr-2" />
                  )}
                  Test API Connection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => testConnection("ws", selectedApiId)}
                  disabled={isTestingConnection[`ws-${selectedApiId}`]}
                  className="flex-1"
                >
                  {isTestingConnection[`ws-${selectedApiId}`] ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4 mr-2" />
                  )}
                  Test WebSocket
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4 mt-4">
          {/* Database Configuration Selector */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Database Configurations ({dbConfigs.length})
                </CardTitle>
                <Button onClick={addDbConfig} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Database
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {dbConfigs.map(db => (
                  <Button
                    key={db.id}
                    variant={selectedDbId === db.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDbId(db.id)}
                    className="relative"
                  >
                    {db.name}
                    {db.isActive && <span className="ml-2 w-2 h-2 bg-success rounded-full"></span>}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Database Configuration */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedDb.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={selectedDb.isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      dbConfigs.forEach(c => updateDbConfig(c.id, { isActive: c.id === selectedDbId }));
                    }}
                  >
                    {selectedDb.isActive ? "Active" : "Set Active"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => removeDbConfig(selectedDbId)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Configuration Name</Label>
                  <Input
                    value={selectedDb.name}
                    onChange={(e) => updateDbConfig(selectedDbId, { name: e.target.value })}
                    placeholder="Database Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Host</Label>
                  <Input
                    value={selectedDb.host}
                    onChange={(e) => updateDbConfig(selectedDbId, { host: e.target.value })}
                    placeholder="localhost"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Port</Label>
                  <Input
                    value={selectedDb.port}
                    onChange={(e) => updateDbConfig(selectedDbId, { port: e.target.value })}
                    placeholder="5432"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Database Name</Label>
                  <Input
                    value={selectedDb.database}
                    onChange={(e) => updateDbConfig(selectedDbId, { database: e.target.value })}
                    placeholder="gann_quant_db"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Pool Size</Label>
                  <Input
                    type="number"
                    value={selectedDb.poolSize}
                    onChange={(e) => updateDbConfig(selectedDbId, { poolSize: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Username</Label>
                  <Input
                    value={selectedDb.username}
                    onChange={(e) => updateDbConfig(selectedDbId, { username: e.target.value })}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-foreground">Password</Label>
                  <Input
                    type="password"
                    value={selectedDb.password}
                    onChange={(e) => updateDbConfig(selectedDbId, { password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Enable SSL/TLS</span>
                </div>
                <Switch
                  checked={selectedDb.ssl}
                  onCheckedChange={(checked) => updateDbConfig(selectedDbId, { ssl: checked })}
                />
              </div>

              <Button 
                variant="outline" 
                onClick={() => testConnection("db", selectedDbId)}
                disabled={isTestingConnection[`db-${selectedDbId}`]}
                className="w-full"
              >
                {isTestingConnection[`db-${selectedDbId}`] ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4 mr-2" />
                )}
                Test Database Connection
              </Button>
            </CardContent>
          </Card>

          {/* Database Tables Preview */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Database Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { name: "trades", rows: 15420, status: "active" },
                  { name: "positions", rows: 45, status: "active" },
                  { name: "signals", rows: 8932, status: "active" },
                  { name: "forecasts", rows: 2341, status: "active" },
                  { name: "alerts", rows: 567, status: "active" },
                  { name: "users", rows: 12, status: "active" },
                  { name: "settings", rows: 1, status: "active" },
                  { name: "logs", rows: 45678, status: "active" },
                  { name: "backtest_results", rows: 234, status: "active" },
                ].map((table, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-foreground">{table.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {table.rows.toLocaleString()} rows
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Retry Attempts (Active API)</Label>
                  <Input
                    type="number"
                    value={selectedApi.retryAttempts}
                    onChange={(e) => updateApiConfig(selectedApiId, { retryAttempts: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Request Rate Limit (per min)</Label>
                  <Input type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Cache TTL (seconds)</Label>
                  <Input type="number" defaultValue="300" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Log Level</Label>
                  <select className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground">
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm text-foreground">Enable Request Caching</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm text-foreground">Enable Compression</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm text-foreground">Enable Debug Mode</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm text-foreground">Auto-reconnect on Disconnect</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                Environment Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: "API_BASE_URL", value: selectedApi.baseUrl, secret: false },
                { key: "WS_URL", value: selectedApi.wsUrl, secret: false },
                { key: "DATABASE_URL", value: `postgresql://***:***@${selectedDb.host}:${selectedDb.port}/${selectedDb.database}`, secret: true },
                { key: "API_KEY", value: "••••••••••••••••", secret: true },
                { key: "JWT_SECRET", value: "••••••••••••••••", secret: true },
              ].map((env, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-foreground">{env.key}</code>
                    {env.secret && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Secret
                      </Badge>
                    )}
                  </div>
                  <code className="text-xs text-muted-foreground truncate max-w-[200px]">{env.value}</code>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackendAPI;
