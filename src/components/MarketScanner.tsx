import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ScannerSignal {
  symbol: string;
  timeframe: string;
  signal: "BUY" | "SELL";
  strength: "STRONG" | "MEDIUM" | "WEAK";
  price: number;
  change: number;
  strategies: string[];
}

const mockSignals: ScannerSignal[] = [
  {
    symbol: "EURUSD",
    timeframe: "H4",
    signal: "BUY",
    strength: "STRONG",
    price: 1.0875,
    change: 0.42,
    strategies: ["Gann", "Ehlers", "ML"],
  },
  {
    symbol: "BTCUSDT",
    timeframe: "D1",
    signal: "BUY",
    strength: "STRONG",
    price: 43250.50,
    change: 2.15,
    strategies: ["Gann", "Astro", "ML"],
  },
  {
    symbol: "XAUUSD",
    timeframe: "H1",
    signal: "SELL",
    strength: "MEDIUM",
    price: 2045.30,
    change: -0.65,
    strategies: ["Ehlers", "Pattern"],
  },
  {
    symbol: "US500",
    timeframe: "H4",
    signal: "BUY",
    strength: "MEDIUM",
    price: 4782.50,
    change: 0.88,
    strategies: ["ML", "Options"],
  },
];

export const MarketScanner = () => {
  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Market Scanner</h2>
        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
          Live
        </Badge>
      </div>

      <div className="space-y-3">
        {mockSignals.map((signal, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">{signal.symbol}</span>
                <span className="text-xs text-muted-foreground">{signal.timeframe}</span>
              </div>
              
              <Badge
                variant={signal.signal === "BUY" ? "default" : "destructive"}
                className={signal.signal === "BUY" ? "bg-success" : ""}
              >
                {signal.signal}
              </Badge>
              
              <Badge
                variant="outline"
                className={
                  signal.strength === "STRONG"
                    ? "border-success text-success"
                    : signal.strength === "MEDIUM"
                    ? "border-accent text-accent"
                    : "border-muted-foreground text-muted-foreground"
                }
              >
                {signal.strength}
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex flex-wrap gap-1">
                {signal.strategies.map((strategy, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {strategy}
                  </Badge>
                ))}
              </div>

              <div className="text-right">
                <div className="font-mono text-sm text-foreground">{signal.price}</div>
                <div
                  className={`text-xs flex items-center ${
                    signal.change > 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {signal.change > 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(signal.change)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
