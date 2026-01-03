import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, Search, RefreshCw, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { DetectedPattern, generateAutoPatterns, getConfidenceColor } from "@/lib/patternUtils";

interface PatternDetectionPanelProps {
  currentPrice: number;
  instrument: string;
  timeframe: string;
  patterns: DetectedPattern[];
  onPatternsDetected: (patterns: DetectedPattern[]) => void;
  onDeletePattern: (id: string) => void;
}

export const PatternDetectionPanel = ({
  currentPrice,
  instrument,
  timeframe,
  patterns,
  onPatternsDetected,
  onDeletePattern,
}: PatternDetectionPanelProps) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastDetection, setLastDetection] = useState<Date | null>(null);

  const runAutoDetection = () => {
    setIsDetecting(true);
    setTimeout(() => {
      const detected = generateAutoPatterns(currentPrice, instrument, timeframe);
      onPatternsDetected(detected);
      setLastDetection(new Date());
      setIsDetecting(false);
    }, 1500);
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
    <Card className="p-4 border-border bg-card border-l-4 border-l-accent">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Zap className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Auto Pattern Detection</h3>
            <p className="text-sm text-muted-foreground">
              {lastDetection
                ? `Last scan: ${lastDetection.toLocaleTimeString()}`
                : "Click to run automatic pattern detection"}
            </p>
          </div>
        </div>
        <Button
          onClick={runAutoDetection}
          disabled={isDetecting}
          className="bg-accent hover:bg-accent/90"
        >
          {isDetecting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Detecting...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Run Auto Detection
            </>
          )}
        </Button>
      </div>

      {/* Patterns Table */}
      {patterns.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pattern Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Time Window</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead>Timeframe</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patterns.map((pattern) => (
                <TableRow key={pattern.id} className="bg-accent/5">
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
                  <TableCell>
                    <Badge variant="secondary">{pattern.timeframe}</Badge>
                  </TableCell>
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

      {patterns.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No patterns detected yet. Click "Run Auto Detection" to scan for patterns.</p>
        </div>
      )}
    </Card>
  );
};
