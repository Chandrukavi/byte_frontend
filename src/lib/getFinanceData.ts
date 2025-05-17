import yahooFinance from 'yahoo-finance2';
import puppeteer from 'puppeteer';

/**
 * Fetches stock data from Yahoo Finance API
 * @param symbol Stock symbol in Yahoo Finance format (e.g., "INFY.NS")
 * @returns Object containing current market price, PE ratio, and earnings
 */
export async function getYahooData(symbol: string) {
  try {
    // Import the correct type from yahoo-finance2 at the top of the file:
    // import type { Quote } from 'yahoo-finance2/dist/esm/src/modules/quote';

    const quote = await yahooFinance.quote(symbol) as any; // Use 'as any' or a more specific type if available
    
    // Get additional market data
    const marketData = {
      cmp: quote.regularMarketPrice || 0,
      peRatio: quote.trailingPE || 0,
      earnings: quote.epsTrailingTwelveMonths ? `₹${quote.epsTrailingTwelveMonths}` : 'N/A',
      dayHigh: quote.dayHigh || 0,
      dayLow: quote.dayLow || 0,
      volume: quote.regularMarketVolume || 0,
      averageVolume: quote.averageVolume || 0,
      marketCap: quote.marketCap ? formatMarketCap(quote.marketCap) : 'N/A',
      dividend: quote.dividendYield ? `${(quote.dividendYield * 100).toFixed(2)}%` : 'N/A',
      previousClose: quote.regularMarketPreviousClose || 0,
      dayChange: quote.regularMarketChange || 0,
      dayChangePercent: quote.regularMarketChangePercent ? `${quote.regularMarketChangePercent.toFixed(2)}%` : '0.00%',
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0
    };
    
    return marketData;
  } catch (error) {
    console.error('Yahoo Fetch Error:', error);
    return null;
  }
}

// Format market cap to readable format (e.g., 1.2T, 345.6B, 78.9M)
function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `₹${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `₹${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `₹${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `₹${marketCap.toFixed(2)}`;
  }
}

/**
 * Scrapes stock data from Google Finance using Puppeteer
 * @param symbol Stock symbol (e.g., "INFY:NSE")
 * @returns PE ratio and earnings data
 */
export async function getGoogleData(symbol: string): Promise<{ peRatio: number; earnings: string; bookValue: string; debtToEquity: string; currentRatio: string; } | null> {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const url = `https://www.google.com/finance/quote/${symbol}`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    const result = await page.evaluate(() => {
      const pe = document.querySelector('[aria-label=\"P/E ratio\"]')?.textContent || '0';
      const earnings = document.querySelector('[aria-label=\"EPS\"]')?.textContent || 'N/A';
      
      // Get additional fundamental data
      const bookValue = document.querySelector('[aria-label=\"Book value per share\"]')?.textContent || 'N/A';
      const debtToEquity = document.querySelector('[aria-label=\"Debt to equity\"]')?.textContent || 'N/A';
      const currentRatio = document.querySelector('[aria-label=\"Current ratio\"]')?.textContent || 'N/A';
      
      return {
        peRatio: parseFloat(pe),
        earnings,
        bookValue,
        debtToEquity,
        currentRatio
      };
    });

    await browser.close();
    return result;
  } catch (error) {
    console.error('Google Fetch Error:', error);
    return null;
  }
}

/**
 * Gets historical price data for a stock
 * @param symbol Stock symbol in Yahoo Finance format (e.g., "INFY.NS")
 * @returns Historical price data for the last 6 months
 */
export async function getHistoricalData(symbol: string) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6); // Get 6 months of data
    
    const queryOptions = {
      period1: startDate.toISOString().split('T')[0],
      period2: endDate.toISOString().split('T')[0],
      interval: "1mo" as "1mo" // Monthly data, explicitly typed
    };
    
    const result = await yahooFinance.historical(symbol, queryOptions);
    
    // Process and format the data
    return result.map(item => ({
      date: item.date.toISOString().split('T')[0],
      close: item.close || 0
    }));
  } catch (error) {
    console.error('Historical Data Fetch Error:', error);
    return [];
  }
}