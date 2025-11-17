import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Play, Download } from "lucide-react";

const Backtest = () => {
  const results = [
    { metric: "Total Return", value: "+45.2%", good: true },
    { metric: "Sharpe Ratio", value: "2.4", good: true },
    { metric: "Max Drawdown", value: "-8.5%", good: true },
    { metric: "Win Rate", value: "67.8%", good: true },
    { metric: "Profit Factor", value: "2.8", good: true },
    { metric: "Total Trades", value: "234", good: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-accent" />
            Backtest Results
          </h1>
          <p className="text-muted-foreground">Strategy performance analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Run New Test
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Card className="p-6 border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Test Configuration</h2>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Completed
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Period</p>
            <p className="text-sm font-semibold text-foreground">Jan 2023 - Dec 2024</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Initial Capital</p>
            <p className="text-sm font-semibold text-foreground">$100,000</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Strategy</p>
            <p className="text-sm font-semibold text-foreground">Ensemble Multi</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Timeframe</p>
            <p className="text-sm font-semibold text-foreground">H4</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {results.map((result, idx) => (
          <Card key={idx} className="p-4 border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">{result.metric}</p>
            <p
              className={`text-xl font-bold ${
                result.good
                  ? result.value.includes("-")
                    ? "text-warning"
                    : "text-success"
                  : "text-foreground"
              }`}
            >
              {result.value}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Equity Curve</h2>
        <div className="bg-secondary/30 rounded-lg h-[400px] flex items-center justify-center border border-border">
          <div className="text-center space-y-4">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-semibold text-foreground">Performance Chart</p>
              <p className="text-sm text-muted-foreground">
                Equity growth and drawdown visualization
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Monthly Returns</h2>
          <div className="space-y-2">
            {[
              { month: "Jan 2024", return: "+3.2%" },
              { month: "Feb 2024", return: "+5.8%" },
              { month: "Mar 2024", return: "-1.2%" },
              { month: "Apr 2024", return: "+4.5%" },
              { month: "May 2024", return: "+6.1%" },
              { month: "Jun 2024", return: "+2.8%" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">{item.month}</span>
                <span
                  className={`text-sm font-semibold ${
                    item.return.includes("-") ? "text-destructive" : "text-success"
                  }`}
                >
                  {item.return}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Trade Statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Total Trades</span>
              <span className="text-sm font-semibold text-foreground">234</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Winning Trades</span>
              <span className="text-sm font-semibold text-success">159 (67.8%)</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Losing Trades</span>
              <span className="text-sm font-semibold text-destructive">75 (32.2%)</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Avg Win</span>
              <span className="text-sm font-semibold text-success">+$425</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Avg Loss</span>
              <span className="text-sm font-semibold text-destructive">-$180</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Largest Win</span>
              <span className="text-sm font-semibold text-success">+$1,250</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Backtest;
