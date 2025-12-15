import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface HexagonGeometryChartProps {
  currentPrice: number;
}

// Full Hexagon angles: 0°,15°,30°,45°,60°,90°,135°,180°,225°,270°,315°,360°
const HEXAGON_ANGLES = [
  { angle: 0, label: "0°", multiplier: 1.000, type: "origin" },
  { angle: 15, label: "15°", multiplier: 0.996, type: "minor" },
  { angle: 30, label: "30°", multiplier: 0.992, type: "support" },
  { angle: 45, label: "45°", multiplier: 0.988, type: "cardinal" },
  { angle: 60, label: "60°", multiplier: 0.982, type: "support" },
  { angle: 90, label: "90°", multiplier: 0.975, type: "major" },
  { angle: 135, label: "135°", multiplier: 1.012, type: "resistance" },
  { angle: 180, label: "180°", multiplier: 1.025, type: "pivot" },
  { angle: 225, label: "225°", multiplier: 1.038, type: "resistance" },
  { angle: 270, label: "270°", multiplier: 1.050, type: "major" },
  { angle: 315, label: "315°", multiplier: 0.962, type: "support" },
  { angle: 360, label: "360°", multiplier: 0.950, type: "cycle" },
];

const HexagonGeometryChart = ({ currentPrice }: HexagonGeometryChartProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "origin":
      case "pivot":
      case "cycle":
        return "border-primary text-primary";
      case "support":
      case "cardinal":
        return "border-success text-success";
      case "resistance":
        return "border-destructive text-destructive";
      case "major":
        return "border-accent text-accent";
      case "minor":
        return "border-muted-foreground text-muted-foreground";
      default:
        return "border-border text-foreground";
    }
  };

  const levels = HEXAGON_ANGLES.map(item => ({
    ...item,
    price: Number((currentPrice * item.multiplier).toFixed(2)),
  }));

  // SVG Hexagon visualization
  const centerX = 150;
  const centerY = 150;
  const radius = 120;

  return (
    <Card className="p-4 md:p-6 border-border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-accent" />
        <h4 className="text-lg font-semibold text-foreground">Hexagon Geometry (0-360°)</h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SVG Visualization */}
        <div className="flex justify-center">
          <svg width="300" height="300" viewBox="0 0 300 300" className="w-full max-w-[300px]">
            {/* Background circles */}
            {[0.25, 0.5, 0.75, 1].map((scale, idx) => (
              <circle
                key={idx}
                cx={centerX}
                cy={centerY}
                r={radius * scale}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Hexagon lines */}
            {HEXAGON_ANGLES.map((item, idx) => {
              const radians = (item.angle - 90) * (Math.PI / 180);
              const x = centerX + radius * Math.cos(radians);
              const y = centerY + radius * Math.sin(radians);
              
              return (
                <g key={idx}>
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke={item.type === "major" || item.type === "pivot" ? "hsl(var(--primary))" : "hsl(var(--border))"}
                    strokeWidth={item.type === "major" || item.type === "pivot" ? 2 : 1}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill={item.type.includes("support") ? "hsl(var(--success))" : item.type.includes("resistance") ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                  />
                  <text
                    x={x + (x > centerX ? 8 : -8)}
                    y={y + (y > centerY ? 12 : -5)}
                    fill="hsl(var(--foreground))"
                    fontSize="10"
                    textAnchor={x > centerX ? "start" : "end"}
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}

            {/* Center price */}
            <circle cx={centerX} cy={centerY} r={35} fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
            <text x={centerX} y={centerY - 5} fill="hsl(var(--foreground))" fontSize="10" textAnchor="middle" fontWeight="bold">
              ${currentPrice.toLocaleString()}
            </text>
            <text x={centerX} y={centerY + 10} fill="hsl(var(--muted-foreground))" fontSize="8" textAnchor="middle">
              Current
            </text>
          </svg>
        </div>

        {/* Price levels list */}
        <div className="space-y-2 max-h-[280px] overflow-y-auto">
          {levels.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
              <span className="text-sm font-bold text-accent">{item.label}</span>
              <span className="text-sm font-mono text-foreground">${item.price.toLocaleString()}</span>
              <Badge variant="outline" className={`text-xs ${getTypeColor(item.type)}`}>
                {item.type}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 bg-success/10 rounded border border-success/30">
          <span className="text-success font-semibold">Support Levels</span>
        </div>
        <div className="p-2 bg-primary/10 rounded border border-primary/30">
          <span className="text-primary font-semibold">Pivot Points</span>
        </div>
        <div className="p-2 bg-destructive/10 rounded border border-destructive/30">
          <span className="text-destructive font-semibold">Resistance Levels</span>
        </div>
      </div>
    </Card>
  );
};

export default HexagonGeometryChart;
