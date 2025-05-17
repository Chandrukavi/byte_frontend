import React from 'react';
import Head from 'next/head';
import SummaryCards from '../components/SummaryCards';
import SectorAllocationChart from '../components/SectorAllocationChart';
import PortfolioPerformanceChart from '@/components/PortfolioChart';
import PortfolioHoldings from '../components/PortfolioTable';
import usePortfolioData from '../hooks/usePortfolioData';
import { RefreshCw } from 'lucide-react';

const PortfolioDashboardPage: React.FC = () => {
  const { portfolioData, loading, error, refreshData } = usePortfolioData();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || "Failed to load portfolio data"}</p>
          <button 
            onClick={refreshData}
            className="mt-2 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <Head>
        <title>Dynamic Portfolio Dashboard</title>
        <meta name="description" content="Track your investment portfolio performance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <div className="bg-blue-700 text-white p-4 rounded-t-lg flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Dynamic Portfolio Dashboard</h1>
        <button 
          onClick={refreshData}
          className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded-full flex items-center text-sm transition-colors"
        >
          <RefreshCw size={16} className="mr-1" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryCards 
        totalInvestment={portfolioData.totalInvestment}
        presentValue={portfolioData.presentValue}
        totalGain={portfolioData.totalGain}
        gainPercentage={portfolioData.gainPercentage}
      />

      {/* Update Information */}
      <div className="text-xs text-gray-600 mb-4 flex justify-between">
        <div>Last updated: {portfolioData.lastUpdated}</div>
        <div>Auto-refreshes every 15s</div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <SectorAllocationChart sectors={portfolioData.sectors} />
        <PortfolioPerformanceChart performanceData={portfolioData.performanceData} />
      </div>

      {/* Portfolio Holdings Table */}
      <PortfolioHoldings 
        holdings={portfolioData.holdings} 
        sectors={portfolioData.sectors} 
      />
    </div>
  );
};

export default PortfolioDashboardPage;