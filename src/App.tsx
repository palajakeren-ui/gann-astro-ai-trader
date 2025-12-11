import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import Charts from "./pages/Charts";
import Scanner from "./pages/Scanner";
import Forecasting from "./pages/Forecasting";
import Gann from "./pages/Gann";
import Astro from "./pages/Astro";
import Ehlers from "./pages/Ehlers";
import AI from "./pages/AI";
import Options from "./pages/Options";
import Risk from "./pages/Risk";
import Backtest from "./pages/Backtest";
import Settings from "./pages/Settings";
import GannTools from "./pages/GannTools";
import SlippageSpike from "./pages/SlippageSpike";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen bg-background">
          <Navigation />
          <main className="flex-1 ml-64 p-8">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/charts" element={<Charts />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/forecasting" element={<Forecasting />} />
              <Route path="/gann" element={<Gann />} />
              <Route path="/astro" element={<Astro />} />
              <Route path="/ehlers" element={<Ehlers />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/options" element={<Options />} />
              <Route path="/risk" element={<Risk />} />
              <Route path="/backtest" element={<Backtest />} />
              <Route path="/gann-tools" element={<GannTools />} />
              <Route path="/slippage-spike" element={<SlippageSpike />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
