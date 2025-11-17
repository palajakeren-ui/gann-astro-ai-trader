import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Risk = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Shield className="w-8 h-8 mr-3 text-success" />
          Risk Management
        </h1>
        <p className="text-muted-foreground">Portfolio risk & position monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Risk Status</h3>
          <p className="text-2xl font-bold text-success">Low</p>
          <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
            <Shield className="w-3 h-3 mr-1" />
            Healthy
          </Badge>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Total Exposure</h3>
          <p className="text-2xl font-bold text-foreground">2.1%</p>
          <Badge variant="outline" className="mt-2">of equity</Badge>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Max Drawdown</h3>
          <p className="text-2xl font-bold text-warning">-3.2%</p>
          <Badge variant="outline" className="mt-2 bg-warning/10 text-warning border-warning/20">
            Within limits
          </Badge>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Sharpe Ratio</h3>
          <p className="text-2xl font-bold text-foreground">2.4</p>
          <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
            Excellent
          </Badge>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Position Sizing</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Kelly Fraction</span>
                <span className="text-sm font-semibold text-foreground">0.5x (Half Kelly)</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Risk Per Trade</span>
                <span className="text-sm font-semibold text-foreground">2.0%</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Max Position Size</span>
                <span className="text-sm font-semibold text-foreground">5.0%</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                  <p className="text-xl font-bold text-success">67.8%</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-1">Avg R:R</p>
                  <p className="text-xl font-bold text-foreground">2.4</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Risk Alerts</h2>
          <div className="space-y-3">
            {[
              { severity: "warning", message: "EURUSD position near max size", action: "Watch" },
              { severity: "info", message: "Volatility increased 15%", action: "Monitor" },
              { severity: "success", message: "All stop losses in place", action: "OK" },
            ].map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  alert.severity === "warning"
                    ? "bg-warning/5 border-warning/20"
                    : alert.severity === "info"
                    ? "bg-accent/5 border-accent/20"
                    : "bg-success/5 border-success/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {alert.severity === "warning" && (
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    )}
                    {alert.severity === "info" && (
                      <TrendingDown className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    )}
                    {alert.severity === "success" && (
                      <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm text-foreground">{alert.message}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      alert.severity === "warning"
                        ? "border-warning text-warning"
                        : alert.severity === "info"
                        ? "border-accent text-accent"
                        : "border-success text-success"
                    }
                  >
                    {alert.action}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Equity Curve</h2>
        <div className="bg-secondary/30 rounded-lg h-[300px] flex items-center justify-center border border-border">
          <div className="text-center space-y-4">
            <TrendingDown className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-semibold text-foreground">Performance Chart</p>
              <p className="text-sm text-muted-foreground">
                Historical equity and drawdown visualization
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Stop Loss Settings</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ATR Multiplier</span>
              <span className="font-semibold text-foreground">2.0x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max SL %</span>
              <span className="font-semibold text-foreground">3.0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trailing Stop</span>
              <span className="font-semibold text-success">Active</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Correlation Matrix</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">EURUSD-GBPUSD</span>
              <span className="font-semibold text-foreground">0.85</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">BTC-ETH</span>
              <span className="font-semibold text-foreground">0.92</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GOLD-USD</span>
              <span className="font-semibold text-foreground">-0.65</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Risk Limits</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Loss Limit</span>
              <span className="font-semibold text-foreground">5.0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Open Positions</span>
              <span className="font-semibold text-foreground">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Leverage</span>
              <span className="font-semibold text-foreground">1:3</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Risk;
