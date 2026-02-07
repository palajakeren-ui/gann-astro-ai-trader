import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap,
  BarChart3,
  RefreshCw,
  Wifi,
  Settings,
  Maximize2,
  Eye,
  EyeOff
} from "lucide-react";

interface OrderLevel {
  price: number;
  bidSize: number;
  askSize: number;
  trades: number;
  delta: number;
}

interface Trade {
  id: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: Date;
}

const generateOrderBook = (basePrice: number, levels: number = 50): OrderLevel[] => {
  const orderBook: OrderLevel[] = [];
  
  for (let i = -levels; i <= levels; i++) {
    const price = basePrice + (i * 0.5);
    const distance = Math.abs(i);
    const bidSize = Math.max(0, Math.floor(Math.random() * (1000 - distance * 15)) + 10);
    const askSize = Math.max(0, Math.floor(Math.random() * (1000 - distance * 15)) + 10);
    const trades = Math.floor(Math.random() * 50);
    const delta = bidSize - askSize;
    
    orderBook.push({ price, bidSize, askSize, trades, delta });
  }
  
  return orderBook.sort((a, b) => b.price - a.price);
};

const generateTrades = (basePrice: number, count: number = 100): Trade[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `trade-${i}`,
    price: basePrice + (Math.random() - 0.5) * 20,
    size: Math.floor(Math.random() * 500) + 10,
    side: (Math.random() > 0.5 ? 'buy' : 'sell') as 'buy' | 'sell',
    timestamp: new Date(Date.now() - Math.random() * 60000 * 60),
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const Bookmap = () => {
  const [basePrice, setBasePrice] = useState(43250);
  const [orderBook, setOrderBook] = useState<OrderLevel[]>(() => generateOrderBook(basePrice));
  const [trades, setTrades] = useState<Trade[]>(() => generateTrades(basePrice));
  const [isLive, setIsLive] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showDelta, setShowDelta] = useState(true);
  const [showTrades, setShowTrades] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState("BTCUSDT");
  const [zoomLevel, setZoomLevel] = useState(1);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setBasePrice(prev => prev + (Math.random() - 0.5) * 5);
      setOrderBook(generateOrderBook(basePrice));
      
      // Add new trade
      const newTrade: Trade = {
        id: `trade-${Date.now()}`,
        price: basePrice + (Math.random() - 0.5) * 5,
        size: Math.floor(Math.random() * 500) + 10,
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        timestamp: new Date(),
      };
      setTrades(prev => [newTrade, ...prev.slice(0, 99)]);
    }, 500);
    
    return () => clearInterval(interval);
  }, [isLive, basePrice]);

  // Calculate totals
  const totalBidVolume = orderBook.reduce((sum, level) => sum + level.bidSize, 0);
  const totalAskVolume = orderBook.reduce((sum, level) => sum + level.askSize, 0);
  const cumulativeDelta = trades.reduce((sum, t) => sum + (t.side === 'buy' ? t.size : -t.size), 0);
  const imbalanceRatio = totalBidVolume / (totalBidVolume + totalAskVolume) * 100;

  const getHeatmapColor = (size: number, max: number, isBid: boolean) => {
    const intensity = Math.min(size / max, 1);
    if (isBid) {
      return `rgba(34, 197, 94, ${intensity * 0.8})`;
    }
    return `rgba(239, 68, 68, ${intensity * 0.8})`;
  };

  const maxSize = Math.max(...orderBook.map(l => Math.max(l.bidSize, l.askSize)));

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Layers className="w-7 h-7 text-primary" />
            Bookmap Order Flow
          </h1>
          <p className="text-sm text-muted-foreground">Real-time order book heatmap & volume analysis</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select 
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground"
          >
            <option value="BTCUSDT">BTCUSDT</option>
            <option value="ETHUSDT">ETHUSDT</option>
            <option value="ES">ES (S&P 500 Futures)</option>
            <option value="NQ">NQ (Nasdaq Futures)</option>
            <option value="EURUSD">EURUSD</option>
            <option value="XAUUSD">XAUUSD</option>
          </select>
          <Badge variant={isLive ? "default" : "outline"} className={isLive ? "bg-success" : ""}>
            <Wifi className="w-3 h-3 mr-1" />
            {isLive ? "Live" : "Paused"}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>

      {/* Market Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Current Price</p>
          <p className="text-xl font-bold text-foreground">${basePrice.toFixed(2)}</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Bid Volume</p>
          <p className="text-xl font-bold text-success">{totalBidVolume.toLocaleString()}</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Ask Volume</p>
          <p className="text-xl font-bold text-destructive">{totalAskVolume.toLocaleString()}</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Imbalance</p>
          <p className={`text-xl font-bold ${imbalanceRatio > 50 ? 'text-success' : 'text-destructive'}`}>
            {imbalanceRatio.toFixed(1)}%
          </p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Cumulative Delta</p>
          <p className={`text-xl font-bold ${cumulativeDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
            {cumulativeDelta >= 0 ? '+' : ''}{cumulativeDelta.toLocaleString()}
          </p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Trades/Min</p>
          <p className="text-xl font-bold text-foreground">{trades.length}</p>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-4 border-border bg-card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
            <Label className="text-sm">Heatmap</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={showDelta} onCheckedChange={setShowDelta} />
            <Label className="text-sm">Delta</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={showTrades} onCheckedChange={setShowTrades} />
            <Label className="text-sm">Trades</Label>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}>
              -
            </Button>
            <span className="text-sm font-mono w-16 text-center">{(zoomLevel * 100).toFixed(0)}%</span>
            <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}>
              +
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Order Book Heatmap */}
        <Card className="xl:col-span-3 p-4 border-border bg-card overflow-hidden">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Order Book Heatmap
          </h3>
          
          <div className="relative overflow-auto max-h-[600px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-muted-foreground">Bid Size</th>
                  <th className="text-center p-2 text-muted-foreground">Price</th>
                  <th className="text-right p-2 text-muted-foreground">Ask Size</th>
                  {showDelta && <th className="text-right p-2 text-muted-foreground">Delta</th>}
                  {showTrades && <th className="text-right p-2 text-muted-foreground">Trades</th>}
                </tr>
              </thead>
              <tbody>
                {orderBook.map((level, idx) => {
                  const isCurrentPrice = Math.abs(level.price - basePrice) < 0.5;
                  return (
                    <tr 
                      key={idx} 
                      className={`border-b border-border/50 ${isCurrentPrice ? 'bg-primary/20' : ''}`}
                      style={{ fontSize: `${zoomLevel * 0.875}rem` }}
                    >
                      <td className="p-1 relative">
                        {showHeatmap && (
                          <div 
                            className="absolute inset-0"
                            style={{ 
                              background: getHeatmapColor(level.bidSize, maxSize, true),
                              width: `${(level.bidSize / maxSize) * 100}%`,
                              right: 0,
                              left: 'auto'
                            }}
                          />
                        )}
                        <span className="relative z-10 font-mono text-success">
                          {level.bidSize.toLocaleString()}
                        </span>
                      </td>
                      <td className={`text-center p-1 font-mono font-bold ${isCurrentPrice ? 'text-primary' : 'text-foreground'}`}>
                        {level.price.toFixed(2)}
                      </td>
                      <td className="p-1 relative">
                        {showHeatmap && (
                          <div 
                            className="absolute inset-0"
                            style={{ 
                              background: getHeatmapColor(level.askSize, maxSize, false),
                              width: `${(level.askSize / maxSize) * 100}%`,
                            }}
                          />
                        )}
                        <span className="relative z-10 font-mono text-destructive text-right block">
                          {level.askSize.toLocaleString()}
                        </span>
                      </td>
                      {showDelta && (
                        <td className={`text-right p-1 font-mono ${level.delta >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {level.delta >= 0 ? '+' : ''}{level.delta.toLocaleString()}
                        </td>
                      )}
                      {showTrades && (
                        <td className="text-right p-1 font-mono text-muted-foreground">
                          {level.trades}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Time & Sales */}
        <Card className="p-4 border-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Time & Sales
          </h3>
          
          <div className="space-y-1 max-h-[550px] overflow-y-auto">
            {trades.slice(0, 50).map((trade) => (
              <div 
                key={trade.id}
                className={`flex items-center justify-between p-2 rounded text-sm ${
                  trade.side === 'buy' 
                    ? 'bg-success/10 border-l-2 border-success' 
                    : 'bg-destructive/10 border-l-2 border-destructive'
                }`}
              >
                <div className="flex items-center gap-2">
                  {trade.side === 'buy' ? (
                    <TrendingUp className="w-3 h-3 text-success" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  )}
                  <span className="font-mono text-foreground">{trade.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono ${trade.side === 'buy' ? 'text-success' : 'text-destructive'}`}>
                    {trade.size.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {trade.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Volume Profile */}
      <Card className="p-4 border-border bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Volume Profile (POC Analysis)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Point of Control (POC)</p>
            <p className="text-2xl font-bold text-foreground">${(basePrice - 5).toFixed(2)}</p>
            <Badge variant="outline" className="mt-2">Highest Volume</Badge>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Value Area High (VAH)</p>
            <p className="text-2xl font-bold text-success">${(basePrice + 15).toFixed(2)}</p>
            <Badge variant="outline" className="mt-2 border-success text-success">70% Volume</Badge>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Value Area Low (VAL)</p>
            <p className="text-2xl font-bold text-destructive">${(basePrice - 20).toFixed(2)}</p>
            <Badge variant="outline" className="mt-2 border-destructive text-destructive">70% Volume</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Bookmap;
