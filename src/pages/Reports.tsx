import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, Download, Printer, Calendar, TrendingUp, TrendingDown, Activity, Target,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Filter, RefreshCw
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts";
import { toast } from "sonner";

const COLORS = ['hsl(var(--success))', 'hsl(var(--destructive))', 'hsl(var(--accent))', 'hsl(var(--primary))'];

const tradingInstruments = [
  { symbol: "BTCUSD", name: "Bitcoin", trades: 45, winRate: 72.5, pnl: 8540.25, category: "Crypto" },
  { symbol: "ETHUSD", name: "Ethereum", trades: 32, winRate: 68.2, pnl: 3210.50, category: "Crypto" },
  { symbol: "XAUUSD", name: "Gold", trades: 28, winRate: 75.0, pnl: 4520.00, category: "Commodities" },
  { symbol: "EURUSD", name: "Euro/USD", trades: 15, winRate: 60.0, pnl: -850.25, category: "Forex" },
  { symbol: "SPX500", name: "S&P 500", trades: 7, winRate: 85.7, pnl: 2100.00, category: "Indices" },
];

const performanceByPeriod = [
  { period: "Week 1", pnl: 2500, trades: 28, winRate: 71 },
  { period: "Week 2", pnl: 3200, trades: 32, winRate: 75 },
  { period: "Week 3", pnl: -800, trades: 25, winRate: 52 },
  { period: "Week 4", pnl: 4520, trades: 42, winRate: 78 },
];

const gannPerformanceData = [
  { name: "Square of 9", accuracy: 78.5, signals: 45, profitable: 35 },
  { name: "Gann Fan", accuracy: 72.3, signals: 42, profitable: 30 },
  { name: "Hexagon", accuracy: 68.9, signals: 18, profitable: 12 },
  { name: "Time Cycles", accuracy: 65.4, signals: 35, profitable: 23 },
  { name: "Gann Box 0-360°", accuracy: 74.2, signals: 28, profitable: 21 },
];

const Reports = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30d");
  const [isLoading, setIsLoading] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const mockReportData = {
    summary: {
      totalTrades: 127,
      winRate: 68.5,
      profitFactor: 2.34,
      netProfit: 15420.50,
      maxDrawdown: 8.2,
      sharpeRatio: 1.87,
    },
    gannAnalysis: {
      squareOf9Accuracy: 78.5,
      fanAngleHits: 42,
      timeCycleConfirmations: 35,
      hexagonPivots: 18,
    },
    ehlersIndicators: {
      compositeScore: 88,
      fisherTransformSignals: 23,
      mamaFamaConfluences: 31,
      cycleIdentifications: 15,
    },
    forecasting: {
      shortTermAccuracy: 72.3,
      mediumTermAccuracy: 65.8,
      longTermAccuracy: 58.4,
      totalForecasts: 89,
    }
  };

  const filteredInstruments = selectedInstrument === "all" 
    ? tradingInstruments 
    : tradingInstruments.filter(i => i.symbol === selectedInstrument);

  const handleExportPDF = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Report exported to PDF successfully!");
      setIsLoading(false);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Report data refreshed!");
      setIsLoading(false);
    }, 1000);
  };

  const pieData = tradingInstruments.map(i => ({ name: i.symbol, value: Math.abs(i.pnl) }));

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-foreground">Analysis Reports</h1>
          <p className="text-sm text-muted-foreground">Comprehensive trading analysis and performance reports</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button size="sm" onClick={handleExportPDF} disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 border-border bg-card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instruments</SelectItem>
                {tradingInstruments.map(i => (
                  <SelectItem key={i.symbol} value={i.symbol}>{i.symbol} - {i.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Report Header */}
      <Card className="p-4 md:p-6 border-border bg-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-foreground">Gann Quant AI Analysis Report</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Generated: {currentDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Period: {selectedPeriod === "30d" ? "Last 30 Days" : selectedPeriod}</span>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="summary" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-5 gap-1">
            <TabsTrigger value="summary" className="text-xs md:text-sm">Summary</TabsTrigger>
            <TabsTrigger value="instruments" className="text-xs md:text-sm">Instruments</TabsTrigger>
            <TabsTrigger value="gann" className="text-xs md:text-sm">WD Gann</TabsTrigger>
            <TabsTrigger value="ehlers" className="text-xs md:text-sm">Ehlers DSP</TabsTrigger>
            <TabsTrigger value="forecast" className="text-xs md:text-sm">Forecasting</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="summary" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Total Trades</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{mockReportData.summary.totalTrades}</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
              <p className="text-xl md:text-2xl font-bold text-success">{mockReportData.summary.winRate}%</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Profit Factor</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{mockReportData.summary.profitFactor}</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
              <p className="text-xl md:text-2xl font-bold text-success">${mockReportData.summary.netProfit.toLocaleString()}</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Max Drawdown</p>
              <p className="text-xl md:text-2xl font-bold text-destructive">{mockReportData.summary.maxDrawdown}%</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Sharpe Ratio</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{mockReportData.summary.sharpeRatio}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card className="p-4 md:p-6 border-border bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Performance</h3>
              <div className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceByPeriod}>
                    <defs>
                      <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Area type="monotone" dataKey="pnl" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorPnl)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 md:p-6 border-border bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">P&L by Instrument</h3>
              <div className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="instruments" className="space-y-4 mt-4">
          <Card className="p-4 md:p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Trading Instruments Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Symbol</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Trades</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Win Rate</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstruments.map((instrument) => (
                    <tr key={instrument.symbol} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-2">
                        <span className="font-semibold text-foreground">{instrument.symbol}</span>
                      </td>
                      <td className="py-3 px-2 text-sm text-muted-foreground">{instrument.name}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline">{instrument.category}</Badge>
                      </td>
                      <td className="py-3 px-2 text-center text-foreground">{instrument.trades}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={instrument.winRate >= 65 ? "bg-success" : instrument.winRate >= 50 ? "bg-accent" : "bg-destructive"}>
                          {instrument.winRate}%
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className={`font-semibold flex items-center justify-end gap-1 ${instrument.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {instrument.pnl >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          ${Math.abs(instrument.pnl).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-4 md:p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Instrument P&L Comparison</h3>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tradingInstruments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="symbol" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="pnl" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="gann" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Square of 9 Accuracy</p>
              <p className="text-xl md:text-2xl font-bold text-success">{mockReportData.gannAnalysis.squareOf9Accuracy}%</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Fan Angle Hits</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{mockReportData.gannAnalysis.fanAngleHits}</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Time Cycle Confirmations</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{mockReportData.gannAnalysis.timeCycleConfirmations}</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Hexagon Pivots</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{mockReportData.gannAnalysis.hexagonPivots}</p>
            </Card>
          </div>

          <Card className="p-4 md:p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">WD Gann Geometry Analysis</h3>
            <div className="space-y-3">
              {gannPerformanceData.map((item, idx) => (
                <div key={idx} className="p-3 md:p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <span className="font-semibold text-foreground">{item.name}</span>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                      <Badge variant="outline" className="text-success border-success">
                        {item.accuracy}% accurate
                      </Badge>
                      <span className="text-sm text-muted-foreground">{item.signals} signals</span>
                      <span className="text-sm text-success">{item.profitable} profitable</span>
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success rounded-full transition-all"
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ehlers" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Composite Score</p>
              <p className="text-xl md:text-2xl font-bold text-success">{mockReportData.ehlersIndicators.compositeScore}%</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Fisher Transform Signals</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{mockReportData.ehlersIndicators.fisherTransformSignals}</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">MAMA/FAMA Confluences</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{mockReportData.ehlersIndicators.mamaFamaConfluences}</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Cycle Identifications</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{mockReportData.ehlersIndicators.cycleIdentifications}</p>
            </Card>
          </div>

          <Card className="p-4 md:p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Ehlers DSP Indicators Performance</h3>
            <div className="space-y-3">
              {[
                { name: "Fisher Transform", accuracy: 82.1, trend: "Bullish" },
                { name: "MAMA/FAMA", accuracy: 79.4, trend: "Bullish" },
                { name: "Super Smoother", accuracy: 76.8, trend: "Neutral" },
                { name: "Cyber Cycle", accuracy: 74.2, trend: "Bullish" },
                { name: "Dominant Cycle", accuracy: 71.5, trend: "Bearish" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="text-foreground">{item.name}</span>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={
                      item.trend === "Bullish" ? "text-success border-success" :
                      item.trend === "Bearish" ? "text-destructive border-destructive" :
                      "text-muted-foreground border-muted"
                    }>
                      {item.trend}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">{item.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Short-Term Accuracy</p>
              <p className="text-xl md:text-2xl font-bold text-success">{mockReportData.forecasting.shortTermAccuracy}%</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Medium-Term Accuracy</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{mockReportData.forecasting.mediumTermAccuracy}%</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Long-Term Accuracy</p>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground">{mockReportData.forecasting.longTermAccuracy}%</p>
            </Card>
            <Card className="p-3 md:p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Total Forecasts</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{mockReportData.forecasting.totalForecasts}</p>
            </Card>
          </div>

          <Card className="p-4 md:p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Forecasting Performance by Timeframe</h3>
            <div className="space-y-3">
              {[
                { timeframe: "1 Day - 1 Week", accuracy: 82.5, forecasts: 34 },
                { timeframe: "1 Week - 1 Month", accuracy: 75.2, forecasts: 28 },
                { timeframe: "1 Month - 1 Year", accuracy: 68.4, forecasts: 18 },
                { timeframe: "1 Year - 10 Years", accuracy: 54.8, forecasts: 7 },
                { timeframe: "10 Years - 365 Years", accuracy: 42.1, forecasts: 2 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-secondary/50 rounded-lg gap-2">
                  <span className="text-foreground">{item.timeframe}</span>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={
                      item.accuracy >= 70 ? "text-success border-success" :
                      item.accuracy >= 50 ? "text-accent border-accent" :
                      "text-muted-foreground border-muted"
                    }>
                      {item.accuracy}% accurate
                    </Badge>
                    <span className="text-sm text-muted-foreground">{item.forecasts} forecasts</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
