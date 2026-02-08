import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ArrowUp, ArrowDown } from "lucide-react";
import type { FootprintData } from "@/hooks/useBookmapData";

interface BookmapFootprintProps {
  footprint: FootprintData[];
  currentPrice: number;
}

export const BookmapFootprint = ({
  footprint,
  currentPrice,
}: BookmapFootprintProps) => {
  const maxVolume = useMemo(() => {
    return Math.max(...footprint.map(f => Math.max(f.bidVolume, f.askVolume)), 1);
  }, [footprint]);

  const totalDelta = useMemo(() => {
    return footprint.reduce((sum, f) => sum + f.delta, 0);
  }, [footprint]);

  const imbalanceCount = useMemo(() => {
    return {
      bid: footprint.filter(f => f.imbalance === 'bid').length,
      ask: footprint.filter(f => f.imbalance === 'ask').length,
    };
  }, [footprint]);

  const getBarWidth = (volume: number) => {
    return Math.min((volume / maxVolume) * 100, 100);
  };

  const getImbalanceColor = (imbalance: 'bid' | 'ask' | 'neutral') => {
    switch (imbalance) {
      case 'bid': return 'bg-success/30 border-l-4 border-success';
      case 'ask': return 'bg-destructive/30 border-l-4 border-destructive';
      default: return '';
    }
  };

  return (
    <Card className="p-4 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Footprint Chart
        </h3>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant={totalDelta >= 0 ? "default" : "destructive"} 
            className={totalDelta >= 0 ? "bg-success" : ""}
          >
            {totalDelta >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
            Δ {totalDelta >= 0 ? '+' : ''}{totalDelta.toLocaleString()}
          </Badge>
          <Badge variant="outline" className="border-success text-success">
            Bid Imb: {imbalanceCount.bid}
          </Badge>
          <Badge variant="outline" className="border-destructive text-destructive">
            Ask Imb: {imbalanceCount.ask}
          </Badge>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-5 text-xs font-semibold text-muted-foreground border-b border-border pb-2 mb-2">
        <div className="text-right pr-2">Bid Vol</div>
        <div className="text-center">Price</div>
        <div className="text-left pl-2">Ask Vol</div>
        <div className="text-center">Delta</div>
        <div className="text-center">Trades</div>
      </div>

      {/* Footprint rows */}
      <div className="max-h-[400px] overflow-y-auto space-y-0.5">
        {footprint.map((row, idx) => {
          const isCurrentPrice = Math.abs(row.price - currentPrice) < 0.5;
          
          return (
            <div 
              key={idx}
              className={`grid grid-cols-5 items-center text-xs py-1 rounded transition-colors
                ${isCurrentPrice ? 'bg-primary/20 ring-1 ring-primary' : ''}
                ${getImbalanceColor(row.imbalance)}
                hover:bg-secondary/50
              `}
            >
              {/* Bid Volume with bar */}
              <div className="relative text-right pr-2">
                <div 
                  className="absolute inset-y-0 right-0 bg-success/40"
                  style={{ width: `${getBarWidth(row.bidVolume)}%` }}
                />
                <span className="relative z-10 font-mono text-success">
                  {row.bidVolume.toLocaleString()}
                </span>
              </div>

              {/* Price */}
              <div className={`text-center font-mono font-bold ${isCurrentPrice ? 'text-primary' : 'text-foreground'}`}>
                {row.price.toFixed(2)}
              </div>

              {/* Ask Volume with bar */}
              <div className="relative text-left pl-2">
                <div 
                  className="absolute inset-y-0 left-0 bg-destructive/40"
                  style={{ width: `${getBarWidth(row.askVolume)}%` }}
                />
                <span className="relative z-10 font-mono text-destructive">
                  {row.askVolume.toLocaleString()}
                </span>
              </div>

              {/* Delta */}
              <div className={`text-center font-mono ${row.delta >= 0 ? 'text-success' : 'text-destructive'}`}>
                {row.delta >= 0 ? '+' : ''}{row.delta.toLocaleString()}
              </div>

              {/* Trades */}
              <div className="text-center font-mono text-muted-foreground">
                {row.trades}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Total Bid Volume</p>
          <p className="text-lg font-bold text-success">
            {footprint.reduce((sum, f) => sum + f.bidVolume, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Net Delta</p>
          <p className={`text-lg font-bold ${totalDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
            {totalDelta >= 0 ? '+' : ''}{totalDelta.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Total Ask Volume</p>
          <p className="text-lg font-bold text-destructive">
            {footprint.reduce((sum, f) => sum + f.askVolume, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BookmapFootprint;
