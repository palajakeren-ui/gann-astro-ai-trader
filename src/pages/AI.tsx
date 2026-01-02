import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Settings2, 
  Play, 
  Pause,
  RotateCcw,
  Save,
  Target,
  Layers,
  Cpu,
  Activity,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Optimizer types
const OPTIMIZERS = [
  { id: "adam", name: "Adam", description: "Adaptive Moment Estimation" },
  { id: "sgd", name: "SGD", description: "Stochastic Gradient Descent" },
  { id: "rmsprop", name: "RMSprop", description: "Root Mean Square Propagation" },
  { id: "adagrad", name: "AdaGrad", description: "Adaptive Gradient" },
  { id: "adamw", name: "AdamW", description: "Adam with Weight Decay" },
  { id: "nadam", name: "NAdam", description: "Nesterov Adam" },
];

// Learning rate schedulers
const LR_SCHEDULERS = [
  { id: "constant", name: "Constant", description: "Fixed learning rate" },
  { id: "step", name: "Step Decay", description: "Reduce LR by factor every N epochs" },
  { id: "exponential", name: "Exponential", description: "Exponential decay" },
  { id: "cosine", name: "Cosine Annealing", description: "Cosine-based decay" },
  { id: "warmup", name: "Warmup + Decay", description: "Linear warmup then decay" },
  { id: "plateau", name: "Reduce on Plateau", description: "Reduce when metric plateaus" },
];

// Loss functions
const LOSS_FUNCTIONS = [
  { id: "mse", name: "MSE", description: "Mean Squared Error" },
  { id: "mae", name: "MAE", description: "Mean Absolute Error" },
  { id: "huber", name: "Huber Loss", description: "Smooth L1 Loss" },
  { id: "cross_entropy", name: "Cross Entropy", description: "Classification loss" },
  { id: "focal", name: "Focal Loss", description: "Class imbalance handling" },
];

// Regularization techniques
const REGULARIZATION = [
  { id: "l1", name: "L1 (Lasso)", description: "Sparse weights" },
  { id: "l2", name: "L2 (Ridge)", description: "Weight decay" },
  { id: "elastic", name: "Elastic Net", description: "L1 + L2 combination" },
  { id: "dropout", name: "Dropout", description: "Random neuron dropping" },
  { id: "batch_norm", name: "Batch Normalization", description: "Normalize activations" },
];

interface TuningConfig {
  // Optimizer
  optimizer: string;
  learningRate: number;
  lrScheduler: string;
  momentum: number;
  beta1: number;
  beta2: number;
  epsilon: number;
  weightDecay: number;
  
  // Training
  batchSize: number;
  epochs: number;
  earlyStopping: boolean;
  patience: number;
  validationSplit: number;
  
  // Regularization
  regularization: string;
  l1Lambda: number;
  l2Lambda: number;
  dropoutRate: number;
  
  // Loss
  lossFunction: string;
  
  // Advanced
  gradientClipping: boolean;
  maxGradNorm: number;
  mixedPrecision: boolean;
  gradientAccumulation: number;
}

interface TuningResult {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  trainAccuracy: number;
  valAccuracy: number;
}

const AI = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedModel, setSelectedModel] = useState("lstm");
  const [tuningResults, setTuningResults] = useState<TuningResult[]>([]);
  
  const [config, setConfig] = useState<TuningConfig>({
    optimizer: "adam",
    learningRate: 0.001,
    lrScheduler: "cosine",
    momentum: 0.9,
    beta1: 0.9,
    beta2: 0.999,
    epsilon: 1e-8,
    weightDecay: 0.01,
    
    batchSize: 32,
    epochs: 100,
    earlyStopping: true,
    patience: 10,
    validationSplit: 0.2,
    
    regularization: "l2",
    l1Lambda: 0.001,
    l2Lambda: 0.001,
    dropoutRate: 0.3,
    
    lossFunction: "mse",
    
    gradientClipping: true,
    maxGradNorm: 1.0,
    mixedPrecision: false,
    gradientAccumulation: 1,
  });

  const models = [
    { id: "lstm", name: "LSTM Predictor", accuracy: 78.5, predictions: 1250, status: "Active" },
    { id: "transformer", name: "Transformer Trend", accuracy: 82.3, predictions: 980, status: "Active" },
    { id: "xgboost", name: "XGBoost Classifier", accuracy: 75.8, predictions: 1450, status: "Active" },
    { id: "rf", name: "Random Forest", accuracy: 73.2, predictions: 1120, status: "Active" },
    { id: "mlp", name: "MLP Ensemble", accuracy: 76.9, predictions: 890, status: "Training" },
  ];

  const updateConfig = <K extends keyof TuningConfig>(key: K, value: TuningConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const startOptimization = () => {
    setIsOptimizing(true);
    setTuningResults([]);
    toast.info("Starting model optimization...");
    
    // Simulate optimization progress
    let epoch = 0;
    const interval = setInterval(() => {
      epoch++;
      const trainLoss = 0.5 * Math.exp(-epoch / 30) + Math.random() * 0.05;
      const valLoss = 0.55 * Math.exp(-epoch / 35) + Math.random() * 0.08;
      const trainAcc = 100 * (1 - trainLoss) - Math.random() * 5;
      const valAcc = 100 * (1 - valLoss) - Math.random() * 8;
      
      setTuningResults(prev => [...prev, {
        epoch,
        trainLoss: Number(trainLoss.toFixed(4)),
        valLoss: Number(valLoss.toFixed(4)),
        trainAccuracy: Number(trainAcc.toFixed(2)),
        valAccuracy: Number(valAcc.toFixed(2)),
      }]);
      
      if (epoch >= config.epochs || epoch >= 50) {
        clearInterval(interval);
        setIsOptimizing(false);
        toast.success("Optimization completed!");
      }
    }, 200);
  };

  const stopOptimization = () => {
    setIsOptimizing(false);
    toast.info("Optimization stopped");
  };

  const resetConfig = () => {
    setConfig({
      optimizer: "adam",
      learningRate: 0.001,
      lrScheduler: "cosine",
      momentum: 0.9,
      beta1: 0.9,
      beta2: 0.999,
      epsilon: 1e-8,
      weightDecay: 0.01,
      batchSize: 32,
      epochs: 100,
      earlyStopping: true,
      patience: 10,
      validationSplit: 0.2,
      regularization: "l2",
      l1Lambda: 0.001,
      l2Lambda: 0.001,
      dropoutRate: 0.3,
      lossFunction: "mse",
      gradientClipping: true,
      maxGradNorm: 1.0,
      mixedPrecision: false,
      gradientAccumulation: 1,
    });
    toast.success("Configuration reset to defaults");
  };

  const saveConfig = () => {
    toast.success("Configuration saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Brain className="w-8 h-8 mr-3 text-accent" />
            AI Models
          </h1>
          <p className="text-muted-foreground">Machine learning predictions, ensemble & optimization</p>
        </div>
      </div>

      {/* Key Metrics */}
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

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="optimizer">
            <Settings2 className="w-3 h-3 mr-1" />
            Optimizer
          </TabsTrigger>
          <TabsTrigger value="tuning">Hyperparameter Tuning</TabsTrigger>
          <TabsTrigger value="results">Training Results</TabsTrigger>
        </TabsList>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-4 mt-4">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4">Model Performance</h2>
            <div className="space-y-3">
              {models.map((model, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-lg bg-secondary/50 border cursor-pointer transition-all ${
                    selectedModel === model.id ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedModel(model.id)}
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
                    {selectedModel === model.id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
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
        </TabsContent>

        {/* Optimizer Tab */}
        <TabsContent value="optimizer" className="space-y-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Optimizer Configuration
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetConfig}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={saveConfig}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button 
                size="sm" 
                onClick={isOptimizing ? stopOptimization : startOptimization}
                variant={isOptimizing ? "destructive" : "default"}
              >
                {isOptimizing ? (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Start Optimization
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Optimizer Selection */}
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                Optimizer Type
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Optimizer</Label>
                  <Select value={config.optimizer} onValueChange={(v) => updateConfig("optimizer", v)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OPTIMIZERS.map(opt => (
                        <SelectItem key={opt.id} value={opt.id}>
                          <div className="flex flex-col">
                            <span>{opt.name}</span>
                            <span className="text-xs text-muted-foreground">{opt.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Learning Rate: {config.learningRate}</Label>
                  <Slider
                    value={[Math.log10(config.learningRate)]}
                    min={-5}
                    max={-1}
                    step={0.1}
                    onValueChange={([v]) => updateConfig("learningRate", Number(Math.pow(10, v).toFixed(6)))}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0.00001</span>
                    <span>0.1</span>
                  </div>
                </div>

                {(config.optimizer === "sgd" || config.optimizer === "rmsprop") && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Momentum: {config.momentum}</Label>
                    <Slider
                      value={[config.momentum]}
                      min={0}
                      max={0.99}
                      step={0.01}
                      onValueChange={([v]) => updateConfig("momentum", v)}
                      className="mt-2"
                    />
                  </div>
                )}

                {(config.optimizer === "adam" || config.optimizer === "adamw" || config.optimizer === "nadam") && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Beta1</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={config.beta1}
                          onChange={(e) => updateConfig("beta1", Number(e.target.value))}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Beta2</Label>
                        <Input
                          type="number"
                          step="0.001"
                          value={config.beta2}
                          onChange={(e) => updateConfig("beta2", Number(e.target.value))}
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label className="text-xs text-muted-foreground">Weight Decay: {config.weightDecay}</Label>
                  <Slider
                    value={[config.weightDecay]}
                    min={0}
                    max={0.1}
                    step={0.001}
                    onValueChange={([v]) => updateConfig("weightDecay", v)}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Learning Rate Scheduler */}
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Learning Rate Scheduler
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Scheduler Type</Label>
                  <Select value={config.lrScheduler} onValueChange={(v) => updateConfig("lrScheduler", v)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LR_SCHEDULERS.map(sch => (
                        <SelectItem key={sch.id} value={sch.id}>
                          <div className="flex flex-col">
                            <span>{sch.name}</span>
                            <span className="text-xs text-muted-foreground">{sch.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Loss Function</Label>
                  <Select value={config.lossFunction} onValueChange={(v) => updateConfig("lossFunction", v)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOSS_FUNCTIONS.map(loss => (
                        <SelectItem key={loss.id} value={loss.id}>
                          <div className="flex flex-col">
                            <span>{loss.name}</span>
                            <span className="text-xs text-muted-foreground">{loss.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="text-sm font-medium text-foreground mb-2">Current Configuration</h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-muted-foreground">
                      Optimizer: <span className="text-foreground font-mono">{OPTIMIZERS.find(o => o.id === config.optimizer)?.name}</span>
                    </p>
                    <p className="text-muted-foreground">
                      LR: <span className="text-foreground font-mono">{config.learningRate}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Scheduler: <span className="text-foreground font-mono">{LR_SCHEDULERS.find(s => s.id === config.lrScheduler)?.name}</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Regularization */}
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-warning" />
                Regularization
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Regularization Type</Label>
                  <Select value={config.regularization} onValueChange={(v) => updateConfig("regularization", v)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REGULARIZATION.map(reg => (
                        <SelectItem key={reg.id} value={reg.id}>
                          <div className="flex flex-col">
                            <span>{reg.name}</span>
                            <span className="text-xs text-muted-foreground">{reg.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(config.regularization === "l1" || config.regularization === "elastic") && (
                  <div>
                    <Label className="text-xs text-muted-foreground">L1 Lambda: {config.l1Lambda}</Label>
                    <Slider
                      value={[config.l1Lambda]}
                      min={0}
                      max={0.1}
                      step={0.001}
                      onValueChange={([v]) => updateConfig("l1Lambda", v)}
                      className="mt-2"
                    />
                  </div>
                )}

                {(config.regularization === "l2" || config.regularization === "elastic") && (
                  <div>
                    <Label className="text-xs text-muted-foreground">L2 Lambda: {config.l2Lambda}</Label>
                    <Slider
                      value={[config.l2Lambda]}
                      min={0}
                      max={0.1}
                      step={0.001}
                      onValueChange={([v]) => updateConfig("l2Lambda", v)}
                      className="mt-2"
                    />
                  </div>
                )}

                {config.regularization === "dropout" && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Dropout Rate: {(config.dropoutRate * 100).toFixed(0)}%</Label>
                    <Slider
                      value={[config.dropoutRate]}
                      min={0}
                      max={0.8}
                      step={0.05}
                      onValueChange={([v]) => updateConfig("dropoutRate", v)}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Advanced Settings */}
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                Advanced Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm text-foreground">Gradient Clipping</Label>
                    <p className="text-xs text-muted-foreground">Prevent exploding gradients</p>
                  </div>
                  <Switch
                    checked={config.gradientClipping}
                    onCheckedChange={(v) => updateConfig("gradientClipping", v)}
                  />
                </div>

                {config.gradientClipping && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Max Gradient Norm: {config.maxGradNorm}</Label>
                    <Slider
                      value={[config.maxGradNorm]}
                      min={0.1}
                      max={10}
                      step={0.1}
                      onValueChange={([v]) => updateConfig("maxGradNorm", v)}
                      className="mt-2"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm text-foreground">Mixed Precision (FP16)</Label>
                    <p className="text-xs text-muted-foreground">Faster training, less memory</p>
                  </div>
                  <Switch
                    checked={config.mixedPrecision}
                    onCheckedChange={(v) => updateConfig("mixedPrecision", v)}
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Gradient Accumulation Steps</Label>
                  <Input
                    type="number"
                    min={1}
                    max={64}
                    value={config.gradientAccumulation}
                    onChange={(e) => updateConfig("gradientAccumulation", Number(e.target.value))}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Hyperparameter Tuning Tab */}
        <TabsContent value="tuning" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-success" />
                Training Configuration
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Batch Size</Label>
                    <Select value={String(config.batchSize)} onValueChange={(v) => updateConfig("batchSize", Number(v))}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[8, 16, 32, 64, 128, 256, 512].map(size => (
                          <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Epochs</Label>
                    <Input
                      type="number"
                      min={1}
                      max={1000}
                      value={config.epochs}
                      onChange={(e) => updateConfig("epochs", Number(e.target.value))}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Validation Split: {(config.validationSplit * 100).toFixed(0)}%</Label>
                  <Slider
                    value={[config.validationSplit]}
                    min={0.1}
                    max={0.4}
                    step={0.05}
                    onValueChange={([v]) => updateConfig("validationSplit", v)}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm text-foreground">Early Stopping</Label>
                    <p className="text-xs text-muted-foreground">Stop when validation loss plateaus</p>
                  </div>
                  <Switch
                    checked={config.earlyStopping}
                    onCheckedChange={(v) => updateConfig("earlyStopping", v)}
                  />
                </div>

                {config.earlyStopping && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Patience (epochs): {config.patience}</Label>
                    <Slider
                      value={[config.patience]}
                      min={3}
                      max={50}
                      step={1}
                      onValueChange={([v]) => updateConfig("patience", v)}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">Configuration Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-secondary/50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-mono text-foreground">{models.find(m => m.id === selectedModel)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Optimizer:</span>
                    <span className="font-mono text-foreground">{OPTIMIZERS.find(o => o.id === config.optimizer)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Learning Rate:</span>
                    <span className="font-mono text-foreground">{config.learningRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Batch Size:</span>
                    <span className="font-mono text-foreground">{config.batchSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Epochs:</span>
                    <span className="font-mono text-foreground">{config.epochs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Regularization:</span>
                    <span className="font-mono text-foreground">{REGULARIZATION.find(r => r.id === config.regularization)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Early Stopping:</span>
                    <span className="font-mono text-foreground">{config.earlyStopping ? `Yes (${config.patience} epochs)` : "No"}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4" 
                  onClick={isOptimizing ? stopOptimization : startOptimization}
                  variant={isOptimizing ? "destructive" : "default"}
                >
                  {isOptimizing ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Stop Training
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Training
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Training Results Tab */}
        <TabsContent value="results" className="space-y-4 mt-4">
          {tuningResults.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 border-border bg-card">
                  <p className="text-xs text-muted-foreground">Current Epoch</p>
                  <p className="text-2xl font-bold text-foreground">
                    {tuningResults[tuningResults.length - 1]?.epoch || 0}
                  </p>
                </Card>
                <Card className="p-4 border-border bg-card">
                  <p className="text-xs text-muted-foreground">Train Loss</p>
                  <p className="text-2xl font-bold text-foreground">
                    {tuningResults[tuningResults.length - 1]?.trainLoss.toFixed(4) || "-"}
                  </p>
                </Card>
                <Card className="p-4 border-border bg-card">
                  <p className="text-xs text-muted-foreground">Val Loss</p>
                  <p className="text-2xl font-bold text-warning">
                    {tuningResults[tuningResults.length - 1]?.valLoss.toFixed(4) || "-"}
                  </p>
                </Card>
                <Card className="p-4 border-border bg-card">
                  <p className="text-xs text-muted-foreground">Val Accuracy</p>
                  <p className="text-2xl font-bold text-success">
                    {tuningResults[tuningResults.length - 1]?.valAccuracy.toFixed(2) || "-"}%
                  </p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4 border-border bg-card">
                  <h3 className="font-semibold text-foreground mb-4">Loss Curve</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tuningResults}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="epoch" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                        <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                        <Line type="monotone" dataKey="trainLoss" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Train Loss" />
                        <Line type="monotone" dataKey="valLoss" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} name="Val Loss" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-4 border-border bg-card">
                  <h3 className="font-semibold text-foreground mb-4">Accuracy Curve</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tuningResults}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="epoch" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                        <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                        <Line type="monotone" dataKey="trainAccuracy" stroke="hsl(var(--success))" strokeWidth={2} dot={false} name="Train Acc" />
                        <Line type="monotone" dataKey="valAccuracy" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} name="Val Acc" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <Card className="p-8 border-border bg-card text-center">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Training Results</h3>
              <p className="text-muted-foreground mb-4">Start optimization to see training metrics and curves</p>
              <Button onClick={startOptimization}>
                <Play className="w-4 h-4 mr-2" />
                Start Training
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AI;
