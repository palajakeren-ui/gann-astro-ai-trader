import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Activity, DollarSign, Percent, Layers } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts";

const mockPriceData = Array.from({ length: 30 }, (_, i) => {
  const base = 47000 + Math.sin(i / 5) * 2000;
  const date = new Date(2024, 9, 21 + i);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: base + Math.random() * 1000,
    volume: 800000 + Math.random() * 800000,
  };
});

const Index = () => {
  const currentPrice = 47509;
  const priceChange = 984;
  const priceChangePercent = 2.11;

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-foreground">Gann Navigator</h1>
        <p className="text-xs md:text-base text-muted-foreground">BTCUSD - Binance Futures, MetaTrader 5</p>
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
          Last Update: {new Date().toISOString().replace('T', ' ').split('.')[0]} UTC
        </p>
      </Card>

      <Card className="p-3 md:p-6 border-border bg-card">
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h2 className="text-lg md:text-2xl font-bold text-foreground">Advanced Trading Charts</h2>
            <div className="text-left sm:text-right">
              <p className="text-xl md:text-3xl font-bold text-foreground">${currentPrice.toLocaleString()}</p>
              <p className="text-sm md:text-lg text-success flex items-center sm:justify-end">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                +{priceChange.toLocaleString()} ({priceChangePercent}%)
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="1d" className="w-full">
          <div className="mb-3 md:mb-4 overflow-x-auto">
            <TabsList className="inline-flex flex-wrap gap-1 h-auto p-1 md:p-2 min-w-max">
              <TabsTrigger value="m1" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">1M</TabsTrigger>
              <TabsTrigger value="m2" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">2M</TabsTrigger>
              <TabsTrigger value="m3" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">3M</TabsTrigger>
              <TabsTrigger value="m5" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">5M</TabsTrigger>
              <TabsTrigger value="m10" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">10M</TabsTrigger>
              <TabsTrigger value="m15" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">15M</TabsTrigger>
              <TabsTrigger value="m30" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">30M</TabsTrigger>
              <TabsTrigger value="m45" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">45M</TabsTrigger>
              <TabsTrigger value="1h" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">1H</TabsTrigger>
              <TabsTrigger value="2h" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">2H</TabsTrigger>
              <TabsTrigger value="3h" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">3H</TabsTrigger>
              <TabsTrigger value="4h" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">4H</TabsTrigger>
              <TabsTrigger value="1d" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">1D</TabsTrigger>
              <TabsTrigger value="1w" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">1W</TabsTrigger>
              <TabsTrigger value="1mo" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">1MO</TabsTrigger>
            </TabsList>
          </div>

          {/* Minute timeframes */}
          {["m1", "m2", "m3", "m5", "m10", "m15", "m30", "m45"].map((tf) => (
            <TabsContent key={tf} value={tf} className="h-[250px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={mockPriceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="price" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                  <YAxis yAxisId="volume" orientation="right" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line yAxisId="price" type="monotone" dataKey="price" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                  <Bar yAxisId="volume" dataKey="volume" fill="hsl(var(--accent))" opacity={0.3} />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}

          {/* Hourly timeframes */}
          {["1h", "2h", "3h", "4h"].map((tf) => (
            <TabsContent key={tf} value={tf} className="h-[250px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPriceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="volume" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </Card>

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
          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Market Overview</h3>
            <p className="text-muted-foreground">General market insights and summary</p>
          </Card>
        </TabsContent>

        <TabsContent value="calculations" className="space-y-4 mt-4">
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">Live Calculation Engines</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="p-4 md:p-6 border-border bg-card">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-success" />
                Gann Analysis
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-muted-foreground mb-2">Hexagon Geometry</h5>
                  <div className="space-y-2">
                    {[
                      { angle: "60°", price: "103.800", type: "support harmonic" },
                      { angle: "120°", price: "104.500", type: "resistance harmonic" },
                      { angle: "180°", price: "105.100", type: "full hexagon pivot" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                        <span className="text-sm font-bold text-accent">{item.angle}</span>
                        <span className="text-sm font-mono text-foreground">{item.price}</span>
                        <Badge variant="outline" className={item.type.includes("support") ? "text-xs border-success text-success" : "text-xs border-destructive text-destructive"}>
                          {item.type.split(' ')[0]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-muted-foreground mb-2">Gann Fan Angles (Full Module)</h5>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {[
                      { ratio: "8x1", price: "104.000", slope: "82° slope", type: "support" },
                      { ratio: "4x1", price: "104.100", slope: "76° slope", type: "support" },
                      { ratio: "1x1", price: "104.200", slope: "45° slope", type: "support" },
                      { ratio: "2x1", price: "104.300", slope: "26.5° slope", type: "support" },
                      { ratio: "1x2", price: "104.700", slope: "63.5° slope", type: "resistance" },
                      { ratio: "3x1", price: "105.200", slope: "18° slope", type: "resistance" },
                      { ratio: "1x3", price: "104.000", slope: "18.4° slope", type: "support" },
                      { ratio: "1x4", price: "104.150", slope: "14° slope", type: "resistance" },
                      { ratio: "1x8", price: "104.050", slope: "7° slope", type: "resistance" },
                    ].map((item, idx) => (
                      <div key={idx} className="p-2 bg-secondary/50 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-foreground">{item.ratio}</span>
                          <Badge variant="outline" className={item.type === "support" ? "text-xs border-success text-success" : "text-xs border-destructive text-destructive"}>
                            {item.type}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-mono text-foreground">{item.price}</span>
                          <span className="text-xs text-muted-foreground">{item.slope}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-muted-foreground mb-2">Square of Nine</h5>
                  <div className="space-y-2">
                    {[
                      { level: "Level 1", price: "$50224", type: "Minor" },
                      { level: "Level 2", price: "$50448", type: "Moderate" },
                      { level: "Level 3", price: "$50673", type: "Major" },
                      { level: "Level 4", price: "$50898", type: "Moderate" },
                      { level: "Level 5", price: "$51124", type: "Minor" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                        <span className="text-xs text-muted-foreground">{item.level}</span>
                        <span className="text-sm font-mono text-foreground">{item.price}</span>
                        <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
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
                      { level: "0.0%", price: "$45000.00" },
                      { level: "23.6%", price: "$47360.00" },
                      { level: "38.2%", price: "$48820.00" },
                      { level: "50.0%", price: "$50000.00" },
                      { level: "61.8%", price: "$51180.00" },
                      { level: "78.6%", price: "$52860.00" },
                      { level: "100.0%", price: "$55000.00" },
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
          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Advanced Analysis</h3>
            <p className="text-muted-foreground">Deep market analysis and patterns</p>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4 mt-4">
          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Forecasting Models</h3>
            <p className="text-muted-foreground">AI-powered price predictions</p>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4 mt-4">
          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Risk & Position Management</h3>
            <p className="text-muted-foreground">Portfolio risk analysis and position sizing</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
