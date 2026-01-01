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
  riskPerTrade: number;
  maxDrawdown: number;
  takeProfitRatio: number;
  stopLossRatio: number;
  trailingStop: boolean;
  trailingStopDistance: number;
  autoDeleverage: boolean;
  hedgingEnabled: boolean;
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
      riskPerTrade: 2,
      maxDrawdown: 15,
      takeProfitRatio: 2,
      stopLossRatio: 1,
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
      riskPerTrade: 1.5,
      maxDrawdown: 10,
      takeProfitRatio: 3,
      stopLossRatio: 1,
      trailingStop: true,
      trailingStopDistance: 0.5,
      autoDeleverage: true,
      hedgingEnabled: true,
    },
  ]);

  const [riskSettings, setRiskSettings] = useState({
    dynamicEnabled: true,
    kellyFraction: 0.5,
    volatilityAdjustment: true,
    drawdownProtection: true,
    adaptiveSizing: true,
    maxOpenPositions: 5,
    maxCorrelatedPositions: 3,
    dailyLossLimit: 5,
    weeklyLossLimit: 10,
  });

  const [leverageSettings, setLeverageSettings] = useState({
    forexLeverage: "1:100",
    indicesLeverage: "1:50",
    commoditiesLeverage: "1:20",
    cryptoLeverage: 20,
    btcLeverage: 25,
    ethLeverage: 20,
    altcoinLeverage: 10,
    marginMode: "cross" as "cross" | "isolated",
    autoDeleverage: true,
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
      riskPerTrade: 2,
      maxDrawdown: 15,
      takeProfitRatio: 2,
      stopLossRatio: 1,
      trailingStop: false,
      trailingStopDistance: 1,
      autoDeleverage: type === "futures",
      hedgingEnabled: type === "futures",
    };
    setActiveModes(prev => [...prev, newMode]);
    toast.success(`New ${type} configuration added`);
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
              <p className="text-xs text-muted-foreground">Max Leverage</p>
              <p className="text-xl font-bold text-foreground">{leverageSettings.btcLeverage}x</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Risk Limit</p>
              <p className="text-xl font-bold text-foreground">{riskSettings.dailyLossLimit}%</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="modes" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="modes" className="text-sm">Trading Modes</TabsTrigger>
          <TabsTrigger value="leverage" className="text-sm">Leverage Config</TabsTrigger>
          <TabsTrigger value="risk" className="text-sm">Risk Management</TabsTrigger>
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
                      <Label className="text-xs">Risk Per Trade (%)</Label>
                      <Input 
                        type="number" 
                        value={mode.riskPerTrade}
                        onChange={(e) => handleUpdateMode(mode.id, { riskPerTrade: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Take Profit Ratio</Label>
                      <Input 
                        type="number" 
                        value={mode.takeProfitRatio}
                        onChange={(e) => handleUpdateMode(mode.id, { takeProfitRatio: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Stop Loss Ratio</Label>
                      <Input 
                        type="number" 
                        value={mode.stopLossRatio}
                        onChange={(e) => handleUpdateMode(mode.id, { stopLossRatio: Number(e.target.value) })}
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
                    <Badge variant="outline" className="text-xs">
                      Max DD: {mode.maxDrawdown}%
                    </Badge>
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
                        <Slider 
                          value={[mode.leverage]}
                          onValueChange={(v) => handleUpdateMode(mode.id, { leverage: v[0] })}
                          min={1}
                          max={125}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm font-mono w-12">{mode.leverage}x</span>
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
                      <Label className="text-xs">Risk Per Trade (%)</Label>
                      <Input 
                        type="number" 
                        value={mode.riskPerTrade}
                        onChange={(e) => handleUpdateMode(mode.id, { riskPerTrade: Number(e.target.value) })}
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

        {/* Leverage Configuration Tab */}
        <TabsContent value="leverage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* MetaTrader Leverage */}
            <Card className="p-4 border-border bg-card">
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                MetaTrader 5
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Forex Leverage</Label>
                  <Input 
                    type="text" 
                    value={leverageSettings.forexLeverage}
                    onChange={(e) => setLeverageSettings(prev => ({ ...prev, forexLeverage: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Indices Leverage</Label>
                  <Input 
                    type="text" 
                    value={leverageSettings.indicesLeverage}
                    onChange={(e) => setLeverageSettings(prev => ({ ...prev, indicesLeverage: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Commodities Leverage</Label>
                  <Input 
                    type="text" 
                    value={leverageSettings.commoditiesLeverage}
                    onChange={(e) => setLeverageSettings(prev => ({ ...prev, commoditiesLeverage: e.target.value }))}
                  />
                </div>
              </div>
            </Card>

            {/* Crypto Exchange Leverage */}
            <Card className="p-4 border-border bg-card">
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Crypto Exchanges
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">BTC/USDT Leverage</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      value={[leverageSettings.btcLeverage]}
                      onValueChange={(v) => setLeverageSettings(prev => ({ ...prev, btcLeverage: v[0] }))}
                      min={1}
                      max={125}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-10">{leverageSettings.btcLeverage}x</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">ETH/USDT Leverage</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      value={[leverageSettings.ethLeverage]}
                      onValueChange={(v) => setLeverageSettings(prev => ({ ...prev, ethLeverage: v[0] }))}
                      min={1}
                      max={100}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-10">{leverageSettings.ethLeverage}x</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Altcoins Leverage</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      value={[leverageSettings.altcoinLeverage]}
                      onValueChange={(v) => setLeverageSettings(prev => ({ ...prev, altcoinLeverage: v[0] }))}
                      min={1}
                      max={50}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-10">{leverageSettings.altcoinLeverage}x</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Margin Mode Settings */}
            <Card className="p-4 border-border bg-card">
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Margin Mode
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Default Margin Mode</Label>
                  <select 
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                    value={leverageSettings.marginMode}
                    onChange={(e) => setLeverageSettings(prev => ({ ...prev, marginMode: e.target.value as "cross" | "isolated" }))}
                  >
                    <option value="cross">Cross Margin</option>
                    <option value="isolated">Isolated Margin</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm">Auto-Deleverage</Label>
                  <Switch 
                    checked={leverageSettings.autoDeleverage}
                    onCheckedChange={(checked) => setLeverageSettings(prev => ({ ...prev, autoDeleverage: checked }))}
                  />
                </div>
                <div className="p-3 rounded bg-secondary/50">
                  <p className="text-xs text-muted-foreground">
                    Cross margin uses entire account balance. Isolated margin limits risk to position margin only.
                  </p>
                </div>
              </div>
            </Card>

            {/* FIX Protocol Leverage */}
            <Card className="p-4 border-border bg-primary/5 border-primary/30">
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                FIX Protocol
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Forex Leverage</Label>
                  <Input type="text" placeholder="1:100" defaultValue="1:100" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Equities Leverage</Label>
                  <Input type="text" placeholder="1:4" defaultValue="1:4" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Custom Leverage</Label>
                  <Input type="text" placeholder="Enter custom ratio" />
                  <p className="text-xs text-muted-foreground">Format: 1:X or Xx</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Management Tab */}
        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Dynamic Risk Settings */}
            <Card className="p-4 border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Dynamic Risk
                </h3>
                <Switch 
                  checked={riskSettings.dynamicEnabled}
                  onCheckedChange={(checked) => setRiskSettings(prev => ({ ...prev, dynamicEnabled: checked }))}
                />
              </div>
              
              <div className="space-y-4">
                <div className="p-3 rounded bg-primary/10 border border-primary/20">
                  <p className="text-xs text-muted-foreground">Automatically adjusts based on market conditions</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Kelly Criterion Fraction</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      value={[riskSettings.kellyFraction * 100]}
                      onValueChange={(v) => setRiskSettings(prev => ({ ...prev, kellyFraction: v[0] / 100 }))}
                      min={10}
                      max={100}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-12">{(riskSettings.kellyFraction * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm">Volatility Adjustment</Label>
                  <Switch 
                    checked={riskSettings.volatilityAdjustment}
                    onCheckedChange={(checked) => setRiskSettings(prev => ({ ...prev, volatilityAdjustment: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm">Drawdown Protection</Label>
                  <Switch 
                    checked={riskSettings.drawdownProtection}
                    onCheckedChange={(checked) => setRiskSettings(prev => ({ ...prev, drawdownProtection: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm">Adaptive Position Sizing</Label>
                  <Switch 
                    checked={riskSettings.adaptiveSizing}
                    onCheckedChange={(checked) => setRiskSettings(prev => ({ ...prev, adaptiveSizing: checked }))}
                  />
                </div>
              </div>
            </Card>

            {/* Fixed Risk Settings */}
            <Card className="p-4 border-border bg-card">
              <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Fixed Risk Limits
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Max Open Positions</Label>
                  <Input 
                    type="number" 
                    value={riskSettings.maxOpenPositions}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, maxOpenPositions: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Max Correlated Positions</Label>
                  <Input 
                    type="number" 
                    value={riskSettings.maxCorrelatedPositions}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, maxCorrelatedPositions: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Daily Loss Limit (%)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      value={[riskSettings.dailyLossLimit]}
                      onValueChange={(v) => setRiskSettings(prev => ({ ...prev, dailyLossLimit: v[0] }))}
                      min={1}
                      max={20}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-10">{riskSettings.dailyLossLimit}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Weekly Loss Limit (%)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      value={[riskSettings.weeklyLossLimit]}
                      onValueChange={(v) => setRiskSettings(prev => ({ ...prev, weeklyLossLimit: v[0] }))}
                      min={5}
                      max={50}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-10">{riskSettings.weeklyLossLimit}%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Risk Summary */}
          <Card className="p-4 border-border bg-card">
            <h3 className="text-base font-semibold text-foreground mb-4">Risk Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded bg-secondary/50">
                <p className="text-xs text-muted-foreground">Daily Risk Budget</p>
                <p className="text-lg font-bold text-foreground">${(100000 * riskSettings.dailyLossLimit / 100).toLocaleString()}</p>
              </div>
              <div className="p-3 rounded bg-secondary/50">
                <p className="text-xs text-muted-foreground">Weekly Risk Budget</p>
                <p className="text-lg font-bold text-foreground">${(100000 * riskSettings.weeklyLossLimit / 100).toLocaleString()}</p>
              </div>
              <div className="p-3 rounded bg-secondary/50">
                <p className="text-xs text-muted-foreground">Per-Trade Risk</p>
                <p className="text-lg font-bold text-foreground">2.0%</p>
              </div>
              <div className="p-3 rounded bg-secondary/50">
                <p className="text-xs text-muted-foreground">Max Positions</p>
                <p className="text-lg font-bold text-foreground">{riskSettings.maxOpenPositions}</p>
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
