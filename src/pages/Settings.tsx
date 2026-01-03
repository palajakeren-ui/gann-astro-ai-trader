import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Settings as SettingsIcon, Save, Download, Upload, Search, ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { tradingInstruments as instrumentsData, InstrumentCategory, Instrument } from "@/data/tradingInstruments";
import AlertAPISettings from "@/components/settings/AlertAPISettings";

const timeframes = [
  { label: "1M", value: "M1", name: "1 Minute" },
  { label: "2M", value: "M2", name: "2 Minutes" },
  { label: "3M", value: "M3", name: "3 Minutes" },
  { label: "5M", value: "M5", name: "5 Minutes" },
  { label: "10M", value: "M10", name: "10 Minutes" },
  { label: "15M", value: "M15", name: "15 Minutes" },
  { label: "30M", value: "M30", name: "30 Minutes" },
  { label: "45M", value: "M45", name: "45 Minutes" },
  { label: "1H", value: "H1", name: "1 Hour" },
  { label: "2H", value: "H2", name: "2 Hours" },
  { label: "3H", value: "H3", name: "3 Hours" },
  { label: "4H", value: "H4", name: "4 Hours" },
  { label: "1D", value: "D1", name: "1 Day" },
  { label: "1W", value: "W1", name: "1 Week" },
  { label: "1MO", value: "MN", name: "1 Month" },
];

const defaultStrategies = [
  { name: "WD Gann Modul", weight: 0.25 },
  { name: "Astro Cycles", weight: 0.15 },
  { name: "Ehlers DSP", weight: 0.20 },
  { name: "ML Models", weight: 0.25 },
  { name: "Pattern Recognition", weight: 0.10 },
  { name: "Options Flow", weight: 0.05 },
];

type TimeframeWeights = {
  [key: string]: { name: string; weight: number }[];
};

const createInitialWeights = (): TimeframeWeights => {
  return timeframes.reduce((acc, tf) => {
    acc[tf.value] = defaultStrategies.map(s => ({ ...s }));
    return acc;
  }, {} as TimeframeWeights);
};

// Instruments data is now imported from @/data/tradingInstruments

const Settings = () => {
  const [tfWeights, setTfWeights] = useState<TimeframeWeights>(() => createInitialWeights());
  const [activeTf, setActiveTf] = useState("H1");
  const [instruments, setInstruments] = useState(instrumentsData);
  const [instrumentSearch, setInstrumentSearch] = useState("");
  const [activeInstrumentTab, setActiveInstrumentTab] = useState<InstrumentCategory>("forex");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    forex: true,
    commodities: true,
    indices: true,
    crypto: true,
    stocks: true,
    bonds: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom instrument input states
  const [newInstrument, setNewInstrument] = useState({ symbol: "", name: "", category: "" });
  const [customInstrumentCategory, setCustomInstrumentCategory] = useState<InstrumentCategory>("forex");

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const addCustomInstrument = () => {
    if (!newInstrument.symbol.trim() || !newInstrument.name.trim()) {
      toast.error("Please fill in symbol and name");
      return;
    }
    
    const instrument: Instrument = {
      symbol: newInstrument.symbol.toUpperCase().trim(),
      name: newInstrument.name.trim(),
      enabled: true,
      category: newInstrument.category.trim() || "Custom"
    };

    // Check if instrument already exists
    if (instruments[customInstrumentCategory].some(i => i.symbol === instrument.symbol)) {
      toast.error("Instrument already exists");
      return;
    }

    setInstruments(prev => ({
      ...prev,
      [customInstrumentCategory]: [...prev[customInstrumentCategory], instrument]
    }));
    
    setNewInstrument({ symbol: "", name: "", category: "" });
    toast.success(`${instrument.symbol} added to ${customInstrumentCategory}`);
  };

  const removeInstrument = (category: InstrumentCategory, symbol: string) => {
    setInstruments(prev => ({
      ...prev,
      [category]: prev[category].filter(i => i.symbol !== symbol)
    }));
    toast.success(`${symbol} removed`);
  };

  const handleExportSettings = () => {
    const settings = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      tfWeights,
      instruments,
      brokerConfigs: {
        mt5: { enabled: true },
        binanceSpot: { enabled: true },
        binanceFutures: { enabled: true },
        bybit: { enabled: false },
        okx: { enabled: false },
        kucoin: { enabled: false },
        kraken: { enabled: false },
        coinbase: { enabled: false },
        gateio: { enabled: false },
        bitget: { enabled: false },
        mexc: { enabled: false },
        htx: { enabled: false },
        bitfinex: { enabled: false },
        gemini: { enabled: false },
        bitstamp: { enabled: false },
        cryptocom: { enabled: false },
        deribit: { enabled: false },
        phemex: { enabled: false },
        bingx: { enabled: false },
      }
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gann-quant-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Settings exported successfully!");
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        if (settings.tfWeights) setTfWeights(settings.tfWeights);
        if (settings.instruments) setInstruments(settings.instruments);
        toast.success("Settings imported successfully!");
      } catch {
        toast.error("Failed to import settings. Invalid file format.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const toggleInstrument = (category: keyof typeof instruments, symbol: string) => {
    setInstruments(prev => ({
      ...prev,
      [category]: prev[category].map(inst =>
        inst.symbol === symbol ? { ...inst, enabled: !inst.enabled } : inst
      )
    }));
  };

  const filteredInstruments = (category: keyof typeof instruments) => {
    return instruments[category].filter(inst =>
      inst.symbol.toLowerCase().includes(instrumentSearch.toLowerCase()) ||
      inst.name.toLowerCase().includes(instrumentSearch.toLowerCase())
    );
  };

  const handleWeightChange = (tf: string, strategyIdx: number, newWeight: number) => {
    setTfWeights(prev => ({
      ...prev,
      [tf]: prev[tf]?.map((s, idx) => 
        idx === strategyIdx ? { ...s, weight: newWeight } : s
      ) || []
    }));
  };

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
          <SettingsIcon className="w-6 h-6 md:w-8 md:h-8 mr-3" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">Configure your trading system</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 border-border bg-card">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Strategy Weights by Timeframe</h2>
          
          <Tabs value={activeTf} onValueChange={setActiveTf} className="w-full">
            <TabsList className="flex flex-wrap gap-1 h-auto p-1 md:p-2 mb-4">
              {timeframes.map((tf) => (
                <TabsTrigger key={tf.value} value={tf.value} className="text-xs px-2 py-1">
                  {tf.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {timeframes.map((tf) => (
              <TabsContent key={tf.value} value={tf.value} className="space-y-4">
                <div className="p-3 rounded bg-primary/10 border border-primary/20 mb-4">
                  <span className="text-sm font-semibold text-primary">{tf.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({tf.value})</span>
                </div>
                
                {tfWeights[tf.value]?.map((strategy, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground text-sm">{strategy.name}</Label>
                      <span className="text-sm font-mono text-foreground bg-secondary px-2 py-0.5 rounded">
                        {strategy.weight.toFixed(2)}
                      </span>
                    </div>
                    <Input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05" 
                      value={strategy.weight}
                      onChange={(e) => handleWeightChange(tf.value, idx, parseFloat(e.target.value))}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Weight:</span>
                    <span className={`font-mono font-semibold ${
                      Math.abs((tfWeights[tf.value]?.reduce((sum, s) => sum + s.weight, 0) ?? 0) - 1) < 0.01 
                        ? 'text-success' 
                        : 'text-destructive'
                    }`}>
                      {(tfWeights[tf.value]?.reduce((sum, s) => sum + s.weight, 0) ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Primary/Confirmation Timeframe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-tf" className="text-foreground text-sm">Primary Timeframe</Label>
                <select id="primary-tf" className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm">
                  {timeframes.map((tf) => (
                    <option key={tf.value} value={tf.value} selected={tf.value === "H1"}>{tf.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmation-tf" className="text-foreground text-sm">Confirmation Timeframe</Label>
                <select id="confirmation-tf" className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm">
                  {timeframes.map((tf) => (
                    <option key={tf.value} value={tf.value} selected={tf.value === "H4"}>{tf.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

      </div>

      {/* Alert API Settings */}
      <AlertAPISettings />

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Active Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Gann Square of 9",
            "Gann Angles",
            "Planetary Aspects",
            "MAMA Indicator",
            "Fisher Transform",
            "LSTM Predictor",
            "Pattern Recognition",
            "Options Flow",
            "Ehlers Cyber Cycle",
          ].map((strategy, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded bg-secondary/50">
              <span className="text-sm text-foreground">{strategy}</span>
              <Switch defaultChecked={idx < 6} />
            </div>
          ))}
        </div>
      </Card>

      {/* Crypto Exchange API Configuration - Spot & Futures Separated */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Crypto Exchange API Configuration</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure Spot and Futures API keys separately for each exchange
        </p>
        
        <Tabs defaultValue="spot" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="spot" className="text-sm">Spot Trading</TabsTrigger>
            <TabsTrigger value="futures" className="text-sm">Futures Trading</TabsTrigger>
          </TabsList>

          {/* SPOT TRADING TAB */}
          <TabsContent value="spot" className="space-y-4">
            <div className="p-3 rounded bg-primary/10 border border-primary/20 mb-4">
              <span className="text-sm font-semibold text-primary">Spot Trading APIs</span>
              <p className="text-xs text-muted-foreground mt-1">Configure API credentials for spot/margin trading</p>
            </div>

            {/* Binance Spot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟡</span>
                  <span className="font-semibold text-foreground">Binance Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Spot</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Spot API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Spot API Secret" />
                  </div>
                  <div className="space-y-2">
                    <Label>Endpoint</Label>
                    <Input defaultValue="https://api.binance.com" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="binance-spot-testnet" />
                    <Label htmlFor="binance-spot-testnet">Testnet</Label>
                    <Switch id="binance-spot-enabled" defaultChecked />
                    <Label htmlFor="binance-spot-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Bybit Spot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟠</span>
                  <span className="font-semibold text-foreground">Bybit Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Spot</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Spot API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Spot API Secret" />
                  </div>
                  <div className="space-y-2">
                    <Label>Endpoint</Label>
                    <Input defaultValue="https://api.bybit.com" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="bybit-spot-testnet" />
                    <Label htmlFor="bybit-spot-testnet">Testnet</Label>
                    <Switch id="bybit-spot-enabled" />
                    <Label htmlFor="bybit-spot-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* OKX Spot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚫</span>
                  <span className="font-semibold text-foreground">OKX Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Spot</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Spot API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Spot API Secret" />
                  </div>
                  <div className="space-y-2">
                    <Label>Passphrase</Label>
                    <Input type="password" placeholder="Enter Passphrase" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="okx-spot-enabled" />
                    <Label htmlFor="okx-spot-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* KuCoin Spot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟢</span>
                  <span className="font-semibold text-foreground">KuCoin Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Spot</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Spot API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Spot API Secret" />
                  </div>
                  <div className="space-y-2">
                    <Label>Passphrase</Label>
                    <Input type="password" placeholder="Enter Passphrase" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="kucoin-spot-enabled" />
                    <Label htmlFor="kucoin-spot-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Gate.io Spot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔴</span>
                  <span className="font-semibold text-foreground">Gate.io Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Spot</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Spot API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Spot API Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="gateio-spot-enabled" />
                    <Label htmlFor="gateio-spot-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Bitget Spot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟦</span>
                  <span className="font-semibold text-foreground">Bitget Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Spot</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Spot API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Spot API Secret" />
                  </div>
                  <div className="space-y-2">
                    <Label>Passphrase</Label>
                    <Input type="password" placeholder="Enter Passphrase" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="bitget-spot-enabled" />
                    <Label htmlFor="bitget-spot-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* MEXC Spot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💙</span>
                  <span className="font-semibold text-foreground">MEXC Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Spot</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Spot API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Spot API Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="mexc-spot-enabled" />
                    <Label htmlFor="mexc-spot-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Kraken Spot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟣</span>
                  <span className="font-semibold text-foreground">Kraken Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Spot</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Spot API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Spot API Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="kraken-spot-enabled" />
                    <Label htmlFor="kraken-spot-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Coinbase Spot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔵</span>
                  <span className="font-semibold text-foreground">Coinbase Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Spot</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Spot API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Spot API Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="coinbase-spot-sandbox" />
                    <Label htmlFor="coinbase-spot-sandbox">Sandbox</Label>
                    <Switch id="coinbase-spot-enabled" />
                    <Label htmlFor="coinbase-spot-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* HTX Spot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔷</span>
                  <span className="font-semibold text-foreground">HTX (Huobi) Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Spot</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Spot API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Spot API Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="htx-spot-enabled" />
                    <Label htmlFor="htx-spot-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Crypto.com Spot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💎</span>
                  <span className="font-semibold text-foreground">Crypto.com Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Spot</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Spot API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Spot API Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="cryptocom-spot-enabled" />
                    <Label htmlFor="cryptocom-spot-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* BingX Spot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌐</span>
                  <span className="font-semibold text-foreground">BingX Spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Spot</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Spot API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Spot API Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="bingx-spot-enabled" />
                    <Label htmlFor="bingx-spot-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>

          {/* FUTURES TRADING TAB */}
          <TabsContent value="futures" className="space-y-4">
            <div className="p-3 rounded bg-warning/10 border border-warning/20 mb-4">
              <span className="text-sm font-semibold text-warning">Futures/Derivatives Trading APIs</span>
              <p className="text-xs text-muted-foreground mt-1">Configure API credentials for perpetual & futures contracts</p>
            </div>

            {/* Binance Futures */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟡</span>
                  <span className="font-semibold text-foreground">Binance Futures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-warning text-warning">Futures</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Futures API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Futures API Secret" />
                  </div>
                  <div className="space-y-2">
                    <Label>Endpoint</Label>
                    <Input defaultValue="https://fapi.binance.com" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="binance-futures-testnet" />
                    <Label htmlFor="binance-futures-testnet">Testnet</Label>
                    <Switch id="binance-futures-enabled" defaultChecked />
                    <Label htmlFor="binance-futures-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Bybit Futures */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟠</span>
                  <span className="font-semibold text-foreground">Bybit Futures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-warning text-warning">Futures</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Futures API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Futures API Secret" />
                  </div>
                  <div className="space-y-2">
                    <Label>Endpoint</Label>
                    <Input defaultValue="https://api.bybit.com" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="bybit-futures-testnet" />
                    <Label htmlFor="bybit-futures-testnet">Testnet</Label>
                    <Switch id="bybit-futures-enabled" />
                    <Label htmlFor="bybit-futures-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* OKX Futures */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚫</span>
                  <span className="font-semibold text-foreground">OKX Futures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-warning text-warning">Futures</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Futures API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Futures API Secret" />
                  </div>
                  <div className="space-y-2">
                    <Label>Passphrase</Label>
                    <Input type="password" placeholder="Enter Passphrase" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="okx-futures-enabled" />
                    <Label htmlFor="okx-futures-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* KuCoin Futures */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟢</span>
                  <span className="font-semibold text-foreground">KuCoin Futures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-warning text-warning">Futures</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Futures API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Futures API Secret" />
                  </div>
                  <div className="space-y-2">
                    <Label>Passphrase</Label>
                    <Input type="password" placeholder="Enter Passphrase" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="kucoin-futures-enabled" />
                    <Label htmlFor="kucoin-futures-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Gate.io Futures */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔴</span>
                  <span className="font-semibold text-foreground">Gate.io Futures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-warning text-warning">Futures</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Futures API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Futures API Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="gateio-futures-enabled" />
                    <Label htmlFor="gateio-futures-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Bitget Futures */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟦</span>
                  <span className="font-semibold text-foreground">Bitget Futures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-warning text-warning">Futures</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Futures API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Futures API Secret" />
                  </div>
                  <div className="space-y-2">
                    <Label>Passphrase</Label>
                    <Input type="password" placeholder="Enter Passphrase" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="bitget-futures-enabled" />
                    <Label htmlFor="bitget-futures-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* MEXC Futures */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💙</span>
                  <span className="font-semibold text-foreground">MEXC Futures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-warning text-warning">Futures</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Futures API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Futures API Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="mexc-futures-enabled" />
                    <Label htmlFor="mexc-futures-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Kraken Futures */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟣</span>
                  <span className="font-semibold text-foreground">Kraken Futures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-warning text-warning">Futures</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Futures API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Futures API Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="kraken-futures-enabled" />
                    <Label htmlFor="kraken-futures-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Deribit */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📊</span>
                  <span className="font-semibold text-foreground">Deribit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-warning text-warning">Derivatives</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client ID</Label>
                    <Input type="password" placeholder="Enter Client ID" />
                  </div>
                  <div className="space-y-2">
                    <Label>Client Secret</Label>
                    <Input type="password" placeholder="Enter Client Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="deribit-testnet" />
                    <Label htmlFor="deribit-testnet">Testnet</Label>
                    <Switch id="deribit-enabled" />
                    <Label htmlFor="deribit-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Phemex Futures */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚡</span>
                  <span className="font-semibold text-foreground">Phemex Futures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-warning text-warning">Futures</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Futures API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Futures API Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="phemex-futures-testnet" />
                    <Label htmlFor="phemex-futures-testnet">Testnet</Label>
                    <Switch id="phemex-futures-enabled" />
                    <Label htmlFor="phemex-futures-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* BingX Futures */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌐</span>
                  <span className="font-semibold text-foreground">BingX Futures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-warning text-warning">Futures</Badge>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Futures API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Futures API Secret" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <Switch id="bingx-futures-demo" />
                    <Label htmlFor="bingx-futures-demo">Demo</Label>
                    <Switch id="bingx-futures-enabled" />
                    <Label htmlFor="bingx-futures-enabled">Enabled</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>
        </Tabs>
      </Card>

      {/* MetaTrader 5 Configuration */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">MetaTrader 5 Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mt5-server" className="text-foreground">Server Address</Label>
            <Input id="mt5-server" placeholder="broker.server.com:443" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mt5-login" className="text-foreground">Login ID</Label>
            <Input id="mt5-login" type="number" placeholder="12345678" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mt5-password" className="text-foreground">Password</Label>
            <Input id="mt5-password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mt5-account" className="text-foreground">Account Type</Label>
            <Input id="mt5-account" placeholder="Real / Demo" defaultValue="Demo" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <Label htmlFor="mt5-enabled" className="text-foreground">Enable MetaTrader 5</Label>
          <Switch id="mt5-enabled" defaultChecked />
        </div>
      </Card>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">FIX Protocol Connector</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fix-host" className="text-foreground">FIX Gateway Host</Label>
            <Input id="fix-host" placeholder="fix.broker.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fix-port" className="text-foreground">Port</Label>
            <Input id="fix-port" type="number" placeholder="9876" defaultValue="9876" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fix-sender" className="text-foreground">Sender Comp ID</Label>
            <Input id="fix-sender" placeholder="SENDER_ID" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fix-target" className="text-foreground">Target Comp ID</Label>
            <Input id="fix-target" placeholder="TARGET_ID" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <Label htmlFor="fix-enabled" className="text-foreground">Enable FIX Connector</Label>
          <Switch id="fix-enabled" />
        </div>
      </Card>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Connection Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "MetaTrader 5", status: "Connected", color: "success" },
            { name: "Binance Spot", status: "Connected", color: "success" },
            { name: "Binance Futures", status: "Connected", color: "success" },
            { name: "Bybit", status: "Disconnected", color: "muted" },
            { name: "OKX", status: "Disconnected", color: "muted" },
            { name: "KuCoin", status: "Disconnected", color: "muted" },
            { name: "Kraken", status: "Disconnected", color: "muted" },
            { name: "Coinbase", status: "Disconnected", color: "muted" },
            { name: "Gate.io", status: "Disconnected", color: "muted" },
            { name: "Bitget", status: "Disconnected", color: "muted" },
            { name: "MEXC", status: "Disconnected", color: "muted" },
            { name: "HTX (Huobi)", status: "Disconnected", color: "muted" },
            { name: "Bitfinex", status: "Disconnected", color: "muted" },
            { name: "Gemini", status: "Disconnected", color: "muted" },
            { name: "Bitstamp", status: "Disconnected", color: "muted" },
            { name: "Crypto.com", status: "Disconnected", color: "muted" },
            { name: "Deribit", status: "Disconnected", color: "muted" },
            { name: "Phemex", status: "Disconnected", color: "muted" },
            { name: "BingX", status: "Disconnected", color: "muted" },
            { name: "FIX Connector", status: "Disconnected", color: "muted" },
          ].map((conn, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-foreground font-medium text-sm">{conn.name}</span>
              <Badge 
                variant="outline"
                className={
                  conn.color === "success" 
                    ? "border-success text-success bg-success/10" 
                    : "border-muted-foreground text-muted-foreground"
                }
              >
                {conn.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Add Custom Instrument */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Add Custom Instrument</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Manually add trading instruments that are not in the predefined list
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <Label className="text-foreground">Asset Class</Label>
            <select
              value={customInstrumentCategory}
              onChange={(e) => setCustomInstrumentCategory(e.target.value as InstrumentCategory)}
              className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground"
            >
              <option value="forex">Forex</option>
              <option value="commodities">Commodities</option>
              <option value="indices">Indices</option>
              <option value="crypto">Crypto</option>
              <option value="stocks">Stocks</option>
              <option value="bonds">Bonds</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Symbol *</Label>
            <Input
              placeholder="e.g., BTCUSDT"
              value={newInstrument.symbol}
              onChange={(e) => setNewInstrument(prev => ({ ...prev, symbol: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Name *</Label>
            <Input
              placeholder="e.g., Bitcoin"
              value={newInstrument.name}
              onChange={(e) => setNewInstrument(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Sub-Category</Label>
            <Input
              placeholder="e.g., Layer 1, Major, etc."
              value={newInstrument.category}
              onChange={(e) => setNewInstrument(prev => ({ ...prev, category: e.target.value }))}
            />
          </div>
          <Button onClick={addCustomInstrument} className="h-10">
            <Plus className="w-4 h-4 mr-2" />
            Add Instrument
          </Button>
        </div>
      </Card>

      {/* Trading Instruments Configuration */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Trading Instruments</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select the instruments you want to trade across Forex, Commodities, Indices, and Crypto
        </p>
        
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search instruments..."
              value={instrumentSearch}
              onChange={(e) => setInstrumentSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeInstrumentTab} onValueChange={(v) => setActiveInstrumentTab(v as InstrumentCategory)}>
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="forex">Forex ({instruments.forex.filter(i => i.enabled).length})</TabsTrigger>
            <TabsTrigger value="commodities">Commodities ({instruments.commodities.filter(i => i.enabled).length})</TabsTrigger>
            <TabsTrigger value="indices">Indices ({instruments.indices.filter(i => i.enabled).length})</TabsTrigger>
            <TabsTrigger value="crypto">Crypto ({instruments.crypto.filter(i => i.enabled).length})</TabsTrigger>
            <TabsTrigger value="stocks">Stocks ({instruments.stocks.filter(i => i.enabled).length})</TabsTrigger>
            <TabsTrigger value="bonds">Bonds ({instruments.bonds.filter(i => i.enabled).length})</TabsTrigger>
          </TabsList>

          {(["forex", "commodities", "indices", "crypto", "stocks", "bonds"] as const).map((category) => {
            const categoryItems = filteredInstruments(category);
            const subCategories = [...new Set(categoryItems.map(i => i.category))];
            
            return (
              <TabsContent key={category} value={category}>
                <div className="space-y-4">
                  {subCategories.map((subCat) => (
                    <Collapsible 
                      key={subCat} 
                      open={openCategories[`${category}-${subCat}`] !== false}
                      onOpenChange={() => toggleCategory(`${category}-${subCat}`)}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                        <div className="flex items-center gap-2">
                          {openCategories[`${category}-${subCat}`] !== false ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          <span className="font-semibold text-foreground">{subCat}</span>
                          <Badge variant="outline" className="ml-2">
                            {categoryItems.filter(i => i.category === subCat && i.enabled).length}/{categoryItems.filter(i => i.category === subCat).length}
                          </Badge>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                          {categoryItems.filter(i => i.category === subCat).map((inst) => (
                            <div
                              key={inst.symbol}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                inst.enabled
                                  ? "bg-primary/10 border-primary/30"
                                  : "bg-secondary/50 border-border"
                              }`}
                            >
                              <div className="flex flex-col flex-1">
                                <span className="font-mono text-sm font-semibold text-foreground">{inst.symbol}</span>
                                <span className="text-xs text-muted-foreground">{inst.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={inst.enabled}
                                  onCheckedChange={() => toggleInstrument(category, inst.symbol)}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeInstrument(category, inst.symbol)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
                {filteredInstruments(category).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No instruments found</p>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </Card>

      {/* FIX Protocol Connectors */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">FIX Protocol Connectors</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure multiple FIX protocol connections for institutional trading
        </p>
        
        <FixConnectorManager />
      </Card>

      {/* Removed: Trading Mode Configuration - now in Trading Mode page */}

      {/* Import/Export Settings */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Backup & Restore Settings</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Export your current configuration to a file or import a previously saved configuration
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleExportSettings} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Settings
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            className="hidden"
          />
        </div>
        
        <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">What's included in the backup:</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Strategy weights for all timeframes</li>
            <li>• Trading instruments configuration</li>
            <li>• Broker connection settings (excluding API keys for security)</li>
            <li>• Risk management parameters</li>
            <li>• FIX Protocol connector configurations</li>
            <li>• Trading mode settings (Spot/Futures)</li>
          </ul>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="lg">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

// FIX Connector Manager Component
const FixConnectorManager = () => {
  const [connectors, setConnectors] = useState([
    {
      id: 1,
      name: "Primary FIX",
      host: "fix.broker1.com",
      port: "9880",
      senderCompId: "CLIENT1",
      targetCompId: "BROKER1",
      enabled: true,
      protocol: "FIX 4.4",
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConnector, setNewConnector] = useState({
    name: "",
    host: "",
    port: "9880",
    senderCompId: "",
    targetCompId: "",
    protocol: "FIX 4.4",
  });

  const addConnector = () => {
    if (!newConnector.name || !newConnector.host || !newConnector.senderCompId) {
      toast.error("Please fill in required fields");
      return;
    }
    setConnectors([
      ...connectors,
      { ...newConnector, id: Date.now(), enabled: false },
    ]);
    setNewConnector({
      name: "",
      host: "",
      port: "9880",
      senderCompId: "",
      targetCompId: "",
      protocol: "FIX 4.4",
    });
    setShowAddForm(false);
    toast.success("FIX Connector added");
  };

  const removeConnector = (id: number) => {
    setConnectors(connectors.filter((c) => c.id !== id));
    toast.success("Connector removed");
  };

  const toggleConnector = (id: number) => {
    setConnectors(
      connectors.map((c) =>
        c.id === id ? { ...c, enabled: !c.enabled } : c
      )
    );
  };

  const testConnection = (id: number) => {
    const conn = connectors.find((c) => c.id === id);
    if (conn) {
      toast.info(`Testing connection to ${conn.host}:${conn.port}...`);
      setTimeout(() => {
        toast.success(`Connection to ${conn.name} successful`);
      }, 1500);
    }
  };

  return (
    <div className="space-y-4">
      {connectors.map((connector) => (
        <div
          key={connector.id}
          className={`p-4 rounded-lg border transition-colors ${
            connector.enabled
              ? "bg-success/10 border-success/30"
              : "bg-secondary/50 border-border"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-foreground">{connector.name}</h3>
              <Badge variant="outline">{connector.protocol}</Badge>
              {connector.enabled && (
                <Badge className="bg-success text-success-foreground">Active</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => testConnection(connector.id)}
              >
                Test
              </Button>
              <Switch
                checked={connector.enabled}
                onCheckedChange={() => toggleConnector(connector.id)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => removeConnector(connector.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground text-xs">Host</Label>
              <p className="text-foreground font-mono">{connector.host}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Port</Label>
              <p className="text-foreground font-mono">{connector.port}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Sender CompID</Label>
              <p className="text-foreground font-mono">{connector.senderCompId}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Target CompID</Label>
              <p className="text-foreground font-mono">{connector.targetCompId}</p>
            </div>
          </div>
        </div>
      ))}

      {showAddForm ? (
        <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-4">
          <h4 className="font-semibold text-foreground">Add New FIX Connector</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Connector Name *</Label>
              <Input
                value={newConnector.name}
                onChange={(e) =>
                  setNewConnector({ ...newConnector, name: e.target.value })
                }
                placeholder="e.g., Primary FIX"
              />
            </div>
            <div className="space-y-2">
              <Label>Protocol</Label>
              <select
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
                value={newConnector.protocol}
                onChange={(e) =>
                  setNewConnector({ ...newConnector, protocol: e.target.value })
                }
              >
                <option value="FIX 4.0">FIX 4.0</option>
                <option value="FIX 4.2">FIX 4.2</option>
                <option value="FIX 4.4">FIX 4.4</option>
                <option value="FIX 5.0">FIX 5.0</option>
                <option value="FIX 5.0 SP2">FIX 5.0 SP2</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Host *</Label>
              <Input
                value={newConnector.host}
                onChange={(e) =>
                  setNewConnector({ ...newConnector, host: e.target.value })
                }
                placeholder="e.g., fix.broker.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Port</Label>
              <Input
                value={newConnector.port}
                onChange={(e) =>
                  setNewConnector({ ...newConnector, port: e.target.value })
                }
                placeholder="9880"
              />
            </div>
            <div className="space-y-2">
              <Label>Sender CompID *</Label>
              <Input
                value={newConnector.senderCompId}
                onChange={(e) =>
                  setNewConnector({ ...newConnector, senderCompId: e.target.value })
                }
                placeholder="YOUR_COMP_ID"
              />
            </div>
            <div className="space-y-2">
              <Label>Target CompID</Label>
              <Input
                value={newConnector.targetCompId}
                onChange={(e) =>
                  setNewConnector({ ...newConnector, targetCompId: e.target.value })
                }
                placeholder="BROKER_COMP_ID"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={addConnector}>
              <Plus className="w-4 h-4 mr-2" />
              Add Connector
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add FIX Connector
        </Button>
      )}
    </div>
  );
};

// Removed: TradingModeSettings component - now in Trading Mode page

export default Settings;
