import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart } from "recharts";

// Gann Strategies
const GANN_STRATEGIES = [
  { id: "gann-square-9", name: "Gann Square of 9", description: "Spiral price levels from center value" },
  { id: "gann-angles", name: "Gann Angles (1x1, 2x1, etc.)", description: "Time-price relationship angles" },
  { id: "gann-fan", name: "Gann Fan", description: "Multiple angle lines from pivot point" },
  { id: "gann-time-cycles", name: "Gann Time Cycles", description: "Cyclical time-based projections" },
  { id: "gann-support-resistance", name: "Gann Support/Resistance", description: "Pivot-based S/R levels" },
  { id: "gann-fibonacci", name: "Gann Fibonacci Levels", description: "Combined Gann-Fibonacci analysis" },
  { id: "gann-wave", name: "Gann Wave Analysis", description: "Wave structure identification" },
  { id: "gann-hexagon", name: "Gann Hexagon", description: "Geometric hexagon price patterns" },
];

// Ehlers Strategies
const EHLERS_STRATEGIES = [
  { id: "ehlers-mama-fama", name: "MAMA/FAMA", description: "Mesa Adaptive Moving Average" },
  { id: "ehlers-fisher", name: "Fisher Transform", description: "Gaussian price normalization" },
  { id: "ehlers-bandpass", name: "Bandpass Filter", description: "Cyclical component extraction" },
  { id: "ehlers-super-smoother", name: "Super Smoother", description: "Lag-reduced price smoothing" },
  { id: "ehlers-roofing", name: "Roofing Filter", description: "HP + LP filtering combination" },
  { id: "ehlers-cyber-cycle", name: "Cyber Cycle", description: "Market cycle identification" },
  { id: "ehlers-decycler", name: "Decycler", description: "Trend extraction filter" },
  { id: "ehlers-instantaneous-trend", name: "Instantaneous Trend", description: "Real-time trend following" },
];

interface ManualInstrument {
  id: string;
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

interface BacktestConfig {
  // General
  startDate: string;
  endDate: string;
  initialCapital: number;
  
  // Risk Management
  riskMode: "dynamic" | "fixed";
  kellyFraction: number;
  volatilityAdjusted: boolean;
  maxDailyDrawdown: number;
  dynamicPositionScaling: boolean;
  fixedRiskPercent: number;
  fixedLotSize: number;
  fixedStopLoss: number;
  fixedTakeProfit: number;
  
  // Strategies
  selectedGannStrategies: string[];
  selectedEhlersStrategies: string[];
  
  // Strategy Parameters
  gannAngle: number;
  gannTimeUnit: number;
  gannCycleLength: number;
  ehlersFilterPeriod: number;
  ehlersBandwidth: number;
  ehlersFastLimit: number;
  ehlersSlowLimit: number;
}

interface BacktestResult {
  trades: TradeResult[];
  metrics: BacktestMetrics;
  equityCurve: { date: string; equity: number; drawdown: number }[];
  monthlyReturns: { month: string; return: number }[];
}

interface TradeResult {
  id: number;
  instrument: string;
  strategy: string;
  direction: "LONG" | "SHORT";
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  size: number;
  pnl: number;
  pnlPercent: number;
  holdingPeriod: string;
}

interface BacktestMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  avgHoldingPeriod: string;
  expectancy: number;
}

export const BacktestSimulator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  
  // Manual instruments
  const [manualInstruments, setManualInstruments] = useState<ManualInstrument[]>([
    { id: "1", symbol: "BTCUSDT", name: "Bitcoin", type: "Crypto", exchange: "Binance" },
  ]);
  const [newInstrument, setNewInstrument] = useState({
    symbol: "",
    name: "",
    type: "Crypto",
    exchange: "Binance",
  });
  
  // Selected instruments for backtest
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(["BTCUSDT"]);
  
  // Backtest configuration
  const [config, setConfig] = useState<BacktestConfig>({
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    initialCapital: 100000,
    
    riskMode: "dynamic",
    kellyFraction: 0.25,
    volatilityAdjusted: true,
    maxDailyDrawdown: 5.0,
    dynamicPositionScaling: true,
    fixedRiskPercent: 1.0,
    fixedLotSize: 0.1,
    fixedStopLoss: 50,
    fixedTakeProfit: 100,
    
    selectedGannStrategies: ["gann-angles", "gann-support-resistance"],
    selectedEhlersStrategies: ["ehlers-mama-fama", "ehlers-super-smoother"],
    
    gannAngle: 45,
    gannTimeUnit: 1,
    gannCycleLength: 30,
    ehlersFilterPeriod: 20,
    ehlersBandwidth: 0.3,
    ehlersFastLimit: 0.5,
    ehlersSlowLimit: 0.05,
  });
  
  // Simulated results
  const [results, setResults] = useState<BacktestResult | null>(null);
  
  const addManualInstrument = () => {
    if (!newInstrument.symbol || !newInstrument.name) {
      toast.error("Please fill in symbol and name");
      return;
    }
    
    const instrument: ManualInstrument = {
      id: Date.now().toString(),
      ...newInstrument,
    };
    
    setManualInstruments(prev => [...prev, instrument]);
    setNewInstrument({ symbol: "", name: "", type: "Crypto", exchange: "Binance" });
    toast.success(`Added ${instrument.symbol}`);
  };
  
  const removeInstrument = (id: string) => {
    setManualInstruments(prev => prev.filter(i => i.id !== id));
  };
  
  const toggleStrategy = (strategyId: string, type: "gann" | "ehlers") => {
    setConfig(prev => {
      const key = type === "gann" ? "selectedGannStrategies" : "selectedEhlersStrategies";
      const current = prev[key];
      if (current.includes(strategyId)) {
        return { ...prev, [key]: current.filter(s => s !== strategyId) };
      } else {
        return { ...prev, [key]: [...current, strategyId] };
      }
    });
  };
  
  const toggleInstrument = (symbol: string) => {
    setSelectedInstruments(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(s => s !== symbol);
      } else {
        return [...prev, symbol];
      }
    });
  };
  
  const runBacktest = () => {
    if (selectedInstruments.length === 0) {
      toast.error("Please select at least one instrument");
      return;
    }
    
    if (config.selectedGannStrategies.length === 0 && config.selectedEhlersStrategies.length === 0) {
      toast.error("Please select at least one strategy");
      return;
    }
    
    setIsRunning(true);
    toast.info("Running backtest simulation...");
    
    // Simulate backtest (in real implementation, this would run actual calculations)
    setTimeout(() => {
      const simulatedResults = generateSimulatedResults();
      setResults(simulatedResults);
      setIsRunning(false);
      setHasResults(true);
      toast.success("Backtest completed!");
    }, 2000);
  };
  
  const generateSimulatedResults = (): BacktestResult => {
    const trades: TradeResult[] = [];
    const strategies = [...config.selectedGannStrategies, ...config.selectedEhlersStrategies];
    
    let tradeId = 1;
    for (let i = 0; i < 50; i++) {
      const isWin = Math.random() > 0.45;
      const strategy = strategies[Math.floor(Math.random() * strategies.length)];
      const strategyName = [...GANN_STRATEGIES, ...EHLERS_STRATEGIES].find(s => s.id === strategy)?.name || strategy;
      const instrument = selectedInstruments[Math.floor(Math.random() * selectedInstruments.length)];
      const direction = Math.random() > 0.5 ? "LONG" : "SHORT";
      const entryPrice = 40000 + Math.random() * 20000;
      const pnlPercent = isWin ? Math.random() * 5 : -Math.random() * 3;
      const exitPrice = entryPrice * (1 + pnlPercent / 100 * (direction === "LONG" ? 1 : -1));
      const size = config.riskMode === "fixed" ? config.fixedLotSize : 0.1 + Math.random() * 0.4;
      
      trades.push({
        id: tradeId++,
        instrument,
        strategy: strategyName,
        direction,
        entryDate: `2024-${String(Math.floor(i / 5) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        exitDate: `2024-${String(Math.floor(i / 5) + 1).padStart(2, '0')}-${String(((i % 28) + 2) % 28 + 1).padStart(2, '0')}`,
        entryPrice,
        exitPrice,
        size,
        pnl: (exitPrice - entryPrice) * size * (direction === "LONG" ? 1 : -1),
        pnlPercent,
        holdingPeriod: `${Math.floor(Math.random() * 48) + 1}h`,
      });
    }
    
    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl < 0);
    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
    const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0;
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length) : 0;
    
    const metrics: BacktestMetrics = {
      totalTrades: trades.length,
      winningTrades: wins.length,
      losingTrades: losses.length,
      winRate: (wins.length / trades.length) * 100,
      totalPnL,
      avgWin,
      avgLoss,
      profitFactor: avgLoss > 0 ? (avgWin * wins.length) / (avgLoss * losses.length) : 0,
      maxDrawdown: 5 + Math.random() * 10,
      sharpeRatio: 1.5 + Math.random() * 1.5,
      sortinoRatio: 1.8 + Math.random() * 1.2,
      calmarRatio: 2 + Math.random() * 1,
      avgHoldingPeriod: "12h",
      expectancy: (avgWin * (wins.length / trades.length)) - (avgLoss * (losses.length / trades.length)),
    };
    
    // Generate equity curve
    let equity = config.initialCapital;
    const equityCurve = [];
    let peak = equity;
    
    for (let i = 0; i < 252; i++) {
      const dailyReturn = (Math.random() - 0.48) * 0.02;
      equity *= (1 + dailyReturn);
      peak = Math.max(peak, equity);
      const drawdown = ((peak - equity) / peak) * 100;
      
      equityCurve.push({
        date: `Day ${i + 1}`,
        equity: Math.round(equity),
        drawdown: Number(drawdown.toFixed(2)),
      });
    }
    
    // Generate monthly returns
    const monthlyReturns = [
      { month: "Jan", return: 2.5 + Math.random() * 3 },
      { month: "Feb", return: -1 + Math.random() * 4 },
      { month: "Mar", return: 1.5 + Math.random() * 2.5 },
      { month: "Apr", return: 3 + Math.random() * 2 },
      { month: "May", return: -0.5 + Math.random() * 3 },
      { month: "Jun", return: 2 + Math.random() * 2 },
      { month: "Jul", return: 1 + Math.random() * 3 },
      { month: "Aug", return: -1.5 + Math.random() * 4 },
      { month: "Sep", return: 2.5 + Math.random() * 2 },
      { month: "Oct", return: 1.8 + Math.random() * 2.5 },
      { month: "Nov", return: 3.2 + Math.random() * 2 },
      { month: "Dec", return: 2 + Math.random() * 3 },
    ];
    
    return { trades, metrics, equityCurve, monthlyReturns };
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="instruments">Instruments</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="results" disabled={!hasResults}>Results</TabsTrigger>
        </TabsList>
        
        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* General Settings */}
            <Card className="p-4 border-border bg-card">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                General Settings
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                  <Input
                    type="date"
                    value={config.startDate}
                    onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">End Date</Label>
                  <Input
                    type="date"
                    value={config.endDate}
                    onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Initial Capital ($)</Label>
                  <Input
                    type="number"
                    value={config.initialCapital}
                    onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            </Card>
            
            {/* Risk Management */}
            <Card className="p-4 border-border bg-card">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Risk Management
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant={config.riskMode === "dynamic" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfig(prev => ({ ...prev, riskMode: "dynamic" }))}
                  >
                    Dynamic
                  </Button>
                  <Button
                    variant={config.riskMode === "fixed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfig(prev => ({ ...prev, riskMode: "fixed" }))}
                  >
                    Fixed
                  </Button>
                </div>
                
                {config.riskMode === "dynamic" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Kelly Fraction</Label>
                      <Input
                        type="number"
                        step="0.05"
                        value={config.kellyFraction}
                        onChange={(e) => setConfig(prev => ({ ...prev, kellyFraction: Number(e.target.value) }))}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Max Daily DD (%)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={config.maxDailyDrawdown}
                        onChange={(e) => setConfig(prev => ({ ...prev, maxDailyDrawdown: Number(e.target.value) }))}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.volatilityAdjusted}
                        onCheckedChange={(v) => setConfig(prev => ({ ...prev, volatilityAdjusted: v }))}
                      />
                      <Label className="text-xs">Volatility Adjusted</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.dynamicPositionScaling}
                        onCheckedChange={(v) => setConfig(prev => ({ ...prev, dynamicPositionScaling: v }))}
                      />
                      <Label className="text-xs">Dynamic Scaling</Label>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Fixed Risk (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={config.fixedRiskPercent}
                        onChange={(e) => setConfig(prev => ({ ...prev, fixedRiskPercent: Number(e.target.value) }))}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Fixed Lot Size</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={config.fixedLotSize}
                        onChange={(e) => setConfig(prev => ({ ...prev, fixedLotSize: Number(e.target.value) }))}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Stop Loss (pips)</Label>
                      <Input
                        type="number"
                        value={config.fixedStopLoss}
                        onChange={(e) => setConfig(prev => ({ ...prev, fixedStopLoss: Number(e.target.value) }))}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Take Profit (pips)</Label>
                      <Input
                        type="number"
                        value={config.fixedTakeProfit}
                        onChange={(e) => setConfig(prev => ({ ...prev, fixedTakeProfit: Number(e.target.value) }))}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Strategy Parameters - Gann */}
            <Card className="p-4 border-border bg-card">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                Gann Parameters
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Gann Angle</Label>
                  <Input
                    type="number"
                    value={config.gannAngle}
                    onChange={(e) => setConfig(prev => ({ ...prev, gannAngle: Number(e.target.value) }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Time Unit</Label>
                  <Input
                    type="number"
                    value={config.gannTimeUnit}
                    onChange={(e) => setConfig(prev => ({ ...prev, gannTimeUnit: Number(e.target.value) }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Cycle Length</Label>
                  <Input
                    type="number"
                    value={config.gannCycleLength}
                    onChange={(e) => setConfig(prev => ({ ...prev, gannCycleLength: Number(e.target.value) }))}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            </Card>
            
            {/* Strategy Parameters - Ehlers */}
            <Card className="p-4 border-border bg-card">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Ehlers DSP Parameters
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Filter Period</Label>
                  <Input
                    type="number"
                    value={config.ehlersFilterPeriod}
                    onChange={(e) => setConfig(prev => ({ ...prev, ehlersFilterPeriod: Number(e.target.value) }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Bandwidth</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={config.ehlersBandwidth}
                    onChange={(e) => setConfig(prev => ({ ...prev, ehlersBandwidth: Number(e.target.value) }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Fast Limit (MAMA)</Label>
                  <Input
                    type="number"
                    step="0.05"
                    value={config.ehlersFastLimit}
                    onChange={(e) => setConfig(prev => ({ ...prev, ehlersFastLimit: Number(e.target.value) }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Slow Limit (MAMA)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={config.ehlersSlowLimit}
                    onChange={(e) => setConfig(prev => ({ ...prev, ehlersSlowLimit: Number(e.target.value) }))}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            </Card>
          </div>
          
          {/* Run Backtest Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={runBacktest}
              disabled={isRunning}
              className="min-w-[200px]"
            >
              {isRunning ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Running Backtest...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Backtest
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        {/* Instruments Tab */}
        <TabsContent value="instruments" className="space-y-4 mt-4">
          {/* Add Manual Instrument */}
          <Card className="p-4 border-border bg-card">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-success" />
              Add Manual Instrument
            </h4>
            <div className="grid grid-cols-5 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Symbol</Label>
                <Input
                  placeholder="e.g., EURUSD"
                  value={newInstrument.symbol}
                  onChange={(e) => setNewInstrument(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <Input
                  placeholder="e.g., Euro/USD"
                  value={newInstrument.name}
                  onChange={(e) => setNewInstrument(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Type</Label>
                <Select
                  value={newInstrument.type}
                  onValueChange={(v) => setNewInstrument(prev => ({ ...prev, type: v }))}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Crypto">Crypto</SelectItem>
                    <SelectItem value="Forex">Forex</SelectItem>
                    <SelectItem value="Stock">Stock</SelectItem>
                    <SelectItem value="Index">Index</SelectItem>
                    <SelectItem value="Commodity">Commodity</SelectItem>
                    <SelectItem value="Futures">Futures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Exchange</Label>
                <Input
                  placeholder="e.g., NYSE"
                  value={newInstrument.exchange}
                  onChange={(e) => setNewInstrument(prev => ({ ...prev, exchange: e.target.value }))}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addManualInstrument} className="w-full">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Instrument List */}
          <Card className="p-4 border-border bg-card">
            <h4 className="font-semibold text-foreground mb-4">Available Instruments (Click to Select)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {manualInstruments.map((instrument) => (
                <div
                  key={instrument.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedInstruments.includes(instrument.symbol)
                      ? "bg-primary/20 border-primary"
                      : "bg-secondary/50 border-border hover:border-primary/50"
                  }`}
                  onClick={() => toggleInstrument(instrument.symbol)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{instrument.symbol}</p>
                      <p className="text-xs text-muted-foreground">{instrument.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {instrument.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeInstrument(instrument.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{instrument.exchange}</p>
                  {selectedInstruments.includes(instrument.symbol) && (
                    <CheckCircle className="w-4 h-4 text-success mt-2" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        {/* Strategies Tab */}
        <TabsContent value="strategies" className="space-y-4 mt-4">
          {/* Gann Strategies */}
          <Card className="p-4 border-border bg-card">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              W.D. Gann Strategies
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {GANN_STRATEGIES.map((strategy) => (
                <div
                  key={strategy.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    config.selectedGannStrategies.includes(strategy.id)
                      ? "bg-accent/20 border-accent"
                      : "bg-secondary/50 border-border hover:border-accent/50"
                  }`}
                  onClick={() => toggleStrategy(strategy.id, "gann")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-foreground text-sm">{strategy.name}</p>
                    {config.selectedGannStrategies.includes(strategy.id) && (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{strategy.description}</p>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Ehlers Strategies */}
          <Card className="p-4 border-border bg-card">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              John F. Ehlers DSP Strategies
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {EHLERS_STRATEGIES.map((strategy) => (
                <div
                  key={strategy.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    config.selectedEhlersStrategies.includes(strategy.id)
                      ? "bg-primary/20 border-primary"
                      : "bg-secondary/50 border-border hover:border-primary/50"
                  }`}
                  onClick={() => toggleStrategy(strategy.id, "ehlers")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-foreground text-sm">{strategy.name}</p>
                    {config.selectedEhlersStrategies.includes(strategy.id) && (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{strategy.description}</p>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Selected Summary */}
          <Card className="p-4 border-border bg-card">
            <h4 className="font-semibold text-foreground mb-2">Selected Strategies</h4>
            <div className="flex flex-wrap gap-2">
              {config.selectedGannStrategies.map(id => {
                const s = GANN_STRATEGIES.find(g => g.id === id);
                return s ? (
                  <Badge key={id} variant="outline" className="border-accent text-accent">
                    {s.name}
                  </Badge>
                ) : null;
              })}
              {config.selectedEhlersStrategies.map(id => {
                const s = EHLERS_STRATEGIES.find(e => e.id === id);
                return s ? (
                  <Badge key={id} variant="outline" className="border-primary text-primary">
                    {s.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </Card>
        </TabsContent>
        
        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4 mt-4">
          {results && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <Card className="p-3 border-border bg-card">
                  <p className="text-xs text-muted-foreground">Total Trades</p>
                  <p className="text-lg font-bold text-foreground">{results.metrics.totalTrades}</p>
                </Card>
                <Card className="p-3 border-border bg-card">
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                  <p className="text-lg font-bold text-success">{results.metrics.winRate.toFixed(1)}%</p>
                </Card>
                <Card className="p-3 border-border bg-card">
                  <p className="text-xs text-muted-foreground">Total P&L</p>
                  <p className={`text-lg font-bold ${results.metrics.totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
                    ${results.metrics.totalPnL.toFixed(2)}
                  </p>
                </Card>
                <Card className="p-3 border-border bg-card">
                  <p className="text-xs text-muted-foreground">Profit Factor</p>
                  <p className="text-lg font-bold text-foreground">{results.metrics.profitFactor.toFixed(2)}</p>
                </Card>
                <Card className="p-3 border-border bg-card">
                  <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                  <p className="text-lg font-bold text-primary">{results.metrics.sharpeRatio.toFixed(2)}</p>
                </Card>
                <Card className="p-3 border-border bg-card">
                  <p className="text-xs text-muted-foreground">Max Drawdown</p>
                  <p className="text-lg font-bold text-destructive">{results.metrics.maxDrawdown.toFixed(1)}%</p>
                </Card>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Equity Curve */}
                <Card className="p-4 border-border bg-card">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    Equity Curve
                  </h4>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={results.equityCurve}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                        <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--destructive))" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                        <Area yAxisId="left" type="monotone" dataKey="equity" fill="hsl(var(--success))" fillOpacity={0.2} stroke="hsl(var(--success))" strokeWidth={2} name="Equity" />
                        <Line yAxisId="right" type="monotone" dataKey="drawdown" stroke="hsl(var(--destructive))" strokeWidth={1} dot={false} name="Drawdown %" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                
                {/* Monthly Returns */}
                <Card className="p-4 border-border bg-card">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Monthly Returns (%)
                  </h4>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={results.monthlyReturns}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                        <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                        <Bar 
                          dataKey="return" 
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
              
              {/* Trade List */}
              <Card className="p-4 border-border bg-card">
                <h4 className="font-semibold text-foreground mb-4">Recent Trades</h4>
                <div className="overflow-x-auto max-h-[300px]">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-foreground">ID</th>
                        <th className="px-3 py-2 text-left text-foreground">Instrument</th>
                        <th className="px-3 py-2 text-left text-foreground">Strategy</th>
                        <th className="px-3 py-2 text-left text-foreground">Direction</th>
                        <th className="px-3 py-2 text-right text-foreground">Entry</th>
                        <th className="px-3 py-2 text-right text-foreground">Exit</th>
                        <th className="px-3 py-2 text-right text-foreground">Size</th>
                        <th className="px-3 py-2 text-right text-foreground">P&L</th>
                        <th className="px-3 py-2 text-right text-foreground">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.trades.slice(0, 20).map((trade, idx) => (
                        <tr key={trade.id} className={idx % 2 === 0 ? "bg-card" : "bg-secondary/20"}>
                          <td className="px-3 py-2 font-mono text-foreground">{trade.id}</td>
                          <td className="px-3 py-2 font-semibold text-foreground">{trade.instrument}</td>
                          <td className="px-3 py-2 text-muted-foreground text-xs">{trade.strategy}</td>
                          <td className="px-3 py-2">
                            <Badge className={trade.direction === "LONG" ? "bg-success" : "bg-destructive"}>
                              {trade.direction}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-right font-mono text-foreground">${trade.entryPrice.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-mono text-foreground">${trade.exitPrice.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-mono text-foreground">{trade.size.toFixed(3)}</td>
                          <td className={`px-3 py-2 text-right font-mono ${trade.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-right text-muted-foreground">{trade.holdingPeriod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              
              {/* Detailed Metrics */}
              <Card className="p-4 border-border bg-card">
                <h4 className="font-semibold text-foreground mb-4">Detailed Performance Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="p-3 bg-secondary/50 rounded">
                    <p className="text-xs text-muted-foreground">Winning Trades</p>
                    <p className="font-bold text-success">{results.metrics.winningTrades}</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded">
                    <p className="text-xs text-muted-foreground">Losing Trades</p>
                    <p className="font-bold text-destructive">{results.metrics.losingTrades}</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded">
                    <p className="text-xs text-muted-foreground">Avg Win</p>
                    <p className="font-bold text-success">${results.metrics.avgWin.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded">
                    <p className="text-xs text-muted-foreground">Avg Loss</p>
                    <p className="font-bold text-destructive">${results.metrics.avgLoss.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded">
                    <p className="text-xs text-muted-foreground">Sortino Ratio</p>
                    <p className="font-bold text-foreground">{results.metrics.sortinoRatio.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded">
                    <p className="text-xs text-muted-foreground">Calmar Ratio</p>
                    <p className="font-bold text-foreground">{results.metrics.calmarRatio.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded">
                    <p className="text-xs text-muted-foreground">Expectancy</p>
                    <p className={`font-bold ${results.metrics.expectancy >= 0 ? 'text-success' : 'text-destructive'}`}>
                      ${results.metrics.expectancy.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded">
                    <p className="text-xs text-muted-foreground">Avg Holding</p>
                    <p className="font-bold text-foreground">{results.metrics.avgHoldingPeriod}</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
