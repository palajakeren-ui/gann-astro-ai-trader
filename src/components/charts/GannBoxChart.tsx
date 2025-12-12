import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Box, RefreshCw } from "lucide-react";

const TIMEFRAMES = [
  { value: "1m", label: "1 Minute" },
  { value: "2m", label: "2 Minutes" },
  { value: "3m", label: "3 Minutes" },
  { value: "5m", label: "5 Minutes" },
  { value: "10m", label: "10 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "30m", label: "30 Minutes" },
  { value: "45m", label: "45 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "2h", label: "2 Hours" },
  { value: "3h", label: "3 Hours" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
  { value: "1mo", label: "1 Month" },
];

const GANN_ANGLES = [
  { degree: 0, label: "0°", type: "cardinal" },
  { degree: 45, label: "45°", type: "diagonal" },
  { degree: 90, label: "90°", type: "cardinal" },
  { degree: 135, label: "135°", type: "diagonal" },
  { degree: 180, label: "180°", type: "cardinal" },
  { degree: 225, label: "225°", type: "diagonal" },
  { degree: 270, label: "270°", type: "cardinal" },
  { degree: 315, label: "315°", type: "diagonal" },
  { degree: 360, label: "360°", type: "cardinal" },
];

interface GannBoxChartProps {
  basePrice?: number;
}

export const GannBoxChart = ({ basePrice = 100 }: GannBoxChartProps) => {
  const [price, setPrice] = useState(basePrice.toString());
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>(["1h", "4h", "1d"]);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [boxLevels, setBoxLevels] = useState<{ degree: number; price: number; type: string }[]>([]);

  const calculateGannBox = () => {
    const priceValue = parseFloat(price) || 100;
    const sqrtPrice = Math.sqrt(priceValue);
    
    const levels = GANN_ANGLES.map((angle) => {
      const radians = (angle.degree * Math.PI) / 180;
      const priceLevel = Math.pow(sqrtPrice + radians / (2 * Math.PI), 2);
      return {
        degree: angle.degree,
        price: priceLevel,
        type: angle.type,
      };
    });
    
    setBoxLevels(levels);
  };

  const toggleTimeframe = (tf: string) => {
    setSelectedTimeframes((prev) =>
      prev.includes(tf) ? prev.filter((t) => t !== tf) : [...prev, tf]
    );
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Box className="h-5 w-5 text-primary" />
          Gann Box 0-360° Multi-Timeframe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Base Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={calculateGannBox} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Calculate
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Auto Update</Label>
            <Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Active Timeframes</Label>
          <div className="flex flex-wrap gap-2">
            {TIMEFRAMES.map((tf) => (
              <Badge
                key={tf.value}
                variant={selectedTimeframes.includes(tf.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTimeframe(tf.value)}
              >
                {tf.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Gann Box Visualization */}
        <div className="relative aspect-square bg-background/50 rounded-lg border border-border/50 overflow-hidden">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Background grid */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const radians = (angle * Math.PI) / 180;
              const x2 = 100 + 90 * Math.cos(radians);
              const y2 = 100 + 90 * Math.sin(radians);
              return (
                <line
                  key={angle}
                  x1="100"
                  y1="100"
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              );
            })}
            
            {/* Concentric circles */}
            {[20, 40, 60, 80].map((r) => (
              <circle
                key={r}
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Gann Box */}
            <rect
              x="20"
              y="20"
              width="160"
              height="160"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
            
            {/* Diagonal lines */}
            <line x1="20" y1="20" x2="180" y2="180" stroke="hsl(var(--primary))" strokeWidth="1" />
            <line x1="180" y1="20" x2="20" y2="180" stroke="hsl(var(--primary))" strokeWidth="1" />
            
            {/* Mid lines */}
            <line x1="100" y1="20" x2="100" y2="180" stroke="hsl(var(--accent))" strokeWidth="1" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="hsl(var(--accent))" strokeWidth="1" />
            
            {/* Degree labels */}
            {GANN_ANGLES.slice(0, -1).map((angle) => {
              const radians = ((angle.degree - 90) * Math.PI) / 180;
              const x = 100 + 95 * Math.cos(radians);
              const y = 100 + 95 * Math.sin(radians);
              return (
                <text
                  key={angle.degree}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[6px]"
                >
                  {angle.label}
                </text>
              );
            })}
            
            {/* Center price */}
            <text
              x="100"
              y="100"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-primary text-[10px] font-bold"
            >
              {parseFloat(price).toFixed(2)}
            </text>
          </svg>
        </div>

        {/* Price Levels */}
        {boxLevels.length > 0 && (
          <div className="space-y-2">
            <Label>Gann Box Price Levels</Label>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {boxLevels.map((level) => (
                <div
                  key={level.degree}
                  className={`p-2 rounded border ${
                    level.type === "cardinal"
                      ? "bg-primary/10 border-primary/30"
                      : "bg-accent/10 border-accent/30"
                  }`}
                >
                  <div className="font-medium">{level.degree}°</div>
                  <div className="text-muted-foreground">{level.price.toFixed(4)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeframe Status */}
        <div className="space-y-2">
          <Label>Timeframe Analysis Status</Label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {selectedTimeframes.map((tf) => {
              const tfData = TIMEFRAMES.find((t) => t.value === tf);
              const signal = Math.random() > 0.5 ? "bullish" : "bearish";
              return (
                <div key={tf} className="p-2 rounded bg-secondary/50 border border-border/50">
                  <div className="font-medium">{tfData?.label}</div>
                  <Badge variant={signal === "bullish" ? "default" : "destructive"} className="text-[10px]">
                    {signal.toUpperCase()}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
