import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, TrendingDown } from "lucide-react";

const Options = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Target className="w-8 h-8 mr-3 text-accent" />
          Options Analysis
        </h1>
        <p className="text-muted-foreground">Greeks, volatility surface & flow analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Implied Volatility</h3>
          <p className="text-2xl font-bold text-foreground">28.5%</p>
          <Badge variant="outline" className="mt-2 bg-warning/10 text-warning border-warning/20">
            Elevated
          </Badge>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Put/Call Ratio</h3>
          <p className="text-2xl font-bold text-foreground">0.85</p>
          <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
            Bullish
          </Badge>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Options Flow</h3>
          <p className="text-2xl font-bold text-foreground">Positive</p>
          <div className="mt-2 flex items-center text-success">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">$2.4M calls</span>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Max Pain</h3>
          <p className="text-2xl font-bold text-foreground">1.0850</p>
          <Badge variant="outline" className="mt-2">Near Current</Badge>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Greeks Overview</h2>
          <div className="space-y-4">
            {[
              { name: "Delta", value: "0.58", desc: "Directional exposure" },
              { name: "Gamma", value: "0.032", desc: "Delta sensitivity" },
              { name: "Theta", value: "-0.015", desc: "Time decay" },
              { name: "Vega", value: "0.125", desc: "Volatility sensitivity" },
            ].map((greek, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-semibold text-foreground">{greek.name}</p>
                  <p className="text-xs text-muted-foreground">{greek.desc}</p>
                </div>
                <span className="text-lg font-mono font-bold text-foreground">{greek.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Unusual Activity</h2>
          <div className="space-y-3">
            {[
              { symbol: "EURUSD", type: "Call", strike: 1.09, volume: 1250, sentiment: "Bullish" },
              { symbol: "BTCUSDT", type: "Call", strike: 45000, volume: 850, sentiment: "Bullish" },
              { symbol: "XAUUSD", type: "Put", strike: 2000, volume: 680, sentiment: "Bearish" },
            ].map((activity, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-foreground">{activity.symbol}</span>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                  <Badge
                    variant={activity.sentiment === "Bullish" ? "default" : "destructive"}
                    className={activity.sentiment === "Bullish" ? "bg-success" : ""}
                  >
                    {activity.sentiment}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Strike: {activity.strike}</span>
                  <span className="text-foreground">{activity.volume} contracts</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Volatility Surface</h2>
        <div className="bg-secondary/30 rounded-lg h-[400px] flex items-center justify-center border border-border">
          <div className="text-center space-y-4">
            <Target className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-semibold text-foreground">IV Surface Chart</p>
              <p className="text-sm text-muted-foreground">
                3D visualization of implied volatility across strikes and maturities
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Options;
