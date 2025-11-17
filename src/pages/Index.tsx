import { DashboardHeader } from "@/components/DashboardHeader";
import { MarketScanner } from "@/components/MarketScanner";
import { StrategyPerformance } from "@/components/StrategyPerformance";
import { RiskMonitor } from "@/components/RiskMonitor";
import { ActivePositions } from "@/components/ActivePositions";

const Index = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Real-time trading system overview</p>
      </div>

      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketScanner />
        </div>
        <div>
          <RiskMonitor />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrategyPerformance />
        <ActivePositions />
      </div>
    </div>
  );
};

export default Index;
