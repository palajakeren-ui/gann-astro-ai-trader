import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Settings, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  Eye,
  EyeOff,
  Layers,
  Activity,
  BarChart3,
  Waves
} from "lucide-react";

interface BookmapControlsProps {
  isLive: boolean;
  isConnected: boolean;
  onToggleLive: () => void;
  showCandlestick: boolean;
  showHeatmap: boolean;
  showFootprint: boolean;
  showTimeSales: boolean;
  showVolumeProfile: boolean;
  showLiquidity: boolean;
  showVolumeDots: boolean;
  onToggleCandlestick: (value: boolean) => void;
  onToggleHeatmap: (value: boolean) => void;
  onToggleFootprint: (value: boolean) => void;
  onToggleTimeSales: (value: boolean) => void;
  onToggleVolumeProfile: (value: boolean) => void;
  onToggleLiquidity: (value: boolean) => void;
  onToggleVolumeDots: (value: boolean) => void;
  selectedInstrument: string;
  onInstrumentChange: (value: string) => void;
  updateSpeed: number;
  onUpdateSpeedChange: (value: number) => void;
}

const INSTRUMENTS = [
  { value: 'BTCUSDT', label: 'BTC/USDT' },
  { value: 'ETHUSDT', label: 'ETH/USDT' },
  { value: 'ES', label: 'ES (S&P 500)' },
  { value: 'NQ', label: 'NQ (Nasdaq)' },
  { value: 'CL', label: 'CL (Crude Oil)' },
  { value: 'GC', label: 'GC (Gold)' },
  { value: 'EURUSD', label: 'EUR/USD' },
  { value: 'GBPUSD', label: 'GBP/USD' },
];

export const BookmapControls = ({
  isLive,
  isConnected,
  onToggleLive,
  showCandlestick,
  showHeatmap,
  showFootprint,
  showTimeSales,
  showVolumeProfile,
  showLiquidity,
  showVolumeDots,
  onToggleCandlestick,
  onToggleHeatmap,
  onToggleFootprint,
  onToggleTimeSales,
  onToggleVolumeProfile,
  onToggleLiquidity,
  onToggleVolumeDots,
  selectedInstrument,
  onInstrumentChange,
  updateSpeed,
  onUpdateSpeedChange,
}: BookmapControlsProps) => {
  return (
    <Card className="p-4 border-border bg-card">
      <div className="flex flex-wrap items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <Badge 
            variant={isConnected ? "default" : "outline"} 
            className={isConnected ? "bg-success" : ""}
          >
            {isConnected ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggleLive}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? "Pause" : "Resume"}
          </Button>
        </div>

        {/* Instrument Selector */}
        <div className="flex items-center gap-2">
          <Label className="text-sm">Instrument:</Label>
          <select 
            value={selectedInstrument}
            onChange={(e) => onInstrumentChange(e.target.value)}
            className="px-3 py-1.5 bg-input border border-border rounded-md text-sm text-foreground"
          >
            {INSTRUMENTS.map(inst => (
              <option key={inst.value} value={inst.value}>{inst.label}</option>
            ))}
          </select>
        </div>

        {/* Update Speed */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <Label className="text-sm whitespace-nowrap">Speed:</Label>
          <Slider
            value={[updateSpeed]}
            onValueChange={(v) => onUpdateSpeedChange(v[0])}
            min={100}
            max={2000}
            step={100}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-12">{updateSpeed}ms</span>
        </div>

        {/* View Toggles */}
        <div className="flex flex-wrap items-center gap-3 ml-auto">
          <div className="flex items-center gap-1.5">
            <Switch 
              id="candlestick" 
              checked={showCandlestick} 
              onCheckedChange={onToggleCandlestick}
              className="scale-75"
            />
            <Label htmlFor="candlestick" className="text-xs cursor-pointer flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Candles
            </Label>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Switch 
              id="heatmap" 
              checked={showHeatmap} 
              onCheckedChange={onToggleHeatmap}
              className="scale-75"
            />
            <Label htmlFor="heatmap" className="text-xs cursor-pointer flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Heatmap
            </Label>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Switch 
              id="footprint" 
              checked={showFootprint} 
              onCheckedChange={onToggleFootprint}
              className="scale-75"
            />
            <Label htmlFor="footprint" className="text-xs cursor-pointer flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Footprint
            </Label>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Switch 
              id="timesales" 
              checked={showTimeSales} 
              onCheckedChange={onToggleTimeSales}
              className="scale-75"
            />
            <Label htmlFor="timesales" className="text-xs cursor-pointer flex items-center gap-1">
              <Activity className="w-3 h-3" />
              T&S
            </Label>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Switch 
              id="volumeprofile" 
              checked={showVolumeProfile} 
              onCheckedChange={onToggleVolumeProfile}
              className="scale-75"
            />
            <Label htmlFor="volumeprofile" className="text-xs cursor-pointer flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              VP
            </Label>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Switch 
              id="liquidity" 
              checked={showLiquidity} 
              onCheckedChange={onToggleLiquidity}
              className="scale-75"
            />
            <Label htmlFor="liquidity" className="text-xs cursor-pointer flex items-center gap-1">
              <Waves className="w-3 h-3" />
              Liquidity
            </Label>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Switch 
              id="volumedots" 
              checked={showVolumeDots} 
              onCheckedChange={onToggleVolumeDots}
              className="scale-75"
            />
            <Label htmlFor="volumedots" className="text-xs cursor-pointer flex items-center gap-1">
              {showVolumeDots ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              Dots
            </Label>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookmapControls;
