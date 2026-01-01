import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  TrendingUp, 
  Shield, 
  Layers, 
  DollarSign,
  AlertTriangle,
  Target,
  Percent
} from "lucide-react";

interface TradingModePanelProps {
  compact?: boolean;
}

const TradingModePanel = ({ compact = false }: TradingModePanelProps) => {
  const [activeMode, setActiveMode] = useState<"spot" | "futures">("futures");
  
  // Spot Settings
  const [spotSettings, setSpotSettings] = useState({
    defaultOrderType: "limit",
    slippageTolerance: "0.5",
    autoConvertDust: true,
    preferredQuoteCurrency: "USDT",
    enableMarginTrading: false,
    riskPerTrade: "2",
    maxDrawdown: "20",
  });

  // Futures Settings
  const [futuresSettings, setFuturesSettings] = useState({
    defaultLeverage: "10",
    marginMode: "cross",
    positionMode: "hedge",
    autoDeleverage: true,
    stopLossPercentage: "2",
    takeProfitPercentage: "4",
    trailingStopEnabled: false,
    trailingStopCallback: "1",
    reduceOnlyDefault: false,
    riskPerTrade: "1",
    maxDrawdown: "15",
    maxPositions: "5",
  });

  // Risk Management (shared)
  const [riskSettings, setRiskSettings] = useState({
    riskRewardRatio: "2.0",
    kellyFraction: "0.5",
    volatilityAdjustment: true,
    drawdownProtection: true,
    adaptiveSizing: true,
  });

  return (
    <Card className="p-4 md:p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Trading Mode & Risk Configuration
        </h2>
        <Badge variant="outline" className={activeMode === "futures" ? "border-accent text-accent" : "border-success text-success"}>
          {activeMode === "futures" ? "Futures Mode" : "Spot Mode"}
        </Badge>
      </div>

      <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as "spot" | "futures")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="spot" className="text-sm">
            <DollarSign className="w-4 h-4 mr-1" />
            Spot Trading
          </TabsTrigger>
          <TabsTrigger value="futures" className="text-sm">
            <Layers className="w-4 h-4 mr-1" />
            Futures Trading
          </TabsTrigger>
        </TabsList>

        {/* SPOT TRADING */}
        <TabsContent value="spot" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Order Settings */}
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                Order Settings
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Order Type</Label>
                  <select
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                    value={spotSettings.defaultOrderType}
                    onChange={(e) => setSpotSettings({ ...spotSettings, defaultOrderType: e.target.value })}
                  >
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                    <option value="stop-limit">Stop Limit</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Slippage Tolerance (%)</Label>
                  <Input
                    type="number"
                    value={spotSettings.slippageTolerance}
                    onChange={(e) => setSpotSettings({ ...spotSettings, slippageTolerance: e.target.value })}
                    step="0.1"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Quote Currency</Label>
                  <select
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                    value={spotSettings.preferredQuoteCurrency}
                    onChange={(e) => setSpotSettings({ ...spotSettings, preferredQuoteCurrency: e.target.value })}
                  >
                    <option value="USDT">USDT</option>
                    <option value="USDC">USDC</option>
                    <option value="BUSD">BUSD</option>
                    <option value="BTC">BTC</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Risk Management */}
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Risk Management
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Risk Per Trade (%)</Label>
                  <Input
                    type="number"
                    value={spotSettings.riskPerTrade}
                    onChange={(e) => setSpotSettings({ ...spotSettings, riskPerTrade: e.target.value })}
                    step="0.5"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max Drawdown (%)</Label>
                  <Input
                    type="number"
                    value={spotSettings.maxDrawdown}
                    onChange={(e) => setSpotSettings({ ...spotSettings, maxDrawdown: e.target.value })}
                    step="1"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Risk:Reward Ratio</Label>
                  <Input
                    type="number"
                    value={riskSettings.riskRewardRatio}
                    onChange={(e) => setRiskSettings({ ...riskSettings, riskRewardRatio: e.target.value })}
                    step="0.5"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                Options
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Auto-Convert Dust</Label>
                  <Switch
                    checked={spotSettings.autoConvertDust}
                    onCheckedChange={(checked) => setSpotSettings({ ...spotSettings, autoConvertDust: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Margin Trading</Label>
                  <Switch
                    checked={spotSettings.enableMarginTrading}
                    onCheckedChange={(checked) => setSpotSettings({ ...spotSettings, enableMarginTrading: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Adaptive Sizing</Label>
                  <Switch
                    checked={riskSettings.adaptiveSizing}
                    onCheckedChange={(checked) => setRiskSettings({ ...riskSettings, adaptiveSizing: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Drawdown Protection</Label>
                  <Switch
                    checked={riskSettings.drawdownProtection}
                    onCheckedChange={(checked) => setRiskSettings({ ...riskSettings, drawdownProtection: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* FUTURES TRADING */}
        <TabsContent value="futures" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Leverage & Margin */}
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                Leverage & Margin
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Default Leverage</Label>
                  <select
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                    value={futuresSettings.defaultLeverage}
                    onChange={(e) => setFuturesSettings({ ...futuresSettings, defaultLeverage: e.target.value })}
                  >
                    {[1, 2, 3, 5, 10, 20, 25, 50, 75, 100, 125].map((lev) => (
                      <option key={lev} value={lev.toString()}>{lev}x</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Margin Mode</Label>
                  <select
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                    value={futuresSettings.marginMode}
                    onChange={(e) => setFuturesSettings({ ...futuresSettings, marginMode: e.target.value })}
                  >
                    <option value="cross">Cross Margin</option>
                    <option value="isolated">Isolated Margin</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Position Mode</Label>
                  <select
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
                    value={futuresSettings.positionMode}
                    onChange={(e) => setFuturesSettings({ ...futuresSettings, positionMode: e.target.value })}
                  >
                    <option value="one-way">One-Way Mode</option>
                    <option value="hedge">Hedge Mode</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Risk Management */}
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                Risk Management
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Risk Per Trade (%)</Label>
                  <Input
                    type="number"
                    value={futuresSettings.riskPerTrade}
                    onChange={(e) => setFuturesSettings({ ...futuresSettings, riskPerTrade: e.target.value })}
                    step="0.5"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max Drawdown (%)</Label>
                  <Input
                    type="number"
                    value={futuresSettings.maxDrawdown}
                    onChange={(e) => setFuturesSettings({ ...futuresSettings, maxDrawdown: e.target.value })}
                    step="1"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max Positions</Label>
                  <Input
                    type="number"
                    value={futuresSettings.maxPositions}
                    onChange={(e) => setFuturesSettings({ ...futuresSettings, maxPositions: e.target.value })}
                    step="1"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Risk:Reward Ratio</Label>
                  <Input
                    type="number"
                    value={riskSettings.riskRewardRatio}
                    onChange={(e) => setRiskSettings({ ...riskSettings, riskRewardRatio: e.target.value })}
                    step="0.5"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* TP/SL & Options */}
            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Percent className="w-4 h-4 text-success" />
                TP/SL Settings
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Stop Loss (%)</Label>
                  <Input
                    type="number"
                    value={futuresSettings.stopLossPercentage}
                    onChange={(e) => setFuturesSettings({ ...futuresSettings, stopLossPercentage: e.target.value })}
                    step="0.5"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Take Profit (%)</Label>
                  <Input
                    type="number"
                    value={futuresSettings.takeProfitPercentage}
                    onChange={(e) => setFuturesSettings({ ...futuresSettings, takeProfitPercentage: e.target.value })}
                    step="0.5"
                    className="text-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Trailing Stop</Label>
                  <Switch
                    checked={futuresSettings.trailingStopEnabled}
                    onCheckedChange={(checked) => setFuturesSettings({ ...futuresSettings, trailingStopEnabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Auto-Deleverage</Label>
                  <Switch
                    checked={futuresSettings.autoDeleverage}
                    onCheckedChange={(checked) => setFuturesSettings({ ...futuresSettings, autoDeleverage: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Reduce-Only</Label>
                  <Switch
                    checked={futuresSettings.reduceOnlyDefault}
                    onCheckedChange={(checked) => setFuturesSettings({ ...futuresSettings, reduceOnlyDefault: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Bar */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Mode:</span>
            <Badge className={activeMode === "futures" ? "bg-accent" : "bg-success"}>
              {activeMode.toUpperCase()}
            </Badge>
          </div>
          {activeMode === "futures" && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Leverage:</span>
                <span className="font-mono font-semibold text-foreground">{futuresSettings.defaultLeverage}x</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Margin:</span>
                <span className="font-mono font-semibold text-foreground capitalize">{futuresSettings.marginMode}</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Risk:</span>
            <span className="font-mono font-semibold text-foreground">
              {activeMode === "futures" ? futuresSettings.riskPerTrade : spotSettings.riskPerTrade}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">R:R:</span>
            <span className="font-mono font-semibold text-foreground">1:{riskSettings.riskRewardRatio}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TradingModePanel;
