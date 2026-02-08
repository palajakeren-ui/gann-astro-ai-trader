import { useState, useEffect, useCallback, useRef } from 'react';

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  delta: number;
}

export interface OrderLevel {
  price: number;
  bidSize: number;
  askSize: number;
  trades: number;
  delta: number;
  timestamp: number;
}

export interface Trade {
  id: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: Date;
  isLarge: boolean;
}

export interface LiquidityLevel {
  price: number;
  size: number;
  type: 'bid' | 'ask';
  isIceberg: boolean;
  timestamp: number;
}

export interface FootprintData {
  price: number;
  bidVolume: number;
  askVolume: number;
  delta: number;
  trades: number;
  imbalance: 'bid' | 'ask' | 'neutral';
}

export interface BookmapConfig {
  symbol: string;
  updateInterval: number;
  candleInterval: '1m' | '5m' | '15m' | '1h';
  levels: number;
  largeOrderThreshold: number;
}

const DEFAULT_CONFIG: BookmapConfig = {
  symbol: 'BTCUSDT',
  updateInterval: 500,
  candleInterval: '1m',
  levels: 50,
  largeOrderThreshold: 500,
};

export const useBookmapData = (config: Partial<BookmapConfig> = {}) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [basePrice, setBasePrice] = useState(43250);
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [orderBook, setOrderBook] = useState<OrderLevel[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [liquidityLevels, setLiquidityLevels] = useState<LiquidityLevel[]>([]);
  const [footprint, setFootprint] = useState<FootprintData[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const candleRef = useRef<CandleData | null>(null);
  const lastCandleTime = useRef<number>(0);

  // Generate initial candles
  const generateInitialCandles = useCallback((count: number = 100): CandleData[] => {
    const now = Date.now();
    const interval = mergedConfig.candleInterval === '1m' ? 60000 : 
                     mergedConfig.candleInterval === '5m' ? 300000 :
                     mergedConfig.candleInterval === '15m' ? 900000 : 3600000;
    
    let price = basePrice - 500;
    return Array.from({ length: count }, (_, i) => {
      const time = now - (count - i) * interval;
      const open = price;
      const volatility = Math.random() * 100;
      const close = open + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * 30;
      const low = Math.min(open, close) - Math.random() * 30;
      const volume = Math.floor(Math.random() * 10000) + 1000;
      const buyVolume = Math.floor(volume * (0.3 + Math.random() * 0.4));
      const sellVolume = volume - buyVolume;
      
      price = close;
      
      return {
        time,
        open,
        high,
        low,
        close,
        volume,
        buyVolume,
        sellVolume,
        delta: buyVolume - sellVolume,
      };
    });
  }, [basePrice, mergedConfig.candleInterval]);

  // Generate order book
  const generateOrderBook = useCallback((price: number): OrderLevel[] => {
    const levels: OrderLevel[] = [];
    
    for (let i = -mergedConfig.levels; i <= mergedConfig.levels; i++) {
      const levelPrice = price + (i * 0.5);
      const distance = Math.abs(i);
      const bidSize = Math.max(0, Math.floor(Math.random() * (1000 - distance * 15)) + 10);
      const askSize = Math.max(0, Math.floor(Math.random() * (1000 - distance * 15)) + 10);
      const tradesCount = Math.floor(Math.random() * 50);
      
      levels.push({
        price: levelPrice,
        bidSize,
        askSize,
        trades: tradesCount,
        delta: bidSize - askSize,
        timestamp: Date.now(),
      });
    }
    
    return levels.sort((a, b) => b.price - a.price);
  }, [mergedConfig.levels]);

  // Generate liquidity levels
  const generateLiquidityLevels = useCallback((price: number): LiquidityLevel[] => {
    const levels: LiquidityLevel[] = [];
    
    // Generate significant liquidity levels
    for (let i = 0; i < 20; i++) {
      const offset = (Math.random() - 0.5) * 100;
      const size = Math.floor(Math.random() * 5000) + 500;
      const isIceberg = size > 2000 && Math.random() > 0.7;
      
      levels.push({
        price: price + offset,
        size,
        type: offset > 0 ? 'ask' : 'bid',
        isIceberg,
        timestamp: Date.now(),
      });
    }
    
    return levels;
  }, []);

  // Generate footprint data
  const generateFootprint = useCallback((price: number): FootprintData[] => {
    const data: FootprintData[] = [];
    
    for (let i = -20; i <= 20; i++) {
      const levelPrice = price + (i * 0.5);
      const bidVolume = Math.floor(Math.random() * 500);
      const askVolume = Math.floor(Math.random() * 500);
      const delta = bidVolume - askVolume;
      
      let imbalance: 'bid' | 'ask' | 'neutral' = 'neutral';
      if (bidVolume > askVolume * 2) imbalance = 'bid';
      if (askVolume > bidVolume * 2) imbalance = 'ask';
      
      data.push({
        price: levelPrice,
        bidVolume,
        askVolume,
        delta,
        trades: Math.floor(Math.random() * 30),
        imbalance,
      });
    }
    
    return data.sort((a, b) => b.price - a.price);
  }, []);

  // Generate new trade
  const generateTrade = useCallback((price: number): Trade => {
    const size = Math.floor(Math.random() * 500) + 10;
    return {
      id: `trade-${Date.now()}-${Math.random()}`,
      price: price + (Math.random() - 0.5) * 5,
      size,
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      timestamp: new Date(),
      isLarge: size > mergedConfig.largeOrderThreshold,
    };
  }, [mergedConfig.largeOrderThreshold]);

  // Update current candle
  const updateCurrentCandle = useCallback((price: number) => {
    const now = Date.now();
    const interval = mergedConfig.candleInterval === '1m' ? 60000 : 
                     mergedConfig.candleInterval === '5m' ? 300000 :
                     mergedConfig.candleInterval === '15m' ? 900000 : 3600000;
    const candleTime = Math.floor(now / interval) * interval;
    
    if (candleTime !== lastCandleTime.current) {
      // New candle
      if (candleRef.current) {
        setCandles(prev => [...prev.slice(-99), candleRef.current!]);
      }
      
      candleRef.current = {
        time: candleTime,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: 0,
        buyVolume: 0,
        sellVolume: 0,
        delta: 0,
      };
      lastCandleTime.current = candleTime;
    } else if (candleRef.current) {
      // Update existing candle
      candleRef.current.high = Math.max(candleRef.current.high, price);
      candleRef.current.low = Math.min(candleRef.current.low, price);
      candleRef.current.close = price;
      
      const volume = Math.floor(Math.random() * 100);
      const isBuy = Math.random() > 0.5;
      candleRef.current.volume += volume;
      if (isBuy) {
        candleRef.current.buyVolume += volume;
      } else {
        candleRef.current.sellVolume += volume;
      }
      candleRef.current.delta = candleRef.current.buyVolume - candleRef.current.sellVolume;
    }
  }, [mergedConfig.candleInterval]);

  // Initialize data
  useEffect(() => {
    setCandles(generateInitialCandles());
    setOrderBook(generateOrderBook(basePrice));
    setLiquidityLevels(generateLiquidityLevels(basePrice));
    setFootprint(generateFootprint(basePrice));
    lastCandleTime.current = Math.floor(Date.now() / 60000) * 60000;
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!isLive) {
      setIsConnected(false);
      return;
    }

    setIsConnected(true);
    
    intervalRef.current = setInterval(() => {
      setBasePrice(prev => {
        const newPrice = prev + (Math.random() - 0.5) * 5;
        
        // Update all data
        updateCurrentCandle(newPrice);
        setOrderBook(generateOrderBook(newPrice));
        setFootprint(generateFootprint(newPrice));
        
        // Add new trade
        const newTrade = generateTrade(newPrice);
        setTrades(prev => [newTrade, ...prev.slice(0, 199)]);
        
        // Occasionally update liquidity
        if (Math.random() > 0.9) {
          setLiquidityLevels(generateLiquidityLevels(newPrice));
        }
        
        return newPrice;
      });
    }, mergedConfig.updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive, mergedConfig.updateInterval, generateOrderBook, generateTrade, generateLiquidityLevels, generateFootprint, updateCurrentCandle]);

  const toggleLive = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);

  // Calculate statistics
  const stats = {
    totalBidVolume: orderBook.reduce((sum, l) => sum + l.bidSize, 0),
    totalAskVolume: orderBook.reduce((sum, l) => sum + l.askSize, 0),
    cumulativeDelta: trades.reduce((sum, t) => sum + (t.side === 'buy' ? t.size : -t.size), 0),
    largeOrders: trades.filter(t => t.isLarge).length,
    icebergCount: liquidityLevels.filter(l => l.isIceberg).length,
  };

  return {
    basePrice,
    candles: candleRef.current ? [...candles, candleRef.current] : candles,
    orderBook,
    trades,
    liquidityLevels,
    footprint,
    isLive,
    isConnected,
    toggleLive,
    stats,
    config: mergedConfig,
  };
};

export default useBookmapData;
