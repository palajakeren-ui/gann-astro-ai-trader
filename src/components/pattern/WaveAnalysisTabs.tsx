import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Waves, BarChart3, Clock, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  ReferenceLine,
} from "recharts";
import {
  generateGannWaveData,
  generateElliottWaveData,
  generateTimeCycleData,
  generateGannWaveAnalysis,
} from "@/lib/patternUtils";

interface WaveAnalysisTabsProps {
  currentPrice: number;
}

export const WaveAnalysisTabs = ({ currentPrice }: WaveAnalysisTabsProps) => {
  const gannWaveData = generateGannWaveData(currentPrice);
  const elliottWaveData = generateElliottWaveData(currentPrice);
  const timePatterns = generateTimeCycleData();
  const gannWaveAnalysis = generateGannWaveAnalysis(currentPrice);

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

  const pricePatterns = [
    { name: "Head & Shoulders", type: "Reversal", confidence: 87, direction: "Bearish", timeframe: "H4" },
    { name: "Ascending Triangle", type: "Continuation", confidence: 82, direction: "Bullish", timeframe: "H1" },
    { name: "Double Bottom", type: "Reversal", confidence: 78, direction: "Bullish", timeframe: "D1" },
    { name: "Cup & Handle", type: "Continuation", confidence: 75, direction: "Bullish", timeframe: "W1" },
    { name: "Falling Wedge", type: "Reversal", confidence: 71, direction: "Bullish", timeframe: "H4" },
    { name: "Bullish Flag", type: "Continuation", confidence: 68, direction: "Bullish", timeframe: "H1" },
  ];

  return (
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
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
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
                    <Badge
                      variant="outline"
                      className={
                        wave.phase === "Ascending"
                          ? "border-success text-success"
                          : wave.phase === "Descending"
                          ? "border-destructive text-destructive"
                          : "border-accent text-accent"
                      }
                    >
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
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value.toFixed(2), "Price"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Price"
                  />
                  <ReferenceLine y={currentPrice * 1.12} stroke="hsl(var(--success))" strokeDasharray="5 5" />
                  <ReferenceLine y={currentPrice * 0.92} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
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
                      <Badge variant="outline" className="text-xs">
                        {pattern.type}
                      </Badge>
                    </div>
                    <Badge
                      className={
                        pattern.confidence >= 85
                          ? "bg-success"
                          : pattern.confidence >= 70
                          ? "bg-accent"
                          : "bg-muted"
                      }
                    >
                      {pattern.confidence}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next Turn: {pattern.nextTurn}</span>
                    <span
                      className={
                        pattern.daysRemaining <= 7 ? "text-destructive font-semibold" : "text-foreground"
                      }
                    >
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
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-center border ${
                    item.active ? "bg-primary/20 border-primary" : "bg-secondary/50 border-border"
                  }`}
                >
                  <div className="text-xs text-muted-foreground">{item.period}</div>
                  <div className={`font-semibold ${item.active ? "text-primary" : "text-foreground"}`}>
                    {item.date}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </TabsContent>

      {/* Price Patterns Tab */}
      <TabsContent value="patterns" className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pricePatterns.map((pattern, idx) => (
            <Card key={idx} className="p-4 border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">{pattern.name}</span>
                <Badge variant="outline">{pattern.timeframe}</Badge>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={pattern.direction === "Bullish" ? "bg-success" : "bg-destructive"}>
                  {pattern.direction === "Bullish" ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {pattern.direction}
                </Badge>
                <Badge variant="outline">{pattern.type}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Confidence</span>
                <span
                  className={`font-bold ${
                    pattern.confidence >= 80
                      ? "text-success"
                      : pattern.confidence >= 70
                      ? "text-accent"
                      : "text-muted-foreground"
                  }`}
                >
                  {pattern.confidence}%
                </span>
              </div>
              <div className="mt-2 w-full bg-secondary rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    pattern.confidence >= 80 ? "bg-success" : pattern.confidence >= 70 ? "bg-accent" : "bg-muted"
                  }`}
                  style={{ width: `${pattern.confidence}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
