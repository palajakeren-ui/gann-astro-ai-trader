import { useMemo, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import type { OrderLevel, CandleData } from "@/hooks/useBookmapData";

interface BookmapHeatmapProps {
  orderBook: OrderLevel[];
  candles: CandleData[];
  currentPrice: number;
  showHeatmap?: boolean;
}

export const BookmapHeatmap = ({
  orderBook,
  candles,
  currentPrice,
  showHeatmap = true,
}: BookmapHeatmapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const priceRange = useMemo(() => {
    if (orderBook.length === 0) return { min: 0, max: 0, range: 1 };
    const prices = orderBook.map(l => l.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max, range: max - min };
  }, [orderBook]);

  const maxSize = useMemo(() => {
    return Math.max(...orderBook.map(l => Math.max(l.bidSize, l.askSize)), 1);
  }, [orderBook]);

  // Draw heatmap
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

    // Draw historical heatmap columns (simulated)
    const columns = 60;
    const columnWidth = width / columns;
    
    for (let col = 0; col < columns; col++) {
      // Each column represents a time slice
      const timeOffset = columns - col;
      
      orderBook.forEach(level => {
        const y = ((priceRange.max - level.price) / priceRange.range) * height;
        const levelHeight = Math.max(height / orderBook.length, 2);
        
        // Simulate historical data decay
        const decayFactor = Math.exp(-timeOffset / 30);
        const bidIntensity = (level.bidSize / maxSize) * decayFactor * (0.5 + Math.random() * 0.5);
        const askIntensity = (level.askSize / maxSize) * decayFactor * (0.5 + Math.random() * 0.5);
        
        if (showHeatmap) {
          // Bid heatmap (green gradient)
          if (level.price < currentPrice) {
            const gradient = ctx.createLinearGradient(col * columnWidth, 0, (col + 1) * columnWidth, 0);
            gradient.addColorStop(0, `rgba(34, 197, 94, ${bidIntensity * 0.3})`);
            gradient.addColorStop(1, `rgba(34, 197, 94, ${bidIntensity * 0.6})`);
            ctx.fillStyle = gradient;
            ctx.fillRect(col * columnWidth, y - levelHeight / 2, columnWidth, levelHeight);
          }
          
          // Ask heatmap (red gradient)
          if (level.price > currentPrice) {
            const gradient = ctx.createLinearGradient(col * columnWidth, 0, (col + 1) * columnWidth, 0);
            gradient.addColorStop(0, `rgba(239, 68, 68, ${askIntensity * 0.3})`);
            gradient.addColorStop(1, `rgba(239, 68, 68, ${askIntensity * 0.6})`);
            ctx.fillStyle = gradient;
            ctx.fillRect(col * columnWidth, y - levelHeight / 2, columnWidth, levelHeight);
          }
        }
      });
      
      // Draw candle on top for the last column
      if (col === columns - 1 && candles.length > 0) {
        const candle = candles[candles.length - 1];
        const openY = ((priceRange.max - candle.open) / priceRange.range) * height;
        const closeY = ((priceRange.max - candle.close) / priceRange.range) * height;
        const highY = ((priceRange.max - candle.high) / priceRange.range) * height;
        const lowY = ((priceRange.max - candle.low) / priceRange.range) * height;
        
        const isBullish = candle.close >= candle.open;
        const color = isBullish ? '#22c55e' : '#ef4444';
        
        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width - columnWidth / 2, highY);
        ctx.lineTo(width - columnWidth / 2, lowY);
        ctx.stroke();
        
        // Body
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
        ctx.fillStyle = color;
        ctx.fillRect(width - columnWidth + 2, bodyTop, columnWidth - 4, bodyHeight);
      }
    }

    // Draw current price line
    const currentY = ((priceRange.max - currentPrice) / priceRange.range) * height;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(width, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Current price label
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(width - 70, currentY - 10, 65, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(currentPrice.toFixed(2), width - 38, currentY + 4);

    // Draw price scale
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    for (let i = 0; i <= 8; i++) {
      const y = (height / 8) * i;
      const price = priceRange.max - (priceRange.range / 8) * i;
      ctx.fillText(price.toFixed(1), 5, y + 4);
    }

    // Draw time scale
    ctx.textAlign = 'center';
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const x = (width / 6) * i;
      const minutesAgo = Math.floor((6 - i) * 10);
      const time = new Date(now.getTime() - minutesAgo * 60000);
      ctx.fillText(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), x + 30, height - 5);
    }

  }, [orderBook, candles, currentPrice, priceRange, maxSize, showHeatmap]);

  return (
    <Card className="p-4 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Order Flow Heatmap
        </h3>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-success text-success">
            Bids: {orderBook.filter(l => l.price < currentPrice).length}
          </Badge>
          <Badge variant="outline" className="border-destructive text-destructive">
            Asks: {orderBook.filter(l => l.price >= currentPrice).length}
          </Badge>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-[350px] rounded"
      />

      {/* Intensity Legend */}
      <div className="flex items-center justify-center gap-8 mt-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Low</span>
          <div className="flex h-3">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity, i) => (
              <div 
                key={i} 
                className="w-5 h-full"
                style={{ backgroundColor: `rgba(34, 197, 94, ${opacity})` }}
              />
            ))}
          </div>
          <span className="text-muted-foreground">High (Bids)</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Low</span>
          <div className="flex h-3">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity, i) => (
              <div 
                key={i} 
                className="w-5 h-full"
                style={{ backgroundColor: `rgba(239, 68, 68, ${opacity})` }}
              />
            ))}
          </div>
          <span className="text-muted-foreground">High (Asks)</span>
        </div>
      </div>
    </Card>
  );
};

export default BookmapHeatmap;
