import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

import { useBookmapData } from "@/hooks/useBookmapData";
import BookmapControls from "@/components/bookmap/BookmapControls";
import BookmapCandlestickChart from "@/components/bookmap/BookmapCandlestickChart";
import BookmapHeatmap from "@/components/bookmap/BookmapHeatmap";
import BookmapFootprint from "@/components/bookmap/BookmapFootprint";
import BookmapTimeSales from "@/components/bookmap/BookmapTimeSales";
import BookmapVolumeProfile from "@/components/bookmap/BookmapVolumeProfile";
import BookmapLiquidityMap from "@/components/bookmap/BookmapLiquidityMap";

const Bookmap = () => {
  // View toggles
  const [showCandlestick, setShowCandlestick] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showFootprint, setShowFootprint] = useState(true);
  const [showTimeSales, setShowTimeSales] = useState(true);
  const [showVolumeProfile, setShowVolumeProfile] = useState(true);
  const [showLiquidity, setShowLiquidity] = useState(true);
  const [showVolumeDots, setShowVolumeDots] = useState(true);
  
  const [selectedInstrument, setSelectedInstrument] = useState("BTCUSDT");
  const [updateSpeed, setUpdateSpeed] = useState(500);

  // Use bookmap data hook
  const {
    basePrice,
    candles,
    orderBook,
    trades,
    liquidityLevels,
    footprint,
    isLive,
    isConnected,
    toggleLive,
    stats,
  } = useBookmapData({
    symbol: selectedInstrument,
    updateInterval: updateSpeed,
  });

  const imbalanceRatio = stats.totalBidVolume / (stats.totalBidVolume + stats.totalAskVolume) * 100;

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Layers className="w-7 h-7 text-primary" />
            Bookmap Pro
          </h1>
          <p className="text-sm text-muted-foreground">
            Advanced order flow visualization with real-time candlesticks, heatmaps & footprint analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-lg px-3 py-1">
            ${basePrice.toFixed(2)}
          </Badge>
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
          <p className="text-xl font-bold text-success">{stats.totalBidVolume.toLocaleString()}</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Ask Volume</p>
          <p className="text-xl font-bold text-destructive">{stats.totalAskVolume.toLocaleString()}</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Imbalance</p>
          <p className={`text-xl font-bold ${imbalanceRatio > 50 ? 'text-success' : 'text-destructive'}`}>
            {imbalanceRatio.toFixed(1)}%
          </p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Cumulative Delta</p>
          <p className={`text-xl font-bold ${stats.cumulativeDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
            {stats.cumulativeDelta >= 0 ? '+' : ''}{stats.cumulativeDelta.toLocaleString()}
          </p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Large Orders</p>
          <p className="text-xl font-bold text-primary">{stats.largeOrders}</p>
        </Card>
      </div>

      {/* Controls */}
      <BookmapControls
        isLive={isLive}
        isConnected={isConnected}
        onToggleLive={toggleLive}
        showCandlestick={showCandlestick}
        showHeatmap={showHeatmap}
        showFootprint={showFootprint}
        showTimeSales={showTimeSales}
        showVolumeProfile={showVolumeProfile}
        showLiquidity={showLiquidity}
        showVolumeDots={showVolumeDots}
        onToggleCandlestick={setShowCandlestick}
        onToggleHeatmap={setShowHeatmap}
        onToggleFootprint={setShowFootprint}
        onToggleTimeSales={setShowTimeSales}
        onToggleVolumeProfile={setShowVolumeProfile}
        onToggleLiquidity={setShowLiquidity}
        onToggleVolumeDots={setShowVolumeDots}
        selectedInstrument={selectedInstrument}
        onInstrumentChange={setSelectedInstrument}
        updateSpeed={updateSpeed}
        onUpdateSpeedChange={setUpdateSpeed}
      />

      {/* Main Chart Row */}
      {showCandlestick && (
        <BookmapCandlestickChart
          candles={candles}
          trades={trades}
          liquidityLevels={liquidityLevels}
          currentPrice={basePrice}
          showVolumeDots={showVolumeDots}
          showLiquidity={showLiquidity}
        />
      )}

      {/* Heatmap & Time Sales Row */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {showHeatmap && (
          <div className="xl:col-span-3">
            <BookmapHeatmap
              orderBook={orderBook}
              candles={candles}
              currentPrice={basePrice}
              showHeatmap={showHeatmap}
            />
          </div>
        )}
        {showTimeSales && (
          <div className={showHeatmap ? "" : "xl:col-span-4"}>
            <BookmapTimeSales
              trades={trades}
              currentPrice={basePrice}
            />
          </div>
        )}
      </div>

      {/* Footprint & Volume Profile Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {showFootprint && (
          <BookmapFootprint
            footprint={footprint}
            currentPrice={basePrice}
          />
        )}
        {showVolumeProfile && (
          <BookmapVolumeProfile
            orderBook={orderBook}
            currentPrice={basePrice}
          />
        )}
      </div>

      {/* Liquidity Map */}
      {showLiquidity && (
        <BookmapLiquidityMap
          liquidityLevels={liquidityLevels}
          orderBook={orderBook}
          currentPrice={basePrice}
        />
      )}
    </div>
  );
};

export default Bookmap;
