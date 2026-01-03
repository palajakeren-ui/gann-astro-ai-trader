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

// Auto Tuning Search Methods
const SEARCH_METHODS = [
  { id: "grid", name: "Grid Search", description: "Exhaustive search over parameter grid" },
  { id: "random", name: "Random Search", description: "Random sampling from parameter space" },
  { id: "bayesian", name: "Bayesian Optimization", description: "Sequential model-based optimization" },
  { id: "hyperband", name: "Hyperband", description: "Adaptive resource allocation" },
];

interface AutoTuneConfig {
  searchMethod: string;
  maxTrials: number;
  parallelTrials: number;
  earlyStopping: boolean;
  minImprovement: number;
  // Grid Search params
  learningRateRange: [number, number];
  learningRateSteps: number;
  batchSizes: number[];
  // Bayesian params
  acquisitionFunction: string;
  explorationRatio: number;
  nInitialPoints: number;
  // Hyperparameters to tune
  tuneLearningRate: boolean;
  tuneBatchSize: boolean;
  tuneDropout: boolean;
  tuneL2: boolean;
  tuneOptimizer: boolean;
}

interface SearchResult {
  trial: number;
  params: Record<string, number | string>;
  valAccuracy: number;
  valLoss: number;
  trainTime: number;
  status: "completed" | "running" | "pending";
}

const AI = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedModel, setSelectedModel] = useState("lstm");
  const [tuningResults, setTuningResults] = useState<TuningResult[]>([]);
  const [isAutoTuning, setIsAutoTuning] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [bestResult, setBestResult] = useState<SearchResult | null>(null);
  
  const [autoTuneConfig, setAutoTuneConfig] = useState<AutoTuneConfig>({
    searchMethod: "bayesian",
    maxTrials: 20,
    parallelTrials: 2,
    earlyStopping: true,
    minImprovement: 0.001,
    learningRateRange: [0.0001, 0.1],
    learningRateSteps: 5,
    batchSizes: [16, 32, 64, 128],
    acquisitionFunction: "ei",
    explorationRatio: 0.15,
    nInitialPoints: 5,
    tuneLearningRate: true,
    tuneBatchSize: true,
    tuneDropout: true,
    tuneL2: false,
    tuneOptimizer: false,
  });
  
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
    { id: "neural_ode", name: "Neural ODE", accuracy: 80.1, predictions: 720, status: "Active" },
    { id: "gradient_boost", name: "Gradient Boosting", accuracy: 77.4, predictions: 1380, status: "Active" },
    { id: "lightgbm", name: "LightGBM", accuracy: 79.2, predictions: 1520, status: "Active" },
    { id: "hybrid_meta", name: "Hybrid Meta-Model", accuracy: 84.7, predictions: 650, status: "Active" },
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

  const updateAutoTuneConfig = <K extends keyof AutoTuneConfig>(key: K, value: AutoTuneConfig[K]) => {
    setAutoTuneConfig(prev => ({ ...prev, [key]: value }));
  };

  const startAutoTuning = () => {
    setIsAutoTuning(true);
    setSearchResults([]);
    setBestResult(null);
    toast.info(`Starting ${SEARCH_METHODS.find(m => m.id === autoTuneConfig.searchMethod)?.name}...`);
    
    let trial = 0;
    const interval = setInterval(() => {
      trial++;
      const lr = Math.pow(10, -1 - Math.random() * 3);
      const batchSize = autoTuneConfig.batchSizes[Math.floor(Math.random() * autoTuneConfig.batchSizes.length)];
      const dropout = 0.1 + Math.random() * 0.4;
      
      const baseAcc = 70 + Math.random() * 15;
      const lrBonus = lr > 0.001 && lr < 0.01 ? 5 : 0;
      const batchBonus = batchSize === 32 || batchSize === 64 ? 3 : 0;
      const valAccuracy = Math.min(95, baseAcc + lrBonus + batchBonus + (Math.random() - 0.5) * 5);
      const valLoss = 0.5 - (valAccuracy - 70) / 50 + Math.random() * 0.1;
      
      const newResult: SearchResult = {
        trial,
        params: {
          learning_rate: Number(lr.toFixed(6)),
          batch_size: batchSize,
          dropout: Number(dropout.toFixed(3)),
          optimizer: OPTIMIZERS[Math.floor(Math.random() * OPTIMIZERS.length)].id,
        },
        valAccuracy: Number(valAccuracy.toFixed(2)),
        valLoss: Number(Math.max(0.01, valLoss).toFixed(4)),
        trainTime: Number((5 + Math.random() * 20).toFixed(1)),
        status: "completed",
      };
      
      setSearchResults(prev => {
        const updated = [...prev, newResult];
        const best = updated.reduce((a, b) => a.valAccuracy > b.valAccuracy ? a : b);
        setBestResult(best);
        return updated;
      });
      
      if (trial >= autoTuneConfig.maxTrials) {
        clearInterval(interval);
        setIsAutoTuning(false);
        toast.success("Auto-tuning completed!");
      }
    }, 800);
  };

  const stopAutoTuning = () => {
    setIsAutoTuning(false);
    toast.info("Auto-tuning stopped");
  };

  const applyBestConfig = () => {
    if (bestResult) {
      setConfig(prev => ({
        ...prev,
        learningRate: bestResult.params.learning_rate as number,
        batchSize: bestResult.params.batch_size as number,
        dropoutRate: bestResult.params.dropout as number,
        optimizer: bestResult.params.optimizer as string,
      }));
      toast.success("Best configuration applied!");
    }
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
        <TabsList className="grid w-full grid-cols-5 md:w-auto md:inline-grid">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="optimizer">
            <Settings2 className="w-3 h-3 mr-1" />
            Optimizer
          </TabsTrigger>
          <TabsTrigger value="tuning">Hyperparameter Tuning</TabsTrigger>
          <TabsTrigger value="autotune">
            <Target className="w-3 h-3 mr-1" />
            Auto Tuning
          </TabsTrigger>
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

        {/* Auto Tuning Tab */}
        <TabsContent value="autotune" className="space-y-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Automated Hyperparameter Search
            </h2>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={isAutoTuning ? stopAutoTuning : startAutoTuning}
                variant={isAutoTuning ? "destructive" : "default"}
              >
                {isAutoTuning ? (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Stop Search
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Start Auto-Tuning
                  </>
                )}
              </Button>
              {bestResult && (
                <Button size="sm" variant="outline" onClick={applyBestConfig}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Apply Best Config
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search Method Configuration */}
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                Search Method
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Search Algorithm</Label>
                  <Select value={autoTuneConfig.searchMethod} onValueChange={(v) => updateAutoTuneConfig("searchMethod", v)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEARCH_METHODS.map(method => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex flex-col">
                            <span>{method.name}</span>
                            <span className="text-xs text-muted-foreground">{method.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Max Trials</Label>
                    <Input
                      type="number"
                      min={5}
                      max={100}
                      value={autoTuneConfig.maxTrials}
                      onChange={(e) => updateAutoTuneConfig("maxTrials", Number(e.target.value))}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Parallel Trials</Label>
                    <Input
                      type="number"
                      min={1}
                      max={8}
                      value={autoTuneConfig.parallelTrials}
                      onChange={(e) => updateAutoTuneConfig("parallelTrials", Number(e.target.value))}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                {autoTuneConfig.searchMethod === "bayesian" && (
                  <>
                    <div>
                      <Label className="text-xs text-muted-foreground">Acquisition Function</Label>
                      <Select value={autoTuneConfig.acquisitionFunction} onValueChange={(v) => updateAutoTuneConfig("acquisitionFunction", v)}>
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ei">Expected Improvement (EI)</SelectItem>
                          <SelectItem value="pi">Probability of Improvement (PI)</SelectItem>
                          <SelectItem value="ucb">Upper Confidence Bound (UCB)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Exploration Ratio: {autoTuneConfig.explorationRatio}</Label>
                      <Slider
                        value={[autoTuneConfig.explorationRatio]}
                        min={0.05}
                        max={0.5}
                        step={0.05}
                        onValueChange={([v]) => updateAutoTuneConfig("explorationRatio", v)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Initial Random Points</Label>
                      <Input
                        type="number"
                        min={3}
                        max={20}
                        value={autoTuneConfig.nInitialPoints}
                        onChange={(e) => updateAutoTuneConfig("nInitialPoints", Number(e.target.value))}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </>
                )}

                {autoTuneConfig.searchMethod === "grid" && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Learning Rate Steps</Label>
                    <Input
                      type="number"
                      min={2}
                      max={10}
                      value={autoTuneConfig.learningRateSteps}
                      onChange={(e) => updateAutoTuneConfig("learningRateSteps", Number(e.target.value))}
                      className="bg-secondary border-border"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Parameters to Tune */}
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-warning" />
                Parameters to Tune
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-foreground">Learning Rate</Label>
                  <Switch
                    checked={autoTuneConfig.tuneLearningRate}
                    onCheckedChange={(v) => updateAutoTuneConfig("tuneLearningRate", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-foreground">Batch Size</Label>
                  <Switch
                    checked={autoTuneConfig.tuneBatchSize}
                    onCheckedChange={(v) => updateAutoTuneConfig("tuneBatchSize", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-foreground">Dropout Rate</Label>
                  <Switch
                    checked={autoTuneConfig.tuneDropout}
                    onCheckedChange={(v) => updateAutoTuneConfig("tuneDropout", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-foreground">L2 Regularization</Label>
                  <Switch
                    checked={autoTuneConfig.tuneL2}
                    onCheckedChange={(v) => updateAutoTuneConfig("tuneL2", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-foreground">Optimizer Type</Label>
                  <Switch
                    checked={autoTuneConfig.tuneOptimizer}
                    onCheckedChange={(v) => updateAutoTuneConfig("tuneOptimizer", v)}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <Label className="text-sm text-foreground">Early Stopping</Label>
                    <p className="text-xs text-muted-foreground">Stop trials early if no improvement</p>
                  </div>
                  <Switch
                    checked={autoTuneConfig.earlyStopping}
                    onCheckedChange={(v) => updateAutoTuneConfig("earlyStopping", v)}
                  />
                </div>
              </div>
            </Card>

            {/* Best Configuration Found */}
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Best Configuration
              </h3>
              {bestResult ? (
                <div className="space-y-3">
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-success">Trial #{bestResult.trial}</span>
                      <Badge className="bg-success">{bestResult.valAccuracy}% Acc</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Val Loss: {bestResult.valLoss}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    {Object.entries(bestResult.params).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-mono text-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-2" size="sm" onClick={applyBestConfig}>
                    Apply to Training Config
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No results yet</p>
                  <p className="text-xs">Start auto-tuning to find optimal parameters</p>
                </div>
              )}
            </Card>
          </div>

          {/* Search Results Table */}
          {searchResults.length > 0 && (
            <Card className="p-4 border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Search Results ({searchResults.length}/{autoTuneConfig.maxTrials} trials)
                </h3>
                {isAutoTuning && (
                  <Badge variant="outline" className="animate-pulse border-warning text-warning">
                    Searching...
                  </Badge>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Trial</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Learning Rate</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Batch Size</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Dropout</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Optimizer</th>
                      <th className="text-right py-2 px-2 text-muted-foreground font-medium">Val Acc</th>
                      <th className="text-right py-2 px-2 text-muted-foreground font-medium">Val Loss</th>
                      <th className="text-right py-2 px-2 text-muted-foreground font-medium">Time (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.slice().reverse().slice(0, 10).map((result) => (
                      <tr 
                        key={result.trial} 
                        className={`border-b border-border/50 ${bestResult?.trial === result.trial ? "bg-success/10" : ""}`}
                      >
                        <td className="py-2 px-2 font-mono">
                          #{result.trial}
                          {bestResult?.trial === result.trial && <span className="ml-1 text-success">★</span>}
                        </td>
                        <td className="py-2 px-2 font-mono">{result.params.learning_rate}</td>
                        <td className="py-2 px-2 font-mono">{result.params.batch_size}</td>
                        <td className="py-2 px-2 font-mono">{result.params.dropout}</td>
                        <td className="py-2 px-2 font-mono text-xs">{result.params.optimizer}</td>
                        <td className="py-2 px-2 text-right font-mono text-success">{result.valAccuracy}%</td>
                        <td className="py-2 px-2 text-right font-mono">{result.valLoss}</td>
                        <td className="py-2 px-2 text-right font-mono text-muted-foreground">{result.trainTime}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {searchResults.length > 10 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Showing latest 10 of {searchResults.length} trials
                </p>
              )}
            </Card>
          )}

          {/* Convergence Chart */}
          {searchResults.length > 2 && (
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">Search Convergence</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={searchResults.map((r, idx) => ({
                    trial: r.trial,
                    valAccuracy: r.valAccuracy,
                    bestSoFar: Math.max(...searchResults.slice(0, idx + 1).map(x => x.valAccuracy)),
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="trial" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    <Line type="monotone" dataKey="valAccuracy" stroke="hsl(var(--muted-foreground))" strokeWidth={1} dot={{ r: 3 }} name="Trial Accuracy" />
                    <Line type="stepAfter" dataKey="bestSoFar" stroke="hsl(var(--success))" strokeWidth={2} dot={false} name="Best So Far" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
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
