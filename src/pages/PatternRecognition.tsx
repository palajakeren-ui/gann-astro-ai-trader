import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, 
  Wifi, 
  WifiOff,
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Zap,
  BarChart3,
  Clock,
  Target,
  FileText,
  Layers,
  LineChart,
  Crosshair,
  AlertTriangle,
  ChevronRight,
  Sparkles
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("detection");

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
  const priceChange = priceData.change || 0;
  const priceChangePercent = priceData.changePercent || 0;

  // Combine all patterns for narration
  const allPatterns = [...autoPatterns, ...manualPatterns];

  // Statistics
  const bullishCount = allPatterns.filter(p => p.signal === "Bullish").length;
  const bearishCount = allPatterns.filter(p => p.signal === "Bearish").length;
  const highConfCount = allPatterns.filter(p => p.confidence >= 0.8).length;

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
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Title Section */}
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/60 p-3 shadow-lg shadow-primary/20">
                <Activity className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Pattern Recognition
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  Price & Time Analysis • Gann • Elliott • Harmonic
                </p>
              </div>
            </div>

            {/* Price & Connection Panel */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Connection Status */}
              <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
                isConnected 
                  ? "bg-success/10 text-success border border-success/20" 
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}>
                {isConnected ? (
                  <Wifi className="h-4 w-4" />
                ) : (
                  <WifiOff className="h-4 w-4" />
                )}
                {isConnected ? "Live" : "Offline"}
              </div>

              {/* Price Display */}
              <div className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-2 shadow-sm">
                <div>
                  <div className="text-xs text-muted-foreground">{selectedInstrument}</div>
                  <div className="text-xl font-bold font-mono text-foreground">
                    ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className={`flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium ${
                  priceChange >= 0 
                    ? "bg-success/10 text-success" 
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {priceChange >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {priceChangePercent >= 0 ? "+" : ""}{priceChangePercent.toFixed(2)}%
                </div>
              </div>

              {/* Refresh Button */}
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleConnection}
                className="rounded-xl"
              >
                <RefreshCw className={`h-4 w-4 ${isLive ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            <Card className="flex items-center gap-3 border-border bg-card/50 backdrop-blur p-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{allPatterns.length}</div>
                <div className="text-xs text-muted-foreground">Total Patterns</div>
              </div>
            </Card>
            <Card className="flex items-center gap-3 border-border bg-card/50 backdrop-blur p-3">
              <div className="rounded-lg bg-success/10 p-2">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{bullishCount}</div>
                <div className="text-xs text-muted-foreground">Bullish</div>
              </div>
            </Card>
            <Card className="flex items-center gap-3 border-border bg-card/50 backdrop-blur p-3">
              <div className="rounded-lg bg-destructive/10 p-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">{bearishCount}</div>
                <div className="text-xs text-muted-foreground">Bearish</div>
              </div>
            </Card>
            <Card className="flex items-center gap-3 border-border bg-card/50 backdrop-blur p-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{highConfCount}</div>
                <div className="text-xs text-muted-foreground">High Conf.</div>
              </div>
            </Card>
            <Card className="flex items-center gap-3 border-border bg-card/50 backdrop-blur p-3">
              <div className="rounded-lg bg-muted p-2">
                <Layers className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{assetAnalyses.length}</div>
                <div className="text-xs text-muted-foreground">Assets</div>
              </div>
            </Card>
            <Card className="flex items-center gap-3 border-border bg-card/50 backdrop-blur p-3">
              <div className="rounded-lg bg-muted p-2">
                <FileText className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{manualAnalyses.length}</div>
                <div className="text-xs text-muted-foreground">Analyses</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left Sidebar - Controls */}
          <div className="space-y-4">
            {/* Instrument Selector */}
            <Card className="border-border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Crosshair className="h-4 w-4 text-primary" />
                Instrument
              </h3>
              <TradingInstrumentSelector
                onInstrumentChange={(symbol) => setSelectedInstrument(symbol)}
                compact
              />
            </Card>

            {/* Timeframe Selector */}
            <Card className="border-border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Timeframe
              </h3>
              <ScrollArea className="h-[200px] pr-3">
                <div className="grid grid-cols-3 gap-1.5">
                  {TIMEFRAMES.map((tf) => (
                    <Button
                      key={tf.value}
                      variant={selectedTimeframe === tf.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedTimeframe(tf.value)}
                      className={`text-xs font-mono ${
                        selectedTimeframe === tf.value 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      }`}
                    >
                      {tf.value}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Quick Navigation */}
            <Card className="border-border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <BarChart3 className="h-4 w-4 text-primary" />
                Quick Nav
              </h3>
              <div className="space-y-1">
                {[
                  { id: "detection", label: "Auto Detection", icon: Zap },
                  { id: "manual", label: "Manual Entry", icon: FileText },
                  { id: "multi-asset", label: "Multi-Asset", icon: Layers },
                  { id: "waves", label: "Wave Analysis", icon: LineChart },
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                ))}
              </div>
            </Card>

            {/* Pattern Summary Mini */}
            <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/5 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Summary
              </h3>
              <div className="space-y-2 text-xs">
                {allPatterns.slice(0, 3).map((p) => (
                  <div 
                    key={p.id} 
                    className={`flex items-center gap-2 rounded-lg p-2 ${
                      p.signal === "Bullish" 
                        ? "bg-success/10 text-success" 
                        : p.signal === "Bearish"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.signal === "Bullish" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : p.signal === "Bearish" ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : null}
                    <span className="truncate font-medium">{p.name}</span>
                  </div>
                ))}
                {allPatterns.length > 3 && (
                  <div className="text-center text-muted-foreground">
                    +{allPatterns.length - 3} more patterns
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
                <TabsTrigger value="detection" className="gap-2 text-xs md:text-sm">
                  <Zap className="h-4 w-4" />
                  <span className="hidden md:inline">Auto Detection</span>
                  <span className="md:hidden">Auto</span>
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-2 text-xs md:text-sm">
                  <FileText className="h-4 w-4" />
                  <span className="hidden md:inline">Manual Entry</span>
                  <span className="md:hidden">Manual</span>
                </TabsTrigger>
                <TabsTrigger value="multi-asset" className="gap-2 text-xs md:text-sm">
                  <Layers className="h-4 w-4" />
                  <span className="hidden md:inline">Multi-Asset</span>
                  <span className="md:hidden">Assets</span>
                </TabsTrigger>
                <TabsTrigger value="waves" className="gap-2 text-xs md:text-sm">
                  <LineChart className="h-4 w-4" />
                  <span className="hidden md:inline">Wave Analysis</span>
                  <span className="md:hidden">Waves</span>
                </TabsTrigger>
              </TabsList>

              {/* Auto Detection Tab */}
              <TabsContent value="detection" className="mt-6 space-y-6">
                <PatternDetectionPanel
                  currentPrice={currentPrice}
                  instrument={selectedInstrument}
                  timeframe={selectedTimeframe}
                  patterns={autoPatterns}
                  onPatternsDetected={handleAutoPatternsDetected}
                  onDeletePattern={handleDeleteAutoPattern}
                />
                
                {/* Pattern Narration */}
                <PatternNarrationPanel patterns={allPatterns} />
              </TabsContent>

              {/* Manual Entry Tab */}
              <TabsContent value="manual" className="mt-6 space-y-6">
                <ManualAnalysisPanel
                  instrument={selectedInstrument}
                  currentPrice={currentPrice}
                  analyses={manualAnalyses}
                  onAddAnalysis={handleAddManualAnalysis}
                  onDeleteAnalysis={handleDeleteManualAnalysis}
                />
                
                <AddPatternForm
                  instrument={selectedInstrument}
                  timeframe={selectedTimeframe}
                  patterns={manualPatterns}
                  onAddPattern={handleAddManualPattern}
                  onDeletePattern={handleDeleteManualPattern}
                />
              </TabsContent>

              {/* Multi-Asset Tab */}
              <TabsContent value="multi-asset" className="mt-6">
                <MultiAssetPanel
                  assets={assetAnalyses}
                  onAddAsset={handleAddAsset}
                  onUpdateAsset={handleUpdateAsset}
                  onDeleteAsset={handleDeleteAsset}
                />
              </TabsContent>

              {/* Wave Analysis Tab */}
              <TabsContent value="waves" className="mt-6">
                <WaveAnalysisTabs currentPrice={currentPrice} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternRecognition;
