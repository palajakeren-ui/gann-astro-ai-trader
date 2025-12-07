import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { useState } from "react";

const timeframes = [
  { label: "1M", value: "M1", name: "1 Minute" },
  { label: "2M", value: "M2", name: "2 Minutes" },
  { label: "3M", value: "M3", name: "3 Minutes" },
  { label: "5M", value: "M5", name: "5 Minutes" },
  { label: "10M", value: "M10", name: "10 Minutes" },
  { label: "15M", value: "M15", name: "15 Minutes" },
  { label: "30M", value: "M30", name: "30 Minutes" },
  { label: "45M", value: "M45", name: "45 Minutes" },
  { label: "1H", value: "H1", name: "1 Hour" },
  { label: "2H", value: "H2", name: "2 Hours" },
  { label: "3H", value: "H3", name: "3 Hours" },
  { label: "4H", value: "H4", name: "4 Hours" },
  { label: "1D", value: "D1", name: "1 Day" },
  { label: "1W", value: "W1", name: "1 Week" },
  { label: "1MO", value: "MN", name: "1 Month" },
];

const defaultStrategies = [
  { name: "Gann Geometry", weight: 0.25 },
  { name: "Astro Cycles", weight: 0.15 },
  { name: "Ehlers DSP", weight: 0.20 },
  { name: "ML Models", weight: 0.25 },
  { name: "Pattern Recognition", weight: 0.10 },
  { name: "Options Flow", weight: 0.05 },
];

type TimeframeWeights = {
  [key: string]: { name: string; weight: number }[];
};

const initialWeights: TimeframeWeights = timeframes.reduce((acc, tf) => {
  acc[tf.value] = defaultStrategies.map(s => ({ ...s }));
  return acc;
}, {} as TimeframeWeights);
const Settings = () => {
  const [tfWeights, setTfWeights] = useState<TimeframeWeights>(initialWeights);
  const [activeTf, setActiveTf] = useState("H1");

  const handleWeightChange = (tf: string, strategyIdx: number, newWeight: number) => {
    setTfWeights(prev => ({
      ...prev,
      [tf]: prev[tf].map((s, idx) => 
        idx === strategyIdx ? { ...s, weight: newWeight } : s
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3" />
          Settings
        </h1>
        <p className="text-muted-foreground">Configure your trading system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Strategy Weights by Timeframe</h2>
          
          <Tabs value={activeTf} onValueChange={setActiveTf} className="w-full">
            <TabsList className="flex flex-wrap gap-1 h-auto p-2 mb-4">
              {timeframes.map((tf) => (
                <TabsTrigger key={tf.value} value={tf.value} className="text-xs px-2 py-1">
                  {tf.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {timeframes.map((tf) => (
              <TabsContent key={tf.value} value={tf.value} className="space-y-4">
                <div className="p-3 rounded bg-primary/10 border border-primary/20 mb-4">
                  <span className="text-sm font-semibold text-primary">{tf.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({tf.value})</span>
                </div>
                
                {tfWeights[tf.value]?.map((strategy, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">{strategy.name}</Label>
                      <span className="text-sm font-mono text-foreground bg-secondary px-2 py-0.5 rounded">
                        {strategy.weight.toFixed(2)}
                      </span>
                    </div>
                    <Input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05" 
                      value={strategy.weight}
                      onChange={(e) => handleWeightChange(tf.value, idx, parseFloat(e.target.value))}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Weight:</span>
                    <span className={`font-mono font-semibold ${
                      Math.abs(tfWeights[tf.value]?.reduce((sum, s) => sum + s.weight, 0) - 1) < 0.01 
                        ? 'text-success' 
                        : 'text-destructive'
                    }`}>
                      {tfWeights[tf.value]?.reduce((sum, s) => sum + s.weight, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Primary/Confirmation Timeframe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-tf" className="text-foreground">Primary Timeframe</Label>
                <select id="primary-tf" className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground">
                  {timeframes.map((tf) => (
                    <option key={tf.value} value={tf.value} selected={tf.value === "H1"}>{tf.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmation-tf" className="text-foreground">Confirmation Timeframe</Label>
                <select id="confirmation-tf" className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground">
                  {timeframes.map((tf) => (
                    <option key={tf.value} value={tf.value} selected={tf.value === "H4"}>{tf.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Risk Management</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="risk-per-trade" className="text-foreground">Risk Per Trade (%)</Label>
              <Input id="risk-per-trade" type="number" defaultValue="2.0" step="0.1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-drawdown" className="text-foreground">Max Drawdown (%)</Label>
              <Input id="max-drawdown" type="number" defaultValue="20" step="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kelly-fraction" className="text-foreground">Kelly Fraction</Label>
              <Input id="kelly-fraction" type="number" defaultValue="0.5" step="0.1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="risk-reward-manual" className="text-foreground">Risk-to-Reward Manual</Label>
              <Input id="risk-reward-manual" type="number" defaultValue="2.0" step="0.1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position-lot-manual" className="text-foreground">Open Position Lot Manual</Label>
              <Input id="position-lot-manual" type="number" defaultValue="0.01" step="0.01" />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="adaptive-sizing" className="text-foreground">Adaptive Position Sizing</Label>
              <Switch id="adaptive-sizing" defaultChecked />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Active Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Gann Square of 9",
            "Gann Angles",
            "Planetary Aspects",
            "MAMA Indicator",
            "Fisher Transform",
            "LSTM Predictor",
            "Pattern Recognition",
            "Options Flow",
            "Ehlers Cyber Cycle",
          ].map((strategy, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded bg-secondary/50">
              <span className="text-sm text-foreground">{strategy}</span>
              <Switch defaultChecked={idx < 6} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Trading Platform Configuration</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure connections to MetaTrader 5, Binance Spot, and Binance Futures
        </p>
        
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center justify-between">
              MetaTrader 5 Configuration
              <Switch defaultChecked />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mt5-server" className="text-foreground">Server Address</Label>
                <Input id="mt5-server" placeholder="broker.server.com:443" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mt5-login" className="text-foreground">Login ID</Label>
                <Input id="mt5-login" type="number" placeholder="12345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mt5-password" className="text-foreground">Password</Label>
                <Input id="mt5-password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mt5-account" className="text-foreground">Account Type</Label>
                <Input id="mt5-account" placeholder="Real / Demo" defaultValue="Demo" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center justify-between">
              Binance Spot Configuration
              <Switch defaultChecked />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="binance-spot-key" className="text-foreground">API Key</Label>
                <Input id="binance-spot-key" type="password" placeholder="Enter Binance Spot API Key" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="binance-spot-secret" className="text-foreground">API Secret</Label>
                <Input id="binance-spot-secret" type="password" placeholder="Enter Binance Spot Secret Key" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="binance-spot-endpoint" className="text-foreground">API Endpoint</Label>
                <Input id="binance-spot-endpoint" defaultValue="https://api.binance.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="binance-spot-testnet" className="text-foreground">Test Mode</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="binance-spot-testnet" />
                  <Label htmlFor="binance-spot-testnet" className="text-sm text-muted-foreground">
                    Use Testnet
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center justify-between">
              Binance Futures Configuration
              <Switch defaultChecked />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="binance-futures-key" className="text-foreground">API Key</Label>
                <Input id="binance-futures-key" type="password" placeholder="Enter Binance Futures API Key" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="binance-futures-secret" className="text-foreground">API Secret</Label>
                <Input id="binance-futures-secret" type="password" placeholder="Enter Binance Futures Secret Key" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="binance-futures-endpoint" className="text-foreground">API Endpoint</Label>
                <Input id="binance-futures-endpoint" defaultValue="https://fapi.binance.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="binance-futures-testnet" className="text-foreground">Test Mode</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="binance-futures-testnet" />
                  <Label htmlFor="binance-futures-testnet" className="text-sm text-muted-foreground">
                    Use Testnet
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3">Algorithm Configuration (YAML)</h3>
            <div className="space-y-2">
              <Label htmlFor="yaml-config" className="text-foreground">Trading Algorithm Architecture</Label>
              <textarea
                id="yaml-config"
                className="w-full h-32 p-3 rounded-md bg-background border border-border text-foreground font-mono text-sm"
                placeholder={`# Trading Algorithm Configuration
algorithm:
  type: gann_navigator
  version: 1.0
  
platforms:
  - name: mt5
    enabled: true
  - name: binance_spot
    enabled: true
  - name: binance_futures
    enabled: true

strategies:
  - gann_angles
  - square_of_nine
  - fibonacci_levels`}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">FIX Protocol Connector</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fix-host" className="text-foreground">FIX Gateway Host</Label>
            <Input id="fix-host" placeholder="fix.broker.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fix-port" className="text-foreground">Port</Label>
            <Input id="fix-port" type="number" placeholder="9876" defaultValue="9876" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fix-sender" className="text-foreground">Sender Comp ID</Label>
            <Input id="fix-sender" placeholder="SENDER_ID" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fix-target" className="text-foreground">Target Comp ID</Label>
            <Input id="fix-target" placeholder="TARGET_ID" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <Label htmlFor="fix-enabled" className="text-foreground">Enable FIX Connector</Label>
          <Switch id="fix-enabled" />
        </div>
      </Card>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Connection Status</h2>
        <div className="space-y-3">
          {[
            { name: "MetaTrader 5", status: "Connected", color: "success" },
            { name: "Binance Spot", status: "Connected", color: "success" },
            { name: "Binance Futures", status: "Connected", color: "success" },
            { name: "FIX Connector", status: "Disconnected", color: "muted" },
          ].map((conn, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-foreground font-medium">{conn.name}</span>
              <Badge 
                variant="outline"
                className={
                  conn.color === "success" 
                    ? "border-success text-success bg-success/10" 
                    : "border-muted-foreground text-muted-foreground"
                }
              >
                {conn.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Legacy Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="broker" className="text-foreground">Broker</Label>
            <select id="broker" className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground">
              <option>MetaTrader 5</option>
              <option>Binance Futures</option>
              <option>Interactive Brokers</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="account" className="text-foreground">Account ID</Label>
            <Input id="account" type="text" placeholder="Enter account ID" />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="lg">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default Settings;
