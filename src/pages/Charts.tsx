import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Layers, ZoomIn, ZoomOut } from "lucide-react";

const Charts = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advanced Charts</h1>
          <p className="text-muted-foreground">Technical analysis with Gann overlays</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ZoomOut className="w-4 h-4 mr-2" />
            Zoom Out
          </Button>
          <Button variant="outline" size="sm">
            <ZoomIn className="w-4 h-4 mr-2" />
            Zoom In
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3 p-6 border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-foreground">EURUSD</h2>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                H4
              </Badge>
              <div className="text-2xl font-bold text-foreground">1.0875</div>
              <div className="text-sm text-success flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +0.42%
              </div>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-secondary/30 rounded-lg h-[500px] flex items-center justify-center border border-border">
            <div className="text-center space-y-4">
              <Layers className="w-16 h-16 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-semibold text-foreground">Price Chart</p>
                <p className="text-sm text-muted-foreground">
                  Connect to data feed to display live charts
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Gann Square Active</Badge>
              <Badge variant="outline">Angles: 1x1, 2x1</Badge>
              <Badge variant="outline">Support: 1.0850</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Overlays</h3>
          <div className="space-y-3">
            {[
              { name: "Gann Square of 9", active: true },
              { name: "Gann Angles", active: true },
              { name: "Fibonacci Levels", active: false },
              { name: "Support/Resistance", active: true },
              { name: "Planetary Lines", active: true },
              { name: "MAMA", active: true },
              { name: "Fisher Transform", active: false },
            ].map((overlay, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-secondary/50">
                <span className="text-sm text-foreground">{overlay.name}</span>
                <div className={`w-2 h-2 rounded-full ${overlay.active ? "bg-success" : "bg-muted"}`} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 border-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Gann Levels</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Resistance 2</span>
              <span className="text-destructive font-mono">1.0920</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Resistance 1</span>
              <span className="text-destructive font-mono">1.0895</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-y border-border py-2">
              <span className="text-foreground">Current</span>
              <span className="text-foreground font-mono">1.0875</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Support 1</span>
              <span className="text-success font-mono">1.0850</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Support 2</span>
              <span className="text-success font-mono">1.0825</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Time Cycles</h3>
          <div className="space-y-3">
            <div className="p-3 rounded bg-accent/10 border border-accent/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-foreground">Next Turn Date</span>
                <Badge variant="outline" className="text-xs">High Probability</Badge>
              </div>
              <p className="text-lg font-bold text-accent">Dec 28, 2024</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mars Cycle</span>
                <span className="text-foreground">18 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jupiter Cycle</span>
                <span className="text-foreground">45 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gann 90°</span>
                <span className="text-foreground">3 days</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Signal Strength</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Gann</span>
                <span className="text-sm font-semibold text-success">85%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-success w-[85%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Astro</span>
                <span className="text-sm font-semibold text-accent">72%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[72%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">ML</span>
                <span className="text-sm font-semibold text-success">78%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-success w-[78%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Charts;
