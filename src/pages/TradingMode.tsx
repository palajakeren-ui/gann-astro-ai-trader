import { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  TrendingUp, 
  DollarSign, 
  Settings2, 
  Shield, 
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  Layers,
  Download,
  Upload,
  Server,
} from "lucide-react";
import { toast } from "sonner";
import BrokerExchangeConfig from "@/components/trading/BrokerExchangeConfig";

// Helper to parse numeric input (supports comma as decimal separator)
const parseNumericInput = (value: string): number | null => {
  if (value === "" || value === "-") return null;
  // Replace comma with dot for decimal
  const normalized = value.replace(",", ".");
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
};

// Helper to format number for display
const formatNumericValue = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};

type RiskManagementType = "dynamic" | "fixed";

interface DynamicRiskSettings {
  riskPerTrade: number;
  kellyFraction: number;
  adaptiveSizing: boolean;
  volatilityAdjustment: boolean;
  drawdownProtection: boolean;
  maxDrawdown: number;
  dailyLossLimit: number;
  weeklyLossLimit: number;
  breakEvenOnProfit: boolean;
  liquidationAlert: number;
}

interface FixedRiskSettings {
  riskPerTrade: number;
  maxDrawdown: number;
  riskRewardRatio: number;
  fixedLotSize: number;
  maxOpenPositions: number;
}

interface TradingModeConfig {
  id: string;
  name: string;
  mode: "spot" | "futures";
  enabled: boolean;
  leverage: number;
  marginMode: "cross" | "isolated";
  openLotSize: number;
  trailingStop: boolean;
  trailingStopDistance: number;
  autoDeleverage: boolean;
  hedgingEnabled: boolean;
  // For Futures - link to instrument for auto leverage
  selectedInstrument: string;
  // Risk Management Type
  riskType: RiskManagementType;
  // Dynamic Risk fields
  riskPerTrade: number;
  kellyFraction: number;
  adaptiveSizing: boolean;
  volatilityAdjustment: boolean;
  drawdownProtection: boolean;
  maxDrawdown: number;
  dailyLossLimit: number;
  weeklyLossLimit: number;
  breakEvenOnProfit: boolean;
  liquidationAlert: number;
  // Fixed Risk fields
  fixedRiskPerTrade: number;
  fixedMaxDrawdown: number;
  riskRewardRatio: number;
  fixedLotSize: number;
  maxOpenPositions: number;
}

interface ManualLeverageConfig {
  instrument: string;
  leverage: number;
  marginMode: "cross" | "isolated";
}

interface ExportConfig {
  version: string;
  exportedAt: string;
  activeModes: TradingModeConfig[];
  manualLeverages: ManualLeverageConfig[];
}

// Custom NumericInput component that allows empty values and comma
const NumericInput = ({ 
  value, 
  onChange, 
  step = "1",
  className = "",
  placeholder = ""
}: { 
  value: number; 
  onChange: (value: number) => void; 
  step?: string;
  className?: string;
  placeholder?: string;
}) => {
  const [localValue, setLocalValue] = useState<string>(formatNumericValue(value));
  
  // Sync local value when external value changes
  useEffect(() => {
    setLocalValue(formatNumericValue(value));
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow empty, numbers, dots, commas, and minus sign
    if (inputValue === "" || /^-?[\d.,]*$/.test(inputValue)) {
      setLocalValue(inputValue);
    }
  };
  
  const handleBlur = () => {
    const parsed = parseNumericInput(localValue);
    if (parsed !== null) {
      onChange(parsed);
      setLocalValue(formatNumericValue(parsed));
    } else if (localValue === "" || localValue === "-") {
      onChange(0);
      setLocalValue("0");
    }
  };
  
  return (
    <Input 
      type="text"
      inputMode="decimal"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      placeholder={placeholder}
    />
  );
};

const TradingMode = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeModes, setActiveModes] = useState<TradingModeConfig[]>([
    {
      id: "spot-1",
      name: "Spot Trading - Primary",
      mode: "spot",
      enabled: true,
      leverage: 1,
      marginMode: "cross",
      openLotSize: 0.01,
      trailingStop: false,
      trailingStopDistance: 1,
      autoDeleverage: false,
      hedgingEnabled: false,
      selectedInstrument: "",
      riskType: "dynamic",
      riskPerTrade: 2.0,
      kellyFraction: 0.5,
      adaptiveSizing: true,
      volatilityAdjustment: true,
      drawdownProtection: true,
      maxDrawdown: 15,
      dailyLossLimit: 5,
      weeklyLossLimit: 15,
      breakEvenOnProfit: true,
      liquidationAlert: 0,
      fixedRiskPerTrade: 2.0,
      fixedMaxDrawdown: 20,
      riskRewardRatio: 2.0,
      fixedLotSize: 0.01,
      maxOpenPositions: 5,
    },
    {
      id: "futures-1",
      name: "Futures Trading - Primary",
      mode: "futures",
      enabled: true,
      leverage: 10,
      marginMode: "isolated",
      openLotSize: 0.1,
      trailingStop: true,
      trailingStopDistance: 0.5,
      autoDeleverage: true,
      hedgingEnabled: true,
      selectedInstrument: "BTC/USDT",
      riskType: "dynamic",
      riskPerTrade: 1.5,
      kellyFraction: 0.5,
      adaptiveSizing: true,
      volatilityAdjustment: true,
      drawdownProtection: true,
      maxDrawdown: 10,
      dailyLossLimit: 3,
      weeklyLossLimit: 10,
      breakEvenOnProfit: true,
      liquidationAlert: 80,
      fixedRiskPerTrade: 2.0,
      fixedMaxDrawdown: 20,
      riskRewardRatio: 2.0,
      fixedLotSize: 0.1,
      maxOpenPositions: 3,
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

  const handleUpdateMode = useCallback((id: string, updates: Partial<TradingModeConfig>) => {
    setActiveModes(prev => prev.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ));
  }, []);

  const addNewMode = (type: "spot" | "futures") => {
    const newMode: TradingModeConfig = {
      id: `${type}-${Date.now()}`,
      name: `${type === 'spot' ? 'Spot' : 'Futures'} Trading - New`,
      mode: type,
      enabled: false,
      leverage: type === "spot" ? 1 : 5,
      marginMode: "isolated",
      openLotSize: type === "spot" ? 0.01 : 0.1,
      trailingStop: false,
      trailingStopDistance: 1,
      autoDeleverage: type === "futures",
      hedgingEnabled: type === "futures",
      selectedInstrument: type === "futures" ? "BTC/USDT" : "",
      riskType: "dynamic",
      riskPerTrade: type === "spot" ? 2.0 : 1.5,
      kellyFraction: 0.5,
      adaptiveSizing: true,
      volatilityAdjustment: true,
      drawdownProtection: true,
      maxDrawdown: type === "spot" ? 15 : 10,
      dailyLossLimit: type === "spot" ? 5 : 3,
      weeklyLossLimit: type === "spot" ? 15 : 10,
      breakEvenOnProfit: true,
      liquidationAlert: type === "futures" ? 80 : 0,
      fixedRiskPerTrade: 2.0,
      fixedMaxDrawdown: 20,
      riskRewardRatio: 2.0,
      fixedLotSize: type === "spot" ? 0.01 : 0.1,
      maxOpenPositions: type === "spot" ? 5 : 3,
    };
    setActiveModes(prev => [...prev, newMode]);
    toast.success(`New ${type} configuration added`);
  };

  // Auto-sync leverage from manual leverage when instrument changes
  const handleInstrumentChange = (modeId: string, instrument: string) => {
    const leverageConfig = manualLeverages.find(l => l.instrument === instrument);
    if (leverageConfig) {
      handleUpdateMode(modeId, { 
        selectedInstrument: instrument, 
        leverage: leverageConfig.leverage,
        marginMode: leverageConfig.marginMode 
      });
      toast.success(`Leverage synced: ${leverageConfig.leverage}x ${leverageConfig.marginMode}`);
    } else {
      handleUpdateMode(modeId, { selectedInstrument: instrument });
    }
  };

  const exportConfig = () => {
    const config: ExportConfig = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      activeModes,
      manualLeverages,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trading-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Configuration exported successfully");
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config: ExportConfig = JSON.parse(e.target?.result as string);
        if (config.version && config.activeModes && config.manualLeverages) {
          setActiveModes(config.activeModes);
          setManualLeverages(config.manualLeverages);
          toast.success("Configuration imported successfully");
        } else {
          toast.error("Invalid configuration file format");
        }
      } catch {
        toast.error("Failed to parse configuration file");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
          <Button onClick={exportConfig} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={importConfig}
          />
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
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="modes" className="text-sm">Trading Modes</TabsTrigger>
          <TabsTrigger value="brokers" className="text-sm gap-1">
            <Server className="w-3 h-3" />
            Brokers/Exchanges
          </TabsTrigger>
          <TabsTrigger value="leverage" className="text-sm">Manual Leverage</TabsTrigger>
          <TabsTrigger value="advanced" className="text-sm">Advanced</TabsTrigger>
        </TabsList>

        {/* Brokers/Exchanges Tab */}
        <TabsContent value="brokers" className="space-y-4">
          <BrokerExchangeConfig />
        </TabsContent>

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
                  
                  {/* Trading Settings */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Open Position Lot Size</Label>
                      <NumericInput 
                        value={mode.openLotSize}
                        onChange={(val) => handleUpdateMode(mode.id, { openLotSize: val })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Trailing Distance (%)</Label>
                      <NumericInput 
                        value={mode.trailingStopDistance}
                        onChange={(val) => handleUpdateMode(mode.id, { trailingStopDistance: val })}
                      />
                    </div>
                  </div>

                  {/* Risk Management Section */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-success flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Risk Management
                      </p>
                      <RadioGroup 
                        value={mode.riskType} 
                        onValueChange={(value: RiskManagementType) => handleUpdateMode(mode.id, { riskType: value })}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="dynamic" id={`${mode.id}-dynamic`} />
                          <Label htmlFor={`${mode.id}-dynamic`} className="text-xs cursor-pointer">Dynamic</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="fixed" id={`${mode.id}-fixed`} />
                          <Label htmlFor={`${mode.id}-fixed`} className="text-xs cursor-pointer">Fixed</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {mode.riskType === "dynamic" ? (
                      <div className="space-y-3">
                        <div className="p-2 rounded bg-primary/10 border border-primary/20">
                          <p className="text-xs text-muted-foreground">Automatically adjusts based on market conditions</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Kelly Criterion Fraction</Label>
                            <NumericInput 
                              value={mode.kellyFraction}
                              onChange={(val) => handleUpdateMode(mode.id, { kellyFraction: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Max Drawdown (%)</Label>
                            <NumericInput 
                              value={mode.maxDrawdown}
                              onChange={(val) => handleUpdateMode(mode.id, { maxDrawdown: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Daily Loss Limit (%)</Label>
                            <NumericInput 
                              value={mode.dailyLossLimit}
                              onChange={(val) => handleUpdateMode(mode.id, { dailyLossLimit: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Weekly Loss Limit (%)</Label>
                            <NumericInput 
                              value={mode.weeklyLossLimit}
                              onChange={(val) => handleUpdateMode(mode.id, { weeklyLossLimit: val })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={mode.adaptiveSizing}
                              onCheckedChange={(checked) => handleUpdateMode(mode.id, { adaptiveSizing: checked })}
                            />
                            <Label className="text-xs">Adaptive Sizing</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={mode.volatilityAdjustment}
                              onCheckedChange={(checked) => handleUpdateMode(mode.id, { volatilityAdjustment: checked })}
                            />
                            <Label className="text-xs">Volatility Adj</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={mode.drawdownProtection}
                              onCheckedChange={(checked) => handleUpdateMode(mode.id, { drawdownProtection: checked })}
                            />
                            <Label className="text-xs">DD Protection</Label>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-2 rounded bg-secondary/50 border border-border">
                          <p className="text-xs text-muted-foreground">Static risk parameters for consistent exposure</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Risk Per Trade (%)</Label>
                            <NumericInput 
                              value={mode.fixedRiskPerTrade}
                              onChange={(val) => handleUpdateMode(mode.id, { fixedRiskPerTrade: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Max Drawdown (%)</Label>
                            <NumericInput 
                              value={mode.fixedMaxDrawdown}
                              onChange={(val) => handleUpdateMode(mode.id, { fixedMaxDrawdown: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Risk-to-Reward Ratio</Label>
                            <NumericInput 
                              value={mode.riskRewardRatio}
                              onChange={(val) => handleUpdateMode(mode.id, { riskRewardRatio: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Fixed Lot Size</Label>
                            <NumericInput 
                              value={mode.fixedLotSize}
                              onChange={(val) => handleUpdateMode(mode.id, { fixedLotSize: val })}
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label className="text-xs">Max Open Positions</Label>
                            <NumericInput 
                              value={mode.maxOpenPositions}
                              onChange={(val) => handleUpdateMode(mode.id, { maxOpenPositions: val })}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={mode.trailingStop}
                        onCheckedChange={(checked) => handleUpdateMode(mode.id, { trailingStop: checked })}
                      />
                      <Label className="text-xs">Trailing Stop</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={mode.breakEvenOnProfit}
                        onCheckedChange={(checked) => handleUpdateMode(mode.id, { breakEvenOnProfit: checked })}
                      />
                      <Label className="text-xs">Break-Even 50%</Label>
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
                  
                  {/* Trading Settings with Instrument Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2 col-span-2">
                      <Label className="text-xs">Trading Instrument (Auto-sync leverage)</Label>
                      <select 
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                        value={mode.selectedInstrument}
                        onChange={(e) => handleInstrumentChange(mode.id, e.target.value)}
                      >
                        <option value="">Select Instrument...</option>
                        {manualLeverages.map((l) => (
                          <option key={l.instrument} value={l.instrument}>
                            {l.instrument} ({l.leverage}x - {l.marginMode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Leverage</Label>
                      <div className="flex items-center gap-2">
                        <NumericInput 
                          value={mode.leverage}
                          onChange={(val) => handleUpdateMode(mode.id, { leverage: val })}
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
                      <Label className="text-xs">Open Position Lot Size</Label>
                      <NumericInput 
                        value={mode.openLotSize}
                        onChange={(val) => handleUpdateMode(mode.id, { openLotSize: val })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Trailing Distance (%)</Label>
                      <NumericInput 
                        value={mode.trailingStopDistance}
                        onChange={(val) => handleUpdateMode(mode.id, { trailingStopDistance: val })}
                      />
                    </div>
                  </div>

                  {/* Risk Management Section */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-primary flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Risk Management
                      </p>
                      <RadioGroup 
                        value={mode.riskType} 
                        onValueChange={(value: RiskManagementType) => handleUpdateMode(mode.id, { riskType: value })}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="dynamic" id={`${mode.id}-dynamic`} />
                          <Label htmlFor={`${mode.id}-dynamic`} className="text-xs cursor-pointer">Dynamic</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="fixed" id={`${mode.id}-fixed`} />
                          <Label htmlFor={`${mode.id}-fixed`} className="text-xs cursor-pointer">Fixed</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {mode.riskType === "dynamic" ? (
                      <div className="space-y-3">
                        <div className="p-2 rounded bg-primary/10 border border-primary/20">
                          <p className="text-xs text-muted-foreground">Automatically adjusts based on market conditions</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Kelly Criterion Fraction</Label>
                            <NumericInput 
                              value={mode.kellyFraction}
                              onChange={(val) => handleUpdateMode(mode.id, { kellyFraction: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Max Drawdown (%)</Label>
                            <NumericInput 
                              value={mode.maxDrawdown}
                              onChange={(val) => handleUpdateMode(mode.id, { maxDrawdown: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Daily Loss Limit (%)</Label>
                            <NumericInput 
                              value={mode.dailyLossLimit}
                              onChange={(val) => handleUpdateMode(mode.id, { dailyLossLimit: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Weekly Loss Limit (%)</Label>
                            <NumericInput 
                              value={mode.weeklyLossLimit}
                              onChange={(val) => handleUpdateMode(mode.id, { weeklyLossLimit: val })}
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label className="text-xs">Liquidation Alert (%)</Label>
                            <NumericInput 
                              value={mode.liquidationAlert}
                              onChange={(val) => handleUpdateMode(mode.id, { liquidationAlert: val })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={mode.adaptiveSizing}
                              onCheckedChange={(checked) => handleUpdateMode(mode.id, { adaptiveSizing: checked })}
                            />
                            <Label className="text-xs">Adaptive Sizing</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={mode.volatilityAdjustment}
                              onCheckedChange={(checked) => handleUpdateMode(mode.id, { volatilityAdjustment: checked })}
                            />
                            <Label className="text-xs">Volatility Adj</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={mode.drawdownProtection}
                              onCheckedChange={(checked) => handleUpdateMode(mode.id, { drawdownProtection: checked })}
                            />
                            <Label className="text-xs">DD Protection</Label>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-2 rounded bg-secondary/50 border border-border">
                          <p className="text-xs text-muted-foreground">Static risk parameters for consistent exposure</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Risk Per Trade (%)</Label>
                            <NumericInput 
                              value={mode.fixedRiskPerTrade}
                              onChange={(val) => handleUpdateMode(mode.id, { fixedRiskPerTrade: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Max Drawdown (%)</Label>
                            <NumericInput 
                              value={mode.fixedMaxDrawdown}
                              onChange={(val) => handleUpdateMode(mode.id, { fixedMaxDrawdown: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Risk-to-Reward Ratio</Label>
                            <NumericInput 
                              value={mode.riskRewardRatio}
                              onChange={(val) => handleUpdateMode(mode.id, { riskRewardRatio: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Fixed Lot Size</Label>
                            <NumericInput 
                              value={mode.fixedLotSize}
                              onChange={(val) => handleUpdateMode(mode.id, { fixedLotSize: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Max Open Positions</Label>
                            <NumericInput 
                              value={mode.maxOpenPositions}
                              onChange={(val) => handleUpdateMode(mode.id, { maxOpenPositions: val })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Liquidation Alert (%)</Label>
                            <NumericInput 
                              value={mode.liquidationAlert}
                              onChange={(val) => handleUpdateMode(mode.id, { liquidationAlert: val })}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border">
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
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={mode.breakEvenOnProfit}
                        onCheckedChange={(checked) => handleUpdateMode(mode.id, { breakEvenOnProfit: checked })}
                      />
                      <Label className="text-xs">BE 50%</Label>
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
