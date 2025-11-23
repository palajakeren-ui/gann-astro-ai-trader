import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Save } from "lucide-react";

const Settings = () => {
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
          <h2 className="text-xl font-semibold text-foreground mb-4">Strategy Weights</h2>
          <div className="space-y-4">
            {[
              { name: "Gann Geometry", weight: 0.25 },
              { name: "Astro Cycles", weight: 0.15 },
              { name: "Ehlers DSP", weight: 0.20 },
              { name: "ML Models", weight: 0.25 },
              { name: "Pattern Recognition", weight: 0.10 },
              { name: "Options Flow", weight: 0.05 },
            ].map((strategy, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">{strategy.name}</Label>
                  <span className="text-sm font-mono text-foreground">{strategy.weight}</span>
                </div>
                <Input type="range" min="0" max="1" step="0.05" defaultValue={strategy.weight} />
              </div>
            ))}
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
