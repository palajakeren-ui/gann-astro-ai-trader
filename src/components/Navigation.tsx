import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  Sparkles,
  Target,
  Brain,
  Telescope,
  Activity,
  Search,
  Shield,
  Calendar,
  BarChart3,
  Zap,
  FileText,
  BookOpen,
  Server,
  Waves,
  Layers,
  Newspaper,
  Users,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Layers, label: "Trading Mode", path: "/trading-mode" },
  { icon: TrendingUp, label: "Charts", path: "/charts" },
  { icon: BarChart3, label: "Bookmap", path: "/bookmap" },
  { icon: Newspaper, label: "Open Terminal", path: "/news-analysis" },
  { icon: Users, label: "Multi-Manager", path: "/multi-manager" },
  { icon: Search, label: "Scanner", path: "/scanner" },
  { icon: Calendar, label: "Forecasting", path: "/forecasting" },
  { icon: Sparkles, label: "Gann Analysis", path: "/gann" },
  { icon: Telescope, label: "Astro Cycles", path: "/astro" },
  { icon: Activity, label: "Ehlers DSP", path: "/ehlers" },
  { icon: Waves, label: "Pattern Recognition", path: "/pattern-recognition" },
  { icon: Zap, label: "HFT Trading", path: "/hft" },
  { icon: Brain, label: "AI Models", path: "/ai" },
  { icon: Target, label: "Options", path: "/options" },
  { icon: Shield, label: "Risk Manager", path: "/risk" },
  { icon: BarChart3, label: "Backtest", path: "/backtest" },
  { icon: Target, label: "Gann Tools", path: "/gann-tools" },
  { icon: Zap, label: "Slippage & Spike", path: "/slippage-spike" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: BookOpen, label: "Trading Journal", path: "/journal" },
  { icon: Server, label: "Backend API", path: "/backend-api" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Navigation = () => {
  return (
    <nav className="border-r border-border bg-card h-screen w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Gann Quant AI</h1>
            <p className="text-xs text-muted-foreground">v3.0</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            activeClassName="bg-primary/10 text-primary hover:bg-primary/20"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">System Online</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Last sync: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </nav>
  );
};
