import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, TrendingUp } from "lucide-react";

const AI = () => {
  const models = [
    { name: "LSTM Predictor", accuracy: 78.5, predictions: 1250, status: "Active" },
    { name: "Transformer Trend", accuracy: 82.3, predictions: 980, status: "Active" },
    { name: "XGBoost Classifier", accuracy: 75.8, predictions: 1450, status: "Active" },
    { name: "Random Forest", accuracy: 73.2, predictions: 1120, status: "Active" },
    { name: "MLP Ensemble", accuracy: 76.9, predictions: 890, status: "Training" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Brain className="w-8 h-8 mr-3 text-accent" />
          AI Models
        </h1>
        <p className="text-muted-foreground">Machine learning predictions & ensemble</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-border bg-card">
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="w-5 h-5 text-warning" />
            <h3 className="text-sm font-semibold text-muted-foreground">Ensemble Accuracy</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">77.3%</p>
          <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
            High Performance
          </Badge>
        </Card>

        <Card className="p-6 border-border bg-card">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <h3 className="text-sm font-semibold text-muted-foreground">Active Models</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">5</p>
          <Badge variant="outline" className="mt-2">Production</Badge>
        </Card>

        <Card className="p-6 border-border bg-card">
          <div className="flex items-center space-x-3 mb-2">
            <Brain className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-semibold text-muted-foreground">Total Predictions</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">5,690</p>
          <Badge variant="outline" className="mt-2 bg-accent/10 text-accent border-accent/20">
            Last 30 days
          </Badge>
        </Card>

        <Card className="p-6 border-border bg-card">
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-muted-foreground">Inference Time</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">45ms</p>
          <Badge variant="outline" className="mt-2">Fast</Badge>
        </Card>
      </div>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Model Performance</h2>
        <div className="space-y-3">
          {models.map((model, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{model.name}</p>
                  <p className="text-xs text-muted-foreground">{model.predictions} predictions</p>
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="font-semibold text-foreground">{model.accuracy}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success"
                      style={{ width: `${model.accuracy}%` }}
                    />
                  </div>
                </div>
                <Badge
                  variant={model.status === "Active" ? "default" : "secondary"}
                  className={model.status === "Active" ? "bg-success" : ""}
                >
                  {model.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Current Predictions</h2>
          <div className="space-y-3">
            {[
              { symbol: "EURUSD", direction: "UP", confidence: 85, target: 1.0920 },
              { symbol: "BTCUSDT", direction: "UP", confidence: 82, target: 44500 },
              { symbol: "XAUUSD", direction: "DOWN", confidence: 78, target: 2030 },
            ].map((pred, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">{pred.symbol}</span>
                  <Badge
                    variant={pred.direction === "UP" ? "default" : "destructive"}
                    className={pred.direction === "UP" ? "bg-success" : ""}
                  >
                    {pred.direction}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Target: {pred.target}</span>
                  <span className="text-foreground">{pred.confidence}% confidence</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Training Status</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">MLP Ensemble</span>
                <Badge variant="outline" className="border-warning text-warning">
                  Training
                </Badge>
              </div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Epoch 45/100</span>
                <span className="font-semibold text-foreground">45%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-warning" style={{ width: "45%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loss</span>
                <span className="font-mono text-foreground">0.0245</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Val Accuracy</span>
                <span className="font-mono text-success">76.9%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ETA</span>
                <span className="font-mono text-foreground">2h 15m</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AI;
