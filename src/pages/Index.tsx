import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Activity, DollarSign, Percent, Layers, RefreshCw, Wifi } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts";
import { GannSquareChart } from "@/components/charts/GannSquareChart";
import { GannWheelChart } from "@/components/charts/GannWheelChart";
import { CandlestickChart } from "@/components/charts/CandlestickChart";
import { GannCalculator } from "@/components/calculators/GannCalculator";
import { GannFanChart } from "@/components/charts/GannFanChart";
import { GannBoxChart } from "@/components/charts/GannBoxChart";
import { GannForecastingCalculator } from "@/components/calculators/GannForecastingCalculator";
import AstroCyclePanel from "@/components/dashboard/AstroCyclePanel";
import EhlersDSPPanel from "@/components/dashboard/EhlersDSPPanel";
import AIForecastPanel from "@/components/dashboard/AIForecastPanel";
import HexagonGeometryChart from "@/components/charts/HexagonGeometryChart";
import GannFanFullModule from "@/components/charts/GannFanFullModule";
import { Button } from "@/components/ui/button";
import useWebSocketPrice from "@/hooks/useWebSocketPrice";
import TradingInstrumentSelector from "@/components/TradingInstrumentSelector";


const generateMockPriceData = (basePrice: number) => Array.from({ length: 30 }, (_, i) => {
  const base = basePrice + Math.sin(i / 5) * (basePrice * 0.04);
  const date = new Date(2024, 9, 21 + i);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: base + Math.random() * (basePrice * 0.02),
    volume: 800000 + Math.random() * 800000,
  };
});

const generateMockCandleData = (basePrice: number) => Array.from({ length: 30 }, (_, i) => {
  const base = basePrice + Math.sin(i / 5) * (basePrice * 0.04);
  return {
    date: new Date(2024, 0, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    open: base + Math.random() * (basePrice * 0.01),
    high: base + Math.random() * (basePrice * 0.03),
    low: base - Math.random() * (basePrice * 0.015),
    close: base + Math.random() * (basePrice * 0.01),
  };
});

const Index = () => {
  // WebSocket price feed integration
  const { priceData, isConnected, isLive, toggleConnection } = useWebSocketPrice({
    symbol: 'BTCUSDT',
    enabled: true,
    updateInterval: 2000,
  });

  const currentPrice = priceData.price;
  const priceChange = priceData.change;
  const priceChangePercent = priceData.changePercent;
  const lastUpdate = priceData.timestamp;
  
  const [mockPriceData, setMockPriceData] = useState(() => generateMockPriceData(currentPrice));
  const [mockCandleData, setMockCandleData] = useState(() => generateMockCandleData(currentPrice));

  // Update chart data when price changes
  useEffect(() => {
    setMockPriceData(generateMockPriceData(currentPrice));
    setMockCandleData(generateMockCandleData(currentPrice));
  }, [currentPrice]);

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-foreground">Gann Navigator</h1>
          <p className="text-xs md:text-base text-muted-foreground">BTCUSD - Binance Futures, MetaTrader 5</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={isConnected ? "border-success text-success" : "border-destructive text-destructive"}>
            <Wifi className="w-3 h-3 mr-1" />
            {isConnected ? "WebSocket" : "Disconnected"}
          </Badge>
          <Badge variant={isLive ? "default" : "outline"} className={isLive ? "bg-success" : ""}>
            {isLive ? "Live" : "Paused"}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleConnection}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>

      <Card className="p-3 md:p-6 border-border bg-card">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Live Analysis</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-muted-foreground">Account Balance</p>
            <p className="text-lg md:text-2xl font-bold text-foreground flex items-center">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              100,000
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-muted-foreground">Risk/Trade</p>
            <p className="text-lg md:text-2xl font-bold text-foreground flex items-center">
              <Percent className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              2%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-muted-foreground">Leverage</p>
            <p className="text-lg md:text-2xl font-bold text-foreground flex items-center">
              <Layers className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              5x
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-muted-foreground">Lot Size</p>
            <p className="text-lg md:text-2xl font-bold text-foreground">0.19</p>
          </div>
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground mt-3 md:mt-4">
          Last Update: {lastUpdate.toISOString().replace('T', ' ').split('.')[0]} UTC
        </p>
      </Card>

      <Card className="p-3 md:p-6 border-border bg-card">
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h2 className="text-lg md:text-2xl font-bold text-foreground">Advanced Trading Charts</h2>
            <div className="text-left sm:text-right">
              <p className="text-xl md:text-3xl font-bold text-foreground">${currentPrice.toLocaleString()}</p>
              <p className={`text-sm md:text-lg flex items-center sm:justify-end ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="1d" className="w-full">
          <div className="mb-3 md:mb-4 overflow-x-auto">
            <TabsList className="inline-flex flex-wrap gap-1 h-auto p-1 md:p-2 min-w-max">
              {["m1", "m2", "m3", "m5", "m10", "m15", "m30", "m45", "1h", "2h", "3h", "4h", "1d", "1w", "1mo"].map((tf) => (
                <TabsTrigger key={tf} value={tf} className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">
                  {tf.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {["m1", "m2", "m3", "m5", "m10", "m15", "m30", "m45"].map((tf) => (
            <TabsContent key={tf} value={tf} className="h-[250px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={mockPriceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="price" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                  <YAxis yAxisId="volume" orientation="right" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Line yAxisId="price" type="monotone" dataKey="price" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                  <Bar yAxisId="volume" dataKey="volume" fill="hsl(var(--accent))" opacity={0.3} />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}

          {["1h", "2h", "3h", "4h"].map((tf) => (
            <TabsContent key={tf} value={tf} className="h-[250px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPriceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="price" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}

          <TabsContent value="1d" className="h-[250px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPriceData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="price" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="1w" className="h-[250px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="1mo" className="h-[250px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="volume" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Trading Instrument Selector */}
      <TradingInstrumentSelector />


      {/* Astro Cycle Panel */}
      <AstroCyclePanel />

      {/* Ehlers DSP Multi-Timeframe & Multi-Instrument Analysis */}
      <EhlersDSPPanel />

      <Tabs defaultValue="calculations" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-5 gap-1">
            <TabsTrigger value="overview" className="text-xs md:text-sm whitespace-nowrap">Overview</TabsTrigger>
            <TabsTrigger value="calculations" className="text-xs md:text-sm whitespace-nowrap">Calculations</TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs md:text-sm whitespace-nowrap">Analysis</TabsTrigger>
            <TabsTrigger value="forecasting" className="text-xs md:text-sm whitespace-nowrap">Forecast</TabsTrigger>
            <TabsTrigger value="risk" className="text-xs md:text-sm whitespace-nowrap">Risk</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card className="p-4 md:p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Market Overview (Real-Time)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Current Price</p>
                <p className="text-xl font-bold text-foreground">${currentPrice.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">24h Change</p>
                <p className={`text-xl font-bold ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
                </p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Gann Level</p>
                <p className="text-xl font-bold text-primary">90°</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Signal</p>
                <Badge className="bg-success">BULLISH</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="calculations" className="space-y-4 mt-4">
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">Live Calculation Engines (WebSocket: ${currentPrice.toLocaleString()})</h3>
          
          {/* Hexagon Geometry and Gann Fan Full Module */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <HexagonGeometryChart currentPrice={currentPrice} />
            <GannFanFullModule currentPrice={currentPrice} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="p-4 md:p-6 border-border bg-card">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-success" />
                WD Gann Angles Summary
              </h4>
              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {[
                  { angle: "0°", price: (currentPrice * 1.000).toFixed(2), type: "origin" },
                  { angle: "15°", price: (currentPrice * 0.996).toFixed(2), type: "minor" },
                  { angle: "30°", price: (currentPrice * 0.992).toFixed(2), type: "support" },
                  { angle: "45°", price: (currentPrice * 0.988).toFixed(2), type: "cardinal" },
                  { angle: "60°", price: (currentPrice * 0.982).toFixed(2), type: "support" },
                  { angle: "90°", price: (currentPrice * 0.975).toFixed(2), type: "major" },
                  { angle: "135°", price: (currentPrice * 1.012).toFixed(2), type: "resistance" },
                  { angle: "180°", price: (currentPrice * 1.025).toFixed(2), type: "pivot" },
                  { angle: "225°", price: (currentPrice * 1.038).toFixed(2), type: "resistance" },
                  { angle: "270°", price: (currentPrice * 1.050).toFixed(2), type: "major" },
                  { angle: "315°", price: (currentPrice * 0.962).toFixed(2), type: "support" },
                  { angle: "360°", price: (currentPrice * 0.950).toFixed(2), type: "cycle" },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                    <span className="text-sm font-bold text-accent">{item.angle}</span>
                    <span className="text-sm font-mono text-foreground">${item.price}</span>
                    <Badge variant="outline" className={item.type.includes("support") || item.type === "cardinal" ? "text-xs border-success text-success" : item.type === "origin" || item.type.includes("pivot") || item.type === "cycle" ? "text-xs border-primary text-primary" : item.type === "major" ? "text-xs border-accent text-accent" : "text-xs border-destructive text-destructive"}>
                      {item.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 md:p-6 border-border bg-card">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-accent" />
                Planetary
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-muted-foreground mb-2">Fibonacci Levels</h5>
                  <div className="space-y-2">
                    {[
                      { level: "0.0%", price: `$${(currentPrice * 0.95).toFixed(2)}` },
                      { level: "23.6%", price: `$${(currentPrice * 0.976).toFixed(2)}` },
                      { level: "38.2%", price: `$${(currentPrice * 0.982).toFixed(2)}` },
                      { level: "50.0%", price: `$${(currentPrice * 1.00).toFixed(2)}` },
                      { level: "61.8%", price: `$${(currentPrice * 1.018).toFixed(2)}` },
                      { level: "78.6%", price: `$${(currentPrice * 1.036).toFixed(2)}` },
                      { level: "100.0%", price: `$${(currentPrice * 1.05).toFixed(2)}` },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                        <span className="text-sm font-mono text-foreground">{item.level}</span>
                        <span className="text-sm font-bold text-accent">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 md:p-6 border-border bg-card">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-chart-3" />
                Technical
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-muted-foreground mb-2">Time Cycles</h5>
                  <div className="space-y-2">
                    {[
                      { name: "Weekly", date: "27/11/2025", type: "Minor" },
                      { name: "Monthly", date: "20/12/2025", type: "Moderate" },
                      { name: "Quarterly", date: "18/2/2026", type: "Major" },
                      { name: "Fibonacci 144", date: "13/4/2026", type: "Major" },
                      { name: "Semi-Annual", date: "19/5/2026", type: "Major" },
                      { name: "Annual", date: "20/11/2026", type: "Critical" },
                    ].map((item, idx) => (
                      <div key={idx} className="p-2 bg-secondary/50 rounded space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-foreground">{item.name}</span>
                          <Badge variant="outline" className="text-xs">{item.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">WD Gann Analysis Tools (Real-Time: ${currentPrice.toLocaleString()})</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <CandlestickChart data={mockCandleData} />
              <GannBoxChart basePrice={currentPrice} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <GannSquareChart centerValue={currentPrice} />
                <GannWheelChart currentPrice={currentPrice} />
              </div>
              <GannFanChart />
            </div>
            <div>
              <GannCalculator />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">AI-Powered WD Gann Forecasting (Real-Time)</h3>
          <AIForecastPanel currentPrice={currentPrice} />
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">WD Gann Cycle Forecasting (Up to 365 Years)</h4>
            <GannForecastingCalculator />
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4 mt-4">
          <Card className="p-4 md:p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Risk & Position Management</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Position Size</p>
                <p className="text-2xl font-bold text-foreground">0.19 BTC</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Risk Amount</p>
                <p className="text-2xl font-bold text-destructive">$2,000</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Stop Loss</p>
                <p className="text-2xl font-bold text-destructive">${(currentPrice * 0.98).toFixed(2)}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Take Profit</p>
                <p className="text-2xl font-bold text-success">${(currentPrice * 1.04).toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
