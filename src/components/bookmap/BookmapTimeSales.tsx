import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, TrendingDown, Zap } from "lucide-react";
import type { Trade } from "@/hooks/useBookmapData";

interface BookmapTimeSalesProps {
  trades: Trade[];
  currentPrice: number;
}

export const BookmapTimeSales = ({
  trades,
  currentPrice,
}: BookmapTimeSalesProps) => {
  const stats = useMemo(() => {
    const buyTrades = trades.filter(t => t.side === 'buy');
    const sellTrades = trades.filter(t => t.side === 'sell');
    const largeTrades = trades.filter(t => t.isLarge);
    
    return {
      buyCount: buyTrades.length,
      sellCount: sellTrades.length,
      buyVolume: buyTrades.reduce((sum, t) => sum + t.size, 0),
      sellVolume: sellTrades.reduce((sum, t) => sum + t.size, 0),
      largeCount: largeTrades.length,
      avgSize: trades.length > 0 ? Math.floor(trades.reduce((sum, t) => sum + t.size, 0) / trades.length) : 0,
    };
  }, [trades]);

  const getTradeStyle = (trade: Trade) => {
    if (trade.isLarge) {
      return trade.side === 'buy' 
        ? 'bg-success/30 border-l-4 border-success animate-pulse' 
        : 'bg-destructive/30 border-l-4 border-destructive animate-pulse';
    }
    return trade.side === 'buy' 
      ? 'bg-success/10 border-l-2 border-success' 
      : 'bg-destructive/10 border-l-2 border-destructive';
  };

  return (
    <Card className="p-4 border-border bg-card h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Time & Sales
        </h3>
        
        <Badge variant="outline" className="text-xs">
          <Zap className="w-3 h-3 mr-1" />
          {trades.length} trades
        </Badge>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-success/10 rounded p-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs text-muted-foreground">Buys</span>
          </div>
          <p className="text-lg font-bold text-success">{stats.buyCount}</p>
          <p className="text-xs text-muted-foreground">{stats.buyVolume.toLocaleString()} vol</p>
        </div>
        <div className="bg-destructive/10 rounded p-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingDown className="w-3 h-3 text-destructive" />
            <span className="text-xs text-muted-foreground">Sells</span>
          </div>
          <p className="text-lg font-bold text-destructive">{stats.sellCount}</p>
          <p className="text-xs text-muted-foreground">{stats.sellVolume.toLocaleString()} vol</p>
        </div>
      </div>

      {/* Large Orders Alert */}
      {stats.largeCount > 0 && (
        <div className="bg-primary/20 rounded p-2 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm">
            <span className="font-bold text-primary">{stats.largeCount}</span>
            <span className="text-muted-foreground"> large orders detected</span>
          </span>
        </div>
      )}

      {/* Trade List */}
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {trades.slice(0, 100).map((trade) => (
          <div 
            key={trade.id}
            className={`flex items-center justify-between p-2 rounded text-sm transition-all ${getTradeStyle(trade)}`}
          >
            <div className="flex items-center gap-2">
              {trade.side === 'buy' ? (
                <TrendingUp className="w-3 h-3 text-success" />
              ) : (
                <TrendingDown className="w-3 h-3 text-destructive" />
              )}
              <span className="font-mono text-foreground">{trade.price.toFixed(2)}</span>
              {trade.isLarge && (
                <Badge variant="secondary" className="text-xs px-1">
                  <Zap className="w-2 h-2" />
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-mono font-bold ${trade.side === 'buy' ? 'text-success' : 'text-destructive'}`}>
                {trade.size.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {trade.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border text-center">
        <div>
          <p className="text-xs text-muted-foreground">Avg Size</p>
          <p className="text-sm font-mono font-bold">{stats.avgSize.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Buy/Sell Ratio</p>
          <p className={`text-sm font-mono font-bold ${stats.buyVolume > stats.sellVolume ? 'text-success' : 'text-destructive'}`}>
            {stats.sellVolume > 0 ? (stats.buyVolume / stats.sellVolume).toFixed(2) : '∞'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BookmapTimeSales;
