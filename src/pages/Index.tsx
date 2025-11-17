import { DashboardHeader } from "@/components/DashboardHeader";
import { MarketScanner } from "@/components/MarketScanner";
import { StrategyPerformance } from "@/components/StrategyPerformance";
import { RiskMonitor } from "@/components/RiskMonitor";
import { ActivePositions } from "@/components/ActivePositions";
import { Activity } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Gann Quant AI</h1>
                <p className="text-xs text-muted-foreground">Algorithmic Trading System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-muted-foreground">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur mt-12">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>© 2025 Gann Quant AI • Professional Trading System</p>
            <p>Last update: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
