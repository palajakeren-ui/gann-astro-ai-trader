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
  Cpu
} from "lucide-react";
import { toast } from "sonner";

const BackendAPI = () => {
  const [apiSettings, setApiSettings] = useState({
    baseUrl: "https://api.gannquantai.com",
    wsUrl: "wss://ws.gannquantai.com",
    apiVersion: "v1",
    timeout: 30000,
    retryAttempts: 3,
  });

  const [dbSettings, setDbSettings] = useState({
    host: "localhost",
    port: "5432",
    database: "gann_quant_db",
    username: "",
    password: "",
    ssl: true,
    poolSize: 10,
  });

  const [connectionStatus, setConnectionStatus] = useState({
    api: false,
    database: false,
    websocket: false,
  });

  const [isTestingConnection, setIsTestingConnection] = useState({
    api: false,
    database: false,
    websocket: false,
  });

  const testConnection = async (type: "api" | "database" | "websocket") => {
    setIsTestingConnection(prev => ({ ...prev, [type]: true }));
    toast.info(`Testing ${type} connection...`);
    
    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setConnectionStatus(prev => ({ ...prev, [type]: success }));
      setIsTestingConnection(prev => ({ ...prev, [type]: false }));
      
      if (success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} connected successfully!`);
      } else {
        toast.error(`Failed to connect to ${type}. Please check your settings.`);
      }
    }, 2000);
  };

  const saveSettings = () => {
    toast.success("Backend API settings saved successfully!");
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                connectionStatus.api ? "bg-success/20" : "bg-muted"
              }`}>
                <Globe className={`w-5 h-5 ${connectionStatus.api ? "text-success" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">REST API</p>
                <p className="text-xs text-muted-foreground">{apiSettings.baseUrl}</p>
              </div>
            </div>
            <Badge className={connectionStatus.api ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}>
              {connectionStatus.api ? "Connected" : "Disconnected"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                connectionStatus.database ? "bg-success/20" : "bg-muted"
              }`}>
                <Database className={`w-5 h-5 ${connectionStatus.database ? "text-success" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Database</p>
                <p className="text-xs text-muted-foreground">{dbSettings.database}</p>
              </div>
            </div>
            <Badge className={connectionStatus.database ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}>
              {connectionStatus.database ? "Connected" : "Disconnected"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                connectionStatus.websocket ? "bg-success/20" : "bg-muted"
              }`}>
                <Link className={`w-5 h-5 ${connectionStatus.websocket ? "text-success" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">WebSocket</p>
                <p className="text-xs text-muted-foreground">{apiSettings.wsUrl}</p>
              </div>
            </div>
            <Badge className={connectionStatus.websocket ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}>
              {connectionStatus.websocket ? "Connected" : "Disconnected"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
          <TabsTrigger value="api" className="text-xs md:text-sm">REST API</TabsTrigger>
          <TabsTrigger value="database" className="text-xs md:text-sm">Database</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs md:text-sm">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4 mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                REST API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Base URL</Label>
                  <Input
                    value={apiSettings.baseUrl}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="https://api.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">WebSocket URL</Label>
                  <Input
                    value={apiSettings.wsUrl}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, wsUrl: e.target.value }))}
                    placeholder="wss://ws.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">API Version</Label>
                  <Input
                    value={apiSettings.apiVersion}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, apiVersion: e.target.value }))}
                    placeholder="v1"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Timeout (ms)</Label>
                  <Input
                    type="number"
                    value={apiSettings.timeout}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">API Key</Label>
                <Input type="password" placeholder="Enter your API key" />
              </div>

              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => testConnection("api")}
                  disabled={isTestingConnection.api}
                  className="flex-1"
                >
                  {isTestingConnection.api ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4 mr-2" />
                  )}
                  Test API Connection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => testConnection("websocket")}
                  disabled={isTestingConnection.websocket}
                  className="flex-1"
                >
                  {isTestingConnection.websocket ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4 mr-2" />
                  )}
                  Test WebSocket Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4 mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Database Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Host</Label>
                  <Input
                    value={dbSettings.host}
                    onChange={(e) => setDbSettings(prev => ({ ...prev, host: e.target.value }))}
                    placeholder="localhost"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Port</Label>
                  <Input
                    value={dbSettings.port}
                    onChange={(e) => setDbSettings(prev => ({ ...prev, port: e.target.value }))}
                    placeholder="5432"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Database Name</Label>
                  <Input
                    value={dbSettings.database}
                    onChange={(e) => setDbSettings(prev => ({ ...prev, database: e.target.value }))}
                    placeholder="gann_quant_db"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Pool Size</Label>
                  <Input
                    type="number"
                    value={dbSettings.poolSize}
                    onChange={(e) => setDbSettings(prev => ({ ...prev, poolSize: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Username</Label>
                  <Input
                    value={dbSettings.username}
                    onChange={(e) => setDbSettings(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Password</Label>
                  <Input
                    type="password"
                    value={dbSettings.password}
                    onChange={(e) => setDbSettings(prev => ({ ...prev, password: e.target.value }))}
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
                  checked={dbSettings.ssl}
                  onCheckedChange={(checked) => setDbSettings(prev => ({ ...prev, ssl: checked }))}
                />
              </div>

              <Button 
                variant="outline" 
                onClick={() => testConnection("database")}
                disabled={isTestingConnection.database}
                className="w-full"
              >
                {isTestingConnection.database ? (
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
                  <Label className="text-foreground">Retry Attempts</Label>
                  <Input
                    type="number"
                    value={apiSettings.retryAttempts}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) }))}
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
                { key: "API_BASE_URL", value: apiSettings.baseUrl, secret: false },
                { key: "WS_URL", value: apiSettings.wsUrl, secret: false },
                { key: "DATABASE_URL", value: "postgresql://***:***@***:5432/***", secret: true },
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
