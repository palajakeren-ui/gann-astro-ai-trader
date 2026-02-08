import { useMemo, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waves, AlertTriangle, Eye } from "lucide-react";
import type { LiquidityLevel, OrderLevel } from "@/hooks/useBookmapData";

interface BookmapLiquidityMapProps {
  liquidityLevels: LiquidityLevel[];
  orderBook: OrderLevel[];
  currentPrice: number;
}

export const BookmapLiquidityMap = ({
  liquidityLevels,
  orderBook,
  currentPrice,
}: BookmapLiquidityMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stats = useMemo(() => {
    const icebergs = liquidityLevels.filter(l => l.isIceberg);
    const bidLiquidity = liquidityLevels.filter(l => l.type === 'bid');
    const askLiquidity = liquidityLevels.filter(l => l.type === 'ask');
    
    return {
      icebergCount: icebergs.length,
      totalBidLiquidity: bidLiquidity.reduce((sum, l) => sum + l.size, 0),
      totalAskLiquidity: askLiquidity.reduce((sum, l) => sum + l.size, 0),
      largestBid: bidLiquidity.length > 0 ? Math.max(...bidLiquidity.map(l => l.size)) : 0,
      largestAsk: askLiquidity.length > 0 ? Math.max(...askLiquidity.map(l => l.size)) : 0,
    };
  }, [liquidityLevels]);

  const priceRange = useMemo(() => {
    const prices = [...liquidityLevels.map(l => l.price), currentPrice];
    const min = Math.min(...prices) - 10;
    const max = Math.max(...prices) + 10;
    return { min, max, range: max - min };
  }, [liquidityLevels, currentPrice]);

  // Draw liquidity map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.fillStyle = 'hsl(224, 71%, 4%)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw order book depth (background)
    orderBook.forEach(level => {
      const y = ((priceRange.max - level.price) / priceRange.range) * height;
      if (y < 0 || y > height) return;

      const bidWidth = Math.min((level.bidSize / 1000) * (width / 2), width / 2);
      const askWidth = Math.min((level.askSize / 1000) * (width / 2), width / 2);

      // Bid depth (left side)
      const bidGradient = ctx.createLinearGradient(width / 2 - bidWidth, 0, width / 2, 0);
      bidGradient.addColorStop(0, 'rgba(34, 197, 94, 0)');
      bidGradient.addColorStop(1, 'rgba(34, 197, 94, 0.2)');
      ctx.fillStyle = bidGradient;
      ctx.fillRect(width / 2 - bidWidth, y - 2, bidWidth, 4);

      // Ask depth (right side)
      const askGradient = ctx.createLinearGradient(width / 2, 0, width / 2 + askWidth, 0);
      askGradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
      askGradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = askGradient;
      ctx.fillRect(width / 2, y - 2, askWidth, 4);
    });

    // Draw liquidity bubbles
    liquidityLevels.forEach(level => {
      const y = ((priceRange.max - level.price) / priceRange.range) * height;
      if (y < 0 || y > height) return;

      const x = level.type === 'bid' ? width / 4 : (width * 3) / 4;
      const radius = Math.min(Math.sqrt(level.size / 100) * 3, 25);

      // Bubble gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      if (level.isIceberg) {
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.9)');
        gradient.addColorStop(0.7, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      } else if (level.type === 'bid') {
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
        gradient.addColorStop(0.7, 'rgba(34, 197, 94, 0.3)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        gradient.addColorStop(0.7, 'rgba(239, 68, 68, 0.3)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      }

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Iceberg indicator
      if (level.isIceberg) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Size label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(level.size.toLocaleString(), x, y + 3);
      }
    });

    // Draw current price line
    const currentY = ((priceRange.max - currentPrice) / priceRange.range) * height;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(width, currentY);
    ctx.stroke();

    // Current price label
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(width / 2 - 40, currentY - 12, 80, 24);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`$${currentPrice.toFixed(2)}`, width / 2, currentY + 4);

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BID LIQUIDITY', width / 4, 15);
    ctx.fillText('ASK LIQUIDITY', (width * 3) / 4, 15);

  }, [liquidityLevels, orderBook, currentPrice, priceRange]);

  return (
    <Card className="p-4 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Waves className="w-5 h-5 text-primary" />
          Liquidity Map
        </h3>
        
        <div className="flex items-center gap-2">
          {stats.icebergCount > 0 && (
            <Badge variant="default" className="bg-blue-500 animate-pulse">
              <Eye className="w-3 h-3 mr-1" />
              {stats.icebergCount} Icebergs
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="p-2 rounded bg-success/10 text-center">
          <p className="text-xs text-muted-foreground">Bid Liquidity</p>
          <p className="text-sm font-bold text-success">{stats.totalBidLiquidity.toLocaleString()}</p>
        </div>
        <div className="p-2 rounded bg-destructive/10 text-center">
          <p className="text-xs text-muted-foreground">Ask Liquidity</p>
          <p className="text-sm font-bold text-destructive">{stats.totalAskLiquidity.toLocaleString()}</p>
        </div>
        <div className="p-2 rounded bg-success/10 text-center">
          <p className="text-xs text-muted-foreground">Largest Bid</p>
          <p className="text-sm font-bold text-success">{stats.largestBid.toLocaleString()}</p>
        </div>
        <div className="p-2 rounded bg-destructive/10 text-center">
          <p className="text-xs text-muted-foreground">Largest Ask</p>
          <p className="text-sm font-bold text-destructive">{stats.largestAsk.toLocaleString()}</p>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-[300px] rounded"
      />

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-success/60"></div>
          <span>Bid Orders</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-destructive/60"></div>
          <span>Ask Orders</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-500"></div>
          <span>Iceberg Orders</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-chart-4" />
          <span>Size = Volume</span>
        </div>
      </div>
    </Card>
  );
};

export default BookmapLiquidityMap;
