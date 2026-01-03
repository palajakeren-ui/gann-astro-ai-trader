import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { DetectedPattern, PatternType, SignalType, PATTERN_TYPES, getConfidenceColor } from "@/lib/patternUtils";

interface AddPatternFormProps {
  instrument: string;
  timeframe: string;
  patterns: DetectedPattern[];
  onAddPattern: (pattern: DetectedPattern) => void;
  onDeletePattern: (id: string) => void;
}

export const AddPatternForm = ({
  instrument,
  timeframe,
  patterns,
  onAddPattern,
  onDeletePattern,
}: AddPatternFormProps) => {
  const [newPattern, setNewPattern] = useState({
    name: "",
    type: "Candlestick" as PatternType,
    confidence: 0.75,
    priceRange: "",
    timeWindow: "",
    signal: "Bullish" as SignalType,
  });

  const handleAddPattern = () => {
    if (!newPattern.name || !newPattern.priceRange || !newPattern.timeWindow) return;

    const pattern: DetectedPattern = {
      id: Date.now().toString(),
      ...newPattern,
      instrument,
      timeframe,
      detectedAt: new Date(),
    };

    onAddPattern(pattern);
    setNewPattern({
      name: "",
      type: "Candlestick",
      confidence: 0.75,
      priceRange: "",
      timeWindow: "",
      signal: "Bullish",
    });
  };

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case "Bullish":
        return (
          <Badge className="bg-success text-success-foreground">
            <TrendingUp className="w-3 h-3 mr-1" />
            Bullish
          </Badge>
        );
      case "Bearish":
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            <TrendingDown className="w-3 h-3 mr-1" />
            Bearish
          </Badge>
        );
      default:
        return <Badge variant="outline">Neutral</Badge>;
    }
  };

  return (
    <Card className="p-4 border-border bg-card">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-accent" />
        Detected Patterns (Name | Type | Confidence | Price Range | Time Window)
      </h3>

      {/* Patterns Table */}
      {patterns.length > 0 && (
        <div className="overflow-x-auto mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pattern Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Time Window</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patterns.map((pattern) => (
                <TableRow key={pattern.id}>
                  <TableCell className="font-semibold">{pattern.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{pattern.type}</Badge>
                  </TableCell>
                  <TableCell className={`font-mono ${getConfidenceColor(pattern.confidence)}`}>
                    {(pattern.confidence * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-sm">{pattern.priceRange}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{pattern.timeWindow}</TableCell>
                  <TableCell>{getSignalBadge(pattern.signal)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeletePattern(pattern.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add New Pattern Form */}
      <div className="p-4 bg-secondary/30 rounded-lg border border-border">
        <h4 className="font-semibold text-foreground mb-3">Add New Pattern</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <Label className="text-xs">Pattern Name</Label>
            <Input
              placeholder="e.g. Bullish Engulfing"
              value={newPattern.name}
              onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">Type</Label>
            <Select
              value={newPattern.type}
              onValueChange={(v: PatternType) => setNewPattern({ ...newPattern, type: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PATTERN_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Confidence</Label>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={newPattern.confidence}
              onChange={(e) => setNewPattern({ ...newPattern, confidence: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <Label className="text-xs">Price Range</Label>
            <Input
              placeholder="e.g. Target: 102,200"
              value={newPattern.priceRange}
              onChange={(e) => setNewPattern({ ...newPattern, priceRange: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">Time Window</Label>
            <Input
              placeholder="e.g. next 7-14 days"
              value={newPattern.timeWindow}
              onChange={(e) => setNewPattern({ ...newPattern, timeWindow: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">Signal</Label>
            <Select
              value={newPattern.signal}
              onValueChange={(v: SignalType) => setNewPattern({ ...newPattern, signal: v })}
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
        </div>
        <Button className="mt-3" onClick={handleAddPattern}>
          <Plus className="w-4 h-4 mr-2" />
          Add Pattern
        </Button>
      </div>
    </Card>
  );
};
