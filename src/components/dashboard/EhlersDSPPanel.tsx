import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, TrendingUp, TrendingDown, RefreshCw, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area } from "recharts";

interface InstrumentData {
  symbol: string;
  name: string;
  price: number;
  mama: number;
  fama: number;
  fisher: number;
  cyberCycle: number;
  bandpass: number;
  signal: "Bullish" | "Bearish" | "Neutral";
  confidence: number;
}

interface TimeframeData {
  timeframe: string;
  signal: "Bullish" | "Bearish" | "Neutral";
  strength: number;
  mama: number;
  fama: number;
}

const TIMEFRAMES = ["1M", "5M", "15M", "30M", "1H", "4H", "1D", "1W", "1MO", "1Y"];

const generateMockInstruments = (): InstrumentData[] => [
  { symbol: "BTCUSDT", name: "Bitcoin", price: 97500, mama: 97400, fama: 97200, fisher: 1.33, cyberCycle: 0.026, bandpass: 0.015, signal: "Bullish", confidence: 88 },
  { symbol: "ETHUSDT", name: "Ethereum", price: 3450, mama: 3440, fama: 3420, fisher: 1.12, cyberCycle: 0.018, bandpass: 0.012, signal: "Bullish", confidence: 82 },
  { symbol: "BNBUSDT", name: "BNB", price: 680, mama: 678, fama: 675, fisher: 0.85, cyberCycle: 0.014, bandpass: 0.008, signal: "Neutral", confidence: 65 },
  { symbol: "XRPUSDT", name: "XRP", price: 2.45, mama: 2.44, fama: 2.42, fisher: -0.45, cyberCycle: -0.012, bandpass: -0.006, signal: "Bearish", confidence: 72 },
  { symbol: "SOLUSDT", name: "Solana", price: 195, mama: 194, fama: 192, fisher: 1.55, cyberCycle: 0.032, bandpass: 0.022, signal: "Bullish", confidence: 91 },
  { symbol: "ADAUSDT", name: "Cardano", price: 0.92, mama: 0.91, fama: 0.90, fisher: 0.22, cyberCycle: 0.005, bandpass: 0.003, signal: "Neutral", confidence: 55 },
];

const generateTimeframeData = (): TimeframeData[] => TIMEFRAMES.map(tf => ({
  timeframe: tf,
  signal: Math.random() > 0.5 ? "Bullish" : Math.random() > 0.5 ? "Bearish" : "Neutral",
  strength: Math.floor(Math.random() * 40) + 60,
  mama: 97400 + Math.random() * 200,
  fama: 97200 + Math.random() * 200,
}));

const generateCorrelationMatrix = (instruments: InstrumentData[]) => {
  const matrix: { pair: string; correlation: number }[] = [];
  for (let i = 0; i < instruments.length; i++) {
    for (let j = i + 1; j < instruments.length; j++) {
      matrix.push({
        pair: `${instruments[i].symbol}/${instruments[j].symbol}`,
        correlation: (Math.random() * 2 - 1).toFixed(2) as unknown as number,
      });
    }
  }
  return matrix;
};

const generateChartData = () => Array.from({ length: 30 }, (_, i) => ({
  time: i,
  price: 97500 + Math.sin(i / 5) * 500 + Math.random() * 200,
  mama: 97400 + Math.sin(i / 5) * 480,
  fama: 97200 + Math.sin(i / 6) * 460,
  fisher: Math.sin(i / 4) * 1.5,
  bandpass: Math.sin(i / 3) * 0.03,
}));

const EhlersDSPPanel = () => {
  const [instruments, setInstruments] = useState<InstrumentData[]>(generateMockInstruments());
  const [timeframeData, setTimeframeData] = useState<TimeframeData[]>(generateTimeframeData());
  const [correlationMatrix, setCorrelationMatrix] = useState(generateCorrelationMatrix(instruments));
  const [chartData, setChartData] = useState(generateChartData());
  const [selectedInstrument, setSelectedInstrument] = useState("BTCUSDT");
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setInstruments(generateMockInstruments());
      setTimeframeData(generateTimeframeData());
      setChartData(generateChartData());
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const getSignalBadge = (signal: string, confidence: number) => {
    const colorClass = signal === "Bullish" ? "bg-success text-success-foreground" : 
                       signal === "Bearish" ? "bg-destructive text-destructive-foreground" : 
                       "bg-muted text-muted-foreground";
    return <Badge className={colorClass}>{signal} ({confidence}%)</Badge>;
  };

  const getCorrelationColor = (corr: number) => {
    if (corr > 0.7) return "text-success";
    if (corr < -0.7) return "text-destructive";
    if (Math.abs(corr) < 0.3) return "text-muted-foreground";
    return corr > 0 ? "text-accent" : "text-warning";
  };

  return (
    <Card className="p-4 md:p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-accent" />
          <h2 className="text-lg md:text-xl font-semibold text-foreground">Ehlers DSP Analysis</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={isLive ? "border-success text-success" : ""}>
            {isLive ? "Live" : "Paused"}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setIsLive(!isLive)}>
            <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="multi-instrument" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="multi-instrument" className="text-xs md:text-sm">Multi-Instrument</TabsTrigger>
          <TabsTrigger value="multi-timeframe" className="text-xs md:text-sm">Multi-Timeframe</TabsTrigger>
          <TabsTrigger value="correlation" className="text-xs md:text-sm">Correlation Matrix</TabsTrigger>
        </TabsList>

        {/* Multi-Instrument Analysis */}
        <TabsContent value="multi-instrument" className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-muted-foreground">Instrument</th>
                  <th className="text-right p-2 text-muted-foreground">Price</th>
                  <th className="text-right p-2 text-muted-foreground">MAMA</th>
                  <th className="text-right p-2 text-muted-foreground">FAMA</th>
                  <th className="text-right p-2 text-muted-foreground">Fisher</th>
                  <th className="text-right p-2 text-muted-foreground">Cyber Cycle</th>
                  <th className="text-center p-2 text-muted-foreground">Signal</th>
                </tr>
              </thead>
              <tbody>
                {instruments.map((inst, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="p-2">
                      <div className="font-semibold text-foreground">{inst.symbol}</div>
                      <div className="text-xs text-muted-foreground">{inst.name}</div>
                    </td>
                    <td className="text-right p-2 font-mono text-foreground">${inst.price.toLocaleString()}</td>
                    <td className="text-right p-2 font-mono text-primary">{inst.mama.toLocaleString()}</td>
                    <td className="text-right p-2 font-mono text-accent">{inst.fama.toLocaleString()}</td>
                    <td className={`text-right p-2 font-mono ${inst.fisher > 0 ? 'text-success' : 'text-destructive'}`}>
                      {inst.fisher > 0 ? '+' : ''}{inst.fisher.toFixed(2)}
                    </td>
                    <td className={`text-right p-2 font-mono ${inst.cyberCycle > 0 ? 'text-success' : 'text-destructive'}`}>
                      {inst.cyberCycle > 0 ? '+' : ''}{inst.cyberCycle.toFixed(3)}
                    </td>
                    <td className="text-center p-2">{getSignalBadge(inst.signal, inst.confidence)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Multi-Timeframe Analysis */}
        <TabsContent value="multi-timeframe" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {instruments.map(inst => (
                  <SelectItem key={inst.symbol} value={inst.symbol}>{inst.symbol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
            {timeframeData.map((tf, idx) => (
              <div key={idx} className="p-3 bg-secondary/50 rounded-lg text-center border border-border">
                <div className="text-xs text-muted-foreground mb-1">{tf.timeframe}</div>
                <Badge className={
                  tf.signal === "Bullish" ? "bg-success text-success-foreground" :
                  tf.signal === "Bearish" ? "bg-destructive text-destructive-foreground" :
                  "bg-muted text-muted-foreground"
                } variant="outline">
                  {tf.signal === "Bullish" ? <TrendingUp className="w-3 h-3" /> : 
                   tf.signal === "Bearish" ? <TrendingDown className="w-3 h-3" /> : 
                   <BarChart3 className="w-3 h-3" />}
                </Badge>
                <div className="text-sm font-bold text-foreground mt-1">{tf.strength}%</div>
              </div>
            ))}
          </div>

          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} name="Price" />
                <Line type="monotone" dataKey="mama" stroke="hsl(var(--primary))" strokeWidth={1.5} dot={false} name="MAMA" />
                <Line type="monotone" dataKey="fama" stroke="hsl(var(--accent))" strokeWidth={1.5} dot={false} name="FAMA" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* Correlation Matrix */}
        <TabsContent value="correlation" className="space-y-4">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <h3 className="text-sm font-semibold text-foreground mb-3">DSP Signal Correlation Matrix</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {correlationMatrix.slice(0, 15).map((item, idx) => (
                <div key={idx} className="p-2 bg-secondary/50 rounded border border-border text-center">
                  <div className="text-xs text-muted-foreground truncate">{item.pair}</div>
                  <div className={`text-lg font-bold ${getCorrelationColor(Number(item.correlation))}`}>
                    {Number(item.correlation).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
              <div className="text-sm text-muted-foreground">Strong Positive</div>
              <div className="text-2xl font-bold text-success">
                {correlationMatrix.filter(c => Number(c.correlation) > 0.7).length}
              </div>
              <div className="text-xs text-muted-foreground">pairs correlated &gt; 0.7</div>
            </div>
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <div className="text-sm text-muted-foreground">Strong Negative</div>
              <div className="text-2xl font-bold text-destructive">
                {correlationMatrix.filter(c => Number(c.correlation) < -0.7).length}
              </div>
              <div className="text-xs text-muted-foreground">pairs correlated &lt; -0.7</div>
            </div>
            <div className="p-4 bg-muted border border-border rounded-lg">
              <div className="text-sm text-muted-foreground">Uncorrelated</div>
              <div className="text-2xl font-bold text-foreground">
                {correlationMatrix.filter(c => Math.abs(Number(c.correlation)) < 0.3).length}
              </div>
              <div className="text-xs text-muted-foreground">pairs |corr| &lt; 0.3</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EhlersDSPPanel;
