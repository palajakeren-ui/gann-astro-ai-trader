import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Filter,
  Search,
  Bell,
  AlertTriangle,
  Zap,
  Globe,
  BarChart3,
  MessageSquare,
  RefreshCw,
  Wifi,
  Star,
  Flame,
  ExternalLink
} from "lucide-react";

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
  isHot?: boolean;
}

interface EconomicEvent {
  id: string;
  name: string;
  country: string;
  time: Date;
  impact: 'high' | 'medium' | 'low';
  previous: string;
  forecast: string;
  actual?: string;
}

interface SentimentData {
  symbol: string;
  bullish: number;
  bearish: number;
  neutral: number;
  mentions: number;
  trend: 'up' | 'down' | 'flat';
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: "Federal Reserve Signals Potential Rate Cuts in Q2 2024",
    summary: "Fed Chair Jerome Powell indicated the central bank may begin cutting interest rates as early as Q2, citing declining inflation and stable employment figures.",
    source: "Bloomberg",
    timestamp: new Date(Date.now() - 15 * 60000),
    sentiment: 'bullish',
    impact: 'high',
    category: 'Central Banks',
    symbols: ['SPY', 'QQQ', 'DXY', 'TLT'],
    isBreaking: true,
  },
  {
    id: '2',
    title: "Bitcoin ETF Sees Record $1.5B Daily Inflows",
    summary: "Institutional demand for Bitcoin continues to surge as spot ETFs report unprecedented inflows, pushing BTC towards new all-time highs.",
    source: "Reuters",
    timestamp: new Date(Date.now() - 45 * 60000),
    sentiment: 'bullish',
    impact: 'high',
    category: 'Cryptocurrency',
    symbols: ['BTC', 'ETH', 'GBTC'],
    isHot: true,
  },
  {
    id: '3',
    title: "Oil Prices Surge on OPEC+ Production Cut Extension",
    summary: "Crude oil rallied 3% after OPEC+ members agreed to extend production cuts through mid-2024, tightening global supply.",
    source: "Financial Times",
    timestamp: new Date(Date.now() - 90 * 60000),
    sentiment: 'bullish',
    impact: 'high',
    category: 'Commodities',
    symbols: ['CL', 'XOM', 'CVX', 'USO'],
  },
  {
    id: '4',
    title: "Tech Earnings Season: NVIDIA Reports 265% Revenue Growth",
    summary: "NVIDIA crushed expectations with data center revenue driven by AI demand, sending shares to new highs in after-hours trading.",
    source: "CNBC",
    timestamp: new Date(Date.now() - 120 * 60000),
    sentiment: 'bullish',
    impact: 'high',
    category: 'Earnings',
    symbols: ['NVDA', 'AMD', 'MSFT', 'GOOGL'],
    isHot: true,
  },
  {
    id: '5',
    title: "China Manufacturing PMI Contracts for Fourth Month",
    summary: "Factory activity in China continued to shrink, raising concerns about global economic growth and commodity demand.",
    source: "Wall Street Journal",
    timestamp: new Date(Date.now() - 180 * 60000),
    sentiment: 'bearish',
    impact: 'medium',
    category: 'Economic Data',
    symbols: ['FXI', 'EEM', 'BABA', 'JD'],
  },
  {
    id: '6',
    title: "European Gas Prices Drop as Storage Hits 85%",
    summary: "Natural gas futures fell sharply as European storage levels exceeded seasonal norms, easing energy crisis concerns.",
    source: "Bloomberg",
    timestamp: new Date(Date.now() - 240 * 60000),
    sentiment: 'neutral',
    impact: 'medium',
    category: 'Energy',
    symbols: ['NG', 'VGK', 'EWG'],
  },
];

const MOCK_EVENTS: EconomicEvent[] = [
  { id: '1', name: "Fed Interest Rate Decision", country: "US", time: new Date(Date.now() + 2 * 3600000), impact: 'high', previous: "5.50%", forecast: "5.25%" },
  { id: '2', name: "Non-Farm Payrolls", country: "US", time: new Date(Date.now() + 24 * 3600000), impact: 'high', previous: "216K", forecast: "180K" },
  { id: '3', name: "CPI Year-over-Year", country: "US", time: new Date(Date.now() + 48 * 3600000), impact: 'high', previous: "3.1%", forecast: "2.9%" },
  { id: '4', name: "ECB Rate Decision", country: "EU", time: new Date(Date.now() + 72 * 3600000), impact: 'high', previous: "4.50%", forecast: "4.50%" },
  { id: '5', name: "GDP Growth Rate", country: "CN", time: new Date(Date.now() + 96 * 3600000), impact: 'medium', previous: "5.2%", forecast: "5.0%" },
];

const MOCK_SENTIMENT: SentimentData[] = [
  { symbol: "BTC", bullish: 72, bearish: 18, neutral: 10, mentions: 15420, trend: 'up' },
  { symbol: "ETH", bullish: 65, bearish: 22, neutral: 13, mentions: 8934, trend: 'up' },
  { symbol: "SPY", bullish: 58, bearish: 28, neutral: 14, mentions: 12450, trend: 'flat' },
  { symbol: "NVDA", bullish: 81, bearish: 12, neutral: 7, mentions: 9823, trend: 'up' },
  { symbol: "GOLD", bullish: 55, bearish: 30, neutral: 15, mentions: 5672, trend: 'down' },
  { symbol: "OIL", bullish: 62, bearish: 25, neutral: 13, mentions: 4532, trend: 'up' },
];

const NewsAnalysis = () => {
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [events, setEvents] = useState<EconomicEvent[]>(MOCK_EVENTS);
  const [sentiment, setSentiment] = useState<SentimentData[]>(MOCK_SENTIMENT);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImpact, setSelectedImpact] = useState("all");
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Update sentiment randomly
      setSentiment(prev => prev.map(s => ({
        ...s,
        bullish: Math.max(0, Math.min(100, s.bullish + (Math.random() - 0.5) * 5)),
        mentions: s.mentions + Math.floor(Math.random() * 50),
      })));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.symbols.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesImpact = selectedImpact === "all" || item.impact === selectedImpact;
    return matchesSearch && matchesCategory && matchesImpact;
  });

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'bearish': return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <BarChart3 className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">High Impact</Badge>;
      case 'medium': return <Badge className="bg-warning/20 text-warning border-warning/30">Medium</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const formatTimeUntil = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours < 1) return `${minutes}m`;
    if (hours < 24) return `${hours}h ${minutes}m`;
    return `${Math.floor(hours / 24)}d`;
  };

  const categories = [...new Set(news.map(n => n.category))];

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-primary" />
            News Analysis Terminal
          </h1>
          <p className="text-sm text-muted-foreground">Bloomberg-style market news & sentiment analysis</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={isLive ? "default" : "outline"} className={isLive ? "bg-success" : ""}>
            <Wifi className="w-3 h-3 mr-1" />
            {isLive ? "Live" : "Paused"}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? "Pause" : "Resume"}
          </Button>
          <span className="text-xs text-muted-foreground">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 border-border bg-card">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search news, symbols, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select 
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground"
          >
            <option value="all">All Impact</option>
            <option value="high">High Impact</option>
            <option value="medium">Medium Impact</option>
            <option value="low">Low Impact</option>
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Main News Feed */}
        <div className="xl:col-span-3 space-y-4">
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="news" className="text-sm">
                <Newspaper className="w-4 h-4 mr-2" />
                News Feed
              </TabsTrigger>
              <TabsTrigger value="calendar" className="text-sm">
                <Clock className="w-4 h-4 mr-2" />
                Economic Calendar
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="text-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Sentiment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="news" className="space-y-3">
              {filteredNews.map(item => (
                <Card 
                  key={item.id} 
                  className={`p-4 border-border bg-card hover:bg-secondary/30 transition-colors cursor-pointer ${
                    item.isBreaking ? 'border-l-4 border-l-destructive' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {item.isBreaking && (
                          <Badge className="bg-destructive text-white animate-pulse">
                            <Zap className="w-3 h-3 mr-1" />
                            BREAKING
                          </Badge>
                        )}
                        {item.isHot && (
                          <Badge className="bg-warning text-warning-foreground">
                            <Flame className="w-3 h-3 mr-1" />
                            HOT
                          </Badge>
                        )}
                        {getImpactBadge(item.impact)}
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                        {getSentimentIcon(item.sentiment)}
                        {item.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.symbols.map(symbol => (
                            <Badge key={symbol} variant="outline" className="text-xs font-mono">
                              {symbol}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {item.source}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(item.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="calendar" className="space-y-3">
              <div className="grid gap-3">
                {events.map(event => (
                  <Card key={event.id} className="p-4 border-border bg-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <Badge 
                            className={`mb-1 ${
                              event.impact === 'high' 
                                ? 'bg-destructive/20 text-destructive' 
                                : event.impact === 'medium'
                                ? 'bg-warning/20 text-warning'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {event.country}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{formatTimeUntil(event.time)}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{event.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.time.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Previous</p>
                          <p className="font-mono text-foreground">{event.previous}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Forecast</p>
                          <p className="font-mono text-primary">{event.forecast}</p>
                        </div>
                        {event.actual && (
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Actual</p>
                            <p className="font-mono font-bold text-success">{event.actual}</p>
                          </div>
                        )}
                        {getImpactBadge(event.impact)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sentiment.map(item => (
                  <Card key={item.symbol} className="p-4 border-border bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">{item.symbol}</span>
                        {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                        {item.trend === 'down' && <TrendingDown className="w-4 h-4 text-destructive" />}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.mentions.toLocaleString()} mentions
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16">Bullish</span>
                        <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success rounded-full transition-all"
                            style={{ width: `${item.bullish}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-success w-12 text-right">{item.bullish.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16">Bearish</span>
                        <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-destructive rounded-full transition-all"
                            style={{ width: `${item.bearish}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-destructive w-12 text-right">{item.bearish.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16">Neutral</span>
                        <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-muted-foreground rounded-full transition-all"
                            style={{ width: `${item.neutral}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground w-12 text-right">{item.neutral.toFixed(1)}%</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Breaking News Ticker */}
          <Card className="p-4 border-border bg-card border-l-4 border-l-destructive">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Breaking News
            </h3>
            <div className="space-y-2">
              {news.filter(n => n.isBreaking || n.isHot).slice(0, 3).map(item => (
                <div key={item.id} className="p-2 rounded bg-secondary/50 text-sm">
                  <p className="text-foreground font-medium line-clamp-2">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(item.timestamp)}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card className="p-4 border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Upcoming Events
            </h3>
            <div className="space-y-2">
              {events.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center justify-between p-2 rounded bg-secondary/50">
                  <div>
                    <p className="text-sm text-foreground">{event.name}</p>
                    <p className="text-xs text-muted-foreground">{event.country}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      event.impact === 'high' 
                        ? 'border-destructive text-destructive' 
                        : ''
                    }
                  >
                    {formatTimeUntil(event.time)}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Market Sentiment Summary */}
          <Card className="p-4 border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Overall Sentiment
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Market Mood</span>
                <Badge className="bg-success/20 text-success border-success/30">
                  Bullish
                </Badge>
              </div>
              <div className="h-4 bg-secondary rounded-full overflow-hidden flex">
                <div className="h-full bg-success" style={{ width: '65%' }} />
                <div className="h-full bg-destructive" style={{ width: '20%' }} />
                <div className="h-full bg-muted-foreground" style={{ width: '15%' }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="text-success">65% Bullish</span>
                <span className="text-destructive">20% Bearish</span>
                <span>15% Neutral</span>
              </div>
            </div>
          </Card>

          {/* Trending Symbols */}
          <Card className="p-4 border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-warning" />
              Trending Now
            </h3>
            <div className="flex flex-wrap gap-2">
              {['BTC', 'NVDA', 'SPY', 'TSLA', 'ETH', 'AAPL', 'GOLD', 'OIL'].map(symbol => (
                <Badge 
                  key={symbol} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-secondary"
                >
                  #{symbol}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsAnalysis;
