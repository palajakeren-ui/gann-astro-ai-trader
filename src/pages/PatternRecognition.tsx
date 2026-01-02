import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, TrendingUp, TrendingDown, Waves, BarChart3, Clock, RefreshCw, Wifi, Plus, Trash2, Edit2, Target, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, ReferenceLine } from "recharts";
import TradingInstrumentSelector from "@/components/TradingInstrumentSelector";
import useWebSocketPrice from "@/hooks/useWebSocketPrice";

// Timeframe options from 1 minute to 1 year
const TIMEFRAMES = [
  { value: "1M", label: "1 Minute" },
  { value: "5M", label: "5 Minutes" },
  { value: "15M", label: "15 Minutes" },
  { value: "30M", label: "30 Minutes" },
  { value: "1H", label: "1 Hour" },
  { value: "4H", label: "4 Hours" },
  { value: "1D", label: "1 Day" },
  { value: "1W", label: "1 Week" },
  { value: "1MO", label: "1 Month" },
  { value: "3MO", label: "3 Months" },
  { value: "6MO", label: "6 Months" },
  { value: "1Y", label: "1 Year" },
];

interface DetectedPattern {
  id: string;
  name: string;
  type: string;
  confidence: number;
  priceRange: string;
  timeWindow: string;
  signal: "Bullish" | "Bearish" | "Neutral";
  instrument: string;
  timeframe: string;
}

interface AssetAnalysis {
  id: string;
  symbol: string;
  name: string;
  timeframe: string;
  lastUpdated: Date;
  patterns: DetectedPattern[];
}

// Generate Gann Wave data
const generateGannWaveData = (basePrice: number) => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    const wave1 = Math.sin(i / 8) * (basePrice * 0.02);
    const wave2 = Math.sin(i / 16) * (basePrice * 0.015);
    const wave3 = Math.sin(i / 32) * (basePrice * 0.01);
    
    data.push({
      time: i,
      price: basePrice + wave1 + wave2 + wave3 + (Math.random() - 0.5) * (basePrice * 0.005),
      wave1: basePrice + wave1,
      wave2: basePrice + wave2,
      wave3: basePrice + wave3,
      composite: basePrice + wave1 + wave2 + wave3,
    });
  }
  return data;
};

// Generate Elliott Wave data
const generateElliottWaveData = (basePrice: number) => {
  const waves = [
    { label: "1", direction: "up", magnitude: 0.05 },
    { label: "2", direction: "down", magnitude: 0.03 },
    { label: "3", direction: "up", magnitude: 0.08 },
    { label: "4", direction: "down", magnitude: 0.025 },
    { label: "5", direction: "up", magnitude: 0.04 },
    { label: "A", direction: "down", magnitude: 0.035 },
    { label: "B", direction: "up", magnitude: 0.02 },
    { label: "C", direction: "down", magnitude: 0.045 },
  ];

  const data = [];
  let currentPrice = basePrice * 0.95;
  let timeIndex = 0;

  waves.forEach((wave) => {
    const points = 8 + Math.floor(Math.random() * 4);
    const targetPrice = wave.direction === "up" 
      ? currentPrice * (1 + wave.magnitude) 
      : currentPrice * (1 - wave.magnitude);
    const priceStep = (targetPrice - currentPrice) / points;

    for (let i = 0; i < points; i++) {
      data.push({
        time: timeIndex++,
        price: currentPrice + priceStep * i + (Math.random() - 0.5) * (basePrice * 0.003),
        waveLabel: i === Math.floor(points / 2) ? wave.label : null,
        waveType: wave.label.match(/[ABC]/) ? "corrective" : "impulse",
      });
    }
    currentPrice = targetPrice;
  });

  return data;
};

// Generate time pattern data
const generateTimePatternData = () => {
  return [
    { cycle: "90 Days", nextTurn: "2025-03-15", daysRemaining: 45, type: "Major", confidence: 92 },
    { cycle: "60 Days", nextTurn: "2025-02-28", daysRemaining: 30, type: "Medium", confidence: 85 },
    { cycle: "30 Days", nextTurn: "2025-02-10", daysRemaining: 12, type: "Minor", confidence: 78 },
    { cycle: "15 Days", nextTurn: "2025-02-01", daysRemaining: 3, type: "Minor", confidence: 72 },
    { cycle: "7 Days", nextTurn: "2025-01-31", daysRemaining: 2, type: "Micro", confidence: 65 },
  ];
};

// Initial detected patterns with Price & Time
const initialPatterns: DetectedPattern[] = [
  {
    id: "1",
    name: "Bullish Engulfing",
    type: "Candlestick",
    confidence: 0.88,
    priceRange: "Konfirmasi: 101,700",
    timeWindow: "valid pada 2025-11-04 15:25:00–16:25:00 UTC",
    signal: "Bullish",
    instrument: "BTCUSDT",
    timeframe: "1H",
  },
  {
    id: "2",
    name: "Morning Star",
    type: "Candlestick",
    confidence: 0.80,
    priceRange: "Level: 101,800",
    timeWindow: "2025-11-03 → 2025-11-04 (daily close)",
    signal: "Bullish",
    instrument: "BTCUSDT",
    timeframe: "1D",
  },
  {
    id: "3",
    name: "Elliott Wave — Wave 3 (impulse)",
    type: "Wave Structure",
    confidence: 0.85,
    priceRange: "Target: 102,200",
    timeWindow: "next 7–14 days (peak probability ~2025-11-11)",
    signal: "Bullish",
    instrument: "BTCUSDT",
    timeframe: "1D",
  },
  {
    id: "4",
    name: "Gann Wave — Uptrend Cycle 3",
    type: "Time–Price Wave",
    confidence: 0.83,
    priceRange: "Projection: 103,000 (reversal area)",
    timeWindow: "~2025-11-16 ±6–12 hours",
    signal: "Bullish",
    instrument: "BTCUSDT",
    timeframe: "4H",
  },
  {
    id: "5",
    name: "Harmonic AB=CD (confluence)",
    type: "Harmonic Pattern",
    confidence: 0.76,
    priceRange: "Range: 101,500 → 102,200",
    timeWindow: "5–8 days to completion",
    signal: "Bullish",
    instrument: "BTCUSDT",
    timeframe: "4H",
  },
];

const PatternRecognition = () => {
  const [selectedInstrument, setSelectedInstrument] = useState("BTCUSDT");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1H");
  const [patterns, setPatterns] = useState<DetectedPattern[]>(initialPatterns);
  const [assetAnalyses, setAssetAnalyses] = useState<AssetAnalysis[]>([
    {
      id: "1",
      symbol: "BTCUSDT",
      name: "Bitcoin",
      timeframe: "1H",
      lastUpdated: new Date(),
      patterns: initialPatterns.filter(p => p.instrument === "BTCUSDT"),
    },
  ]);
  
  // New pattern form
  const [newPattern, setNewPattern] = useState({
    name: "",
    type: "Candlestick",
    confidence: 0.75,
    priceRange: "",
    timeWindow: "",
    signal: "Bullish" as "Bullish" | "Bearish" | "Neutral",
  });

  // New asset form
  const [newAssetSymbol, setNewAssetSymbol] = useState("");
  const [newAssetTimeframe, setNewAssetTimeframe] = useState("1H");

  const { priceData, isConnected, isLive, toggleConnection } = useWebSocketPrice({
    symbol: selectedInstrument,
    enabled: true,
    updateInterval: 2000,
  });

  const currentPrice = priceData.price;
  const gannWaveData = generateGannWaveData(currentPrice);
  const elliottWaveData = generateElliottWaveData(currentPrice);
  const timePatterns = generateTimePatternData();

  // Gann Wave analysis
  const gannWaveAnalysis = [
    { wave: "Primary Wave", period: "180 days", phase: "Ascending", target: (currentPrice * 1.15).toFixed(2) },
    { wave: "Secondary Wave", period: "60 days", phase: "Peak", target: (currentPrice * 1.05).toFixed(2) },
    { wave: "Tertiary Wave", period: "20 days", phase: "Descending", target: (currentPrice * 0.98).toFixed(2) },
    { wave: "Minor Wave", period: "7 days", phase: "Trough", target: (currentPrice * 0.96).toFixed(2) },
  ];

  // Elliott Wave count
  const elliottWaveCount = {
    currentWave: "Wave 3",
    subWave: "iii of 3",
    degree: "Intermediate",
    trend: "Bullish",
    targets: {
      wave3: (currentPrice * 1.12).toFixed(2),
      wave4: (currentPrice * 1.08).toFixed(2),
      wave5: (currentPrice * 1.18).toFixed(2),
    },
    invalidation: (currentPrice * 0.92).toFixed(2),
  };

  // Add new pattern
  const handleAddPattern = () => {
    if (!newPattern.name || !newPattern.priceRange || !newPattern.timeWindow) return;
    
    const pattern: DetectedPattern = {
      id: Date.now().toString(),
      ...newPattern,
      instrument: selectedInstrument,
      timeframe: selectedTimeframe,
    };
    
    setPatterns([...patterns, pattern]);
    setNewPattern({
      name: "",
      type: "Candlestick",
      confidence: 0.75,
      priceRange: "",
      timeWindow: "",
      signal: "Bullish",
    });
  };

  // Delete pattern
  const handleDeletePattern = (id: string) => {
    setPatterns(patterns.filter(p => p.id !== id));
  };

  // Add new asset for analysis
  const handleAddAsset = () => {
    if (!newAssetSymbol) return;
    
    const asset: AssetAnalysis = {
      id: Date.now().toString(),
      symbol: newAssetSymbol.toUpperCase(),
      name: newAssetSymbol.toUpperCase(),
      timeframe: newAssetTimeframe,
      lastUpdated: new Date(),
      patterns: [],
    };
    
    setAssetAnalyses([...assetAnalyses, asset]);
    setNewAssetSymbol("");
  };

  // Update asset analysis
  const handleUpdateAsset = (id: string) => {
    setAssetAnalyses(assetAnalyses.map(a => 
      a.id === id ? { ...a, lastUpdated: new Date() } : a
    ));
  };

  // Delete asset
  const handleDeleteAsset = (id: string) => {
    setAssetAnalyses(assetAnalyses.filter(a => a.id !== id));
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.85) return "text-success";
    if (conf >= 0.70) return "text-accent";
    return "text-warning";
  };

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case "Bullish": return <Badge className="bg-success text-success-foreground"><TrendingUp className="w-3 h-3 mr-1" />Bullish</Badge>;
      case "Bearish": return <Badge className="bg-destructive text-destructive-foreground"><TrendingDown className="w-3 h-3 mr-1" />Bearish</Badge>;
      default: return <Badge variant="outline">Neutral</Badge>;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            📈 Pattern Recognition — (Price & Time)
          </h1>
          <p className="text-sm text-muted-foreground">Gann Wave, Elliott Wave, Time Cycles & Multi-Asset Analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={isConnected ? "border-success text-success" : "border-destructive text-destructive"}>
            <Wifi className="w-3 h-3 mr-1" />
            {isConnected ? "Live" : "Offline"}
          </Badge>
          <Badge variant="outline" className="text-lg font-mono">
            ${currentPrice.toLocaleString()}
          </Badge>
          <Button variant="outline" size="sm" onClick={toggleConnection}>
            <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Multi-Asset & Multi-Timeframe Management */}
      <Card className="p-4 border-border bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Multi-Asset & Multi-Timeframe Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label className="text-sm text-muted-foreground">Add Asset Symbol</Label>
            <Input 
              placeholder="e.g. ETHUSDT" 
              value={newAssetSymbol}
              onChange={(e) => setNewAssetSymbol(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Timeframe</Label>
            <Select value={newAssetTimeframe} onValueChange={setNewAssetTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEFRAMES.map(tf => (
                  <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddAsset} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Timeframe</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Patterns</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assetAnalyses.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-semibold">{asset.symbol}</TableCell>
                  <TableCell><Badge variant="outline">{asset.timeframe}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {asset.lastUpdated.toLocaleString()}
                  </TableCell>
                  <TableCell>{asset.patterns.length} patterns</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleUpdateAsset(asset.id)}>
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteAsset(asset.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Detected Patterns Table */}
      <Card className="p-4 border-border bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent" />
          Detected Patterns (Name | Type | Confidence | Price Range | Time Window)
        </h3>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pattern Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Time Window</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patterns.map((pattern) => (
                <TableRow key={pattern.id}>
                  <TableCell className="font-semibold">{pattern.name}</TableCell>
                  <TableCell><Badge variant="outline">{pattern.type}</Badge></TableCell>
                  <TableCell className={`font-mono ${getConfidenceColor(pattern.confidence)}`}>
                    {(pattern.confidence * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-sm">{pattern.priceRange}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{pattern.timeWindow}</TableCell>
                  <TableCell>{getSignalBadge(pattern.signal)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={() => handleDeletePattern(pattern.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add New Pattern Form */}
        <div className="mt-4 p-4 bg-secondary/30 rounded-lg border border-border">
          <h4 className="font-semibold text-foreground mb-3">Add New Pattern</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <Label className="text-xs">Pattern Name</Label>
              <Input 
                placeholder="e.g. Bullish Engulfing"
                value={newPattern.name}
                onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">Type</Label>
              <Select value={newPattern.type} onValueChange={(v) => setNewPattern({ ...newPattern, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Candlestick">Candlestick</SelectItem>
                  <SelectItem value="Wave Structure">Wave Structure</SelectItem>
                  <SelectItem value="Time–Price Wave">Time–Price Wave</SelectItem>
                  <SelectItem value="Harmonic Pattern">Harmonic Pattern</SelectItem>
                  <SelectItem value="Chart Pattern">Chart Pattern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Confidence</Label>
              <Input 
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={newPattern.confidence}
                onChange={(e) => setNewPattern({ ...newPattern, confidence: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label className="text-xs">Price Range</Label>
              <Input 
                placeholder="e.g. Target: 102,200"
                value={newPattern.priceRange}
                onChange={(e) => setNewPattern({ ...newPattern, priceRange: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">Time Window</Label>
              <Input 
                placeholder="e.g. next 7-14 days"
                value={newPattern.timeWindow}
                onChange={(e) => setNewPattern({ ...newPattern, timeWindow: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">Signal</Label>
              <Select value={newPattern.signal} onValueChange={(v: "Bullish" | "Bearish" | "Neutral") => setNewPattern({ ...newPattern, signal: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bullish">Bullish</SelectItem>
                  <SelectItem value="Bearish">Bearish</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-3" onClick={handleAddPattern}>
            <Plus className="w-4 h-4 mr-2" />
            Add Pattern
          </Button>
        </div>
      </Card>

      {/* Pattern Summary (Narasi) */}
      <Card className="p-4 border-border bg-card border-l-4 border-l-primary">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          Pattern Summary (Narasi)
        </h3>
        <div className="space-y-3 text-sm">
          <p className="p-3 bg-success/10 border border-success/30 rounded-lg">
            <strong>Bullish Engulfing</strong> pada 101,700 (konfirmasi intraday 2025-11-04 15:25:00 UTC) memberikan sinyal masuk awal.
          </p>
          <p className="p-3 bg-success/10 border border-success/30 rounded-lg">
            <strong>Morning Star</strong> pada area 101,800 memperkuat setup bagi Wave 3 impulsif — target terukur 102,200 dalam 7–14 days.
          </p>
          <p className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
            <strong>Gann Wave</strong> menunjuk reversal window kuat sekitar 2025-11-16 (target 103,000) — gunakan untuk manajemen TP bagian/scale-out.
          </p>
        </div>
      </Card>

      {/* Instrument & Timeframe Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TradingInstrumentSelector
          onInstrumentChange={(symbol) => setSelectedInstrument(symbol)}
          compact={false}
        />
        <Card className="p-4 border-border bg-card">
          <Label className="text-foreground mb-2 block">Timeframe (1 Menit - 1 Tahun)</Label>
          <div className="flex flex-wrap gap-2">
            {TIMEFRAMES.map(tf => (
              <Button
                key={tf.value}
                variant={selectedTimeframe === tf.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(tf.value)}
              >
                {tf.value}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <Tabs defaultValue="gann-wave" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
          <TabsTrigger value="gann-wave" className="text-xs md:text-sm">Gann Wave</TabsTrigger>
          <TabsTrigger value="elliott-wave" className="text-xs md:text-sm">Elliott Wave</TabsTrigger>
          <TabsTrigger value="time-cycles" className="text-xs md:text-sm">Time Cycles</TabsTrigger>
          <TabsTrigger value="patterns" className="text-xs md:text-sm">Price Patterns</TabsTrigger>
        </TabsList>

        {/* Gann Wave Tab */}
        <TabsContent value="gann-wave" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 p-4 border-border bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Waves className="w-5 h-5 text-primary" />
                Gann Wave Analysis Chart
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={gannWaveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="price" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} name="Price" />
                    <Line type="monotone" dataKey="wave1" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Primary Wave" />
                    <Line type="monotone" dataKey="wave2" stroke="hsl(var(--success))" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Secondary Wave" />
                    <Line type="monotone" dataKey="wave3" stroke="hsl(var(--accent))" strokeWidth={1} strokeDasharray="2 2" dot={false} name="Tertiary Wave" />
                    <Line type="monotone" dataKey="composite" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="Composite" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 border-border bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Wave Analysis</h3>
              <div className="space-y-3">
                {gannWaveAnalysis.map((wave, idx) => (
                  <div key={idx} className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{wave.wave}</span>
                      <Badge variant="outline" className={
                        wave.phase === "Ascending" ? "border-success text-success" :
                        wave.phase === "Descending" ? "border-destructive text-destructive" :
                        "border-accent text-accent"
                      }>
                        {wave.phase}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Period: {wave.period}</p>
                      <p>Target: ${wave.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Elliott Wave Tab */}
        <TabsContent value="elliott-wave" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 p-4 border-border bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                Elliott Wave Count Chart
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={elliottWaveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                      formatter={(value: number, name: string) => [value.toFixed(2), name]}
                    />
                    <Area type="monotone" dataKey="price" fill="hsl(var(--primary))" fillOpacity={0.1} stroke="hsl(var(--primary))" strokeWidth={2} name="Price" />
                    <ReferenceLine y={currentPrice * 1.12} stroke="hsl(var(--success))" strokeDasharray="5 5" label="Wave 3 Target" />
                    <ReferenceLine y={currentPrice * 0.92} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label="Invalidation" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 border-border bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Elliott Wave Count</h3>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-primary">{elliottWaveCount.currentWave}</span>
                    <Badge className="bg-success">{elliottWaveCount.trend}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Sub-wave: {elliottWaveCount.subWave}</p>
                  <p className="text-sm text-muted-foreground">Degree: {elliottWaveCount.degree}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Price Targets</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between p-2 bg-secondary/50 rounded">
                      <span className="text-sm text-muted-foreground">Wave 3 Target</span>
                      <span className="font-mono text-success">${elliottWaveCount.targets.wave3}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-secondary/50 rounded">
                      <span className="text-sm text-muted-foreground">Wave 4 Retrace</span>
                      <span className="font-mono text-accent">${elliottWaveCount.targets.wave4}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-secondary/50 rounded">
                      <span className="text-sm text-muted-foreground">Wave 5 Target</span>
                      <span className="font-mono text-success">${elliottWaveCount.targets.wave5}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-destructive/20 rounded border border-destructive/30">
                      <span className="text-sm text-destructive">Invalidation</span>
                      <span className="font-mono text-destructive">${elliottWaveCount.invalidation}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-semibold text-foreground mb-2">Wave Rules</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Wave 2 cannot retrace more than 100% of Wave 1</li>
                    <li>• Wave 3 is never the shortest impulse wave</li>
                    <li>• Wave 4 cannot overlap Wave 1 territory</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Time Cycles Tab */}
        <TabsContent value="time-cycles" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 border-border bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Time Cycle Analysis
              </h3>
              <div className="space-y-3">
                {timePatterns.map((pattern, idx) => (
                  <div key={idx} className="p-4 bg-secondary/50 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{pattern.cycle}</span>
                        <Badge variant="outline" className="text-xs">{pattern.type}</Badge>
                      </div>
                      <Badge className={
                        pattern.confidence >= 85 ? "bg-success" :
                        pattern.confidence >= 70 ? "bg-accent" : "bg-muted"
                      }>
                        {pattern.confidence}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Next Turn: {pattern.nextTurn}</span>
                      <span className={pattern.daysRemaining <= 7 ? "text-destructive font-semibold" : "text-foreground"}>
                        {pattern.daysRemaining} days
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${100 - (pattern.daysRemaining / 90) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 border-border bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Gann Time Squares</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { period: "7 Days", date: "Jan 31", active: true },
                  { period: "15 Days", date: "Feb 5", active: false },
                  { period: "30 Days", date: "Feb 15", active: false },
                  { period: "45 Days", date: "Feb 28", active: false },
                  { period: "60 Days", date: "Mar 15", active: false },
                  { period: "90 Days", date: "Apr 1", active: true },
                  { period: "120 Days", date: "Apr 30", active: false },
                  { period: "180 Days", date: "Jun 1", active: true },
                  { period: "360 Days", date: "Dec 1", active: false },
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-lg text-center border ${item.active ? 'bg-primary/20 border-primary' : 'bg-secondary/50 border-border'}`}>
                    <div className="text-xs text-muted-foreground">{item.period}</div>
                    <div className={`font-semibold ${item.active ? 'text-primary' : 'text-foreground'}`}>{item.date}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Price Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Head & Shoulders", type: "Reversal", confidence: 87, direction: "Bearish", timeframe: "4H" },
              { name: "Ascending Triangle", type: "Continuation", confidence: 82, direction: "Bullish", timeframe: "1H" },
              { name: "Double Bottom", type: "Reversal", confidence: 78, direction: "Bullish", timeframe: "1D" },
              { name: "Cup & Handle", type: "Continuation", confidence: 75, direction: "Bullish", timeframe: "1W" },
              { name: "Falling Wedge", type: "Reversal", confidence: 71, direction: "Bullish", timeframe: "4H" },
              { name: "Bullish Flag", type: "Continuation", confidence: 68, direction: "Bullish", timeframe: "1H" },
            ].map((pattern, idx) => (
              <Card key={idx} className="p-4 border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">{pattern.name}</span>
                  <Badge variant="outline">{pattern.timeframe}</Badge>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={pattern.direction === "Bullish" ? "bg-success" : "bg-destructive"}>
                    {pattern.direction === "Bullish" ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {pattern.direction}
                  </Badge>
                  <Badge variant="outline">{pattern.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <span className={`font-bold ${pattern.confidence >= 80 ? 'text-success' : pattern.confidence >= 70 ? 'text-accent' : 'text-muted-foreground'}`}>
                    {pattern.confidence}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${pattern.confidence >= 80 ? 'bg-success' : pattern.confidence >= 70 ? 'bg-accent' : 'bg-muted'}`}
                    style={{ width: `${pattern.confidence}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatternRecognition;
