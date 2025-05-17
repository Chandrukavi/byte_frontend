// hooks/usePortfolioData.ts
import { useState, useEffect } from 'react';
import { PortfolioData, getMockPortfolioData } from '../types/portfolio';

const usePortfolioData = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(getMockPortfolioData());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we're just using mock data
      const data = getMockPortfolioData();
      
      // Simulate a small randomization to make it look like real data updates
      const updatedData = {
        ...data,
        presentValue: data.presentValue * (1 + (Math.random() * 0.002 - 0.001)),
        lastUpdated: new Date().toLocaleString('en-IN', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit'
        })
      };
      
      // Recalculate total gain and percentage
      updatedData.totalGain = updatedData.presentValue - updatedData.totalInvestment;
      updatedData.gainPercentage = (updatedData.totalGain / updatedData.totalInvestment) * 100;
      
      // Update holdings with new random values
      updatedData.holdings = updatedData.holdings.map(holding => {
        const newCmp = holding.cmp * (1 + (Math.random() * 0.01 - 0.005));
        const newPresentValue = newCmp * holding.qty;
        const newGainLoss = newPresentValue - holding.investment;
        const newPercentage = (newGainLoss / holding.investment) * 100;
        
        return {
          ...holding,
          cmp: newCmp,
          presentValue: newPresentValue,
          gainLoss: newGainLoss,
          percentage: newPercentage
        };
      });
      
      setPortfolioData(updatedData);
    } catch (err) {
      setError('Failed to fetch portfolio data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Set up auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    portfolioData,
    loading,
    error,
    refreshData: fetchData
  };
};

export default usePortfolioData;