import type { NextApiRequest, NextApiResponse } from 'next';
import { getYahooData, getGoogleData } from '@/lib/getFinanceData';

// Portfolio definition - in a real app, this would likely come from a database
const portfolio = [
  // Technology Sector
  { name: 'Infosys Ltd', symbol: 'INFY:NSE', exchange: 'NSE', sector: 'Technology', purchasePrice: 1400, quantity: 10, purchaseDate: '2023-11-15' },
  { name: 'TCS Ltd', symbol: 'TCS:NSE', exchange: 'NSE', sector: 'Technology', purchasePrice: 3200, quantity: 5, purchaseDate: '2023-09-22' },
  { name: 'Tech Mahindra', symbol: 'TECHM:NSE', exchange: 'NSE', sector: 'Technology', purchasePrice: 1200, quantity: 8, purchaseDate: '2024-01-10' },
  { name: 'Wipro Ltd', symbol: 'WIPRO:NSE', exchange: 'NSE', sector: 'Technology', purchasePrice: 450, quantity: 20, purchaseDate: '2023-12-05' },
  
  // Financial Sector
  { name: 'HDFC Bank', symbol: 'HDFCBANK:NSE', exchange: 'NSE', sector: 'Financials', purchasePrice: 1500, quantity: 5, purchaseDate: '2023-10-18' },
  { name: 'ICICI Bank', symbol: 'ICICIBANK:NSE', exchange: 'NSE', sector: 'Financials', purchasePrice: 950, quantity: 12, purchaseDate: '2024-02-20' },
  { name: 'SBI', symbol: 'SBIN:NSE', exchange: 'NSE', sector: 'Financials', purchasePrice: 620, quantity: 15, purchaseDate: '2023-08-30' },
  
  // Energy Sector
  { name: 'Reliance Industries', symbol: 'RELIANCE:NSE', exchange: 'NSE', sector: 'Energy', purchasePrice: 2500, quantity: 8, purchaseDate: '2023-07-12' },
  { name: 'ONGC', symbol: 'ONGC:NSE', exchange: 'NSE', sector: 'Energy', purchasePrice: 180, quantity: 40, purchaseDate: '2024-03-05' },
  
  // Consumer Sector
  { name: 'ITC Ltd', symbol: 'ITC:NSE', exchange: 'NSE', sector: 'Consumer', purchasePrice: 420, quantity: 30, purchaseDate: '2023-11-28' },
  { name: 'Hindustan Unilever', symbol: 'HINDUNILVR:NSE', exchange: 'NSE', sector: 'Consumer', purchasePrice: 2600, quantity: 4, purchaseDate: '2024-01-15' },
  
  // Healthcare Sector
  { name: 'Dr Reddy\'s Labs', symbol: 'DRREDDY:NSE', exchange: 'NSE', sector: 'Healthcare', purchasePrice: 5800, quantity: 2, purchaseDate: '2023-12-22' },
  { name: 'Sun Pharma', symbol: 'SUNPHARMA:NSE', exchange: 'NSE', sector: 'Healthcare', purchasePrice: 1150, quantity: 10, purchaseDate: '2024-02-08' }
];

export interface StockResponse {
  name: string;
  symbol: string;
  exchange: string;
  sector: string;
  purchasePrice: number;
  quantity: number;
  cmp: number;
  investment: number;
  presentValue: number;
  gainLoss: number;
  percentage: number;
  peRatio: number;
  latestEarnings: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stocks: StockResponse[] = [];

    for (const item of portfolio) {
      // Convert NSE symbol format to Yahoo Finance format (.NS suffix)
      const yahooData = await getYahooData(item.symbol.replace(':NSE', '.NS')); 
      const googleData = await getGoogleData(item.symbol);

      if (!yahooData) continue;

      const cmp = yahooData.cmp;
      const investment = item.purchasePrice * item.quantity;
      const presentValue = cmp * item.quantity;
      const gainLoss = presentValue - investment;
      const percentage = (gainLoss / investment) * 100;

      stocks.push({
        name: item.name,
        symbol: item.symbol,
        exchange: item.exchange,
        sector: item.sector,
        purchasePrice: item.purchasePrice,
        quantity: item.quantity,
        cmp,
        investment,
        presentValue,
        gainLoss,
        percentage,
        peRatio: googleData?.peRatio || yahooData.peRatio,
        latestEarnings: googleData?.earnings || yahooData.earnings,
      });
    }

    // Return the processed stock data
    res.status(200).json({
      stocks,
      lastUpdated: new Date().toLocaleString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      })
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
}