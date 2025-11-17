import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const Gann = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gann Analysis</h1>
        <p className="text-muted-foreground">Sacred geometry & market vibrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            Square of 9
          </h2>
          <div className="bg-secondary/30 rounded-lg h-[400px] flex items-center justify-center border border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Spiral visualization</p>
              <p className="text-lg font-bold text-foreground mt-2">Current: 1.0875</p>
              <div className="mt-4 space-y-1">
                <p className="text-sm text-destructive">Resistance: 1.0920</p>
                <p className="text-sm text-success">Support: 1.0850</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Gann Angles</h2>
          <div className="space-y-4">
            {[
              { angle: "1x1", value: 1.0875, active: true },
              { angle: "1x2", value: 1.0895, active: true },
              { angle: "2x1", value: 1.0855, active: true },
              { angle: "1x3", value: 1.0910, active: false },
              { angle: "3x1", value: 1.0835, active: false },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">{item.angle}</Badge>
                  <span className="text-sm text-foreground">Level</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-foreground">{item.value}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.active ? "bg-success" : "bg-muted"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Square of 52</h3>
          <p className="text-2xl font-bold text-foreground">Active</p>
          <p className="text-xs text-muted-foreground mt-1">Weekly cycle</p>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Square of 144</h3>
          <p className="text-2xl font-bold text-foreground">85%</p>
          <p className="text-xs text-success mt-1">Strong signal</p>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Square of 360</h3>
          <p className="text-2xl font-bold text-foreground">Neutral</p>
          <p className="text-xs text-muted-foreground mt-1">Annual cycle</p>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Wave Count</h3>
          <p className="text-2xl font-bold text-foreground">Wave 3</p>
          <p className="text-xs text-success mt-1">Impulse up</p>
        </Card>
      </div>
    </div>
  );
};

export default Gann;
