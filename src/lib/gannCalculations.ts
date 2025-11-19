// Gann Square of 9 Calculator
export const calculateSquareOf9 = (center: number) => {
  const results: Array<{ ring: number; values: number[] }> = [];
  
  for (let ring = 1; ring <= 5; ring++) {
    const values: number[] = [];
    const pointsInRing = ring * 8;
    const increment = (Math.pow(ring, 2) - Math.pow(ring - 1, 2)) / pointsInRing;
    
    for (let i = 0; i < pointsInRing; i++) {
      values.push(center + Math.pow(ring - 1, 2) + increment * i);
    }
    
    results.push({ ring, values });
  }
  
  return results;
};

// Gann Angles Calculator
export const calculateGannAngles = (price: number, timeUnit: number = 1) => {
  return {
    "1x1": price,
    "1x2": price + (timeUnit * 0.5),
    "1x4": price + (timeUnit * 0.25),
    "1x8": price + (timeUnit * 0.125),
    "2x1": price + (timeUnit * 2),
    "4x1": price + (timeUnit * 4),
    "8x1": price + (timeUnit * 8),
  };
};

// Support and Resistance Calculator
export const calculateSupportResistance = (
  high: number,
  low: number,
  close: number
) => {
  const pivot = (high + low + close) / 3;
  
  return {
    pivot,
    resistance1: (2 * pivot) - low,
    resistance2: pivot + (high - low),
    resistance3: high + 2 * (pivot - low),
    support1: (2 * pivot) - high,
    support2: pivot - (high - low),
    support3: low - 2 * (high - pivot),
  };
};

// Time Cycles Calculator
export const calculateTimeCycles = (startDate: Date, cycleLength: number) => {
  const cycles: Array<{ cycle: number; date: Date; daysFromStart: number }> = [];
  
  for (let i = 1; i <= 8; i++) {
    const daysFromStart = cycleLength * i;
    const cycleDate = new Date(startDate);
    cycleDate.setDate(cycleDate.getDate() + daysFromStart);
    
    cycles.push({
      cycle: i,
      date: cycleDate,
      daysFromStart,
    });
  }
  
  return cycles;
};

// Fibonacci Levels Calculator
export const calculateFibonacciLevels = (high: number, low: number) => {
  const diff = high - low;
  
  return {
    level_0: low,
    level_236: low + diff * 0.236,
    level_382: low + diff * 0.382,
    level_500: low + diff * 0.5,
    level_618: low + diff * 0.618,
    level_786: low + diff * 0.786,
    level_100: high,
  };
};

// Gann Fan Calculator
export const calculateGannFan = (
  startPrice: number,
  startTime: number,
  direction: "up" | "down" = "up"
) => {
  const angles = [82.5, 75, 63.75, 45, 26.25, 15, 7.5];
  const multiplier = direction === "up" ? 1 : -1;
  
  return angles.map((angle) => ({
    angle,
    slope: Math.tan((angle * Math.PI) / 180) * multiplier,
    label: `${angle}°`,
  }));
};
