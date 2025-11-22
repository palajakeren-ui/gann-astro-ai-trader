import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MAMAFAMAChartProps {
  data: Array<{
    time: string;
    price: number;
    mama: number;
    fama: number;
  }>;
  crossovers: Array<{
    index: number;
    type: 'bullish' | 'bearish';
    mama: number;
    fama: number;
  }>;
}

const MAMAFAMAChart = ({ data, crossovers }: MAMAFAMAChartProps) => {
  const latestCrossover = crossovers.length > 0 ? crossovers[crossovers.length - 1] : null;

  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">MAMA/FAMA Chart</h3>
        </div>
        {latestCrossover && (
          <Badge
            variant={latestCrossover.type === 'bullish' ? 'default' : 'destructive'}
            className="flex items-center gap-1"
          >
            {latestCrossover.type === 'bullish' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {latestCrossover.type === 'bullish' ? 'Bullish Cross' : 'Bearish Cross'}
          </Badge>
        )}
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: '14px'
              }}
            />
            
            {/* Crossover markers */}
            {crossovers.map((crossover, idx) => (
              <ReferenceLine
                key={idx}
                x={data[crossover.index]?.time}
                stroke={crossover.type === 'bullish' ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                strokeDasharray="3 3"
                opacity={0.6}
              />
            ))}

            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              dot={false}
              name="Price"
            />
            <Line
              type="monotone"
              dataKey="mama"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={false}
              name="MAMA"
            />
            <Line
              type="monotone"
              dataKey="fama"
              stroke="hsl(var(--accent))"
              strokeWidth={2.5}
              dot={false}
              name="FAMA"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Current Price</p>
          <p className="text-lg font-bold text-foreground font-mono">
            {data[data.length - 1]?.price.toFixed(2)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
          <p className="text-xs text-muted-foreground mb-1">MAMA</p>
          <p className="text-lg font-bold text-primary font-mono">
            {data[data.length - 1]?.mama.toFixed(2)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
          <p className="text-xs text-muted-foreground mb-1">FAMA</p>
          <p className="text-lg font-bold text-accent font-mono">
            {data[data.length - 1]?.fama.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-muted/50">
        <p className="text-xs text-muted-foreground">
          <strong>Signal:</strong> {data[data.length - 1]?.mama > data[data.length - 1]?.fama 
            ? 'MAMA above FAMA - Bullish trend' 
            : 'MAMA below FAMA - Bearish trend'}
        </p>
      </div>
    </Card>
  );
};

export default MAMAFAMAChart;
