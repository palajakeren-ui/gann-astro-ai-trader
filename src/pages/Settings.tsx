import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
        <h2 className="text-xl font-semibold text-foreground mb-4">Broker Configuration</h2>
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
