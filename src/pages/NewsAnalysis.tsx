import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Terminal, TrendingUp, TrendingDown, Clock, Search, Bell, 
  AlertTriangle, Zap, Globe, BarChart3, MessageSquare, RefreshCw, 
  Wifi, Flame, Activity, DollarSign, ArrowUpRight, ArrowDownRight,
  Monitor, Database, Rss, Eye, ChevronRight, Hash
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: Date;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  category: string;
  symbols: string[];
  isBreaking?: boolean;
  isFlash?: boolean;
}

interface MarketTicker {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  volume: string;
  high: number;
  low: number;
}

interface EconomicEvent {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  time: Date;
  impact: 'high' | 'medium' | 'low';
  previous: string;
  forecast: string;
  actual?: string;
}

interface SectorHeat {
  name: string;
  change: number;
  volume: string;
}

interface CommandEntry {
  input: string;
  output: string;
  timestamp: Date;
}

// ─── Mock Data ──────────────────────────────────────────
const TICKERS: MarketTicker[] = [
  { symbol: "ES", price: 5234.50, change: 12.75, changePct: 0.24, volume: "1.2M", high: 5242.00, low: 5218.25 },
  { symbol: "NQ", price: 18456.25, change: -34.50, changePct: -0.19, volume: "856K", high: 18520.00, low: 18390.75 },
  { symbol: "YM", price: 39120.00, change: 85.00, changePct: 0.22, volume: "432K", high: 39200.00, low: 39020.00 },
  { symbol: "CL", price: 78.45, change: 1.23, changePct: 1.59, volume: "654K", high: 79.10, low: 77.15 },
  { symbol: "GC", price: 2045.30, change: -8.40, changePct: -0.41, volume: "234K", high: 2058.00, low: 2040.00 },
  { symbol: "BTC", price: 43250.00, change: 856.00, changePct: 2.02, volume: "32B", high: 43800.00, low: 42100.00 },
  { symbol: "ETH", price: 2285.40, change: 45.30, changePct: 2.02, volume: "18B", high: 2310.00, low: 2230.00 },
  { symbol: "EUR/USD", price: 1.0845, change: 0.0023, changePct: 0.21, volume: "5.2T", high: 1.0870, low: 1.0810 },
  { symbol: "DXY", price: 104.23, change: -0.15, changePct: -0.14, volume: "—", high: 104.50, low: 104.05 },
  { symbol: "VIX", price: 14.85, change: -0.42, changePct: -2.75, volume: "—", high: 15.40, low: 14.60 },
  { symbol: "10Y", price: 4.285, change: 0.032, changePct: 0.75, volume: "—", high: 4.310, low: 4.245 },
  { symbol: "SPY", price: 523.18, change: 1.45, changePct: 0.28, volume: "78M", high: 524.50, low: 521.20 },
];

const NEWS_WIRE: NewsItem[] = [
  { id:'1', title:"FED HOLDS RATES STEADY AT 5.25-5.50%, SIGNALS CUTS AHEAD", summary:"Federal Reserve unanimously votes to maintain current rate, Powell cites declining PCE inflation. Dot plot suggests 3 cuts in 2024.", source:"FOMC", timestamp: new Date(Date.now()-3*60000), sentiment:'bullish', impact:'high', category:'Central Banks', symbols:['SPY','TLT','DXY','GC'], isBreaking:true, isFlash:true },
  { id:'2', title:"BITCOIN SPOT ETF RECORDS $1.5B SINGLE-DAY NET INFLOW", summary:"BlackRock's IBIT leads with $820M. Total AUM across all BTC ETFs surpasses $45B milestone.", source:"Bloomberg ETF", timestamp: new Date(Date.now()-18*60000), sentiment:'bullish', impact:'high', category:'Crypto', symbols:['BTC','IBIT','GBTC'], isFlash:true },
  { id:'3', title:"NVIDIA BEATS Q4 ESTIMATES BY 22%, RAISES FY25 GUIDANCE", summary:"Data center revenue up 409% YoY to $18.4B. Management raises full-year outlook citing unprecedented AI infrastructure demand.", source:"Company Filing", timestamp: new Date(Date.now()-45*60000), sentiment:'bullish', impact:'high', category:'Earnings', symbols:['NVDA','AMD','SMCI','AVGO'] },
  { id:'4', title:"CHINA CAIXIN PMI CONTRACTS AT 49.1 VS 50.3 EXPECTED", summary:"Manufacturing activity shrinks unexpectedly, property sector woes deepen. PBOC likely to ease further.", source:"Caixin/S&P", timestamp: new Date(Date.now()-90*60000), sentiment:'bearish', impact:'high', category:'Macro', symbols:['FXI','KWEB','BABA','CL'] },
  { id:'5', title:"OPEC+ EXTENDS 2.2M BPD VOLUNTARY CUTS THROUGH Q2", summary:"Saudi Arabia leads coalition in maintaining supply restraint. Brent crude rises above $80.", source:"OPEC", timestamp: new Date(Date.now()-150*60000), sentiment:'bullish', impact:'medium', category:'Commodities', symbols:['CL','XOM','CVX','USO'] },
  { id:'6', title:"JAPAN CORE CPI RISES 2.8% YOY, BOJ EXIT LOOMS", summary:"Tokyo CPI data reinforces expectations for BOJ rate normalization in April. Yen strengthens.", source:"Statistics Japan", timestamp: new Date(Date.now()-200*60000), sentiment:'neutral', impact:'medium', category:'Macro', symbols:['USD/JPY','EWJ','NKD'] },
  { id:'7', title:"US INITIAL JOBLESS CLAIMS FALL TO 194K, LABOR MARKET TIGHT", summary:"Claims below consensus of 215K. Continuing claims also decline, suggesting strong employment.", source:"DOL", timestamp: new Date(Date.now()-280*60000), sentiment:'neutral', impact:'medium', category:'Employment', symbols:['SPY','TLT','DXY'] },
  { id:'8', title:"EUROPEAN GAS STORAGE AT 62%, BELOW 5-YEAR AVERAGE", summary:"Drawdowns accelerate on cold snap. TTF futures rally 8% on supply concerns.", source:"GIE", timestamp: new Date(Date.now()-350*60000), sentiment:'bearish', impact:'medium', category:'Energy', symbols:['NG','EWG','VGK'] },
];

const EVENTS: EconomicEvent[] = [
  { id:'1', name:"FOMC Rate Decision", country:"US", countryFlag:"🇺🇸", time: new Date(Date.now()+2*3600000), impact:'high', previous:"5.50%", forecast:"5.50%" },
  { id:'2', name:"Non-Farm Payrolls", country:"US", countryFlag:"🇺🇸", time: new Date(Date.now()+26*3600000), impact:'high', previous:"216K", forecast:"185K" },
  { id:'3', name:"Core PCE Price Index", country:"US", countryFlag:"🇺🇸", time: new Date(Date.now()+50*3600000), impact:'high', previous:"2.9%", forecast:"2.8%" },
  { id:'4', name:"ECB Rate Decision", country:"EU", countryFlag:"🇪🇺", time: new Date(Date.now()+74*3600000), impact:'high', previous:"4.50%", forecast:"4.50%" },
  { id:'5', name:"BOJ Monetary Policy", country:"JP", countryFlag:"🇯🇵", time: new Date(Date.now()+100*3600000), impact:'high', previous:"-0.10%", forecast:"-0.10%" },
  { id:'6', name:"UK GDP MoM", country:"GB", countryFlag:"🇬🇧", time: new Date(Date.now()+120*3600000), impact:'medium', previous:"-0.3%", forecast:"0.2%" },
  { id:'7', name:"China Trade Balance", country:"CN", countryFlag:"🇨🇳", time: new Date(Date.now()+140*3600000), impact:'medium', previous:"$75.3B", forecast:"$72.0B" },
];

const SECTORS: SectorHeat[] = [
  { name:"Technology", change:1.24, volume:"$42B" },
  { name:"Healthcare", change:-0.38, volume:"$18B" },
  { name:"Financials", change:0.67, volume:"$24B" },
  { name:"Energy", change:2.15, volume:"$15B" },
  { name:"Consumer Disc", change:0.12, volume:"$12B" },
  { name:"Industrials", change:0.89, volume:"$14B" },
  { name:"Materials", change:-0.55, volume:"$8B" },
  { name:"Utilities", change:-0.18, volume:"$6B" },
  { name:"Real Estate", change:-1.02, volume:"$5B" },
  { name:"Comm Services", change:0.45, volume:"$16B" },
  { name:"Staples", change:0.08, volume:"$9B" },
];

// ─── Component ──────────────────────────────────────────
const NewsAnalysis = () => {
  const [tickers, setTickers] = useState<MarketTicker[]>(TICKERS);
  const [news] = useState<NewsItem[]>(NEWS_WIRE);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLive, setIsLive] = useState(true);
  const [clock, setClock] = useState(new Date());
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>(["ES","NQ","BTC","GC","CL","EUR/USD"]);
  const [alertCount, setAlertCount] = useState(3);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate ticker updates
  useEffect(() => {
    if (!isLive) return;
    const t = setInterval(() => {
      setTickers(prev => prev.map(tk => {
        const delta = (Math.random() - 0.5) * tk.price * 0.001;
        const newPrice = +(tk.price + delta).toFixed(tk.price > 100 ? 2 : 4);
        const newChange = +(tk.change + delta).toFixed(tk.price > 100 ? 2 : 4);
        const newPct = +((newChange / (newPrice - newChange)) * 100).toFixed(2);
        return { ...tk, price: newPrice, change: newChange, changePct: newPct };
      }));
    }, 1000);
    return () => clearInterval(t);
  }, [isLive]);

  // Command handler
  const handleCommand = (cmd: string) => {
    const c = cmd.trim().toUpperCase();
    let output = "";
    if (c === "HELP") output = "Commands: HELP, TOP, NEWS, ECO, SECTOR, WATCH, ALERT, CLEAR";
    else if (c === "TOP") output = tickers.map(t => `${t.symbol}: ${t.price} (${t.changePct > 0 ? '+' : ''}${t.changePct}%)`).join("\n");
    else if (c === "NEWS") output = news.slice(0,5).map(n => `[${n.source}] ${n.title}`).join("\n");
    else if (c === "ECO") output = EVENTS.slice(0,5).map(e => `${e.countryFlag} ${e.name}: Prev ${e.previous} → Fcst ${e.forecast}`).join("\n");
    else if (c === "SECTOR") output = SECTORS.map(s => `${s.name}: ${s.change > 0 ? '+' : ''}${s.change}%`).join("\n");
    else if (c === "WATCH") output = `Watchlist: ${watchlist.join(", ")}`;
    else if (c === "ALERT") output = `Active alerts: ${alertCount}`;
    else if (c === "CLEAR") { setCommandHistory([]); return; }
    else if (c.startsWith("ADD ")) { const sym = c.slice(4); setWatchlist(p => [...p, sym]); output = `Added ${sym} to watchlist`; }
    else output = `Unknown command: ${c}. Type HELP for list.`;
    
    setCommandHistory(prev => [...prev, { input: cmd, output, timestamp: new Date() }]);
    setCommandInput("");
  };

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [commandHistory]);

  const filteredNews = news.filter(item => {
    const matchSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.symbols.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = selectedCategory === "all" || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const categories = [...new Set(news.map(n => n.category))];

  const formatTimeAgo = (d: Date) => {
    const m = Math.floor((Date.now() - d.getTime()) / 60000);
    if (m < 60) return `${m}m ago`;
    return `${Math.floor(m / 60)}h ago`;
  };

  const formatCountdown = (d: Date) => {
    const diff = d.getTime() - Date.now();
    if (diff < 0) return "RELEASED";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="space-y-0 font-mono text-xs">
      {/* ─── Bloomberg-style Top Bar ─── */}
      <div className="bg-[hsl(220,25%,6%)] border-b-2 border-[hsl(45,100%,45%)] px-3 py-1.5 flex items-center justify-between -mx-4 md:-mx-8 -mt-4 md:-mt-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[hsl(45,100%,50%)]" />
            <span className="text-[hsl(45,100%,50%)] font-bold text-sm tracking-widest">OPEN ANALYSIS TERMINAL</span>
          </div>
          <span className="text-[hsl(120,60%,50%)]">● LIVE</span>
        </div>
        <div className="flex items-center gap-6 text-muted-foreground">
          <span className="text-[hsl(45,100%,50%)]">{clock.toLocaleTimeString()} UTC</span>
          <span>NY {new Date(clock.getTime()).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour:'2-digit', minute:'2-digit' })}</span>
          <span>LDN {new Date(clock.getTime()).toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour:'2-digit', minute:'2-digit' })}</span>
          <span>TKY {new Date(clock.getTime()).toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo', hour:'2-digit', minute:'2-digit' })}</span>
          <div className="flex items-center gap-1">
            <Bell className="w-3 h-3" />
            <span className="text-[hsl(45,100%,50%)]">{alertCount}</span>
          </div>
        </div>
      </div>

      {/* ─── Scrolling Ticker ─── */}
      <div className="bg-[hsl(220,20%,8%)] border-b border-border px-3 py-1 flex gap-6 overflow-x-auto -mx-4 md:-mx-8 scrollbar-none">
        {tickers.map(t => (
          <div key={t.symbol} className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className="text-[hsl(45,100%,50%)] font-bold">{t.symbol}</span>
            <span className="text-foreground">{t.price.toFixed(t.price > 100 ? 2 : 4)}</span>
            <span className={t.change >= 0 ? 'text-[hsl(120,60%,50%)]' : 'text-[hsl(0,80%,55%)]'}>
              {t.change >= 0 ? '▲' : '▼'} {Math.abs(t.changePct).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* ─── Main Grid ─── */}
      <div className="grid grid-cols-12 gap-0.5 pt-1 -mx-4 md:-mx-8 px-1" style={{ minHeight: 'calc(100vh - 200px)' }}>
        
        {/* LEFT: News Wire (col 1-5) */}
        <div className="col-span-12 xl:col-span-5 bg-[hsl(220,20%,8%)] border border-[hsl(220,15%,18%)] flex flex-col">
          <div className="bg-[hsl(220,25%,12%)] px-3 py-1.5 flex items-center justify-between border-b border-[hsl(220,15%,18%)]">
            <span className="text-[hsl(45,100%,50%)] font-bold tracking-wider flex items-center gap-2">
              <Rss className="w-3.5 h-3.5" /> NEWS WIRE
            </span>
            <div className="flex items-center gap-2">
              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-[hsl(220,20%,15%)] border border-[hsl(220,15%,25%)] text-foreground text-xs px-2 py-0.5 rounded"
              >
                <option value="all">ALL</option>
                {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <input 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  placeholder="Search..." 
                  className="bg-[hsl(220,20%,15%)] border border-[hsl(220,15%,25%)] text-foreground text-xs pl-7 pr-2 py-0.5 rounded w-32"
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[70vh]">
            {filteredNews.map(item => (
              <div 
                key={item.id} 
                className={`px-3 py-2 border-b border-[hsl(220,15%,15%)] hover:bg-[hsl(220,20%,12%)] cursor-pointer transition-colors ${
                  item.isFlash ? 'bg-[hsl(0,40%,12%)] border-l-2 border-l-[hsl(0,80%,55%)]' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[hsl(45,80%,45%)]">{item.timestamp.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</span>
                  {item.isFlash && <span className="text-[hsl(0,80%,55%)] font-bold animate-pulse">⚡ FLASH</span>}
                  {item.isBreaking && <span className="text-[hsl(0,80%,55%)] font-bold">🔴 BREAKING</span>}
                  <span className="text-[hsl(200,60%,50%)]">[{item.source}]</span>
                  {item.impact === 'high' && <span className="text-[hsl(0,80%,55%)]">■■■</span>}
                  {item.impact === 'medium' && <span className="text-[hsl(45,80%,50%)]">■■</span>}
                  {item.impact === 'low' && <span className="text-muted-foreground">■</span>}
                </div>
                <p className={`text-foreground leading-tight ${item.isFlash ? 'font-bold' : ''}`}>{item.title}</p>
                <p className="text-muted-foreground mt-1 leading-tight">{item.summary}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {item.symbols.map(s => (
                    <span key={s} className="text-[hsl(200,70%,55%)] cursor-pointer hover:underline">{s}</span>
                  ))}
                  <span className={`ml-auto ${item.sentiment === 'bullish' ? 'text-[hsl(120,60%,50%)]' : item.sentiment === 'bearish' ? 'text-[hsl(0,80%,55%)]' : 'text-muted-foreground'}`}>
                    {item.sentiment === 'bullish' ? '▲ BULLISH' : item.sentiment === 'bearish' ? '▼ BEARISH' : '● NEUTRAL'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: Market Data + Calendar (col 6-9) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-0.5">
          {/* Watchlist */}
          <div className="bg-[hsl(220,20%,8%)] border border-[hsl(220,15%,18%)] flex-1">
            <div className="bg-[hsl(220,25%,12%)] px-3 py-1.5 border-b border-[hsl(220,15%,18%)]">
              <span className="text-[hsl(45,100%,50%)] font-bold tracking-wider flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" /> MARKET MONITOR
              </span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-[hsl(220,15%,18%)]">
                  <th className="text-left px-3 py-1">SYMBOL</th>
                  <th className="text-right px-2 py-1">LAST</th>
                  <th className="text-right px-2 py-1">CHG</th>
                  <th className="text-right px-2 py-1">%</th>
                  <th className="text-right px-2 py-1">HIGH</th>
                  <th className="text-right px-2 py-1">LOW</th>
                  <th className="text-right px-3 py-1">VOL</th>
                </tr>
              </thead>
              <tbody>
                {tickers.filter(t => watchlist.includes(t.symbol)).map(t => (
                  <tr key={t.symbol} className="border-b border-[hsl(220,15%,12%)] hover:bg-[hsl(220,20%,12%)]">
                    <td className="px-3 py-1.5 text-[hsl(45,100%,50%)] font-bold">{t.symbol}</td>
                    <td className="text-right px-2 py-1.5 text-foreground font-bold">{t.price.toFixed(t.price > 100 ? 2 : 4)}</td>
                    <td className={`text-right px-2 py-1.5 ${t.change >= 0 ? 'text-[hsl(120,60%,50%)]' : 'text-[hsl(0,80%,55%)]'}`}>
                      {t.change >= 0 ? '+' : ''}{t.change.toFixed(t.price > 100 ? 2 : 4)}
                    </td>
                    <td className={`text-right px-2 py-1.5 font-bold ${t.changePct >= 0 ? 'text-[hsl(120,60%,50%)]' : 'text-[hsl(0,80%,55%)]'}`}>
                      {t.changePct >= 0 ? '+' : ''}{t.changePct.toFixed(2)}%
                    </td>
                    <td className="text-right px-2 py-1.5 text-muted-foreground">{t.high.toFixed(2)}</td>
                    <td className="text-right px-2 py-1.5 text-muted-foreground">{t.low.toFixed(2)}</td>
                    <td className="text-right px-3 py-1.5 text-muted-foreground">{t.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Economic Calendar */}
          <div className="bg-[hsl(220,20%,8%)] border border-[hsl(220,15%,18%)]">
            <div className="bg-[hsl(220,25%,12%)] px-3 py-1.5 border-b border-[hsl(220,15%,18%)]">
              <span className="text-[hsl(45,100%,50%)] font-bold tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> ECONOMIC CALENDAR
              </span>
            </div>
            <div className="max-h-[30vh] overflow-y-auto">
              {EVENTS.map(ev => (
                <div key={ev.id} className="flex items-center px-3 py-1.5 border-b border-[hsl(220,15%,12%)] hover:bg-[hsl(220,20%,12%)]">
                  <span className="w-6">{ev.countryFlag}</span>
                  <span className="flex-1 text-foreground">{ev.name}</span>
                  <span className="w-16 text-right text-muted-foreground">{ev.previous}</span>
                  <span className="w-16 text-right text-[hsl(200,70%,55%)]">{ev.forecast}</span>
                  <span className={`w-16 text-right font-bold ${ev.actual ? 'text-[hsl(120,60%,50%)]' : 'text-muted-foreground'}`}>
                    {ev.actual || '—'}
                  </span>
                  <span className={`w-14 text-right font-bold ${
                    formatCountdown(ev.time) === 'RELEASED' ? 'text-[hsl(120,60%,50%)]' : 'text-[hsl(45,80%,50%)]'
                  }`}>{formatCountdown(ev.time)}</span>
                  <span className="w-6 text-right">
                    {ev.impact === 'high' ? '🔴' : ev.impact === 'medium' ? '🟡' : '🟢'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Sectors + Terminal (col 10-12) */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-0.5">
          {/* Sector Heatmap */}
          <div className="bg-[hsl(220,20%,8%)] border border-[hsl(220,15%,18%)]">
            <div className="bg-[hsl(220,25%,12%)] px-3 py-1.5 border-b border-[hsl(220,15%,18%)]">
              <span className="text-[hsl(45,100%,50%)] font-bold tracking-wider flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5" /> SECTOR MAP
              </span>
            </div>
            <div className="p-2 grid grid-cols-3 gap-1">
              {SECTORS.map(s => (
                <div 
                  key={s.name} 
                  className={`p-2 rounded text-center text-[10px] font-bold ${
                    s.change > 1 ? 'bg-[hsl(120,40%,18%)] text-[hsl(120,60%,55%)]' :
                    s.change > 0 ? 'bg-[hsl(120,30%,14%)] text-[hsl(120,50%,50%)]' :
                    s.change > -0.5 ? 'bg-[hsl(0,30%,14%)] text-[hsl(0,60%,55%)]' :
                    'bg-[hsl(0,40%,16%)] text-[hsl(0,70%,55%)]'
                  }`}
                >
                  <div className="truncate">{s.name}</div>
                  <div>{s.change > 0 ? '+' : ''}{s.change}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Stats */}
          <div className="bg-[hsl(220,20%,8%)] border border-[hsl(220,15%,18%)] p-3">
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">S&P 500</span><span className="text-[hsl(120,60%,50%)]">▲ +0.24%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">NASDAQ</span><span className="text-[hsl(0,80%,55%)]">▼ -0.19%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">DOW</span><span className="text-[hsl(120,60%,50%)]">▲ +0.22%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">FTSE 100</span><span className="text-[hsl(120,60%,50%)]">▲ +0.15%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">DAX</span><span className="text-[hsl(0,80%,55%)]">▼ -0.08%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">NIKKEI</span><span className="text-[hsl(120,60%,50%)]">▲ +0.92%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Fear/Greed</span><span className="text-[hsl(45,80%,50%)]">62 Greed</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Put/Call</span><span className="text-foreground">0.85</span></div>
            </div>
          </div>

          {/* Command Terminal */}
          <div className="bg-[hsl(220,20%,8%)] border border-[hsl(220,15%,18%)] flex-1 flex flex-col">
            <div className="bg-[hsl(220,25%,12%)] px-3 py-1.5 border-b border-[hsl(220,15%,18%)]">
              <span className="text-[hsl(45,100%,50%)] font-bold tracking-wider flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" /> COMMAND
              </span>
            </div>
            <div ref={terminalRef} className="flex-1 overflow-y-auto p-2 max-h-[20vh] space-y-1">
              {commandHistory.length === 0 && (
                <p className="text-muted-foreground">Type HELP for commands</p>
              )}
              {commandHistory.map((entry, i) => (
                <div key={i}>
                  <div className="text-[hsl(120,60%,50%)]">&gt; {entry.input}</div>
                  <div className="text-foreground whitespace-pre-wrap pl-2">{entry.output}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-[hsl(220,15%,18%)] px-2 py-1 flex items-center gap-1">
              <span className="text-[hsl(120,60%,50%)]">&gt;</span>
              <input
                value={commandInput}
                onChange={e => setCommandInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && commandInput.trim()) handleCommand(commandInput); }}
                className="bg-transparent border-none outline-none text-foreground flex-1 text-xs font-mono"
                placeholder="Enter command..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsAnalysis;
