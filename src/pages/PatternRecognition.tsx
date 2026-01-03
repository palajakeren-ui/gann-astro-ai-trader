import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Activity, Wifi, RefreshCw } from "lucide-react";
import TradingInstrumentSelector from "@/components/TradingInstrumentSelector";
import useWebSocketPrice from "@/hooks/useWebSocketPrice";

// Pattern Components
import { PatternDetectionPanel } from "@/components/pattern/PatternDetectionPanel";
import { ManualAnalysisPanel } from "@/components/pattern/ManualAnalysisPanel";
import { MultiAssetPanel } from "@/components/pattern/MultiAssetPanel";
import { PatternNarrationPanel } from "@/components/pattern/PatternNarrationPanel";
import { AddPatternForm } from "@/components/pattern/AddPatternForm";
import { WaveAnalysisTabs } from "@/components/pattern/WaveAnalysisTabs";

// Types and Utils
import {
  DetectedPattern,
  ManualAnalysis,
  AssetAnalysis,
  TIMEFRAMES,
  getInitialPatterns,
} from "@/lib/patternUtils";

const PatternRecognition = () => {
  // State Management
  const [selectedInstrument, setSelectedInstrument] = useState("BTCUSDT");
  const [selectedTimeframe, setSelectedTimeframe] = useState("H1");

  // Pattern States
  const [autoPatterns, setAutoPatterns] = useState<DetectedPattern[]>([]);
  const [manualPatterns, setManualPatterns] = useState<DetectedPattern[]>(() => 
    getInitialPatterns("BTCUSDT")
  );

  // Manual Analysis State
  const [manualAnalyses, setManualAnalyses] = useState<ManualAnalysis[]>([]);

  // Multi-Asset State
  const [assetAnalyses, setAssetAnalyses] = useState<AssetAnalysis[]>([
    {
      id: "1",
      symbol: "BTCUSDT",
      name: "Bitcoin",
      timeframes: ["H1", "H4", "D1"],
      lastUpdated: new Date(),
      patternCount: 5,
    },
  ]);

  // WebSocket Price Hook
  const { priceData, isConnected, isLive, toggleConnection } = useWebSocketPrice({
    symbol: selectedInstrument,
    enabled: true,
    updateInterval: 2000,
  });

  const currentPrice = priceData.price;

  // Combine all patterns for narration
  const allPatterns = [...autoPatterns, ...manualPatterns];

  // Handlers
  const handleAutoPatternsDetected = (patterns: DetectedPattern[]) => {
    setAutoPatterns(patterns);
  };

  const handleDeleteAutoPattern = (id: string) => {
    setAutoPatterns((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddManualPattern = (pattern: DetectedPattern) => {
    setManualPatterns((prev) => [...prev, pattern]);
  };

  const handleDeleteManualPattern = (id: string) => {
    setManualPatterns((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddManualAnalysis = (analysis: ManualAnalysis) => {
    setManualAnalyses((prev) => [...prev, analysis]);
  };

  const handleDeleteManualAnalysis = (id: string) => {
    setManualAnalyses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddAsset = (asset: AssetAnalysis) => {
    setAssetAnalyses((prev) => [...prev, asset]);
  };

  const handleUpdateAsset = (id: string) => {
    setAssetAnalyses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, lastUpdated: new Date() } : a))
    );
  };

  const handleDeleteAsset = (id: string) => {
    setAssetAnalyses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            📈 Pattern Recognition — (Price & Time)
          </h1>
          <p className="text-sm text-muted-foreground">
            Gann Wave, Elliott Wave, Time Cycles & Multi-Asset Analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={isConnected ? "border-success text-success" : "border-destructive text-destructive"}
          >
            <Wifi className="w-3 h-3 mr-1" />
            {isConnected ? "Live" : "Offline"}
          </Badge>
          <Badge variant="outline" className="text-lg font-mono">
            ${currentPrice.toLocaleString()}
          </Badge>
          <Button variant="outline" size="sm" onClick={toggleConnection}>
            <RefreshCw className={`w-4 h-4 ${isLive ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Auto Pattern Detection */}
      <PatternDetectionPanel
        currentPrice={currentPrice}
        instrument={selectedInstrument}
        timeframe={selectedTimeframe}
        patterns={autoPatterns}
        onPatternsDetected={handleAutoPatternsDetected}
        onDeletePattern={handleDeleteAutoPattern}
      />

      {/* Manual Timeframe Analysis */}
      <ManualAnalysisPanel
        instrument={selectedInstrument}
        currentPrice={currentPrice}
        analyses={manualAnalyses}
        onAddAnalysis={handleAddManualAnalysis}
        onDeleteAnalysis={handleDeleteManualAnalysis}
      />

      {/* Multi-Asset Panel */}
      <MultiAssetPanel
        assets={assetAnalyses}
        onAddAsset={handleAddAsset}
        onUpdateAsset={handleUpdateAsset}
        onDeleteAsset={handleDeleteAsset}
      />

      {/* Manual Pattern Entry */}
      <AddPatternForm
        instrument={selectedInstrument}
        timeframe={selectedTimeframe}
        patterns={manualPatterns}
        onAddPattern={handleAddManualPattern}
        onDeletePattern={handleDeleteManualPattern}
      />

      {/* Pattern Narration */}
      <PatternNarrationPanel patterns={allPatterns} />

      {/* Instrument & Timeframe Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TradingInstrumentSelector
          onInstrumentChange={(symbol) => setSelectedInstrument(symbol)}
          compact={false}
        />
        <Card className="p-4 border-border bg-card">
          <Label className="text-foreground mb-2 block">Timeframe (M1 - 1Y)</Label>
          <div className="flex flex-wrap gap-2">
            {TIMEFRAMES.map((tf) => (
              <Button
                key={tf.value}
                variant={selectedTimeframe === tf.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(tf.value)}
              >
                {tf.value}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Wave Analysis Tabs */}
      <WaveAnalysisTabs currentPrice={currentPrice} />
    </div>
  );
};

export default PatternRecognition;
