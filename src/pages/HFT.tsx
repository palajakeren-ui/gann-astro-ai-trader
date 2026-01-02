import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Activity, 
  Settings, 
  Play, 
  Pause, 
  BarChart3, 
  Clock, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Server,
  Cpu,
  Network,
  TestTube
} from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { BacktestSimulator } from "@/components/hft/BacktestSimulator";
// Generate mock latency data
const generateLatencyData = () => {
  return Array.from({ length: 60 }, (_, i) => ({
    time: i,
    latency: 0.5 + Math.random() * 2,
    orderLatency: 1 + Math.random() * 3,
    marketData: 0.3 + Math.random() * 1,
  }));
};

// Generate mock P&L data
const generatePnLData = () => {
  let pnl = 0;
  return Array.from({ length: 100 }, (_, i) => {
    pnl += (Math.random() - 0.48) * 50;
    return {
      trade: i + 1,
      pnl: pnl,
      cumulative: pnl,
    };
  });
};

const HFT = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("market-making");
  
  // HFT Configuration State
  const [config, setConfig] = useState({
    // General
    enabled: false,
    maxOrdersPerSecond: 100,
    maxPositionSize: 10,
    riskLimitPerTrade: 0.1,
    
    // Latency
    targetLatency: 1.0, // ms
    maxLatency: 5.0, // ms
    coLocation: true,
    directMarketAccess: true,
    
    // Market Making
    spreadBps: 2.0,
    inventoryLimit: 5,
    quoteSize: 0.1,
    refreshRate: 100, // ms
    
    // Arbitrage
    minSpreadArb: 0.05,
    maxSlippage: 0.02,
    
    // Momentum
    signalThreshold: 0.8,
    holdPeriod: 500, // ms

    // Risk Management
    riskMode: "dynamic" as "dynamic" | "fixed",
    // Dynamic Risk
    kellyFraction: 0.25,
    volatilityAdjusted: true,
    maxDailyDrawdown: 5.0,
    dynamicPositionScaling: true,
    // Fixed Risk
    fixedRiskPercent: 1.0,
    fixedLotSize: 0.1,
    fixedStopLoss: 50,
    fixedTakeProfit: 100,

    // Instrument Configuration
    instrumentMode: "single" as "single" | "multi",
    selectedInstruments: ["BTCUSDT"] as string[],

    // Strategy Settings
    useGannStrategy: false,
    useEhlersStrategy: false,
    gannAngle: 45,
    gannTimeUnit: 1,
    ehlersFilterPeriod: 20,
    ehlersBandwidth: 0.3,
  });

  const availableInstruments = [
    "BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT", 
    "DOGEUSDT", "SOLUSDT", "DOTUSDT", "MATICUSDT", "LTCUSDT"
  ];

  const latencyData = generateLatencyData();
  const pnlData = generatePnLData();

  // Mock statistics
  const stats = {
    ordersToday: 125840,
    tradesExecuted: 8542,
    winRate: 52.3,
    avgLatency: 1.2,
    pnlToday: 2845.50,
    sharpeRatio: 2.4,
    maxDrawdown: 1.2,
    uptimePercent: 99.97,
  };

  // Active positions
  const positions = [
    { symbol: "BTCUSDT", side: "LONG", size: 0.5, entry: 47250, pnl: 125, latency: 0.8 },
    { symbol: "ETHUSDT", side: "SHORT", size: 2.0, entry: 2480, pnl: -32, latency: 1.1 },
    { symbol: "BNBUSDT", side: "LONG", size: 5.0, entry: 310, pnl: 45, latency: 0.6 },
  ];

  // Order book simulation
  const orderBook = {
    bids: [
      { price: 47500, size: 2.5, orders: 15 },
      { price: 47498, size: 1.8, orders: 12 },
      { price: 47495, size: 3.2, orders: 22 },
      { price: 47490, size: 5.1, orders: 35 },
    ],
    asks: [
      { price: 47502, size: 2.1, orders: 14 },
      { price: 47505, size: 1.5, orders: 10 },
      { price: 47508, size: 2.8, orders: 18 },
      { price: 47515, size: 4.2, orders: 28 },
    ],
  };

  const strategies = [
    { id: "market-making", name: "Market Making", status: "Active", pnl: 1250, trades: 3245 },
    { id: "arbitrage", name: "Statistical Arbitrage", status: "Active", pnl: 890, trades: 1562 },
    { id: "momentum", name: "Momentum Scalping", status: "Paused", pnl: 420, trades: 892 },
    { id: "mean-reversion", name: "Mean Reversion", status: "Active", pnl: 285, trades: 643 },
    { id: "gann-angles", name: "Gann Angles Strategy", status: config.useGannStrategy ? "Active" : "Inactive", pnl: 560, trades: 428 },
    { id: "ehlers-dsp", name: "Ehlers DSP Filter", status: config.useEhlersStrategy ? "Active" : "Inactive", pnl: 720, trades: 315 },
  ];

  const toggleInstrument = (instrument: string) => {
    setConfig(prev => {
      const current = prev.selectedInstruments;
      if (current.includes(instrument)) {
        return { ...prev, selectedInstruments: current.filter(i => i !== instrument) };
      } else {
        return { ...prev, selectedInstruments: [...current, instrument] };
      }
    });
  };

  const toggleHFT = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      toast.success("HFT Engine started");
    } else {
      toast.info("HFT Engine stopped");
    }
  };

  const updateConfig = (key: string, value: number | boolean | string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-accent" />
            High Frequency Trading
          </h1>
          <p className="text-sm text-muted-foreground">Ultra-low latency trading infrastructure</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={isRunning ? "border-success text-success" : "border-muted-foreground"}>
            <Activity className={`w-3 h-3 mr-1 ${isRunning ? 'animate-pulse' : ''}`} />
            {isRunning ? "Running" : "Stopped"}
          </Badge>
          <Badge variant="outline" className="font-mono">
            Latency: {stats.avgLatency}ms
          </Badge>
          <Button 
            onClick={toggleHFT}
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? "Stop HFT" : "Start HFT"}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Orders Today</p>
          <p className="text-lg font-bold text-foreground">{stats.ordersToday.toLocaleString()}</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Trades</p>
          <p className="text-lg font-bold text-foreground">{stats.tradesExecuted.toLocaleString()}</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Win Rate</p>
          <p className="text-lg font-bold text-success">{stats.winRate}%</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Avg Latency</p>
          <p className="text-lg font-bold text-accent">{stats.avgLatency}ms</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">P&L Today</p>
          <p className={`text-lg font-bold ${stats.pnlToday >= 0 ? 'text-success' : 'text-destructive'}`}>
            ${stats.pnlToday.toLocaleString()}
          </p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
          <p className="text-lg font-bold text-foreground">{stats.sharpeRatio}</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Max DD</p>
          <p className="text-lg font-bold text-destructive">{stats.maxDrawdown}%</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Uptime</p>
          <p className="text-lg font-bold text-success">{stats.uptimePercent}%</p>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-6 md:w-auto md:inline-grid">
          <TabsTrigger value="dashboard" className="text-xs md:text-sm">Dashboard</TabsTrigger>
          <TabsTrigger value="strategies" className="text-xs md:text-sm">Strategies</TabsTrigger>
          <TabsTrigger value="orderbook" className="text-xs md:text-sm">Order Book</TabsTrigger>
          <TabsTrigger value="config" className="text-xs md:text-sm">Configuration</TabsTrigger>
          <TabsTrigger value="backtest" className="text-xs md:text-sm">
            <TestTube className="w-3 h-3 mr-1" />
            Backtest
          </TabsTrigger>
          <TabsTrigger value="infrastructure" className="text-xs md:text-sm">Infrastructure</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 border-border bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Latency Monitor (Real-time)
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} unit="ms" />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    <Line type="monotone" dataKey="latency" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Total" />
                    <Line type="monotone" dataKey="orderLatency" stroke="hsl(var(--destructive))" strokeWidth={1.5} dot={false} name="Order" />
                    <Line type="monotone" dataKey="marketData" stroke="hsl(var(--success))" strokeWidth={1.5} dot={false} name="Market Data" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 border-border bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-success" />
                Cumulative P&L
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pnlData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="trade" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    <Area type="monotone" dataKey="cumulative" fill="hsl(var(--success))" fillOpacity={0.2} stroke="hsl(var(--success))" strokeWidth={2} name="P&L" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Active Positions */}
          <Card className="p-4 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Active Positions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-foreground">Symbol</th>
                    <th className="px-4 py-2 text-left text-foreground">Side</th>
                    <th className="px-4 py-2 text-right text-foreground">Size</th>
                    <th className="px-4 py-2 text-right text-foreground">Entry</th>
                    <th className="px-4 py-2 text-right text-foreground">P&L</th>
                    <th className="px-4 py-2 text-right text-foreground">Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-card" : "bg-secondary/20"}>
                      <td className="px-4 py-2 font-semibold text-foreground">{pos.symbol}</td>
                      <td className="px-4 py-2">
                        <Badge className={pos.side === "LONG" ? "bg-success" : "bg-destructive"}>
                          {pos.side}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-foreground">{pos.size}</td>
                      <td className="px-4 py-2 text-right font-mono text-foreground">${pos.entry.toLocaleString()}</td>
                      <td className={`px-4 py-2 text-right font-mono ${pos.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {pos.pnl >= 0 ? '+' : ''}{pos.pnl}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-accent">{pos.latency}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Strategies Tab */}
        <TabsContent value="strategies" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategies.map((strategy, idx) => (
              <Card key={idx} className={`p-4 border-border bg-card ${selectedStrategy === strategy.id ? 'ring-2 ring-primary' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{strategy.name}</h4>
                    <Badge variant="outline" className={
                      strategy.status === "Active" ? "border-success text-success" : "border-muted-foreground"
                    }>
                      {strategy.status}
                    </Badge>
                  </div>
                  <Button 
                    variant={selectedStrategy === strategy.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStrategy(strategy.id)}
                  >
                    {selectedStrategy === strategy.id ? "Selected" : "Select"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-2 bg-secondary/50 rounded">
                    <p className="text-xs text-muted-foreground">P&L</p>
                    <p className={`font-bold ${strategy.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                      ${strategy.pnl.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 bg-secondary/50 rounded">
                    <p className="text-xs text-muted-foreground">Trades</p>
                    <p className="font-bold text-foreground">{strategy.trades.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Order Book Tab */}
        <TabsContent value="orderbook" className="space-y-4 mt-4">
          <Card className="p-4 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Level 2 Order Book - BTCUSDT
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-success mb-2">Bids</h4>
                <div className="space-y-1">
                  {orderBook.bids.map((bid, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-success/10 rounded relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 bg-success/20" style={{ width: `${(bid.size / 6) * 100}%` }} />
                      <span className="font-mono text-sm text-success z-10">${bid.price.toLocaleString()}</span>
                      <span className="font-mono text-sm text-foreground z-10">{bid.size}</span>
                      <span className="text-xs text-muted-foreground z-10">{bid.orders} orders</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-destructive mb-2">Asks</h4>
                <div className="space-y-1">
                  {orderBook.asks.map((ask, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-destructive/10 rounded relative overflow-hidden">
                      <div className="absolute right-0 top-0 bottom-0 bg-destructive/20" style={{ width: `${(ask.size / 5) * 100}%` }} />
                      <span className="font-mono text-sm text-destructive z-10">${ask.price.toLocaleString()}</span>
                      <span className="font-mono text-sm text-foreground z-10">{ask.size}</span>
                      <span className="text-xs text-muted-foreground z-10">{ask.orders} orders</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-4 mt-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
              <TabsTrigger value="risk" className="text-xs">Risk Mgmt</TabsTrigger>
              <TabsTrigger value="instruments" className="text-xs">Instruments</TabsTrigger>
              <TabsTrigger value="strategies" className="text-xs">Strategies</TabsTrigger>
              <TabsTrigger value="latency" className="text-xs">Latency</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 border-border bg-card">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    General Settings
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Enable HFT</Label>
                      <Switch checked={config.enabled} onCheckedChange={(v) => updateConfig("enabled", v)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Max Orders/Second</Label>
                      <Input 
                        type="number" 
                        value={config.maxOrdersPerSecond}
                        onChange={(e) => updateConfig("maxOrdersPerSecond", parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Max Position Size</Label>
                      <Input 
                        type="number" 
                        value={config.maxPositionSize}
                        onChange={(e) => updateConfig("maxPositionSize", parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-border bg-card">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-success" />
                    Market Making
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Spread (bps)</Label>
                      <Input 
                        type="number" 
                        step="0.1"
                        value={config.spreadBps}
                        onChange={(e) => updateConfig("spreadBps", parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Inventory Limit</Label>
                      <Input 
                        type="number" 
                        value={config.inventoryLimit}
                        onChange={(e) => updateConfig("inventoryLimit", parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Quote Size</Label>
                      <Input 
                        type="number" 
                        step="0.01"
                        value={config.quoteSize}
                        onChange={(e) => updateConfig("quoteSize", parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Refresh Rate (ms)</Label>
                      <Input 
                        type="number" 
                        value={config.refreshRate}
                        onChange={(e) => updateConfig("refreshRate", parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Risk Management */}
            <TabsContent value="risk" className="mt-4">
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant={config.riskMode === "dynamic" ? "default" : "outline"}
                    onClick={() => updateConfig("riskMode", "dynamic")}
                    className="flex-1"
                  >
                    Dynamic Risk
                  </Button>
                  <Button 
                    variant={config.riskMode === "fixed" ? "default" : "outline"}
                    onClick={() => updateConfig("riskMode", "fixed")}
                    className="flex-1"
                  >
                    Fixed Risk
                  </Button>
                </div>

                {config.riskMode === "dynamic" ? (
                  <Card className="p-4 border-border bg-card">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      Dynamic Risk Management
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-foreground text-sm">Kelly Fraction</Label>
                          <Input 
                            type="number" 
                            step="0.01"
                            value={config.kellyFraction}
                            onChange={(e) => updateConfig("kellyFraction", parseFloat(e.target.value))}
                          />
                          <p className="text-xs text-muted-foreground">Optimal: 0.25 (Quarter Kelly)</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-foreground text-sm">Volatility Adjusted</Label>
                          <Switch 
                            checked={config.volatilityAdjusted} 
                            onCheckedChange={(v) => updateConfig("volatilityAdjusted", v)} 
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-foreground text-sm">Max Daily Drawdown (%)</Label>
                          <Input 
                            type="number" 
                            step="0.1"
                            value={config.maxDailyDrawdown}
                            onChange={(e) => updateConfig("maxDailyDrawdown", parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-foreground text-sm">Dynamic Position Scaling</Label>
                          <Switch 
                            checked={config.dynamicPositionScaling} 
                            onCheckedChange={(v) => updateConfig("dynamicPositionScaling", v)} 
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-4 border-border bg-card">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-primary" />
                      Fixed Risk Management
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-foreground text-sm">Fixed Risk per Trade (%)</Label>
                          <Input 
                            type="number" 
                            step="0.1"
                            value={config.fixedRiskPercent}
                            onChange={(e) => updateConfig("fixedRiskPercent", parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground text-sm">Fixed Lot Size (Open Position)</Label>
                          <Input 
                            type="number" 
                            step="0.01"
                            value={config.fixedLotSize}
                            onChange={(e) => updateConfig("fixedLotSize", parseFloat(e.target.value))}
                          />
                          <p className="text-xs text-muted-foreground">Lot size untuk buka posisi</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-foreground text-sm">Fixed Stop Loss (pips/points)</Label>
                          <Input 
                            type="number" 
                            value={config.fixedStopLoss}
                            onChange={(e) => updateConfig("fixedStopLoss", parseInt(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground text-sm">Fixed Take Profit (pips/points)</Label>
                          <Input 
                            type="number" 
                            value={config.fixedTakeProfit}
                            onChange={(e) => updateConfig("fixedTakeProfit", parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Instruments Configuration */}
            <TabsContent value="instruments" className="mt-4">
              <Card className="p-4 border-border bg-card">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-accent" />
                  Instrument Trading Mode
                </h4>
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button 
                      variant={config.instrumentMode === "single" ? "default" : "outline"}
                      onClick={() => updateConfig("instrumentMode", "single")}
                      className="flex-1"
                    >
                      Single Instrument
                    </Button>
                    <Button 
                      variant={config.instrumentMode === "multi" ? "default" : "outline"}
                      onClick={() => updateConfig("instrumentMode", "multi")}
                      className="flex-1"
                    >
                      Multi Instrument
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {availableInstruments.map((instrument) => (
                      <Button
                        key={instrument}
                        variant={config.selectedInstruments.includes(instrument) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (config.instrumentMode === "single") {
                            setConfig(prev => ({ ...prev, selectedInstruments: [instrument] }));
                          } else {
                            toggleInstrument(instrument);
                          }
                        }}
                        className="text-xs"
                      >
                        {instrument}
                      </Button>
                    ))}
                  </div>

                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Active Instruments: <span className="text-foreground font-semibold">{config.selectedInstruments.join(", ")}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {config.instrumentMode === "single" 
                        ? "Mode: Single - Hanya satu instrumen aktif" 
                        : "Mode: Multi - Beberapa instrumen bisa aktif bersamaan"}
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Strategy Settings */}
            <TabsContent value="strategies" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 border-border bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      Gann Strategy
                    </h4>
                    <Switch 
                      checked={config.useGannStrategy} 
                      onCheckedChange={(v) => updateConfig("useGannStrategy", v)} 
                    />
                  </div>
                  <div className={`space-y-4 ${!config.useGannStrategy && 'opacity-50'}`}>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Gann Angle (°)</Label>
                      <Input 
                        type="number" 
                        value={config.gannAngle}
                        onChange={(e) => updateConfig("gannAngle", parseInt(e.target.value))}
                        disabled={!config.useGannStrategy}
                      />
                      <p className="text-xs text-muted-foreground">1x1 = 45°, 2x1 = 63.75°, 1x2 = 26.25°</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Time Unit</Label>
                      <Input 
                        type="number" 
                        step="0.1"
                        value={config.gannTimeUnit}
                        onChange={(e) => updateConfig("gannTimeUnit", parseFloat(e.target.value))}
                        disabled={!config.useGannStrategy}
                      />
                    </div>
                    <div className="p-2 bg-secondary/50 rounded text-xs text-muted-foreground">
                      Gann menggunakan price-time squares untuk prediksi support/resistance dan time cycles.
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-border bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Ehlers DSP Strategy
                    </h4>
                    <Switch 
                      checked={config.useEhlersStrategy} 
                      onCheckedChange={(v) => updateConfig("useEhlersStrategy", v)} 
                    />
                  </div>
                  <div className={`space-y-4 ${!config.useEhlersStrategy && 'opacity-50'}`}>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Filter Period</Label>
                      <Input 
                        type="number" 
                        value={config.ehlersFilterPeriod}
                        onChange={(e) => updateConfig("ehlersFilterPeriod", parseInt(e.target.value))}
                        disabled={!config.useEhlersStrategy}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Bandwidth</Label>
                      <Input 
                        type="number" 
                        step="0.1"
                        value={config.ehlersBandwidth}
                        onChange={(e) => updateConfig("ehlersBandwidth", parseFloat(e.target.value))}
                        disabled={!config.useEhlersStrategy}
                      />
                    </div>
                    <div className="p-2 bg-secondary/50 rounded text-xs text-muted-foreground">
                      Ehlers DSP menggunakan digital signal processing untuk filtering noise dan deteksi cycle.
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Latency Settings */}
            <TabsContent value="latency" className="mt-4">
              <Card className="p-4 border-border bg-card">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  Latency Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Target Latency (ms)</Label>
                      <Input 
                        type="number" 
                        step="0.1"
                        value={config.targetLatency}
                        onChange={(e) => updateConfig("targetLatency", parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Max Latency (ms)</Label>
                      <Input 
                        type="number" 
                        step="0.1"
                        value={config.maxLatency}
                        onChange={(e) => updateConfig("maxLatency", parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground text-sm">Co-Location</Label>
                      <Switch checked={config.coLocation} onCheckedChange={(v) => updateConfig("coLocation", v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground text-sm">Direct Market Access</Label>
                      <Switch checked={config.directMarketAccess} onCheckedChange={(v) => updateConfig("directMarketAccess", v)} />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <Button onClick={() => toast.success("Configuration saved!")} className="w-full md:w-auto mt-4">
            Save Configuration
          </Button>
        </TabsContent>

        {/* Infrastructure Tab */}
        <TabsContent value="infrastructure" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Execution Servers</h4>
              </div>
              <div className="space-y-3">
                {[
                  { name: "NYC-1", status: "Online", latency: 0.3, load: 45 },
                  { name: "LON-1", status: "Online", latency: 0.8, load: 32 },
                  { name: "TYO-1", status: "Online", latency: 1.2, load: 28 },
                  { name: "SIN-1", status: "Standby", latency: 1.5, load: 0 },
                ].map((server, idx) => (
                  <div key={idx} className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{server.name}</span>
                      <Badge variant="outline" className={
                        server.status === "Online" ? "border-success text-success" : "border-muted-foreground"
                      }>
                        {server.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Latency: {server.latency}ms</span>
                      <span>Load: {server.load}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-5 h-5 text-accent" />
                <h4 className="font-semibold text-foreground">Network Status</h4>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Primary Feed", status: "Active", bandwidth: "10 Gbps" },
                  { name: "Backup Feed", status: "Ready", bandwidth: "10 Gbps" },
                  { name: "Order Gateway", status: "Active", bandwidth: "1 Gbps" },
                  { name: "Data Center Link", status: "Active", bandwidth: "100 Gbps" },
                ].map((network, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{network.name}</p>
                      <p className="text-xs text-muted-foreground">{network.bandwidth}</p>
                    </div>
                    <Badge variant="outline" className={
                      network.status === "Active" ? "border-success text-success" : "border-accent text-accent"
                    }>
                      {network.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-success" />
                <h4 className="font-semibold text-foreground">System Resources</h4>
              </div>
              <div className="space-y-4">
                {[
                  { name: "CPU Usage", value: 35, unit: "%" },
                  { name: "Memory Usage", value: 62, unit: "%" },
                  { name: "Network I/O", value: 2.4, unit: "GB/s" },
                  { name: "Disk I/O", value: 450, unit: "MB/s" },
                ].map((resource, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{resource.name}</span>
                      <span className="text-muted-foreground">{resource.value}{resource.unit}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          typeof resource.value === 'number' && resource.value > 80 ? 'bg-destructive' :
                          typeof resource.value === 'number' && resource.value > 60 ? 'bg-accent' : 'bg-success'
                        }`}
                        style={{ width: `${Math.min(resource.value, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-4 border-border bg-card">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-accent" />
              <h4 className="font-semibold text-foreground">System Alerts</h4>
            </div>
            <div className="space-y-2">
              {[
                { time: "10:32:15", type: "INFO", message: "Order gateway reconnected successfully" },
                { time: "10:31:45", type: "WARN", message: "Latency spike detected: 4.2ms" },
                { time: "10:30:00", type: "INFO", message: "Daily risk limit reset completed" },
              ].map((alert, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-secondary/50 rounded text-sm">
                  <span className="text-muted-foreground font-mono">{alert.time}</span>
                  <Badge variant="outline" className={
                    alert.type === "WARN" ? "border-accent text-accent" :
                    alert.type === "ERROR" ? "border-destructive text-destructive" :
                    "border-muted-foreground"
                  }>
                    {alert.type}
                  </Badge>
                  <span className="text-foreground">{alert.message}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Backtest Simulator Tab */}
        <TabsContent value="backtest" className="space-y-4 mt-4">
          <Card className="p-4 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TestTube className="w-5 h-5 text-primary" />
              Backtest Simulator
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Test your risk management configuration and strategies before live trading. 
              Includes all W.D. Gann and Ehlers DSP strategies with manual instrument input.
            </p>
          </Card>
          <BacktestSimulator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HFT;
