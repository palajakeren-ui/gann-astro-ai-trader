import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save, Edit2, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { ManualAnalysis, TIMEFRAMES, SignalType } from "@/lib/patternUtils";

interface ManualAnalysisPanelProps {
  instrument: string;
  currentPrice: number;
  analyses: ManualAnalysis[];
  onAddAnalysis: (analysis: ManualAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
}

export const ManualAnalysisPanel = ({
  instrument,
  currentPrice,
  analyses,
  onAddAnalysis,
  onDeleteAnalysis,
}: ManualAnalysisPanelProps) => {
  const [newAnalysis, setNewAnalysis] = useState({
    timeframe: "H1",
    notes: "",
    patterns: "",
    bias: "Neutral" as SignalType,
    support: "",
    resistance: "",
  });

  const handleAddAnalysis = () => {
    if (!newAnalysis.notes) return;

    const analysis: ManualAnalysis = {
      id: Date.now().toString(),
      timeframe: newAnalysis.timeframe,
      instrument,
      notes: newAnalysis.notes,
      patterns: newAnalysis.patterns.split(",").map((p) => p.trim()).filter(Boolean),
      bias: newAnalysis.bias,
      keyLevels: {
        support: parseFloat(newAnalysis.support) || currentPrice * 0.95,
        resistance: parseFloat(newAnalysis.resistance) || currentPrice * 1.05,
      },
      createdAt: new Date(),
    };

    onAddAnalysis(analysis);
    setNewAnalysis({
      timeframe: "H1",
      notes: "",
      patterns: "",
      bias: "Neutral",
      support: "",
      resistance: "",
    });
  };

  return (
    <Card className="p-4 border-border bg-card">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Manual Timeframe Analysis
      </h3>

      {/* Add New Analysis Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-secondary/30 rounded-lg">
        <div>
          <Label className="text-sm">Timeframe</Label>
          <Select
            value={newAnalysis.timeframe}
            onValueChange={(v) => setNewAnalysis({ ...newAnalysis, timeframe: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAMES.map((tf) => (
                <SelectItem key={tf.value} value={tf.value}>
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm">Bias</Label>
          <Select
            value={newAnalysis.bias}
            onValueChange={(v: SignalType) => setNewAnalysis({ ...newAnalysis, bias: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bullish">Bullish</SelectItem>
              <SelectItem value="Bearish">Bearish</SelectItem>
              <SelectItem value="Neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm">Support Level</Label>
          <Input
            type="number"
            placeholder={`e.g. ${(currentPrice * 0.95).toFixed(0)}`}
            value={newAnalysis.support}
            onChange={(e) => setNewAnalysis({ ...newAnalysis, support: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-sm">Resistance Level</Label>
          <Input
            type="number"
            placeholder={`e.g. ${(currentPrice * 1.05).toFixed(0)}`}
            value={newAnalysis.resistance}
            onChange={(e) => setNewAnalysis({ ...newAnalysis, resistance: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <Label className="text-sm">Patterns Identified (comma separated)</Label>
          <Input
            placeholder="e.g. Double Bottom, Rising Wedge, MACD Divergence"
            value={newAnalysis.patterns}
            onChange={(e) => setNewAnalysis({ ...newAnalysis, patterns: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <Label className="text-sm">Analysis Notes</Label>
          <Textarea
            placeholder="Your analysis notes..."
            value={newAnalysis.notes}
            onChange={(e) => setNewAnalysis({ ...newAnalysis, notes: e.target.value })}
            className="min-h-[60px]"
          />
        </div>
      </div>
      <Button onClick={handleAddAnalysis} className="mb-4">
        <Save className="w-4 h-4 mr-2" />
        Save Analysis
      </Button>

      {/* Manual Analyses List */}
      {analyses.length > 0 && (
        <div className="space-y-3">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="p-4 bg-secondary/30 rounded-lg border border-border"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {analysis.timeframe}
                  </Badge>
                  <Badge
                    className={
                      analysis.bias === "Bullish"
                        ? "bg-success text-success-foreground"
                        : analysis.bias === "Bearish"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {analysis.bias === "Bullish" && <TrendingUp className="w-3 h-3 mr-1" />}
                    {analysis.bias === "Bearish" && <TrendingDown className="w-3 h-3 mr-1" />}
                    {analysis.bias}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{analysis.instrument}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {analysis.createdAt.toLocaleString()}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteAnalysis(analysis.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Support: </span>
                  <span className="font-mono text-destructive">
                    ${analysis.keyLevels.support.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Resistance: </span>
                  <span className="font-mono text-success">
                    ${analysis.keyLevels.resistance.toLocaleString()}
                  </span>
                </div>
              </div>
              {analysis.patterns.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {analysis.patterns.map((p, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {p}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-foreground">{analysis.notes}</p>
            </div>
          ))}
        </div>
      )}

      {analyses.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No manual analyses yet. Add your first analysis above.</p>
        </div>
      )}
    </Card>
  );
};
