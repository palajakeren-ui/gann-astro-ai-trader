import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, ArrowUp, ArrowDown } from "lucide-react";
import type { OrderLevel } from "@/hooks/useBookmapData";

interface BookmapVolumeProfileProps {
  orderBook: OrderLevel[];
  currentPrice: number;
}

interface VolumeNode {
  price: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  delta: number;
  isPOC: boolean;
  isHVN: boolean;
  isLVN: boolean;
}

export const BookmapVolumeProfile = ({
  orderBook,
  currentPrice,
}: BookmapVolumeProfileProps) => {
  const volumeProfile = useMemo((): VolumeNode[] => {
    const nodes = orderBook.map(level => ({
      price: level.price,
      volume: level.bidSize + level.askSize,
      buyVolume: level.bidSize,
      sellVolume: level.askSize,
      delta: level.delta,
      isPOC: false,
      isHVN: false,
      isLVN: false,
    }));

    if (nodes.length === 0) return [];

    // Find POC (Point of Control) - highest volume
    const maxVolumeIdx = nodes.reduce((maxIdx, node, idx, arr) => 
      node.volume > arr[maxIdx].volume ? idx : maxIdx, 0);
    nodes[maxVolumeIdx].isPOC = true;

    // Find HVN (High Volume Nodes) - top 20%
    const sortedByVolume = [...nodes].sort((a, b) => b.volume - a.volume);
    const hvnThreshold = sortedByVolume[Math.floor(nodes.length * 0.2)]?.volume || 0;
    
    // Find LVN (Low Volume Nodes) - bottom 20%
    const lvnThreshold = sortedByVolume[Math.floor(nodes.length * 0.8)]?.volume || 0;

    nodes.forEach(node => {
      if (node.volume >= hvnThreshold && !node.isPOC) node.isHVN = true;
      if (node.volume <= lvnThreshold) node.isLVN = true;
    });

    return nodes;
  }, [orderBook]);

  const maxVolume = useMemo(() => {
    return Math.max(...volumeProfile.map(n => n.volume), 1);
  }, [volumeProfile]);

  const poc = useMemo(() => {
    return volumeProfile.find(n => n.isPOC);
  }, [volumeProfile]);

  const valueArea = useMemo(() => {
    if (volumeProfile.length === 0) return { high: 0, low: 0, volume: 0 };
    
    const sortedByVolume = [...volumeProfile].sort((a, b) => b.volume - a.volume);
    const totalVolume = sortedByVolume.reduce((sum, n) => sum + n.volume, 0);
    const targetVolume = totalVolume * 0.7;
    
    let accumulatedVolume = 0;
    const valueAreaNodes: VolumeNode[] = [];
    
    for (const node of sortedByVolume) {
      valueAreaNodes.push(node);
      accumulatedVolume += node.volume;
      if (accumulatedVolume >= targetVolume) break;
    }
    
    const prices = valueAreaNodes.map(n => n.price);
    return {
      high: Math.max(...prices),
      low: Math.min(...prices),
      volume: accumulatedVolume,
    };
  }, [volumeProfile]);

  const getNodeStyle = (node: VolumeNode) => {
    if (node.isPOC) return 'ring-2 ring-primary bg-primary/20';
    if (node.isHVN) return 'bg-chart-2/20';
    if (node.isLVN) return 'bg-muted/30';
    return '';
  };

  return (
    <Card className="p-4 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Volume Profile
        </h3>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary text-primary">
            <Target className="w-3 h-3 mr-1" />
            POC: ${poc?.price.toFixed(2) || '-'}
          </Badge>
        </div>
      </div>

      {/* Value Area Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-success/10 border border-success/30">
          <div className="flex items-center gap-1 mb-1">
            <ArrowUp className="w-3 h-3 text-success" />
            <p className="text-xs text-muted-foreground">VAH (70%)</p>
          </div>
          <p className="text-lg font-bold text-success">${valueArea.high.toFixed(2)}</p>
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-primary" />
            <p className="text-xs text-muted-foreground">POC</p>
          </div>
          <p className="text-lg font-bold text-primary">${poc?.price.toFixed(2) || '-'}</p>
        </div>
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-center gap-1 mb-1">
            <ArrowDown className="w-3 h-3 text-destructive" />
            <p className="text-xs text-muted-foreground">VAL (70%)</p>
          </div>
          <p className="text-lg font-bold text-destructive">${valueArea.low.toFixed(2)}</p>
        </div>
      </div>

      {/* Volume Profile Visualization */}
      <div className="flex gap-2 mb-4">
        {/* Price scale */}
        <div className="w-16 flex flex-col justify-between text-xs font-mono text-muted-foreground">
          {volumeProfile.slice(0, Math.min(10, volumeProfile.length)).map((node, idx) => (
            <div key={idx} className={`${node.isPOC ? 'text-primary font-bold' : ''}`}>
              {node.price.toFixed(1)}
            </div>
          ))}
        </div>
        
        {/* Volume bars */}
        <div className="flex-1 flex flex-col gap-0.5">
          {volumeProfile.slice(0, Math.min(30, volumeProfile.length)).map((node, idx) => {
            const isCurrentPrice = Math.abs(node.price - currentPrice) < 0.5;
            const buyWidth = (node.buyVolume / maxVolume) * 100;
            const sellWidth = (node.sellVolume / maxVolume) * 100;
            
            return (
              <div 
                key={idx}
                className={`h-4 flex rounded overflow-hidden transition-all hover:scale-x-105 ${getNodeStyle(node)} ${isCurrentPrice ? 'ring-1 ring-foreground' : ''}`}
              >
                {/* Buy volume (left side) */}
                <div 
                  className="h-full bg-success/60 flex items-center justify-end pr-1"
                  style={{ width: `${buyWidth / 2}%` }}
                >
                  {buyWidth > 20 && (
                    <span className="text-[10px] font-mono text-success-foreground">
                      {node.buyVolume}
                    </span>
                  )}
                </div>
                
                {/* Sell volume (right side) */}
                <div 
                  className="h-full bg-destructive/60 flex items-center justify-start pl-1"
                  style={{ width: `${sellWidth / 2}%` }}
                >
                  {sellWidth > 20 && (
                    <span className="text-[10px] font-mono text-destructive-foreground">
                      {node.sellVolume}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary/50 ring-2 ring-primary"></div>
          <span>POC</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-chart-2/40"></div>
          <span>HVN</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-muted/50"></div>
          <span>LVN</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-success/60"></div>
          <span>Buy Vol</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-destructive/60"></div>
          <span>Sell Vol</span>
        </div>
      </div>
    </Card>
  );
};

export default BookmapVolumeProfile;
