import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Waves, 
  BarChart3, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Target,
  Calendar,
  Zap
} from "lucide-react";
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
      <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
        <TabsTrigger value="gann-wave" className="gap-2 text-xs md:text-sm">
          <Waves className="h-4 w-4" />
          <span className="hidden md:inline">Gann Wave</span>
          <span className="md:hidden">Gann</span>
        </TabsTrigger>
        <TabsTrigger value="elliott-wave" className="gap-2 text-xs md:text-sm">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden md:inline">Elliott Wave</span>
          <span className="md:hidden">Elliott</span>
        </TabsTrigger>
        <TabsTrigger value="time-cycles" className="gap-2 text-xs md:text-sm">
          <Clock className="h-4 w-4" />
          <span className="hidden md:inline">Time Cycles</span>
          <span className="md:hidden">Cycles</span>
        </TabsTrigger>
        <TabsTrigger value="patterns" className="gap-2 text-xs md:text-sm">
          <Target className="h-4 w-4" />
          <span className="hidden md:inline">Price Patterns</span>
          <span className="md:hidden">Patterns</span>
        </TabsTrigger>
      </TabsList>

      {/* Gann Wave Tab */}
      <TabsContent value="gann-wave" className="mt-6 space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden border-border bg-card">
            <div className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5 p-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Waves className="h-5 w-5 text-primary" />
                Gann Wave Analysis
              </h3>
            </div>
            <div className="h-[350px] p-4">
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
                  <Line type="monotone" dataKey="wave1" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Primary" />
                  <Line type="monotone" dataKey="wave2" stroke="hsl(var(--success))" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Secondary" />
                  <Line type="monotone" dataKey="composite" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="Composite" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="overflow-hidden border-border bg-card">
            <div className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5 p-4">
              <h3 className="font-bold text-foreground">Wave Analysis</h3>
            </div>
            <ScrollArea className="h-[350px]">
              <div className="space-y-3 p-4">
                {gannWaveAnalysis.map((wave, idx) => (
                  <div key={idx} className="rounded-xl bg-muted/50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{wave.wave}</span>
                      <Badge
                        variant="outline"
                        className={
                          wave.phase === "Ascending"
                            ? "border-success/30 bg-success/10 text-success"
                            : wave.phase === "Descending"
                            ? "border-destructive/30 bg-destructive/10 text-destructive"
                            : "border-accent/30 bg-accent/10 text-accent"
                        }
                      >
                        {wave.phase}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Period: {wave.period}</p>
                      <p className="font-mono text-foreground">Target: ${wave.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </TabsContent>

      {/* Elliott Wave Tab */}
      <TabsContent value="elliott-wave" className="mt-6 space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden border-border bg-card">
            <div className="border-b border-border bg-gradient-to-r from-accent/5 to-primary/5 p-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <BarChart3 className="h-5 w-5 text-accent" />
                Elliott Wave Count
              </h3>
            </div>
            <div className="h-[350px] p-4">
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

          <Card className="overflow-hidden border-border bg-card">
            <div className="border-b border-border bg-gradient-to-r from-accent/5 to-primary/5 p-4">
              <h3 className="font-bold text-foreground">Wave Count</h3>
            </div>
            <ScrollArea className="h-[350px]">
              <div className="space-y-4 p-4">
                <div className="rounded-xl bg-primary/10 p-4 border border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-primary">{elliottWaveCount.currentWave}</span>
                    <Badge className="bg-success text-success-foreground">{elliottWaveCount.trend}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Sub-wave: {elliottWaveCount.subWave}</p>
                  <p className="text-sm text-muted-foreground">Degree: {elliottWaveCount.degree}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Targets</h4>
                  {[
                    { label: "Wave 3", value: elliottWaveCount.targets.wave3, color: "text-success" },
                    { label: "Wave 4", value: elliottWaveCount.targets.wave4, color: "text-accent" },
                    { label: "Wave 5", value: elliottWaveCount.targets.wave5, color: "text-success" },
                  ].map((target, idx) => (
                    <div key={idx} className="flex justify-between rounded-lg bg-muted/50 p-3">
                      <span className="text-sm text-muted-foreground">{target.label}</span>
                      <span className={`font-mono font-semibold ${target.color}`}>${target.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between rounded-lg bg-destructive/10 p-3 border border-destructive/30">
                    <span className="text-sm text-destructive">Invalidation</span>
                    <span className="font-mono font-semibold text-destructive">${elliottWaveCount.invalidation}</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>
      </TabsContent>

      {/* Time Cycles Tab */}
      <TabsContent value="time-cycles" className="mt-6 space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="overflow-hidden border-border bg-card">
            <div className="border-b border-border bg-gradient-to-r from-accent/5 to-primary/5 p-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Clock className="h-5 w-5 text-accent" />
                Time Cycle Analysis
              </h3>
            </div>
            <ScrollArea className="h-[350px]">
              <div className="space-y-3 p-4">
                {timePatterns.map((pattern, idx) => (
                  <div key={idx} className="rounded-xl bg-muted/50 p-4 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">{pattern.cycle}</span>
                        <Badge variant="outline" className="text-xs">{pattern.type}</Badge>
                      </div>
                      <Badge
                        className={
                          pattern.confidence >= 85
                            ? "bg-success text-success-foreground"
                            : pattern.confidence >= 70
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {pattern.confidence}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Next: {pattern.nextTurn}</span>
                      <span className={pattern.daysRemaining <= 7 ? "font-semibold text-destructive" : "text-foreground"}>
                        {pattern.daysRemaining} days
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${100 - (pattern.daysRemaining / 90) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          <Card className="overflow-hidden border-border bg-card">
            <div className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5 p-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Zap className="h-5 w-5 text-primary" />
                Gann Time Squares
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4">
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
                  className={`rounded-xl p-4 text-center border transition-all ${
                    item.active 
                      ? "bg-primary/10 border-primary shadow-sm" 
                      : "bg-muted/30 border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="text-xs text-muted-foreground">{item.period}</div>
                  <div className={`mt-1 font-bold ${item.active ? "text-primary" : "text-foreground"}`}>
                    {item.date}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </TabsContent>

      {/* Price Patterns Tab */}
      <TabsContent value="patterns" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pricePatterns.map((pattern, idx) => (
            <Card key={idx} className="overflow-hidden border-border bg-card transition-all hover:shadow-md">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{pattern.name}</h4>
                  <Badge variant="outline" className="font-mono">{pattern.timeframe}</Badge>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={pattern.direction === "Bullish" ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
                    {pattern.direction === "Bullish" ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {pattern.direction}
                  </Badge>
                  <Badge variant="secondary">{pattern.type}</Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <span
                    className={`font-bold font-mono ${
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
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pattern.confidence >= 80 ? "bg-success" : pattern.confidence >= 70 ? "bg-accent" : "bg-muted"
                    }`}
                    style={{ width: `${pattern.confidence}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
