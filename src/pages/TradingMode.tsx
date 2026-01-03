import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Settings2, 
  Shield, 
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  RefreshCw,
  Layers
} from "lucide-react";
import { toast } from "sonner";

interface TradingModeConfig {
  id: string;
  name: string;
  mode: "spot" | "futures";
  enabled: boolean;
  leverage: number;
  marginMode: "cross" | "isolated";
  maxPositionSize: number;
  trailingStop: boolean;
  trailingStopDistance: number;
  autoDeleverage: boolean;
  hedgingEnabled: boolean;
}

interface ManualLeverageConfig {
  instrument: string;
  leverage: number;
  marginMode: "cross" | "isolated";
}

const TradingMode = () => {
  const [activeModes, setActiveModes] = useState<TradingModeConfig[]>([
    {
      id: "spot-1",
      name: "Spot Trading - Primary",
      mode: "spot",
      enabled: true,
      leverage: 1,
      marginMode: "cross",
      maxPositionSize: 10000,
      trailingStop: false,
      trailingStopDistance: 1,
      autoDeleverage: false,
      hedgingEnabled: false,
    },
    {
      id: "futures-1",
      name: "Futures Trading - Primary",
      mode: "futures",
      enabled: true,
      leverage: 10,
      marginMode: "isolated",
      maxPositionSize: 50000,
      trailingStop: true,
      trailingStopDistance: 0.5,
      autoDeleverage: true,
      hedgingEnabled: true,
    },
  ]);

  const [manualLeverages, setManualLeverages] = useState<ManualLeverageConfig[]>([
    { instrument: "BTC/USDT", leverage: 25, marginMode: "isolated" },
    { instrument: "ETH/USDT", leverage: 20, marginMode: "isolated" },
    { instrument: "EUR/USD", leverage: 100, marginMode: "cross" },
    { instrument: "XAU/USD", leverage: 20, marginMode: "cross" },
  ]);

  const [newLeverageInput, setNewLeverageInput] = useState({
    instrument: "",
    leverage: 10,
    marginMode: "isolated" as "cross" | "isolated",
  });

  const [isRunning, setIsRunning] = useState(false);

  const handleModeToggle = (id: string) => {
    setActiveModes(prev => prev.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
    const mode = activeModes.find(m => m.id === id);
    toast.success(`${mode?.name} ${mode?.enabled ? 'disabled' : 'enabled'}`);
  };

  const handleUpdateMode = (id: string, updates: Partial<TradingModeConfig>) => {
    setActiveModes(prev => prev.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ));
  };

  const addNewMode = (type: "spot" | "futures") => {
    const newMode: TradingModeConfig = {
      id: `${type}-${Date.now()}`,
      name: `${type === 'spot' ? 'Spot' : 'Futures'} Trading - New`,
      mode: type,
      enabled: false,
      leverage: type === "spot" ? 1 : 5,
      marginMode: "isolated",
      maxPositionSize: type === "spot" ? 5000 : 25000,
      trailingStop: false,
      trailingStopDistance: 1,
      autoDeleverage: type === "futures",
      hedgingEnabled: type === "futures",
    };
    setActiveModes(prev => [...prev, newMode]);
    toast.success(`New ${type} configuration added`);
  };

  const addManualLeverage = () => {
    if (!newLeverageInput.instrument.trim()) {
      toast.error("Please enter instrument name");
      return;
    }
    if (manualLeverages.some(l => l.instrument.toLowerCase() === newLeverageInput.instrument.toLowerCase())) {
      toast.error("Instrument already exists");
      return;
    }
    setManualLeverages(prev => [...prev, { 
      ...newLeverageInput, 
      instrument: newLeverageInput.instrument.toUpperCase() 
    }]);
    setNewLeverageInput({ instrument: "", leverage: 10, marginMode: "isolated" });
    toast.success(`Leverage for ${newLeverageInput.instrument.toUpperCase()} added`);
  };

  const removeManualLeverage = (instrument: string) => {
    setManualLeverages(prev => prev.filter(l => l.instrument !== instrument));
    toast.success(`${instrument} removed`);
  };

  const updateManualLeverage = (instrument: string, updates: Partial<ManualLeverageConfig>) => {
    setManualLeverages(prev => prev.map(l => 
      l.instrument === instrument ? { ...l, ...updates } : l
    ));
  };

  const removeMode = (id: string) => {
    setActiveModes(prev => prev.filter(m => m.id !== id));
    toast.success("Configuration removed");
  };

  const saveAllSettings = () => {
    toast.success("All trading configurations saved successfully");
  };

  const toggleAllModes = () => {
    setIsRunning(!isRunning);
    toast.success(isRunning ? "All trading modes paused" : "All trading modes activated");
  };

  const spotModes = activeModes.filter(m => m.mode === "spot");
  const futuresModes = activeModes.filter(m => m.mode === "futures");
  const activeCount = activeModes.filter(m => m.enabled).length;

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-7 h-7 text-primary" />
            Trading Mode Configuration
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure Spot & Futures trading with Risk Management and Leverage settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "bg-success" : ""}>
            {isRunning ? "Running" : "Paused"}
          </Badge>
          <Badge variant="outline">
            {activeCount}/{activeModes.length} Active
          </Badge>
          <Button 
            onClick={toggleAllModes}
            variant={isRunning ? "destructive" : "default"}
            className="gap-2"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Pause All" : "Start All"}
          </Button>
          <Button onClick={saveAllSettings} variant="outline" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Save All
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Spot Configs</p>
              <p className="text-xl font-bold text-foreground">{spotModes.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Futures Configs</p>
              <p className="text-xl font-bold text-foreground">{futuresModes.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Leverage Configs</p>
              <p className="text-xl font-bold text-foreground">{manualLeverages.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max Leverage</p>
              <p className="text-xl font-bold text-foreground">{Math.max(...manualLeverages.map(l => l.leverage), 1)}x</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="modes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="modes" className="text-sm">Trading Modes</TabsTrigger>
          <TabsTrigger value="leverage" className="text-sm">Manual Leverage</TabsTrigger>
          <TabsTrigger value="advanced" className="text-sm">Advanced</TabsTrigger>
        </TabsList>

        {/* Trading Modes Tab */}
        <TabsContent value="modes" className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => addNewMode("spot")} variant="outline" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Add Spot Config
            </Button>
            <Button onClick={() => addNewMode("futures")} variant="outline" className="gap-2">
              <Zap className="w-4 h-4" />
              Add Futures Config
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Spot Trading Configurations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                Spot Trading
              </h3>
              {spotModes.map((mode) => (
                <Card key={mode.id} className={`p-4 border-border ${mode.enabled ? 'bg-success/5 border-success/30' : 'bg-card'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={mode.enabled} 
                        onCheckedChange={() => handleModeToggle(mode.id)} 
                      />
                      <Input 
                        value={mode.name}
                        onChange={(e) => handleUpdateMode(mode.id, { name: e.target.value })}
                        className="font-semibold bg-transparent border-none p-0 h-auto text-foreground"
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeMode(mode.id)}>
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Max Position Size</Label>
                      <Input 
                        type="number" 
                        value={mode.maxPositionSize}
                        onChange={(e) => handleUpdateMode(mode.id, { maxPositionSize: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Trailing Distance (%)</Label>
                      <Input 
                        type="number" 
                        value={mode.trailingStopDistance}
                        onChange={(e) => handleUpdateMode(mode.id, { trailingStopDistance: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={mode.trailingStop}
                        onCheckedChange={(checked) => handleUpdateMode(mode.id, { trailingStop: checked })}
                      />
                      <Label className="text-xs">Trailing Stop</Label>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Futures Trading Configurations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Futures Trading
              </h3>
              {futuresModes.map((mode) => (
                <Card key={mode.id} className={`p-4 border-border ${mode.enabled ? 'bg-primary/5 border-primary/30' : 'bg-card'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={mode.enabled} 
                        onCheckedChange={() => handleModeToggle(mode.id)} 
                      />
                      <Input 
                        value={mode.name}
                        onChange={(e) => handleUpdateMode(mode.id, { name: e.target.value })}
                        className="font-semibold bg-transparent border-none p-0 h-auto text-foreground"
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeMode(mode.id)}>
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Leverage</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number"
                          value={mode.leverage}
                          onChange={(e) => handleUpdateMode(mode.id, { leverage: Number(e.target.value) })}
                          min={1}
                          max={125}
                          className="flex-1"
                        />
                        <span className="text-sm font-mono w-8">x</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Margin Mode</Label>
                      <select 
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                        value={mode.marginMode}
                        onChange={(e) => handleUpdateMode(mode.id, { marginMode: e.target.value as "cross" | "isolated" })}
                      >
                        <option value="cross">Cross Margin</option>
                        <option value="isolated">Isolated Margin</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Max Position Size</Label>
                      <Input 
                        type="number" 
                        value={mode.maxPositionSize}
                        onChange={(e) => handleUpdateMode(mode.id, { maxPositionSize: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Trailing Distance (%)</Label>
                      <Input 
                        type="number" 
                        value={mode.trailingStopDistance}
                        onChange={(e) => handleUpdateMode(mode.id, { trailingStopDistance: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={mode.trailingStop}
                        onCheckedChange={(checked) => handleUpdateMode(mode.id, { trailingStop: checked })}
                      />
                      <Label className="text-xs">Trailing</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={mode.autoDeleverage}
                        onCheckedChange={(checked) => handleUpdateMode(mode.id, { autoDeleverage: checked })}
                      />
                      <Label className="text-xs">Auto-DL</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={mode.hedgingEnabled}
                        onCheckedChange={(checked) => handleUpdateMode(mode.id, { hedgingEnabled: checked })}
                      />
                      <Label className="text-xs">Hedge</Label>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Manual Leverage Configuration Tab */}
        <TabsContent value="leverage" className="space-y-4">
          {/* Add New Leverage */}
          <Card className="p-4 border-border bg-card">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Add Manual Leverage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Instrument</Label>
                <Input 
                  type="text" 
                  placeholder="e.g., BTC/USDT, EUR/USD"
                  value={newLeverageInput.instrument}
                  onChange={(e) => setNewLeverageInput(prev => ({ ...prev, instrument: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Leverage</Label>
                <Input 
                  type="number"
                  min={1}
                  max={500}
                  value={newLeverageInput.leverage}
                  onChange={(e) => setNewLeverageInput(prev => ({ ...prev, leverage: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Margin Mode</Label>
                <select 
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                  value={newLeverageInput.marginMode}
                  onChange={(e) => setNewLeverageInput(prev => ({ ...prev, marginMode: e.target.value as "cross" | "isolated" }))}
                >
                  <option value="cross">Cross Margin</option>
                  <option value="isolated">Isolated Margin</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={addManualLeverage} className="w-full gap-2">
                  <DollarSign className="w-4 h-4" />
                  Add Leverage
                </Button>
              </div>
            </div>
          </Card>

          {/* Leverage List */}
          <Card className="p-4 border-border bg-card">
            <h3 className="text-base font-semibold text-foreground mb-4">Configured Leverage Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {manualLeverages.map((lev) => (
                <div key={lev.instrument} className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-foreground">{lev.instrument}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeManualLeverage(lev.instrument)}
                      className="text-destructive hover:text-destructive"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Leverage</Label>
                      <Input 
                        type="number"
                        min={1}
                        max={500}
                        value={lev.leverage}
                        onChange={(e) => updateManualLeverage(lev.instrument, { leverage: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Margin Mode</Label>
                      <select 
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                        value={lev.marginMode}
                        onChange={(e) => updateManualLeverage(lev.instrument, { marginMode: e.target.value as "cross" | "isolated" })}
                      >
                        <option value="cross">Cross Margin</option>
                        <option value="isolated">Isolated Margin</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <Badge variant="outline" className="text-xs">
                      {lev.leverage}x {lev.marginMode}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {manualLeverages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Settings2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No leverage settings configured. Add one above.</p>
              </div>
            )}
          </Card>

          {/* Quick Reference */}
          <Card className="p-4 border-border bg-secondary/30">
            <h3 className="text-base font-semibold text-foreground mb-3">Leverage Reference</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Forex (Retail)</p>
                <p className="font-semibold">1:30 - 1:500</p>
              </div>
              <div>
                <p className="text-muted-foreground">Crypto Futures</p>
                <p className="font-semibold">1x - 125x</p>
              </div>
              <div>
                <p className="text-muted-foreground">Commodities</p>
                <p className="font-semibold">1:10 - 1:50</p>
              </div>
              <div>
                <p className="text-muted-foreground">Indices</p>
                <p className="font-semibold">1:20 - 1:100</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 border-border bg-card">
              <h3 className="text-base font-semibold text-foreground mb-4">Order Execution Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm">Smart Order Routing</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm">Hidden Orders</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm">Reduce Only Mode</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm">Post-Only Orders</Label>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Slippage Tolerance (%)</Label>
                  <Input type="number" defaultValue="0.1" step="0.01" />
                </div>
              </div>
            </Card>

            <Card className="p-4 border-border bg-card">
              <h3 className="text-base font-semibold text-foreground mb-4">Position Management</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm">Auto-Close on Target</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm">Break-Even Stop</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm">Partial Take Profit</Label>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Partial TP Levels</Label>
                  <Input placeholder="25%, 50%, 75%, 100%" defaultValue="25%, 50%, 75%, 100%" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Trailing Stop Activation</Label>
                  <Input type="number" defaultValue="1" step="0.1" />
                  <p className="text-xs text-muted-foreground">% profit before trailing activates</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingMode;
