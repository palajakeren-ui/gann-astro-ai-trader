import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp } from "lucide-react";

const Ehlers = () => {
  const indicators = [
    { name: "MAMA", value: 1.0868, signal: "BUY", strength: 78 },
    { name: "FAMA", value: 1.0862, signal: "BUY", strength: 75 },
    { name: "Fisher Transform", value: 1.24, signal: "BUY", strength: 82 },
    { name: "Cyber Cycle", value: 0.65, signal: "BULLISH", strength: 70 },
    { name: "Super Smoother", value: 1.0870, signal: "UP", strength: 68 },
    { name: "Roofing Filter", value: 0.0012, signal: "CLEAN", strength: 85 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Activity className="w-8 h-8 mr-3 text-accent" />
          Ehlers DSP Indicators
        </h1>
        <p className="text-muted-foreground">Digital signal processing for market analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Dominant Cycle</h3>
          <p className="text-2xl font-bold text-foreground">23 bars</p>
          <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
            Stable
          </Badge>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Trend Strength</h3>
          <p className="text-2xl font-bold text-foreground">Strong</p>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-success" />
            <span className="text-sm text-success">Bullish</span>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Signal Quality</h3>
          <p className="text-2xl font-bold text-foreground">87%</p>
          <Badge variant="outline" className="mt-2 bg-accent/10 text-accent border-accent/20">
            High Confidence
          </Badge>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Active Indicators</h2>
          <div className="space-y-3">
            {indicators.map((indicator, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
              >
                <div>
                  <p className="font-semibold text-foreground">{indicator.name}</p>
                  <p className="text-sm text-muted-foreground font-mono">{indicator.value}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="outline"
                    className={
                      indicator.signal.includes("BUY") || indicator.signal === "BULLISH"
                        ? "border-success text-success"
                        : "border-accent text-accent"
                    }
                  >
                    {indicator.signal}
                  </Badge>
                  <span className="text-sm font-semibold text-foreground">{indicator.strength}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            MAMA/FAMA Crossover
          </h2>
          <div className="bg-secondary/30 rounded-lg h-[300px] flex items-center justify-center border border-border mb-4">
            <div className="text-center">
              <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Adaptive Moving Average Chart</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Last Crossover</p>
              <p className="text-lg font-bold text-success">Bullish (3h ago)</p>
            </div>
            <Badge className="bg-success">Active Signal</Badge>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Cycle Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: "Short Cycle", value: "8 bars", status: "Active" },
            { name: "Medium Cycle", value: "23 bars", status: "Dominant" },
            { name: "Long Cycle", value: "55 bars", status: "Building" },
            { name: "Trend Mode", value: "Uptrend", status: "Strong" },
          ].map((cycle, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">{cycle.name}</p>
              <p className="text-lg font-bold text-foreground">{cycle.value}</p>
              <Badge variant="outline" className="mt-2">
                {cycle.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Ehlers;
