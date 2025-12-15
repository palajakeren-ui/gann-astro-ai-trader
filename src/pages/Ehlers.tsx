import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp } from "lucide-react";
import MAMAFAMAChart from "@/components/charts/MAMAFAMAChart";
import MAMAFAMACalculator from "@/components/calculators/MAMAFAMACalculator";
import MAMAFAMAAlerts from "@/components/alerts/MAMAFAMAAlerts";
import EhlersRealtimeChart from "@/components/charts/EhlersRealtimeChart";

const Ehlers = () => {
  // Mock chart data for MAMA/FAMA visualization
  const chartData = [
    { time: "10:00", price: 104.20, mama: 104.15, fama: 104.10 },
    { time: "10:15", price: 104.35, mama: 104.22, fama: 104.18 },
    { time: "10:30", price: 104.28, mama: 104.26, fama: 104.22 },
    { time: "10:45", price: 104.42, mama: 104.32, fama: 104.28 },
    { time: "11:00", price: 104.55, mama: 104.40, fama: 104.35 },
    { time: "11:15", price: 104.48, mama: 104.44, fama: 104.39 },
    { time: "11:30", price: 104.38, mama: 104.42, fama: 104.41 },
    { time: "11:45", price: 104.32, mama: 104.38, fama: 104.40 },
    { time: "12:00", price: 104.45, mama: 104.40, fama: 104.42 },
    { time: "12:15", price: 104.58, mama: 104.46, fama: 104.44 },
    { time: "12:30", price: 104.65, mama: 104.52, fama: 104.48 },
    { time: "12:45", price: 104.72, mama: 104.58, fama: 104.52 },
    { time: "13:00", price: 104.80, mama: 104.65, fama: 104.58 },
    { time: "13:15", price: 104.75, mama: 104.70, fama: 104.62 },
    { time: "13:30", price: 104.68, mama: 104.71, fama: 104.66 },
    { time: "13:45", price: 104.62, mama: 104.68, fama: 104.67 },
    { time: "14:00", price: 104.70, mama: 104.68, fama: 104.68 },
    { time: "14:15", price: 104.78, mama: 104.72, fama: 104.70 },
  ];

  const mockCrossovers = [
    { index: 7, type: 'bearish' as const, mama: 104.38, fama: 104.40 },
    { index: 8, type: 'bullish' as const, mama: 104.40, fama: 104.42 },
  ];

  const indicators = [
    { name: "Fisher Transform", value: "1.33", signal: "Bullish Cross", strength: 93, trend: "bullish" },
    { name: "Smoothed RSI", value: "67.2", signal: "Bullish", strength: 87, trend: "bullish" },
    { name: "Super Smoother", value: "+0.024", signal: "Trend Up", strength: 85, trend: "bullish" },
    { name: "MAMA (MESA Adaptive)", value: "104,400", signal: "Bullish", strength: 90, trend: "bullish" },
    { name: "FAMA (Following Adaptive)", value: "104,350", signal: "Following", strength: 88, trend: "bullish" },
    { name: "Instantaneous Trendline", value: "104,100", signal: "Uptrend", strength: 89, trend: "bullish" },
    { name: "Cyber Cycle", value: "+0.026", signal: "Rising", strength: 86, trend: "bullish" },
    { name: "Dominant Cycle", value: "24.0 days", signal: "Strong", strength: 96, trend: "bullish" },
    { name: "Sinewave Indicator", value: "+0.021", signal: "Bullish phase", strength: 84, trend: "bullish" },
    { name: "Roofing Filter", value: "+0.017", signal: "Uptrend noise", strength: 80, trend: "bullish" },
    { name: "Decycler", value: "+0.028", signal: "Bullish", strength: 82, trend: "bullish" },
    { name: "Bandpass Filter", value: "+0.015", signal: "Cycle Peak", strength: 88, trend: "bullish" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Activity className="w-8 h-8 mr-3 text-accent" />
          John F. Ehlers' Digital Filters
        </h1>
        <p className="text-muted-foreground">Advanced signal processing for market analysis</p>
      </div>

      <Card className="p-6 border-border bg-card">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Overall Analysis Score</h2>
          <Badge className="bg-success text-success-foreground text-lg px-4 py-2">88%</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Combined confidence across all digital filter indicators (including Bandpass Filter)
        </p>
      </Card>

      {/* Interactive Real-Time Chart */}
      <EhlersRealtimeChart currentPrice={47509} />

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Digital Filter Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {indicators.map((indicator, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors"
            >
              <div className="flex-1">
                <p className="font-semibold text-foreground">{indicator.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-muted-foreground font-mono">{indicator.value}</p>
                  <Badge
                    variant="outline"
                    className="border-success text-success bg-success/10"
                  >
                    {indicator.signal}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                  <p className="text-lg font-bold text-foreground">{indicator.strength}%</p>
                </div>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bandpass Filter Detail */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-primary" />
          Bandpass Filter Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Center Frequency</p>
            <p className="text-2xl font-bold text-foreground">20 Bars</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Bandwidth</p>
            <p className="text-2xl font-bold text-foreground">0.30</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Current Signal</p>
            <p className="text-2xl font-bold text-success">+0.015</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          The Bandpass Filter isolates the dominant cycle component, removing both high-frequency noise and low-frequency trend. 
          Positive values indicate bullish cycle phase, negative values indicate bearish phase.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MAMAFAMAChart data={chartData} crossovers={mockCrossovers} />
        <MAMAFAMACalculator />
      </div>

      <MAMAFAMAAlerts />
    </div>
  );
};

export default Ehlers;
