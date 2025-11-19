import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";
import {
  calculateSquareOf9,
  calculateGannAngles,
  calculateSupportResistance,
  calculateFibonacciLevels,
} from "@/lib/gannCalculations";

export const GannCalculator = () => {
  const [price, setPrice] = useState<string>("100");
  const [high, setHigh] = useState<string>("105");
  const [low, setLow] = useState<string>("95");
  const [results, setResults] = useState<any>(null);

  const handleCalculate = () => {
    const priceNum = parseFloat(price);
    const highNum = parseFloat(high);
    const lowNum = parseFloat(low);

    if (isNaN(priceNum) || isNaN(highNum) || isNaN(lowNum)) return;

    const gannAngles = calculateGannAngles(priceNum);
    const supportResistance = calculateSupportResistance(highNum, lowNum, priceNum);
    const fibonacci = calculateFibonacciLevels(highNum, lowNum);
    const squareOf9 = calculateSquareOf9(priceNum);

    setResults({
      gannAngles,
      supportResistance,
      fibonacci,
      squareOf9: squareOf9[0]?.values.slice(0, 4),
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Gann Calculator
        </h3>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="price">Current Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="high">Period High</Label>
            <Input
              id="high"
              type="number"
              step="0.01"
              value={high}
              onChange={(e) => setHigh(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="low">Period Low</Label>
            <Input
              id="low"
              type="number"
              step="0.01"
              value={low}
              onChange={(e) => setLow(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full">
          Calculate Levels
        </Button>
      </div>

      {results && (
        <div className="space-y-6">
          {/* Gann Angles */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Gann Angles</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(results.gannAngles).map(([angle, value]: [string, any]) => (
                <div key={angle} className="flex justify-between items-center p-2 bg-secondary rounded-lg">
                  <span className="text-xs text-muted-foreground">{angle}</span>
                  <Badge variant="outline">{value.toFixed(2)}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Support & Resistance */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Support & Resistance</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-destructive/10 rounded-lg">
                <span className="text-xs text-muted-foreground">R3</span>
                <Badge className="bg-destructive">{results.supportResistance.resistance3.toFixed(2)}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-destructive/10 rounded-lg">
                <span className="text-xs text-muted-foreground">R2</span>
                <Badge className="bg-destructive">{results.supportResistance.resistance2.toFixed(2)}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-destructive/10 rounded-lg">
                <span className="text-xs text-muted-foreground">R1</span>
                <Badge className="bg-destructive">{results.supportResistance.resistance1.toFixed(2)}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-primary/10 rounded-lg">
                <span className="text-xs font-medium text-foreground">Pivot</span>
                <Badge className="bg-primary">{results.supportResistance.pivot.toFixed(2)}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-success/10 rounded-lg">
                <span className="text-xs text-muted-foreground">S1</span>
                <Badge className="bg-success">{results.supportResistance.support1.toFixed(2)}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-success/10 rounded-lg">
                <span className="text-xs text-muted-foreground">S2</span>
                <Badge className="bg-success">{results.supportResistance.support2.toFixed(2)}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-success/10 rounded-lg">
                <span className="text-xs text-muted-foreground">S3</span>
                <Badge className="bg-success">{results.supportResistance.support3.toFixed(2)}</Badge>
              </div>
            </div>
          </div>

          {/* Fibonacci Levels */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Fibonacci Retracement</h4>
            <div className="space-y-2">
              {Object.entries(results.fibonacci).map(([level, value]: [string, any]) => (
                <div key={level} className="flex justify-between items-center p-2 bg-secondary rounded-lg">
                  <span className="text-xs text-muted-foreground">{level.replace('level_', '').replace('_', '.')}</span>
                  <Badge variant="outline">{value.toFixed(2)}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
