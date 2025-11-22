import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp } from "lucide-react";

const Ehlers = () => {
  const indicators = [
    { name: "Fisher Transform", value: "1.33", signal: "Bullish Cross", strength: 93, trend: "bullish" },
    { name: "Smoothed RSI", value: "67.2", signal: "Bullish", strength: 87, trend: "bullish" },
    { name: "Super Smoother", value: "+0.024", signal: "Trend Up", strength: 85, trend: "bullish" },
    { name: "MAMA (MESA Adaptive)", value: "104,400", signal: "Bullish", strength: 90, trend: "bullish" },
    { name: "FAMA (Following Adaptive)", value: "104,350", signal: "Following", strength: 88, trend: "bullish" },
    { name: "Instantaneous Trendline", value: "104,100", signal: "Uptrend", strength: 89, trend: "bullish" },
    { name: "Cyber Cycle", value: "+0.026", signal: "Rising", strength: 86, trend: "bullish" },
    { name: "Dominant Cycle", value: "24.0 hari", signal: "Strong", strength: 96, trend: "bullish" },
    { name: "Sinewave Indicator", value: "+0.021", signal: "Bullish phase", strength: 84, trend: "bullish" },
    { name: "Roofing Filter", value: "+0.017", signal: "Uptrend noise", strength: 80, trend: "bullish" },
    { name: "Decycler", value: "+0.028", signal: "Bullish", strength: 82, trend: "bullish" },
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
          Combined confidence across all digital filter indicators
        </p>
      </Card>


      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Digital Filter Indicators</h2>
        <div className="space-y-3">
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
    </div>
  );
};

export default Ehlers;
