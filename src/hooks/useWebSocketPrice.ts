import { useState, useEffect, useCallback, useRef } from 'react';

interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  timestamp: Date;
}

interface WebSocketPriceConfig {
  symbol?: string;
  enabled?: boolean;
  updateInterval?: number;
}

export const useWebSocketPrice = (config: WebSocketPriceConfig = {}) => {
  const { symbol = 'BTCUSDT', enabled = true, updateInterval = 1000 } = config;
  
  const [priceData, setPriceData] = useState<PriceData>({
    symbol,
    price: 47509,
    change: 984,
    changePercent: 2.11,
    high24h: 48500,
    low24h: 46000,
    volume: 1250000000,
    timestamp: new Date(),
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [isLive, setIsLive] = useState(enabled);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const basePrice = useRef(47509);

  // Simulate realistic price movements
  const generatePriceUpdate = useCallback(() => {
    const volatility = 0.001; // 0.1% volatility
    const drift = (Math.random() - 0.5) * 2; // Random walk
    const change = basePrice.current * volatility * drift;
    
    basePrice.current += change;
    
    const newPrice = basePrice.current;
    const dailyChange = newPrice - 46525; // From start of day
    const dailyChangePercent = (dailyChange / 46525) * 100;
    
    setPriceData(prev => ({
      ...prev,
      symbol,
      price: Number(newPrice.toFixed(2)),
      change: Number(dailyChange.toFixed(2)),
      changePercent: Number(dailyChangePercent.toFixed(2)),
      high24h: Math.max(prev.high24h, newPrice),
      low24h: Math.min(prev.low24h, newPrice),
      volume: prev.volume + Math.random() * 1000000,
      timestamp: new Date(),
    }));
  }, [symbol]);

  // Start/stop the simulated WebSocket
  useEffect(() => {
    if (isLive && enabled) {
      setIsConnected(true);
      intervalRef.current = setInterval(generatePriceUpdate, updateInterval);
      console.log('[WebSocket] Connected to price feed:', symbol);
    } else {
      setIsConnected(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      console.log('[WebSocket] Disconnected from price feed');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLive, enabled, updateInterval, generatePriceUpdate, symbol]);

  const toggleConnection = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);

  const setSymbol = useCallback((newSymbol: string) => {
    setPriceData(prev => ({ ...prev, symbol: newSymbol }));
  }, []);

  return {
    priceData,
    isConnected,
    isLive,
    toggleConnection,
    setSymbol,
  };
};

export default useWebSocketPrice;
