import { useMemo, useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  ZoomIn, 
  ZoomOut,
  Crosshair,
  BarChart2
} from "lucide-react";
import type { CandleData, Trade, LiquidityLevel } from "@/hooks/useBookmapData";

interface BookmapCandlestickChartProps {
  candles: CandleData[];
  trades: Trade[];
  liquidityLevels: LiquidityLevel[];
  currentPrice: number;
  showVolumeDots?: boolean;
  showLiquidity?: boolean;
}

export const BookmapCandlestickChart = ({
  candles,
  trades,
  liquidityLevels,
  currentPrice,
  showVolumeDots = true,
  showLiquidity = true,
}: BookmapCandlestickChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);

  const visibleCandles = useMemo(() => {
    const count = Math.floor(80 / zoom);
    return candles.slice(-count);
  }, [candles, zoom]);

  const priceRange = useMemo(() => {
    if (visibleCandles.length === 0) return { min: 0, max: 0, range: 1 };
    const prices = visibleCandles.flatMap(c => [c.high, c.low]);
    const min = Math.min(...prices) - 20;
    const max = Math.max(...prices) + 20;
    return { min, max, range: max - min };
  }, [visibleCandles]);

  const maxVolume = useMemo(() => {
    return Math.max(...visibleCandles.map(c => c.volume), 1);
  }, [visibleCandles]);

  // Draw chart on canvas
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
    const chartHeight = height * 0.75;
    const volumeHeight = height * 0.2;
    const volumeTop = chartHeight + 10;

    // Clear canvas
    ctx.fillStyle = 'hsl(224, 71%, 4%)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = (chartHeight / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical grid lines
    const candleWidth = width / visibleCandles.length;
    for (let i = 0; i < visibleCandles.length; i += 10) {
      const x = i * candleWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, chartHeight);
      ctx.stroke();
    }

    // Draw liquidity levels (background)
    if (showLiquidity) {
      liquidityLevels.forEach(level => {
        const y = ((priceRange.max - level.price) / priceRange.range) * chartHeight;
        if (y < 0 || y > chartHeight) return;

        const opacity = Math.min(level.size / 3000, 0.5);
        ctx.fillStyle = level.type === 'bid' 
          ? `rgba(34, 197, 94, ${opacity})` 
          : `rgba(239, 68, 68, ${opacity})`;
        
        ctx.fillRect(0, y - 2, width, 4);

        // Iceberg indicator
        if (level.isIceberg) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
          ctx.beginPath();
          ctx.arc(width - 20, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Draw candles
    visibleCandles.forEach((candle, i) => {
      const x = i * candleWidth + candleWidth / 2;
      const bodyWidth = Math.max(candleWidth * 0.7, 4);
      
      const isBullish = candle.close >= candle.open;
      const color = isBullish ? '#22c55e' : '#ef4444';
      
      // High-Low line (wick)
      const highY = ((priceRange.max - candle.high) / priceRange.range) * chartHeight;
      const lowY = ((priceRange.max - candle.low) / priceRange.range) * chartHeight;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Body
      const openY = ((priceRange.max - candle.open) / priceRange.range) * chartHeight;
      const closeY = ((priceRange.max - candle.close) / priceRange.range) * chartHeight;
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(closeY - openY), 1);

      ctx.fillStyle = isBullish ? color : color;
      ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);

      // Volume bar
      const volumeBarHeight = (candle.volume / maxVolume) * volumeHeight;
      ctx.fillStyle = isBullish ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)';
      ctx.fillRect(x - bodyWidth / 2, volumeTop + volumeHeight - volumeBarHeight, bodyWidth, volumeBarHeight);

      // Volume dots (large trades)
      if (showVolumeDots && candle.volume > maxVolume * 0.5) {
        const dotSize = Math.min((candle.volume / maxVolume) * 15, 12);
        ctx.fillStyle = isBullish ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
        ctx.beginPath();
        ctx.arc(x, closeY, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw current price line
    const currentY = ((priceRange.max - currentPrice) / priceRange.range) * chartHeight;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(width, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Price label
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(width - 80, currentY - 10, 75, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(currentPrice.toFixed(2), width - 42, currentY + 4);

    // Draw crosshair
    if (crosshair) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      
      ctx.beginPath();
      ctx.moveTo(crosshair.x, 0);
      ctx.lineTo(crosshair.x, chartHeight);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, crosshair.y);
      ctx.lineTo(width, crosshair.y);
      ctx.stroke();
      
      ctx.setLineDash([]);

      // Price at crosshair
      const price = priceRange.max - (crosshair.y / chartHeight) * priceRange.range;
      ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
      ctx.fillRect(width - 80, crosshair.y - 10, 75, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(price.toFixed(2), width - 42, crosshair.y + 4);
    }

    // Draw price scale (right side)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = (chartHeight / 5) * i;
      const price = priceRange.max - (priceRange.range / 5) * i;
      ctx.fillText(price.toFixed(0), width - 5, y + 4);
    }

  }, [visibleCandles, priceRange, maxVolume, currentPrice, crosshair, showVolumeDots, showLiquidity, liquidityLevels]);

  // Mouse handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCrosshair({ x, y });

    // Find hovered candle
    const candleWidth = rect.width / visibleCandles.length;
    const candleIndex = Math.floor(x / candleWidth);
    if (candleIndex >= 0 && candleIndex < visibleCandles.length) {
      setHoveredCandle(visibleCandles[candleIndex]);
    }
  };

  const handleMouseLeave = () => {
    setCrosshair(null);
    setHoveredCandle(null);
  };

  const lastCandle = candles[candles.length - 1];
  const priceChange = lastCandle ? lastCandle.close - lastCandle.open : 0;
  const isBullish = priceChange >= 0;

  return (
    <Card className="p-4 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-primary" />
          Real-Time Candlestick Chart
        </h3>
        
        <div className="flex items-center gap-2">
          <Tabs defaultValue="1m" className="h-8">
            <TabsList className="h-8">
              <TabsTrigger value="1m" className="h-6 text-xs">1M</TabsTrigger>
              <TabsTrigger value="5m" className="h-6 text-xs">5M</TabsTrigger>
              <TabsTrigger value="15m" className="h-6 text-xs">15M</TabsTrigger>
              <TabsTrigger value="1h" className="h-6 text-xs">1H</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setZoom(z => Math.min(z + 0.25, 3))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
          
          <Badge variant={isBullish ? "default" : "destructive"} className={isBullish ? "bg-success" : ""}>
            {isBullish ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}
          </Badge>
        </div>
      </div>

      {/* OHLCV Info */}
      {hoveredCandle && (
        <div className="flex gap-4 text-xs font-mono mb-2 bg-secondary/50 p-2 rounded">
          <span>O: <span className="text-foreground">{hoveredCandle.open.toFixed(2)}</span></span>
          <span>H: <span className="text-success">{hoveredCandle.high.toFixed(2)}</span></span>
          <span>L: <span className="text-destructive">{hoveredCandle.low.toFixed(2)}</span></span>
          <span>C: <span className="text-foreground">{hoveredCandle.close.toFixed(2)}</span></span>
          <span>V: <span className="text-primary">{hoveredCandle.volume.toLocaleString()}</span></span>
          <span>Δ: <span className={hoveredCandle.delta >= 0 ? 'text-success' : 'text-destructive'}>
            {hoveredCandle.delta >= 0 ? '+' : ''}{hoveredCandle.delta.toLocaleString()}
          </span></span>
        </div>
      )}

      {/* Canvas Chart */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] rounded cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        
        {/* Crosshair indicator */}
        {crosshair && (
          <div className="absolute top-2 left-2 bg-card/80 backdrop-blur p-2 rounded text-xs">
            <Crosshair className="w-3 h-3 inline mr-1" />
            {(priceRange.max - (crosshair.y / 300) * priceRange.range).toFixed(2)}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span>Bullish</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
          <span>Bearish</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span>Current Price</span>
        </div>
        {showVolumeDots && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-2 border-success"></div>
            <span>Large Volume</span>
          </div>
        )}
        {showLiquidity && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Iceberg</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BookmapCandlestickChart;
