import { GannSquareChart } from "@/components/charts/GannSquareChart";
import { GannWheelChart } from "@/components/charts/GannWheelChart";
import { CandlestickChart } from "@/components/charts/CandlestickChart";
import { GannCalculator } from "@/components/calculators/GannCalculator";

// Mock data for candlestick chart
const mockCandleData = Array.from({ length: 30 }, (_, i) => {
  const base = 100 + Math.sin(i / 5) * 10;
  return {
    date: new Date(2024, 0, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    open: base + Math.random() * 2,
    high: base + Math.random() * 5,
    low: base - Math.random() * 3,
    close: base + Math.random() * 2,
  };
});

const GannTools = () => {
  const currentPrice = 105.75;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gann Analysis Tools</h1>
        <p className="text-muted-foreground">Advanced Gann calculation engines and visualization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CandlestickChart data={mockCandleData} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GannSquareChart centerValue={currentPrice} />
            <GannWheelChart currentPrice={currentPrice} />
          </div>
        </div>

        <div>
          <GannCalculator />
        </div>
      </div>
    </div>
  );
};

export default GannTools;
