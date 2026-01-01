import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, TrendingUp, TrendingDown, Waves, BarChart3, Clock, DollarSign, RefreshCw, Wifi } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, ReferenceLine } from "recharts";
import TradingInstrumentSelector from "@/components/TradingInstrumentSelector";
import useWebSocketPrice from "@/hooks/useWebSocketPrice";

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

  waves.forEach((wave, waveIdx) => {
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

// Time-based pattern data
const generateTimePatternData = () => {
  return [
    { cycle: "90 Days", nextTurn: "2024-03-15", daysRemaining: 45, type: "Major", confidence: 92 },
    { cycle: "60 Days", nextTurn: "2024-02-28", daysRemaining: 30, type: "Medium", confidence: 85 },
    { cycle: "30 Days", nextTurn: "2024-02-10", daysRemaining: 12, type: "Minor", confidence: 78 },
    { cycle: "15 Days", nextTurn: "2024-02-01", daysRemaining: 3, type: "Minor", confidence: 72 },
    { cycle: "7 Days", nextTurn: "2024-01-31", daysRemaining: 2, type: "Micro", confidence: 65 },
  ];
};

const PatternRecognition = () => {
  const [selectedInstrument, setSelectedInstrument] = useState("BTCUSDT");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1H");
  
  const { priceData, isConnected, isLive, toggleConnection } = useWebSocketPrice({
    symbol: selectedInstrument,
    enabled: true,
    updateInterval: 2000,
  });

  const currentPrice = priceData.price;
  const gannWaveData = generateGannWaveData(currentPrice);
  const elliottWaveData = generateElliottWaveData(currentPrice);
  const timePatterns = generateTimePatternData();

  const TIMEFRAMES = ["1M", "5M", "15M", "30M", "1H", "4H", "1D", "1W"];

  // Detected patterns
  const detectedPatterns = [
    { name: "Head & Shoulders", type: "Reversal", confidence: 87, direction: "Bearish", timeframe: "4H" },
    { name: "Ascending Triangle", type: "Continuation", confidence: 82, direction: "Bullish", timeframe: "1H" },
    { name: "Double Bottom", type: "Reversal", confidence: 78, direction: "Bullish", timeframe: "1D" },
    { name: "Cup & Handle", type: "Continuation", confidence: 75, direction: "Bullish", timeframe: "1W" },
    { name: "Falling Wedge", type: "Reversal", confidence: 71, direction: "Bullish", timeframe: "4H" },
  ];

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

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            Pattern Recognition (Price & Time)
          </h1>
          <p className="text-sm text-muted-foreground">Gann Wave, Elliott Wave, and Time Cycle Analysis</p>
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

      {/* Instrument & Timeframe Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TradingInstrumentSelector
          selectedInstrument={selectedInstrument}
          onInstrumentChange={setSelectedInstrument}
        />
        <Card className="p-4 border-border bg-card">
          <Label className="text-foreground mb-2 block">Timeframe</Label>
          <div className="flex flex-wrap gap-2">
            {TIMEFRAMES.map(tf => (
              <Button
                key={tf}
                variant={selectedTimeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(tf)}
              >
                {tf}
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
                  { period: "60 Days", date: "Mar 10", active: false },
                  { period: "90 Days", date: "Apr 1", active: false },
                  { period: "120 Days", date: "May 1", active: false },
                  { period: "180 Days", date: "Jul 1", active: false },
                  { period: "360 Days", date: "Jan 2025", active: false },
                ].map((sq, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg text-center border ${
                      sq.active 
                        ? "bg-primary/20 border-primary text-primary" 
                        : "bg-secondary/50 border-border"
                    }`}
                  >
                    <p className="font-semibold text-sm">{sq.period}</p>
                    <p className="text-xs text-muted-foreground">{sq.date}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>Gann Time Rule:</strong> Price and time must balance. When price moves a certain distance, 
                  time often equals that movement in trading days.
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Price Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4 mt-4">
          <Card className="p-4 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-success" />
              Detected Price Patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detectedPatterns.map((pattern, idx) => (
                <div key={idx} className="p-4 bg-secondary/50 rounded-lg border border-border hover:border-primary transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">{pattern.name}</span>
                    {pattern.direction === "Bullish" ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{pattern.type}</Badge>
                    <Badge variant="outline" className="text-xs">{pattern.timeframe}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${
                      pattern.direction === "Bullish" ? "text-success" : "text-destructive"
                    }`}>
                      {pattern.direction}
                    </span>
                    <Badge className={
                      pattern.confidence >= 80 ? "bg-success" :
                      pattern.confidence >= 70 ? "bg-accent" : "bg-muted"
                    }>
                      {pattern.confidence}% Confidence
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3">Candlestick Patterns</h4>
              <div className="space-y-2">
                {[
                  { name: "Bullish Engulfing", signal: "Buy", strength: 85 },
                  { name: "Morning Star", signal: "Buy", strength: 78 },
                  { name: "Hammer", signal: "Buy", strength: 72 },
                  { name: "Doji", signal: "Neutral", strength: 60 },
                ].map((pattern, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                    <span className="text-sm text-foreground">{pattern.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={
                        pattern.signal === "Buy" ? "text-success border-success" :
                        pattern.signal === "Sell" ? "text-destructive border-destructive" :
                        "text-muted-foreground"
                      }>
                        {pattern.signal}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{pattern.strength}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 border-border bg-card">
              <h4 className="font-semibold text-foreground mb-3">Harmonic Patterns</h4>
              <div className="space-y-2">
                {[
                  { name: "Gartley", completion: 87, direction: "Bullish" },
                  { name: "Butterfly", completion: 65, direction: "Bearish" },
                  { name: "Bat", completion: 45, direction: "Bullish" },
                  { name: "Crab", completion: 30, direction: "Pending" },
                ].map((pattern, idx) => (
                  <div key={idx} className="p-2 bg-secondary/50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{pattern.name}</span>
                      <Badge variant="outline" className={
                        pattern.direction === "Bullish" ? "text-success border-success" :
                        pattern.direction === "Bearish" ? "text-destructive border-destructive" :
                        "text-muted-foreground"
                      }>
                        {pattern.direction}
                      </Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          pattern.completion >= 80 ? "bg-success" :
                          pattern.completion >= 50 ? "bg-accent" : "bg-muted-foreground"
                        }`}
                        style={{ width: `${pattern.completion}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{pattern.completion}% complete</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatternRecognition;
