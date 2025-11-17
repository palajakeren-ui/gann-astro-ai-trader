import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Telescope, Moon, Sun } from "lucide-react";

const Astro = () => {
  const aspects = [
    { planet1: "Mars", planet2: "Jupiter", aspect: "Trine", angle: 120, effect: "Bullish", strength: 85 },
    { planet1: "Venus", planet2: "Saturn", aspect: "Square", angle: 90, effect: "Bearish", strength: 72 },
    { planet1: "Mercury", planet2: "Uranus", aspect: "Sextile", angle: 60, effect: "Volatile", strength: 68 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Telescope className="w-8 h-8 mr-3 text-accent" />
          Astro Cycles
        </h1>
        <p className="text-muted-foreground">Planetary aspects & market timing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-border bg-card">
          <div className="flex items-center space-x-3 mb-3">
            <Sun className="w-6 h-6 text-warning" />
            <h3 className="text-lg font-semibold text-foreground">Solar Position</h3>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">Sagittarius 28°</p>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Bullish Phase
          </Badge>
        </Card>

        <Card className="p-6 border-border bg-card">
          <div className="flex items-center space-x-3 mb-3">
            <Moon className="w-6 h-6 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Moon Phase</h3>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">Waxing Gibbous</p>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            82% Full
          </Badge>
        </Card>

        <Card className="p-6 border-border bg-card">
          <div className="flex items-center space-x-3 mb-3">
            <Telescope className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Active Aspects</h3>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">{aspects.length}</p>
          <Badge variant="outline">Current Week</Badge>
        </Card>
      </div>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Major Planetary Aspects</h2>
        <div className="space-y-3">
          {aspects.map((aspect, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    {aspect.planet1}
                  </Badge>
                  <span className="text-muted-foreground">⟷</span>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    {aspect.planet2}
                  </Badge>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{aspect.aspect}</p>
                  <p className="text-xs text-muted-foreground">{aspect.angle}°</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge
                  variant={aspect.effect === "Bullish" ? "default" : "destructive"}
                  className={aspect.effect === "Bullish" ? "bg-success" : ""}
                >
                  {aspect.effect}
                </Badge>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{aspect.strength}%</p>
                  <p className="text-xs text-muted-foreground">Strength</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Retrograde Planets</h2>
          <div className="space-y-3">
            {[
              { planet: "Mercury", status: "Direct", next: "Jan 15, 2025" },
              { planet: "Venus", status: "Direct", next: "Mar 4, 2025" },
              { planet: "Mars", status: "Retrograde", ends: "Dec 25, 2024" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded bg-secondary/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${item.status === "Retrograde" ? "bg-warning" : "bg-success"}`} />
                  <span className="font-medium text-foreground">{item.planet}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{item.status}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.status === "Retrograde" ? `Ends: ${item.ends}` : `Next: ${item.next}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Planetary Cycles</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Jupiter Cycle</span>
                <span className="text-sm font-semibold text-foreground">Day 245/4333</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: "5.6%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Saturn Cycle</span>
                <span className="text-sm font-semibold text-foreground">Day 1890/10759</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: "17.5%" }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Astro;
