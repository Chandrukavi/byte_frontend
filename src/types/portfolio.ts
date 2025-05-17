// types/portfolio.ts
export interface Stock {
  sector: string;
  particulars: string;
  exchange: string;
  purchasePrice: number;
  qty: number;
  investment: number;
  cmp: number;
  presentValue: number;
  gainLoss: number;
  peRatio: number;
  percentage: number;
}

export interface SectorData {
  name: string;
  value: number;
  color: string;
}

export interface PerformanceData {
  name: string;
  value: number;
}

export interface SectorTotals {
  [key: string]: {
    investment: number;
    presentValue: number;
    gainLoss: number;
  };
}

export interface PortfolioData {
  totalInvestment: number;
  presentValue: number;
  totalGain: number;
  gainPercentage: number;
  lastUpdated: string;
  sectors: SectorData[];
  performanceData: PerformanceData[];
  holdings: Stock[];
}

// This function is kept for fallback or testing purposes
export const getMockPortfolioData = (): PortfolioData => {
  return {
    totalInvestment: 83250.00,
    presentValue: 87520.50,
    totalGain: 4270.50,
    gainPercentage: 5.13,
    lastUpdated: "17 May 2025, 10:45 AM",
    sectors: [
      { name: "Technology", value: 35, color: "#3b82f6" },
      { name: "Finance", value: 25, color: "#ef4444" },
      { name: "Energy", value: 20, color: "#eab308" },
      { name: "Consumer", value: 20, color: "#22c55e" }
    ],
    performanceData: [
      { name: "Jan", value: 82000 },
      { name: "Feb", value: 83500 },
      { name: "Mar", value: 83000 },
      { name: "Apr", value: 85000 },
      { name: "May", value: 87520 }
    ],
    holdings: [
      { 
        sector: "Technology",
        particulars: "Infosys Ltd", 
        exchange: "NSE", 
        purchasePrice: 1500.00, 
        qty: 10, 
        investment: 15000.00, 
        cmp: 1580.50, 
        presentValue: 15805.00, 
        gainLoss: 805.00, 
        peRatio: 24.5, 
        percentage: 5.3 
      },
      { 
        sector: "Technology",
        particulars: "TCS Ltd", 
        exchange: "NSE", 
        purchasePrice: 3200.00, 
        qty: 5, 
        investment: 16000.00, 
        cmp: 3339.00, 
        presentValue: 16695.00, 
        gainLoss: 695.00, 
        peRatio: 26.2, 
        percentage: 4.3 
      },
      { 
        sector: "Finance",
        particulars: "HDFC Bank", 
        exchange: "NSE", 
        purchasePrice: 1600.00, 
        qty: 8, 
        investment: 12800.00, 
        cmp: 1550.25, 
        presentValue: 12402.00, 
        gainLoss: -398.00, 
        peRatio: 18.2, 
        percentage: -3.1 
      },
      { 
        sector: "Energy",
        particulars: "Reliance Industries", 
        exchange: "BSE", 
        purchasePrice: 2490.00, 
        qty: 8, 
        investment: 19920.00, 
        cmp: 2667.50, 
        presentValue: 21340.00, 
        gainLoss: 1420.00, 
        peRatio: 29.7, 
        percentage: 7.1 
      }
    ]
  };
};