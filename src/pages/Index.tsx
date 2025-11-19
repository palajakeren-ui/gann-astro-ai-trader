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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gann Navigator</h1>
        <p className="text-muted-foreground">BTCUSD - Binance Futures, MetaTrader 5</p>
      </div>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Live Analysis</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Account Balance</p>
            <p className="text-2xl font-bold text-foreground flex items-center">
              <DollarSign className="w-5 h-5 mr-1" />
              100,000
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Risk/Trade</p>
            <p className="text-2xl font-bold text-foreground flex items-center">
              <Percent className="w-5 h-5 mr-1" />
              2%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Leverage</p>
            <p className="text-2xl font-bold text-foreground flex items-center">
              <Layers className="w-5 h-5 mr-1" />
              5x
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Lot Size</p>
            <p className="text-2xl font-bold text-foreground">0.19</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Last Update: {new Date().toISOString().replace('T', ' ').split('.')[0]} UTC
        </p>
      </Card>

      <Card className="p-6 border-border bg-card">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-foreground">Advanced Trading Charts</h2>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">${currentPrice.toLocaleString()}</p>
              <p className="text-lg text-success flex items-center justify-end">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{priceChange.toLocaleString()} ({priceChangePercent}%)
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="1d" className="w-full">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <TabsList>
              <TabsTrigger value="1h">1H</TabsTrigger>
              <TabsTrigger value="4h">4H</TabsTrigger>
              <TabsTrigger value="1d">1D</TabsTrigger>
              <TabsTrigger value="1w">1W</TabsTrigger>
              <TabsTrigger value="1m">1M</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="1h" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="price" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="volume" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line yAxisId="price" type="monotone" dataKey="price" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                <Bar yAxisId="volume" dataKey="volume" fill="hsl(var(--accent))" opacity={0.3} />
              </ComposedChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="4h" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="1d" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPriceData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area type="monotone" dataKey="price" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="1w" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="1m" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="volume" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </Card>

      <Tabs defaultValue="calculations" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calculations">Calculations</TabsTrigger>
          <TabsTrigger value="analysis">Advanced Analysis</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="risk">Risk & Position</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Market Overview</h3>
            <p className="text-muted-foreground">General market insights and summary</p>
          </Card>
        </TabsContent>

        <TabsContent value="calculations" className="space-y-4 mt-4">
          <h3 className="text-xl font-semibold text-foreground mb-4">Live Calculation Engines</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-border bg-card">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-success" />
                Gann Analysis
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-muted-foreground mb-2">Gann Angles</h5>
                  <div className="space-y-2">
                    {[
                      { angle: "8x1", price: "$90000.00" },
                      { angle: "4x1", price: "$70000.00" },
                      { angle: "3x1", price: "$65000.00" },
                      { angle: "2x1", price: "$60000.00" },
                      { angle: "1x1", price: "$55000.00" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                        <span className="text-sm font-mono text-foreground">{item.angle}</span>
                        <span className="text-sm font-bold text-success">{item.price}</span>
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

            <Card className="p-6 border-border bg-card">
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

            <Card className="p-6 border-border bg-card">
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
