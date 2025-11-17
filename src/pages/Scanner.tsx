import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import { useState } from "react";

const mockResults = [
  {
    symbol: "EURUSD",
    asset: "Forex",
    signal: "BUY",
    strength: "STRONG",
    price: 1.0875,
    gann: 85,
    astro: 72,
    ehlers: 78,
    ml: 82,
    confluence: 4,
  },
  {
    symbol: "BTCUSDT",
    asset: "Crypto",
    signal: "BUY",
    strength: "STRONG",
    price: 43250,
    gann: 88,
    astro: 90,
    ehlers: 75,
    ml: 85,
    confluence: 4,
  },
  {
    symbol: "XAUUSD",
    asset: "Commodity",
    signal: "SELL",
    strength: "MEDIUM",
    price: 2045.30,
    gann: 45,
    astro: 38,
    ehlers: 62,
    ml: 55,
    confluence: 2,
  },
  {
    symbol: "GBPJPY",
    asset: "Forex",
    signal: "BUY",
    strength: "MEDIUM",
    price: 184.52,
    gann: 68,
    astro: 72,
    ehlers: 65,
    ml: 70,
    confluence: 3,
  },
  {
    symbol: "US500",
    asset: "Index",
    signal: "BUY",
    strength: "WEAK",
    price: 4782.50,
    gann: 55,
    astro: 48,
    ehlers: 58,
    ml: 62,
    confluence: 2,
  },
];

const Scanner = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Market Scanner</h1>
          <p className="text-muted-foreground">Multi-asset opportunity detector</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 border-border bg-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select className="px-4 py-2 bg-input border border-border rounded-md text-foreground">
            <option>All Assets</option>
            <option>Forex</option>
            <option>Crypto</option>
            <option>Indices</option>
            <option>Commodities</option>
          </select>
          <select className="px-4 py-2 bg-input border border-border rounded-md text-foreground">
            <option>All Timeframes</option>
            <option>M15</option>
            <option>H1</option>
            <option>H4</option>
            <option>D1</option>
          </select>
          <Button className="w-full">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Scanner Results */}
      <Card className="p-6 border-border bg-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Scan Results ({mockResults.length})
          </h2>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Last scan: 2 min ago
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Symbol
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Asset
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Signal
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Strength
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Price
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Gann
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Astro
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Ehlers
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">
                  ML
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Confluence
                </th>
              </tr>
            </thead>
            <tbody>
              {mockResults.map((result, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-secondary/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-semibold text-foreground">{result.symbol}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline">{result.asset}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant={result.signal === "BUY" ? "default" : "destructive"}
                      className={result.signal === "BUY" ? "bg-success" : ""}
                    >
                      {result.signal}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant="outline"
                      className={
                        result.strength === "STRONG"
                          ? "border-success text-success"
                          : result.strength === "MEDIUM"
                          ? "border-accent text-accent"
                          : "border-muted-foreground text-muted-foreground"
                      }
                    >
                      {result.strength}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-foreground">
                    {result.price}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`font-semibold ${
                        result.gann > 70 ? "text-success" : "text-muted-foreground"
                      }`}
                    >
                      {result.gann}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`font-semibold ${
                        result.astro > 70 ? "text-success" : "text-muted-foreground"
                      }`}
                    >
                      {result.astro}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`font-semibold ${
                        result.ehlers > 70 ? "text-success" : "text-muted-foreground"
                      }`}
                    >
                      {result.ehlers}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`font-semibold ${
                        result.ml > 70 ? "text-success" : "text-muted-foreground"
                      }`}
                    >
                      {result.ml}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge
                      variant="outline"
                      className={
                        result.confluence >= 4
                          ? "border-success text-success"
                          : result.confluence >= 3
                          ? "border-accent text-accent"
                          : "border-muted text-muted-foreground"
                      }
                    >
                      {result.confluence}/5
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Scanner;
