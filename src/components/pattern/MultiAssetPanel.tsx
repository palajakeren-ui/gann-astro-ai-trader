import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Target, Plus, RefreshCw, Eye, Trash2 } from "lucide-react";
import { AssetAnalysis, TIMEFRAMES } from "@/lib/patternUtils";

interface MultiAssetPanelProps {
  assets: AssetAnalysis[];
  onAddAsset: (asset: AssetAnalysis) => void;
  onUpdateAsset: (id: string) => void;
  onDeleteAsset: (id: string) => void;
}

export const MultiAssetPanel = ({
  assets,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
}: MultiAssetPanelProps) => {
  const [newSymbol, setNewSymbol] = useState("");
  const [newTimeframes, setNewTimeframes] = useState<string[]>(["H1"]);

  const handleAddAsset = () => {
    if (!newSymbol) return;

    const asset: AssetAnalysis = {
      id: Date.now().toString(),
      symbol: newSymbol.toUpperCase(),
      name: newSymbol.toUpperCase(),
      timeframes: newTimeframes,
      lastUpdated: new Date(),
      patternCount: 0,
    };

    onAddAsset(asset);
    setNewSymbol("");
    setNewTimeframes(["H1"]);
  };

  const toggleTimeframe = (tf: string) => {
    if (newTimeframes.includes(tf)) {
      setNewTimeframes(newTimeframes.filter((t) => t !== tf));
    } else {
      setNewTimeframes([...newTimeframes, tf]);
    }
  };

  return (
    <Card className="p-4 border-border bg-card">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        Multi-Asset & Multi-Timeframe Analysis
      </h3>

      {/* Add New Asset */}
      <div className="grid grid-cols-1 gap-4 mb-4 p-4 bg-secondary/30 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-muted-foreground">Add Asset Symbol</Label>
            <Input
              placeholder="e.g. ETHUSDT, XAUUSD, EURUSD"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddAsset} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </div>
        
        <div>
          <Label className="text-sm text-muted-foreground mb-2 block">Select Timeframes</Label>
          <div className="flex flex-wrap gap-2">
            {TIMEFRAMES.map((tf) => (
              <Button
                key={tf.value}
                variant={newTimeframes.includes(tf.value) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTimeframe(tf.value)}
              >
                {tf.value}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Assets Table */}
      {assets.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Timeframes</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Patterns</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-semibold">{asset.symbol}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {asset.timeframes.map((tf) => (
                        <Badge key={tf} variant="outline" className="text-xs">
                          {tf}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {asset.lastUpdated.toLocaleString()}
                  </TableCell>
                  <TableCell>{asset.patternCount} patterns</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateAsset(asset.id)}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteAsset(asset.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {assets.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No assets tracked. Add your first asset above.</p>
        </div>
      )}
    </Card>
  );
};
