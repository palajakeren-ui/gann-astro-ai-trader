import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { calculateGannAngles } from "@/lib/gannCalculations";

interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
  showGannAngles?: boolean;
}

export const CandlestickChart = ({ data, showGannAngles = true }: CandlestickChartProps) => {
  const latestPrice = data[data.length - 1]?.close || 0;
  const gannAngles = calculateGannAngles(latestPrice, 1);
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Price Chart with Gann Angles
      </h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }}
          />
          
          {/* Price line */}
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={false}
          />
          
          {/* Gann Angles */}
          {showGannAngles && (
            <>
              <ReferenceLine 
                y={gannAngles["2x1"]} 
                stroke="hsl(var(--chart-2))" 
                strokeDasharray="3 3"
                label={{ value: '2x1', position: 'right', fill: 'hsl(var(--chart-2))' }}
              />
              <ReferenceLine 
                y={gannAngles["1x1"]} 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                label={{ value: '1x1', position: 'right', fill: 'hsl(var(--primary))' }}
              />
              <ReferenceLine 
                y={gannAngles["1x2"]} 
                stroke="hsl(var(--chart-3))" 
                strokeDasharray="3 3"
                label={{ value: '1x2', position: 'right', fill: 'hsl(var(--chart-3))' }}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">High: </span>
          <span className="font-medium text-foreground">{Math.max(...data.map(d => d.high)).toFixed(2)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Low: </span>
          <span className="font-medium text-foreground">{Math.min(...data.map(d => d.low)).toFixed(2)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Current: </span>
          <span className="font-medium text-foreground">{latestPrice.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};
