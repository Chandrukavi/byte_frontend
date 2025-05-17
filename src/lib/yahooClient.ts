import yahooFinance from 'yahoo-finance2';

export async function fetchQuote(symbol: string) {
  try {
    const result = await yahooFinance.quote(symbol);
    return result;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}
