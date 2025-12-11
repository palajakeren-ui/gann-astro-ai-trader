import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Play, Download, Upload, FileText, X, File, Calendar, DollarSign, Clock, TrendingUp } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
}

// Complete timeframes from 1 minute to 1 month
const TIMEFRAMES = [
  { value: "M1", label: "1 Minute" },
  { value: "M2", label: "2 Minutes" },
  { value: "M3", label: "3 Minutes" },
  { value: "M5", label: "5 Minutes" },
  { value: "M10", label: "10 Minutes" },
  { value: "M15", label: "15 Minutes" },
  { value: "M30", label: "30 Minutes" },
  { value: "M45", label: "45 Minutes" },
  { value: "H1", label: "1 Hour" },
  { value: "H2", label: "2 Hours" },
  { value: "H3", label: "3 Hours" },
  { value: "H4", label: "4 Hours" },
  { value: "H6", label: "6 Hours" },
  { value: "H8", label: "8 Hours" },
  { value: "H12", label: "12 Hours" },
  { value: "D1", label: "1 Day" },
  { value: "W1", label: "1 Week" },
  { value: "MN1", label: "1 Month" },
];

const Backtest = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [backtestConfig, setBacktestConfig] = useState({
    startDate: "2023-01-01",
    endDate: "2024-12-31",
    initialCapital: "100000",
    strategy: "Ensemble Multi",
    timeframe: "H4"
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const results = [
    { metric: "Total Return", value: "+45.2%", good: true },
    { metric: "Sharpe Ratio", value: "2.4", good: true },
    { metric: "Max Drawdown", value: "-8.5%", good: true },
    { metric: "Win Rate", value: "67.8%", good: true },
    { metric: "Profit Factor", value: "2.8", good: true },
    { metric: "Total Trades", value: "234", good: false },
  ];

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const allowedTypes = [
      "text/csv",
      "application/json",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf"
    ];
    
    const newFiles: UploadedFile[] = [];
    
    Array.from(files).forEach(file => {
      if (allowedTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.json') || file.name.endsWith('.txt')) {
        newFiles.push({
          name: file.name,
          size: file.size,
          type: file.type || getFileExtension(file.name),
          lastModified: new Date(file.lastModified)
        });
      } else {
        toast.error(`${file.name}: Unsupported file type`);
      }
    });

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) uploaded successfully`);
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || "FILE";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success("File removed");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const runBacktest = () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one data file");
      return;
    }
    toast.success("Backtest started with uploaded data...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-accent" />
            Backtest Results
          </h1>
          <p className="text-muted-foreground">Strategy performance analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={runBacktest}>
            <Play className="w-4 h-4 mr-2" />
            Run New Test
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Document Upload Section */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Upload Backtest Data
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload historical price data files for backtesting (CSV, JSON, Excel, PDF)
        </p>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-secondary/30"
          }`}
        >
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-foreground font-medium mb-2">
            Drag & drop files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: CSV, JSON, TXT, Excel (.xlsx, .xls), PDF
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".csv,.json,.txt,.xlsx,.xls,.pdf"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <Label className="text-foreground">Uploaded Files ({uploadedFiles.length})</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {getFileExtension(file.name)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Backtest Configuration */}
      <Card className="p-6 border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Test Configuration</h2>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            {uploadedFiles.length > 0 ? "Ready" : "Awaiting Data"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Start Date
            </Label>
            <Input
              type="date"
              value={backtestConfig.startDate}
              onChange={(e) => setBacktestConfig(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" /> End Date
            </Label>
            <Input
              type="date"
              value={backtestConfig.endDate}
              onChange={(e) => setBacktestConfig(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Initial Capital
            </Label>
            <Input
              type="number"
              value={backtestConfig.initialCapital}
              onChange={(e) => setBacktestConfig(prev => ({ ...prev, initialCapital: e.target.value }))}
              placeholder="100000"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Strategy
            </Label>
            <select
              value={backtestConfig.strategy}
              onChange={(e) => setBacktestConfig(prev => ({ ...prev, strategy: e.target.value }))}
              className="w-full px-4 py-2 bg-card border border-border rounded-md text-foreground"
            >
              <option>Ensemble Multi</option>
              <option>Gann Geometry</option>
              <option>Ehlers DSP</option>
              <option>ML Models</option>
              <option>Astro Cycles</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> Timeframe
            </Label>
            <select
              value={backtestConfig.timeframe}
              onChange={(e) => setBacktestConfig(prev => ({ ...prev, timeframe: e.target.value }))}
              className="w-full px-4 py-2 bg-card border border-border rounded-md text-foreground"
            >
              {TIMEFRAMES.map((tf) => (
                <option key={tf.value} value={tf.value}>{tf.value} - {tf.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {results.map((result, idx) => (
          <Card key={idx} className="p-4 border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">{result.metric}</p>
            <p
              className={`text-xl font-bold ${
                result.good
                  ? result.value.includes("-")
                    ? "text-warning"
                    : "text-success"
                  : "text-foreground"
              }`}
            >
              {result.value}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Equity Curve</h2>
        <div className="bg-secondary/30 rounded-lg h-[400px] flex items-center justify-center border border-border">
          <div className="text-center space-y-4">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-semibold text-foreground">Performance Chart</p>
              <p className="text-sm text-muted-foreground">
                Equity growth and drawdown visualization
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Monthly Returns</h2>
          <div className="space-y-2">
            {[
              { month: "Jan 2024", return: "+3.2%" },
              { month: "Feb 2024", return: "+5.8%" },
              { month: "Mar 2024", return: "-1.2%" },
              { month: "Apr 2024", return: "+4.5%" },
              { month: "May 2024", return: "+6.1%" },
              { month: "Jun 2024", return: "+2.8%" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">{item.month}</span>
                <span
                  className={`text-sm font-semibold ${
                    item.return.includes("-") ? "text-destructive" : "text-success"
                  }`}
                >
                  {item.return}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Trade Statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Total Trades</span>
              <span className="text-sm font-semibold text-foreground">234</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Winning Trades</span>
              <span className="text-sm font-semibold text-success">159 (67.8%)</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Losing Trades</span>
              <span className="text-sm font-semibold text-destructive">75 (32.2%)</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Avg Win</span>
              <span className="text-sm font-semibold text-success">+$425</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Avg Loss</span>
              <span className="text-sm font-semibold text-destructive">-$180</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Largest Win</span>
              <span className="text-sm font-semibold text-success">+$1,250</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Backtest;
