import { Stock } from '@/types/portfolio';

export async function fetchStockData(): Promise<Stock[]> {
  const response = await fetch('/api/stocks');
  const data = await response.json();
  return data;
}