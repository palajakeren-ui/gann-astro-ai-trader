import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Printer, Calendar, TrendingUp, TrendingDown, Activity, Target } from "lucide-react";

const Reports = () => {
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

  const handleExportPDF = () => {
    console.log("Exporting report to PDF...");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analysis Reports</h1>
          <p className="text-muted-foreground">Comprehensive trading analysis and performance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Header */}
      <Card className="p-6 border-border bg-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Gann Quant AI Analysis Report</h2>
              <p className="text-sm text-muted-foreground">Generated: {currentDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Period: Last 30 Days</span>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="gann">Gann Analysis</TabsTrigger>
          <TabsTrigger value="ehlers">Ehlers DSP</TabsTrigger>
          <TabsTrigger value="forecast">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Total Trades</p>
              <p className="text-2xl font-bold text-foreground">{mockReportData.summary.totalTrades}</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-success">{mockReportData.summary.winRate}%</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Profit Factor</p>
              <p className="text-2xl font-bold text-foreground">{mockReportData.summary.profitFactor}</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
              <p className="text-2xl font-bold text-success">${mockReportData.summary.netProfit.toLocaleString()}</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Max Drawdown</p>
              <p className="text-2xl font-bold text-destructive">{mockReportData.summary.maxDrawdown}%</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Sharpe Ratio</p>
              <p className="text-2xl font-bold text-foreground">{mockReportData.summary.sharpeRatio}</p>
            </Card>
          </div>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-foreground">Winning Trades</span>
                </div>
                <span className="font-bold text-success">87 trades</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  <span className="text-foreground">Losing Trades</span>
                </div>
                <span className="font-bold text-destructive">40 trades</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  <span className="text-foreground">Average Trade Duration</span>
                </div>
                <span className="font-bold text-foreground">4.2 hours</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="gann" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Square of 9 Accuracy</p>
              <p className="text-2xl font-bold text-success">{mockReportData.gannAnalysis.squareOf9Accuracy}%</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Fan Angle Hits</p>
              <p className="text-2xl font-bold text-foreground">{mockReportData.gannAnalysis.fanAngleHits}</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Time Cycle Confirmations</p>
              <p className="text-2xl font-bold text-foreground">{mockReportData.gannAnalysis.timeCycleConfirmations}</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Hexagon Pivots</p>
              <p className="text-2xl font-bold text-foreground">{mockReportData.gannAnalysis.hexagonPivots}</p>
            </Card>
          </div>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Gann Geometry Analysis</h3>
            <div className="space-y-3">
              {[
                { name: "Square of 9 Levels", accuracy: 78.5, signals: 45 },
                { name: "Gann Fan Angles", accuracy: 72.3, signals: 42 },
                { name: "Hexagon Geometry", accuracy: 68.9, signals: 18 },
                { name: "Time Cycles", accuracy: 65.4, signals: 35 },
                { name: "Gann Box 0-360°", accuracy: 74.2, signals: 28 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <span className="text-foreground">{item.name}</span>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-success border-success">
                      {item.accuracy}% accurate
                    </Badge>
                    <span className="text-sm text-muted-foreground">{item.signals} signals</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ehlers" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Composite Score</p>
              <p className="text-2xl font-bold text-success">{mockReportData.ehlersIndicators.compositeScore}%</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Fisher Transform Signals</p>
              <p className="text-2xl font-bold text-foreground">{mockReportData.ehlersIndicators.fisherTransformSignals}</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">MAMA/FAMA Confluences</p>
              <p className="text-2xl font-bold text-foreground">{mockReportData.ehlersIndicators.mamaFamaConfluences}</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Cycle Identifications</p>
              <p className="text-2xl font-bold text-foreground">{mockReportData.ehlersIndicators.cycleIdentifications}</p>
            </Card>
          </div>

          <Card className="p-6 border-border bg-card">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Short-Term Accuracy</p>
              <p className="text-2xl font-bold text-success">{mockReportData.forecasting.shortTermAccuracy}%</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Medium-Term Accuracy</p>
              <p className="text-2xl font-bold text-foreground">{mockReportData.forecasting.mediumTermAccuracy}%</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Long-Term Accuracy</p>
              <p className="text-2xl font-bold text-muted-foreground">{mockReportData.forecasting.longTermAccuracy}%</p>
            </Card>
            <Card className="p-4 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Total Forecasts</p>
              <p className="text-2xl font-bold text-foreground">{mockReportData.forecasting.totalForecasts}</p>
            </Card>
          </div>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Forecasting Performance by Timeframe</h3>
            <div className="space-y-3">
              {[
                { timeframe: "1 Day - 1 Week", accuracy: 82.5, forecasts: 34 },
                { timeframe: "1 Week - 1 Month", accuracy: 75.2, forecasts: 28 },
                { timeframe: "1 Month - 1 Year", accuracy: 68.4, forecasts: 18 },
                { timeframe: "1 Year - 10 Years", accuracy: 54.8, forecasts: 7 },
                { timeframe: "10 Years - 365 Years", accuracy: 42.1, forecasts: 2 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
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
