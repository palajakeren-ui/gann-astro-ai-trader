import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Server,
  Radio,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface DataFeedConnection {
  id: string;
  name: string;
  type: 'mt4' | 'mt5' | 'exchange' | 'fix';
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  latency?: number;
  lastUpdate?: Date;
  symbol?: string;
  price?: number;
  bid?: number;
  ask?: number;
}

interface ActivePosition {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  lots: number;
  openPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  connection: string;
}

const MOCK_CONNECTIONS: DataFeedConnection[] = [
  { id: 'mt5-1', name: 'MetaTrader 5 - IC Markets', type: 'mt5', status: 'connected', latency: 45, lastUpdate: new Date(), symbol: 'BTCUSD', price: 43250.50, bid: 43249.00, ask: 43252.00 },
  { id: 'mt4-1', name: 'MetaTrader 4 - Pepperstone', type: 'mt4', status: 'disconnected', symbol: 'EURUSD' },
  { id: 'binance-futures', name: 'Binance Futures', type: 'exchange', status: 'connected', latency: 12, lastUpdate: new Date(), symbol: 'BTCUSDT', price: 43248.00, bid: 43247.50, ask: 43248.50 },
  { id: 'binance-spot', name: 'Binance Spot', type: 'exchange', status: 'connected', latency: 15, lastUpdate: new Date(), symbol: 'ETHUSDT', price: 2285.50, bid: 2285.00, ask: 2286.00 },
  { id: 'fix-cme', name: 'FIX Protocol - CME', type: 'fix', status: 'connecting', symbol: 'ES' },
  { id: 'fix-eurex', name: 'FIX Protocol - Eurex', type: 'fix', status: 'error', symbol: 'FDAX' },
];

const MOCK_POSITIONS: ActivePosition[] = [
  { id: '1', symbol: 'BTCUSD', type: 'buy', lots: 0.5, openPrice: 42800.00, currentPrice: 43250.50, pnl: 225.25, pnlPercent: 1.05, connection: 'mt5-1' },
  { id: '2', symbol: 'ETHUSDT', type: 'sell', lots: 2.0, openPrice: 2320.00, currentPrice: 2285.50, pnl: 69.00, pnlPercent: 1.49, connection: 'binance-spot' },
];

const ActiveTradingPanel = () => {
  const [connections, setConnections] = useState<DataFeedConnection[]>(MOCK_CONNECTIONS);
  const [positions, setPositions] = useState<ActivePosition[]>(MOCK_POSITIONS);
  const [selectedInstrument, setSelectedInstrument] = useState("BTCUSD");
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [orderLots, setOrderLots] = useState("0.1");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [selectedConnection, setSelectedConnection] = useState("mt5-1");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'disconnected': return <XCircle className="w-4 h-4 text-muted-foreground" />;
      case 'connecting': return <Loader2 className="w-4 h-4 text-warning animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return <WifiOff className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return <Badge className="bg-success/20 text-success border-success/30">Connected</Badge>;
      case 'disconnected': return <Badge variant="outline" className="text-muted-foreground">Disconnected</Badge>;
      case 'connecting': return <Badge className="bg-warning/20 text-warning border-warning/30">Connecting...</Badge>;
      case 'error': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Error</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mt4':
      case 'mt5': return <Server className="w-4 h-4" />;
      case 'exchange': return <Activity className="w-4 h-4" />;
      case 'fix': return <Radio className="w-4 h-4" />;
      default: return <Wifi className="w-4 h-4" />;
    }
  };

  const handleConnect = (id: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id 
        ? { ...conn, status: 'connecting' as const }
        : conn
    ));
    
    setTimeout(() => {
      setConnections(prev => prev.map(conn => 
        conn.id === id 
          ? { ...conn, status: 'connected' as const, latency: Math.floor(Math.random() * 50) + 10, lastUpdate: new Date() }
          : conn
      ));
      toast.success(`Connected to ${connections.find(c => c.id === id)?.name}`);
    }, 1500);
  };

  const handleDisconnect = (id: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id 
        ? { ...conn, status: 'disconnected' as const, latency: undefined, lastUpdate: undefined }
        : conn
    ));
    toast.info(`Disconnected from ${connections.find(c => c.id === id)?.name}`);
  };

  const handleBuy = () => {
    const lots = parseFloat(orderLots);
    if (isNaN(lots) || lots <= 0) {
      toast.error("Invalid lot size");
      return;
    }
    
    const connection = connections.find(c => c.id === selectedConnection);
    const price = connection?.price || 43250.50;
    
    const newPosition: ActivePosition = {
      id: `pos-${Date.now()}`,
      symbol: selectedInstrument,
      type: 'buy',
      lots,
      openPrice: price,
      currentPrice: price,
      pnl: 0,
      pnlPercent: 0,
      connection: selectedConnection
    };
    
    setPositions(prev => [...prev, newPosition]);
    toast.success(`BUY ${lots} ${selectedInstrument} @ ${price.toLocaleString()}`);
  };

  const handleSell = () => {
    const lots = parseFloat(orderLots);
    if (isNaN(lots) || lots <= 0) {
      toast.error("Invalid lot size");
      return;
    }
    
    const connection = connections.find(c => c.id === selectedConnection);
    const price = connection?.price || 43250.50;
    
    const newPosition: ActivePosition = {
      id: `pos-${Date.now()}`,
      symbol: selectedInstrument,
      type: 'sell',
      lots,
      openPrice: price,
      currentPrice: price,
      pnl: 0,
      pnlPercent: 0,
      connection: selectedConnection
    };
    
    setPositions(prev => [...prev, newPosition]);
    toast.success(`SELL ${lots} ${selectedInstrument} @ ${price.toLocaleString()}`);
  };

  const closePosition = (id: string) => {
    const position = positions.find(p => p.id === id);
    if (position) {
      toast.success(`Closed ${position.type.toUpperCase()} ${position.symbol} with P&L: $${position.pnl.toFixed(2)}`);
      setPositions(prev => prev.filter(p => p.id !== id));
    }
  };

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);
  const connectedCount = connections.filter(c => c.status === 'connected').length;

  return (
    <Card className="p-4 md:p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Active Trading
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            {connectedCount}/{connections.length} Connected
          </Badge>
          <Badge className={totalPnL >= 0 ? "bg-success" : "bg-destructive"}>
            P&L: ${totalPnL.toFixed(2)}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="trade" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="trade" className="text-xs">Trade</TabsTrigger>
          <TabsTrigger value="positions" className="text-xs">Positions ({positions.length})</TabsTrigger>
          <TabsTrigger value="connections" className="text-xs">Data Feeds</TabsTrigger>
        </TabsList>

        <TabsContent value="trade" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Order Entry */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Instrument</Label>
                  <select 
                    value={selectedInstrument}
                    onChange={(e) => setSelectedInstrument(e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground"
                  >
                    <option value="BTCUSD">BTCUSD</option>
                    <option value="ETHUSD">ETHUSD</option>
                    <option value="EURUSD">EURUSD</option>
                    <option value="GBPUSD">GBPUSD</option>
                    <option value="XAUUSD">XAUUSD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Connection</Label>
                  <select 
                    value={selectedConnection}
                    onChange={(e) => setSelectedConnection(e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground"
                  >
                    {connections.filter(c => c.status === 'connected').map(conn => (
                      <option key={conn.id} value={conn.id}>{conn.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Order Type</Label>
                  <select 
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as 'market' | 'limit')}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground"
                  >
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Lots</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={orderLots}
                    onChange={(e) => setOrderLots(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              {orderType === 'limit' && (
                <div className="space-y-2">
                  <Label className="text-xs">Limit Price</Label>
                  <Input 
                    type="number" 
                    placeholder="Enter price..."
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="text-sm"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Stop Loss</Label>
                  <Input 
                    type="number" 
                    placeholder="Optional"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Take Profit</Label>
                  <Input 
                    type="number" 
                    placeholder="Optional"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleBuy}
                  className="bg-success hover:bg-success/90 text-white font-bold py-3"
                >
                  <ArrowUpCircle className="w-5 h-5 mr-2" />
                  BUY
                </Button>
                <Button 
                  onClick={handleSell}
                  className="bg-destructive hover:bg-destructive/90 text-white font-bold py-3"
                >
                  <ArrowDownCircle className="w-5 h-5 mr-2" />
                  SELL
                </Button>
              </div>
            </div>

            {/* Market Data */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Live Market Data</h4>
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {connections.filter(c => c.status === 'connected').map(conn => (
                  <div key={conn.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(conn.type)}
                        <span className="text-sm font-medium text-foreground">{conn.symbol}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {conn.latency}ms
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Bid</span>
                        <p className="font-mono text-destructive">{conn.bid?.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <span className="text-muted-foreground">Price</span>
                        <p className="font-mono font-bold text-foreground">{conn.price?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground">Ask</span>
                        <p className="font-mono text-success">{conn.ask?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-3">
          {positions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No active positions</p>
            </div>
          ) : (
            <div className="space-y-2">
              {positions.map(position => (
                <div key={position.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {position.type === 'buy' ? (
                        <TrendingUp className="w-5 h-5 text-success" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-destructive" />
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{position.symbol}</p>
                        <p className="text-xs text-muted-foreground">
                          {position.type.toUpperCase()} {position.lots} @ {position.openPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`font-mono font-bold ${position.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => closePosition(position.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="connections" className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {connections.map(conn => (
              <div key={conn.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(conn.type)}
                    <span className="text-sm font-medium text-foreground">{conn.name}</span>
                  </div>
                  {getStatusIcon(conn.status)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(conn.status)}
                    {conn.latency && (
                      <span className="text-xs text-muted-foreground">{conn.latency}ms</span>
                    )}
                  </div>
                  {conn.status === 'connected' ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect(conn.id)}
                      className="text-xs"
                    >
                      <WifiOff className="w-3 h-3 mr-1" />
                      Disconnect
                    </Button>
                  ) : conn.status === 'connecting' ? (
                    <Button variant="outline" size="sm" disabled className="text-xs">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Connecting
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConnect(conn.id)}
                      className="text-xs"
                    >
                      <Wifi className="w-3 h-3 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
                {conn.lastUpdate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last update: {conn.lastUpdate.toLocaleTimeString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ActiveTradingPanel;
