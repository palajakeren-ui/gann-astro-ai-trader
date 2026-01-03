import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Settings as SettingsIcon, Save, Download, Upload, Search, ChevronDown, ChevronRight, Plus, Trash2, Wifi, WifiOff, RefreshCw, Loader2, CheckCircle2, XCircle, AlertCircle, RotateCcw, Timer, Zap } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
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

// MetaTrader Account Type
interface MTAccount {
  id: string;
  name: string;
  server: string;
  login: string;
  password: string;
  accountType: 'demo' | 'real';
  broker: string;
  timeout: number;
  enabled: boolean;
}

// Exchange Account Type
interface ExchangeAccount {
  id: string;
  name: string;
  exchange: string;
  type: 'spot' | 'futures';
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  endpoint?: string;
  testnet: boolean;
  enabled: boolean;
}

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

  // Multi-account MetaTrader states
  const [mt4Accounts, setMt4Accounts] = useState<MTAccount[]>([
    { id: 'mt4-1', name: 'Main MT4 Account', server: '', login: '', password: '', accountType: 'demo', broker: '', timeout: 30000, enabled: false }
  ]);
  const [mt5Accounts, setMt5Accounts] = useState<MTAccount[]>([
    { id: 'mt5-1', name: 'Main MT5 Account', server: '', login: '', password: '', accountType: 'demo', broker: '', timeout: 30000, enabled: true }
  ]);

  // Multi-account Exchange states
  const [exchangeAccounts, setExchangeAccounts] = useState<ExchangeAccount[]>([
    { id: 'binance-spot-1', name: 'Binance Spot Main', exchange: 'Binance', type: 'spot', apiKey: '', apiSecret: '', endpoint: 'https://api.binance.com', testnet: false, enabled: true },
    { id: 'binance-futures-1', name: 'Binance Futures Main', exchange: 'Binance', type: 'futures', apiKey: '', apiSecret: '', endpoint: 'https://fapi.binance.com', testnet: false, enabled: true },
  ]);

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
      mt4Accounts: mt4Accounts.map(a => ({ ...a, password: '', apiSecret: '' })),
      mt5Accounts: mt5Accounts.map(a => ({ ...a, password: '', apiSecret: '' })),
      exchangeAccounts: exchangeAccounts.map(a => ({ ...a, apiKey: '', apiSecret: '', passphrase: '' })),
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

  // MT Account Management
  const addMTAccount = (type: 'mt4' | 'mt5') => {
    const newAccount: MTAccount = {
      id: `${type}-${Date.now()}`,
      name: `New ${type.toUpperCase()} Account`,
      server: '',
      login: '',
      password: '',
      accountType: 'demo',
      broker: '',
      timeout: 30000,
      enabled: false
    };
    if (type === 'mt4') {
      setMt4Accounts(prev => [...prev, newAccount]);
    } else {
      setMt5Accounts(prev => [...prev, newAccount]);
    }
    toast.success(`New ${type.toUpperCase()} account added`);
  };

  const removeMTAccount = (type: 'mt4' | 'mt5', id: string) => {
    if (type === 'mt4') {
      setMt4Accounts(prev => prev.filter(a => a.id !== id));
    } else {
      setMt5Accounts(prev => prev.filter(a => a.id !== id));
    }
    toast.success('Account removed');
  };

  const updateMTAccount = (type: 'mt4' | 'mt5', id: string, updates: Partial<MTAccount>) => {
    if (type === 'mt4') {
      setMt4Accounts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    } else {
      setMt5Accounts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    }
  };

  // Exchange Account Management
  const addExchangeAccount = (exchange: string, type: 'spot' | 'futures') => {
    const exchangeDefaults: Record<string, { endpoint?: string, hasPassphrase?: boolean }> = {
      'Binance': { endpoint: type === 'spot' ? 'https://api.binance.com' : 'https://fapi.binance.com' },
      'Bybit': { endpoint: 'https://api.bybit.com' },
      'OKX': { endpoint: 'https://www.okx.com', hasPassphrase: true },
      'KuCoin': { endpoint: 'https://api.kucoin.com', hasPassphrase: true },
      'Gate.io': { endpoint: 'https://api.gateio.ws' },
      'Bitget': { endpoint: 'https://api.bitget.com', hasPassphrase: true },
      'MEXC': { endpoint: 'https://api.mexc.com' },
      'Kraken': { endpoint: 'https://api.kraken.com' },
      'Coinbase': { endpoint: 'https://api.coinbase.com' },
      'HTX': { endpoint: 'https://api.huobi.pro' },
      'Crypto.com': { endpoint: 'https://api.crypto.com' },
      'BingX': { endpoint: 'https://open-api.bingx.com' },
      'Deribit': { endpoint: 'https://www.deribit.com' },
      'Phemex': { endpoint: 'https://api.phemex.com' },
    };

    const defaults = exchangeDefaults[exchange] || {};
    const newAccount: ExchangeAccount = {
      id: `${exchange.toLowerCase()}-${type}-${Date.now()}`,
      name: `${exchange} ${type.charAt(0).toUpperCase() + type.slice(1)} Account`,
      exchange,
      type,
      apiKey: '',
      apiSecret: '',
      passphrase: defaults.hasPassphrase ? '' : undefined,
      endpoint: defaults.endpoint,
      testnet: false,
      enabled: false
    };
    setExchangeAccounts(prev => [...prev, newAccount]);
    toast.success(`New ${exchange} ${type} account added`);
  };

  const removeExchangeAccount = (id: string) => {
    setExchangeAccounts(prev => prev.filter(a => a.id !== id));
    toast.success('Account removed');
  };

  const updateExchangeAccount = (id: string, updates: Partial<ExchangeAccount>) => {
    setExchangeAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
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

      {/* Multi-Account Crypto Exchange Configuration */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Crypto Exchange Accounts</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Manage multiple accounts per exchange for Spot and Futures trading
        </p>
        
        <Tabs defaultValue="spot" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="spot" className="text-sm">Spot Trading</TabsTrigger>
            <TabsTrigger value="futures" className="text-sm">Futures Trading</TabsTrigger>
          </TabsList>

          <TabsContent value="spot" className="space-y-4">
            <div className="p-3 rounded bg-primary/10 border border-primary/20 mb-4">
              <span className="text-sm font-semibold text-primary">Spot Trading Accounts</span>
              <p className="text-xs text-muted-foreground mt-1">Configure multiple accounts for spot/margin trading</p>
            </div>

            {exchangeAccounts.filter(a => a.type === 'spot').map(account => (
              <Collapsible key={account.id}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💰</span>
                    <div className="text-left">
                      <span className="font-semibold text-foreground">{account.name}</span>
                      <p className="text-xs text-muted-foreground">{account.exchange}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {account.enabled && <Badge className="bg-success text-success-foreground">Active</Badge>}
                    <Badge variant="outline">Spot</Badge>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Name</Label>
                      <Input 
                        value={account.name}
                        onChange={(e) => updateExchangeAccount(account.id, { name: e.target.value })}
                        placeholder="Account Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input 
                        type="password" 
                        value={account.apiKey}
                        onChange={(e) => updateExchangeAccount(account.id, { apiKey: e.target.value })}
                        placeholder="Enter API Key" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Secret</Label>
                      <Input 
                        type="password" 
                        value={account.apiSecret}
                        onChange={(e) => updateExchangeAccount(account.id, { apiSecret: e.target.value })}
                        placeholder="Enter API Secret" 
                      />
                    </div>
                    {account.passphrase !== undefined && (
                      <div className="space-y-2">
                        <Label>Passphrase</Label>
                        <Input 
                          type="password" 
                          value={account.passphrase}
                          onChange={(e) => updateExchangeAccount(account.id, { passphrase: e.target.value })}
                          placeholder="Enter Passphrase" 
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Endpoint</Label>
                      <Input 
                        value={account.endpoint}
                        onChange={(e) => updateExchangeAccount(account.id, { endpoint: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-6">
                      <Switch 
                        id={`${account.id}-testnet`}
                        checked={account.testnet}
                        onCheckedChange={(checked) => updateExchangeAccount(account.id, { testnet: checked })}
                      />
                      <Label htmlFor={`${account.id}-testnet`}>Testnet</Label>
                      <Switch 
                        id={`${account.id}-enabled`}
                        checked={account.enabled}
                        onCheckedChange={(checked) => updateExchangeAccount(account.id, { enabled: checked })}
                      />
                      <Label htmlFor={`${account.id}-enabled`}>Enabled</Label>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeExchangeAccount(account.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Account
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

            <div className="flex flex-wrap gap-2 pt-4">
              {['Binance', 'Bybit', 'OKX', 'KuCoin', 'Gate.io', 'Bitget', 'MEXC', 'Kraken', 'Coinbase', 'HTX', 'Crypto.com', 'BingX'].map(exchange => (
                <Button 
                  key={exchange}
                  variant="outline" 
                  size="sm"
                  onClick={() => addExchangeAccount(exchange, 'spot')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {exchange}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="futures" className="space-y-4">
            <div className="p-3 rounded bg-warning/10 border border-warning/20 mb-4">
              <span className="text-sm font-semibold text-warning">Futures/Derivatives Trading Accounts</span>
              <p className="text-xs text-muted-foreground mt-1">Configure multiple accounts for perpetual & futures contracts</p>
            </div>

            {exchangeAccounts.filter(a => a.type === 'futures').map(account => (
              <Collapsible key={account.id}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📈</span>
                    <div className="text-left">
                      <span className="font-semibold text-foreground">{account.name}</span>
                      <p className="text-xs text-muted-foreground">{account.exchange}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {account.enabled && <Badge className="bg-success text-success-foreground">Active</Badge>}
                    <Badge variant="outline" className="border-warning text-warning">Futures</Badge>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Name</Label>
                      <Input 
                        value={account.name}
                        onChange={(e) => updateExchangeAccount(account.id, { name: e.target.value })}
                        placeholder="Account Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input 
                        type="password" 
                        value={account.apiKey}
                        onChange={(e) => updateExchangeAccount(account.id, { apiKey: e.target.value })}
                        placeholder="Enter API Key" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Secret</Label>
                      <Input 
                        type="password" 
                        value={account.apiSecret}
                        onChange={(e) => updateExchangeAccount(account.id, { apiSecret: e.target.value })}
                        placeholder="Enter API Secret" 
                      />
                    </div>
                    {account.passphrase !== undefined && (
                      <div className="space-y-2">
                        <Label>Passphrase</Label>
                        <Input 
                          type="password" 
                          value={account.passphrase}
                          onChange={(e) => updateExchangeAccount(account.id, { passphrase: e.target.value })}
                          placeholder="Enter Passphrase" 
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Endpoint</Label>
                      <Input 
                        value={account.endpoint}
                        onChange={(e) => updateExchangeAccount(account.id, { endpoint: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-6">
                      <Switch 
                        id={`${account.id}-testnet`}
                        checked={account.testnet}
                        onCheckedChange={(checked) => updateExchangeAccount(account.id, { testnet: checked })}
                      />
                      <Label htmlFor={`${account.id}-testnet`}>Testnet</Label>
                      <Switch 
                        id={`${account.id}-enabled`}
                        checked={account.enabled}
                        onCheckedChange={(checked) => updateExchangeAccount(account.id, { enabled: checked })}
                      />
                      <Label htmlFor={`${account.id}-enabled`}>Enabled</Label>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeExchangeAccount(account.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Account
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

            <div className="flex flex-wrap gap-2 pt-4">
              {['Binance', 'Bybit', 'OKX', 'KuCoin', 'Bitget', 'MEXC', 'Kraken', 'BingX', 'Deribit', 'Phemex'].map(exchange => (
                <Button 
                  key={exchange}
                  variant="outline" 
                  size="sm"
                  onClick={() => addExchangeAccount(exchange, 'futures')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {exchange}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Multi-Account MetaTrader Configuration */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">MetaTrader Accounts</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure multiple MetaTrader 4 and MetaTrader 5 accounts
        </p>
        
        <Tabs defaultValue="mt5" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="mt4" className="text-sm">MetaTrader 4 ({mt4Accounts.length})</TabsTrigger>
            <TabsTrigger value="mt5" className="text-sm">MetaTrader 5 ({mt5Accounts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="mt4" className="space-y-4">
            <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20 mb-4">
              <span className="text-sm font-semibold text-blue-400">MetaTrader 4 Accounts</span>
              <p className="text-xs text-muted-foreground mt-1">Legacy platform - widely supported by brokers</p>
            </div>

            {mt4Accounts.map(account => (
              <Collapsible key={account.id}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📊</span>
                    <div className="text-left">
                      <span className="font-semibold text-foreground">{account.name}</span>
                      <p className="text-xs text-muted-foreground">{account.broker || 'No broker set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {account.enabled && <Badge className="bg-success text-success-foreground">Active</Badge>}
                    <Badge variant="outline" className="border-blue-400 text-blue-400">{account.accountType}</Badge>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Name</Label>
                      <Input 
                        value={account.name}
                        onChange={(e) => updateMTAccount('mt4', account.id, { name: e.target.value })}
                        placeholder="Account Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Server Address</Label>
                      <Input 
                        value={account.server}
                        onChange={(e) => updateMTAccount('mt4', account.id, { server: e.target.value })}
                        placeholder="broker-mt4.server.com:443" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Login ID</Label>
                      <Input 
                        type="number"
                        value={account.login}
                        onChange={(e) => updateMTAccount('mt4', account.id, { login: e.target.value })}
                        placeholder="12345678" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input 
                        type="password"
                        value={account.password}
                        onChange={(e) => updateMTAccount('mt4', account.id, { password: e.target.value })}
                        placeholder="••••••••" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <select 
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                        value={account.accountType}
                        onChange={(e) => updateMTAccount('mt4', account.id, { accountType: e.target.value as 'demo' | 'real' })}
                      >
                        <option value="demo">Demo</option>
                        <option value="real">Real</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Broker Name</Label>
                      <Input 
                        value={account.broker}
                        onChange={(e) => updateMTAccount('mt4', account.id, { broker: e.target.value })}
                        placeholder="e.g., IC Markets, FXCM" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Connection Timeout (ms)</Label>
                      <Input 
                        type="number"
                        value={account.timeout}
                        onChange={(e) => updateMTAccount('mt4', account.id, { timeout: parseInt(e.target.value) || 30000 })}
                        placeholder="30000" 
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-6">
                      <Switch 
                        id={`${account.id}-enabled`}
                        checked={account.enabled}
                        onCheckedChange={(checked) => updateMTAccount('mt4', account.id, { enabled: checked })}
                      />
                      <Label htmlFor={`${account.id}-enabled`}>Enabled</Label>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeMTAccount('mt4', account.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Account
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

            <Button variant="outline" onClick={() => addMTAccount('mt4')}>
              <Plus className="w-4 h-4 mr-2" />
              Add MT4 Account
            </Button>
          </TabsContent>

          <TabsContent value="mt5" className="space-y-4">
            <div className="p-3 rounded bg-purple-500/10 border border-purple-500/20 mb-4">
              <span className="text-sm font-semibold text-purple-400">MetaTrader 5 Accounts</span>
              <p className="text-xs text-muted-foreground mt-1">Modern platform with multi-asset support</p>
            </div>

            {mt5Accounts.map(account => (
              <Collapsible key={account.id}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📈</span>
                    <div className="text-left">
                      <span className="font-semibold text-foreground">{account.name}</span>
                      <p className="text-xs text-muted-foreground">{account.broker || 'No broker set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {account.enabled && <Badge className="bg-success text-success-foreground">Active</Badge>}
                    <Badge variant="outline" className="border-purple-400 text-purple-400">{account.accountType}</Badge>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border border-t-0 border-border rounded-b-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Name</Label>
                      <Input 
                        value={account.name}
                        onChange={(e) => updateMTAccount('mt5', account.id, { name: e.target.value })}
                        placeholder="Account Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Server Address</Label>
                      <Input 
                        value={account.server}
                        onChange={(e) => updateMTAccount('mt5', account.id, { server: e.target.value })}
                        placeholder="broker-mt5.server.com:443" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Login ID</Label>
                      <Input 
                        type="number"
                        value={account.login}
                        onChange={(e) => updateMTAccount('mt5', account.id, { login: e.target.value })}
                        placeholder="12345678" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input 
                        type="password"
                        value={account.password}
                        onChange={(e) => updateMTAccount('mt5', account.id, { password: e.target.value })}
                        placeholder="••••••••" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <select 
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                        value={account.accountType}
                        onChange={(e) => updateMTAccount('mt5', account.id, { accountType: e.target.value as 'demo' | 'real' })}
                      >
                        <option value="demo">Demo</option>
                        <option value="real">Real</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Broker Name</Label>
                      <Input 
                        value={account.broker}
                        onChange={(e) => updateMTAccount('mt5', account.id, { broker: e.target.value })}
                        placeholder="e.g., Pepperstone, XM" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Connection Timeout (ms)</Label>
                      <Input 
                        type="number"
                        value={account.timeout}
                        onChange={(e) => updateMTAccount('mt5', account.id, { timeout: parseInt(e.target.value) || 30000 })}
                        placeholder="30000" 
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-6">
                      <Switch 
                        id={`${account.id}-enabled`}
                        checked={account.enabled}
                        onCheckedChange={(checked) => updateMTAccount('mt5', account.id, { enabled: checked })}
                      />
                      <Label htmlFor={`${account.id}-enabled`}>Enabled</Label>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeMTAccount('mt5', account.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Account
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

            <Button variant="outline" onClick={() => addMTAccount('mt5')}>
              <Plus className="w-4 h-4 mr-2" />
              Add MT5 Account
            </Button>
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">FIX Protocol Connector</h2>
        <FixConnectorManager />
      </Card>

      {/* Real-Time Connection Status with Auto-Reconnect */}
      <ConnectionStatusPanel 
        mt4Accounts={mt4Accounts}
        mt5Accounts={mt5Accounts}
        exchangeAccounts={exchangeAccounts}
      />

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
            <Label className="text-foreground">Symbol</Label>
            <Input
              placeholder="e.g., BTCUSDT"
              value={newInstrument.symbol}
              onChange={(e) => setNewInstrument({ ...newInstrument, symbol: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Name</Label>
            <Input
              placeholder="e.g., Bitcoin/Tether"
              value={newInstrument.name}
              onChange={(e) => setNewInstrument({ ...newInstrument, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Category (Optional)</Label>
            <Input
              placeholder="e.g., Major, Altcoin"
              value={newInstrument.category}
              onChange={(e) => setNewInstrument({ ...newInstrument, category: e.target.value })}
            />
          </div>
          <Button onClick={addCustomInstrument} className="h-10">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </Card>

      {/* Trading Instruments */}
      <Card className="p-6 border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Trading Instruments</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search instruments..."
              value={instrumentSearch}
              onChange={(e) => setInstrumentSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>

        <Tabs value={activeInstrumentTab} onValueChange={(v) => setActiveInstrumentTab(v as InstrumentCategory)}>
          <TabsList className="mb-4">
            <TabsTrigger value="forex">Forex</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
            <TabsTrigger value="indices">Indices</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="bonds">Bonds</TabsTrigger>
          </TabsList>

          {(Object.keys(instruments) as InstrumentCategory[]).map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredInstruments(category).map((instrument) => (
                  <div
                    key={instrument.symbol}
                    className="flex items-center justify-between p-3 rounded bg-secondary/50 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={instrument.enabled}
                        onCheckedChange={() => toggleInstrument(category, instrument.symbol)}
                      />
                      <div>
                        <span className="font-mono text-sm text-foreground">{instrument.symbol}</span>
                        <p className="text-xs text-muted-foreground">{instrument.name}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeInstrument(category, instrument.symbol)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Backup & Restore Settings */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Backup & Restore Settings</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Export your settings for backup or import previously saved configurations
        </p>
        
        <div className="flex gap-4">
          <Button onClick={handleExportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
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
            <li>• Account configurations (excluding sensitive API keys)</li>
            <li>• FIX Protocol connector configurations</li>
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

// Connection Status Panel Component with Auto-Reconnect
type ConnectionStatus = 'connected' | 'disconnected' | 'testing' | 'error' | 'reconnecting';

interface Connection {
  id: string;
  name: string;
  category: string;
  status: ConnectionStatus;
  lastCheck: Date | null;
  latency: number | null;
  autoReconnect: boolean;
  retryCount: number;
  maxRetries: number;
  retryInterval: number;
  nextRetry: Date | null;
}

interface ConnectionStatusPanelProps {
  mt4Accounts: MTAccount[];
  mt5Accounts: MTAccount[];
  exchangeAccounts: ExchangeAccount[];
}

const ConnectionStatusPanel = ({ mt4Accounts, mt5Accounts, exchangeAccounts }: ConnectionStatusPanelProps) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [testing, setTesting] = useState<string | null>(null);
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [globalAutoReconnect, setGlobalAutoReconnect] = useState(true);
  const [defaultRetryInterval, setDefaultRetryInterval] = useState(30);
  const [defaultMaxRetries, setDefaultMaxRetries] = useState(5);

  // Initialize connections from accounts
  useEffect(() => {
    const mtConnections: Connection[] = [
      ...mt4Accounts.filter(a => a.enabled).map(a => ({
        id: a.id,
        name: a.name,
        category: 'metatrader',
        status: 'disconnected' as ConnectionStatus,
        lastCheck: null,
        latency: null,
        autoReconnect: true,
        retryCount: 0,
        maxRetries: defaultMaxRetries,
        retryInterval: defaultRetryInterval,
        nextRetry: null,
      })),
      ...mt5Accounts.filter(a => a.enabled).map(a => ({
        id: a.id,
        name: a.name,
        category: 'metatrader',
        status: 'disconnected' as ConnectionStatus,
        lastCheck: null,
        latency: null,
        autoReconnect: true,
        retryCount: 0,
        maxRetries: defaultMaxRetries,
        retryInterval: defaultRetryInterval,
        nextRetry: null,
      })),
    ];

    const exchangeConns: Connection[] = exchangeAccounts.filter(a => a.enabled).map(a => ({
      id: a.id,
      name: a.name,
      category: 'exchange',
      status: 'disconnected' as ConnectionStatus,
      lastCheck: null,
      latency: null,
      autoReconnect: true,
      retryCount: 0,
      maxRetries: defaultMaxRetries,
      retryInterval: defaultRetryInterval,
      nextRetry: null,
    }));

    const fixConn: Connection = {
      id: 'fix-primary',
      name: 'FIX Primary',
      category: 'fix',
      status: 'disconnected',
      lastCheck: null,
      latency: null,
      autoReconnect: true,
      retryCount: 0,
      maxRetries: defaultMaxRetries,
      retryInterval: defaultRetryInterval,
      nextRetry: null,
    };

    setConnections([...mtConnections, ...exchangeConns, fixConn]);
  }, [mt4Accounts, mt5Accounts, exchangeAccounts, defaultMaxRetries, defaultRetryInterval]);

  // Auto-reconnect logic
  useEffect(() => {
    if (!globalAutoReconnect) return;

    const interval = setInterval(() => {
      const now = new Date();
      setConnections(prev => prev.map(conn => {
        if (
          conn.autoReconnect && 
          (conn.status === 'error' || conn.status === 'disconnected') && 
          conn.retryCount < conn.maxRetries &&
          conn.nextRetry &&
          now >= conn.nextRetry
        ) {
          // Trigger reconnection
          simulateReconnect(conn.id);
        }
        return conn;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [globalAutoReconnect]);

  const simulateReconnect = useCallback((id: string) => {
    setConnections(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'reconnecting' as const } : c
    ));

    setTimeout(() => {
      const success = Math.random() > 0.4;
      const latency = success ? Math.floor(Math.random() * 100) + 20 : null;
      
      setConnections(prev => prev.map(c => {
        if (c.id !== id) return c;
        
        if (success) {
          toast.success(`${c.name} reconnected successfully`);
          return { 
            ...c, 
            status: 'connected' as const, 
            lastCheck: new Date(),
            latency,
            retryCount: 0,
            nextRetry: null
          };
        } else {
          const newRetryCount = c.retryCount + 1;
          const nextRetry = newRetryCount < c.maxRetries 
            ? new Date(Date.now() + c.retryInterval * 1000)
            : null;
          
          if (newRetryCount >= c.maxRetries) {
            toast.error(`${c.name} max retries reached. Manual intervention required.`);
          }
          
          return { 
            ...c, 
            status: 'error' as const, 
            lastCheck: new Date(),
            latency: null,
            retryCount: newRetryCount,
            nextRetry
          };
        }
      }));
    }, 2000);
  }, []);

  const testConnection = (id: string) => {
    setTesting(id);
    setConnections(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'testing' as const } : c
    ));

    setTimeout(() => {
      const success = Math.random() > 0.3;
      const latency = success ? Math.floor(Math.random() * 100) + 20 : null;
      setConnections(prev => prev.map(c => {
        if (c.id !== id) return c;
        
        if (success) {
          return { 
            ...c, 
            status: 'connected' as const, 
            lastCheck: new Date(),
            latency,
            retryCount: 0,
            nextRetry: null
          };
        } else {
          const nextRetry = c.autoReconnect && globalAutoReconnect
            ? new Date(Date.now() + c.retryInterval * 1000)
            : null;
          return { 
            ...c, 
            status: 'error' as const, 
            lastCheck: new Date(),
            latency: null,
            nextRetry
          };
        }
      }));
      setTesting(null);
      
      const conn = connections.find(c => c.id === id);
      if (success) {
        toast.success(`${conn?.name} connected successfully`);
      } else {
        toast.error(`Failed to connect to ${conn?.name}`);
      }
    }, 1500);
  };

  const toggleAutoReconnect = (id: string) => {
    setConnections(prev => prev.map(c => 
      c.id === id ? { ...c, autoReconnect: !c.autoReconnect } : c
    ));
  };

  const updateRetrySettings = (id: string, settings: { retryInterval?: number; maxRetries?: number }) => {
    setConnections(prev => prev.map(c => 
      c.id === id ? { ...c, ...settings } : c
    ));
  };

  const refreshAllConnections = () => {
    setRefreshingAll(true);
    const enabledIds = connections.map(c => c.id);
    
    enabledIds.forEach((id, index) => {
      setTimeout(() => {
        testConnection(id);
      }, index * 500);
    });

    setTimeout(() => {
      setRefreshingAll(false);
      toast.success('Connection status refreshed');
    }, enabledIds.length * 500 + 1000);
  };

  const resetRetryCount = (id: string) => {
    setConnections(prev => prev.map(c => 
      c.id === id ? { 
        ...c, 
        retryCount: 0, 
        nextRetry: new Date(Date.now() + c.retryInterval * 1000) 
      } : c
    ));
    toast.info('Retry counter reset');
  };

  const getStatusIcon = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-muted-foreground" />;
      case 'testing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'reconnecting':
        return <RotateCcw className="w-4 h-4 text-warning animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <AlertCircle className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusBadge = (conn: Connection) => {
    switch (conn.status) {
      case 'connected':
        return (
          <Badge variant="outline" className="border-success text-success bg-success/10">
            <Wifi className="w-3 h-3 mr-1" />
            Connected {conn.latency && `(${conn.latency}ms)`}
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
            <WifiOff className="w-3 h-3 mr-1" />
            Disconnected
          </Badge>
        );
      case 'testing':
        return (
          <Badge variant="outline" className="border-primary text-primary">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Testing...
          </Badge>
        );
      case 'reconnecting':
        return (
          <Badge variant="outline" className="border-warning text-warning bg-warning/10">
            <RotateCcw className="w-3 h-3 mr-1 animate-spin" />
            Reconnecting... ({conn.retryCount}/{conn.maxRetries})
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="border-destructive text-destructive bg-destructive/10">
            <XCircle className="w-3 h-3 mr-1" />
            Error {conn.autoReconnect && conn.retryCount < conn.maxRetries && `(retry ${conn.retryCount}/${conn.maxRetries})`}
          </Badge>
        );
      default:
        return null;
    }
  };

  const metatraderConnections = connections.filter(c => c.category === 'metatrader');
  const exchangeConnections = connections.filter(c => c.category === 'exchange');
  const fixConnections = connections.filter(c => c.category === 'fix');

  const connectedCount = connections.filter(c => c.status === 'connected').length;
  const totalCount = connections.length;

  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Real-Time Connection Status</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {connectedCount} of {totalCount} connections active
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch 
              id="global-auto-reconnect"
              checked={globalAutoReconnect}
              onCheckedChange={setGlobalAutoReconnect}
            />
            <Label htmlFor="global-auto-reconnect" className="text-sm flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Auto-Reconnect
            </Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAllConnections}
            disabled={refreshingAll}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshingAll ? 'animate-spin' : ''}`} />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Global Retry Settings */}
      {globalAutoReconnect && (
        <div className="mb-6 p-4 rounded-lg bg-secondary/50 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Default Retry Settings
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Retry Interval (seconds)</Label>
              <Input 
                type="number"
                min="5"
                max="300"
                value={defaultRetryInterval}
                onChange={(e) => setDefaultRetryInterval(parseInt(e.target.value) || 30)}
                className="h-8"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Max Retries</Label>
              <Input 
                type="number"
                min="1"
                max="20"
                value={defaultMaxRetries}
                onChange={(e) => setDefaultMaxRetries(parseInt(e.target.value) || 5)}
                className="h-8"
              />
            </div>
          </div>
        </div>
      )}

      {/* MetaTrader Section */}
      {metatraderConnections.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            MetaTrader ({metatraderConnections.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metatraderConnections.map(conn => (
              <div key={conn.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(conn.status)}
                    <div>
                      <span className="text-foreground font-medium text-sm">{conn.name}</span>
                      {conn.lastCheck && (
                        <p className="text-xs text-muted-foreground">
                          Last: {conn.lastCheck.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(conn)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => testConnection(conn.id)}
                      disabled={testing === conn.id || conn.status === 'reconnecting'}
                    >
                      {testing === conn.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {conn.status === 'error' && conn.autoReconnect && conn.nextRetry && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Next retry: {Math.max(0, Math.ceil((conn.nextRetry.getTime() - Date.now()) / 1000))}s
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => resetRetryCount(conn.id)}>
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exchange Section */}
      {exchangeConnections.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            Crypto Exchanges ({exchangeConnections.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {exchangeConnections.map(conn => (
              <div key={conn.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(conn.status)}
                    <div>
                      <span className="text-foreground font-medium text-sm">{conn.name}</span>
                      {conn.latency && (
                        <p className="text-xs text-muted-foreground">
                          {conn.latency}ms
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => testConnection(conn.id)}
                    disabled={testing === conn.id || conn.status === 'reconnecting'}
                  >
                    {testing === conn.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {conn.status === 'error' && conn.autoReconnect && conn.nextRetry && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Retry in {Math.max(0, Math.ceil((conn.nextRetry.getTime() - Date.now()) / 1000))}s
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => resetRetryCount(conn.id)}>
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FIX Section */}
      {fixConnections.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            FIX Protocol
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fixConnections.map(conn => (
              <div key={conn.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(conn.status)}
                    <div>
                      <span className="text-foreground font-medium text-sm">{conn.name}</span>
                      {conn.lastCheck && (
                        <p className="text-xs text-muted-foreground">
                          Last: {conn.lastCheck.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(conn)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => testConnection(conn.id)}
                      disabled={testing === conn.id || conn.status === 'reconnecting'}
                    >
                      {testing === conn.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {conn.status === 'error' && conn.autoReconnect && conn.nextRetry && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Next retry: {Math.max(0, Math.ceil((conn.nextRetry.getTime() - Date.now()) / 1000))}s
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => resetRetryCount(conn.id)}>
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {connections.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <WifiOff className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No enabled accounts to monitor</p>
          <p className="text-sm">Enable accounts in the sections above to see connection status</p>
        </div>
      )}
    </Card>
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

export default Settings;
