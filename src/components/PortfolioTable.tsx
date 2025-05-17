// components/PortfolioHoldings.tsx
import React, { useState } from 'react';
import { Stock, SectorData } from '../types/portfolio';
import { formatCurrency } from './SummaryCards';

interface PortfolioHoldingsProps {
  holdings: Stock[];
  sectors: SectorData[];
}

interface SectorTotals {
  [key: string]: {
    investment: number;
    presentValue: number;
    gainLoss: number;
  };
}

const PortfolioHoldings: React.FC<PortfolioHoldingsProps> = ({ holdings, sectors }) => {
  const [sectorFilter, setSectorFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Calculate sector-wise totals
  const calculateSectorTotals = (): SectorTotals => {
    const totals: SectorTotals = {};
    
    sectors.forEach(sector => {
      const sectorHoldings = holdings.filter(item => item.sector === sector.name);
      totals[sector.name] = {
        investment: sectorHoldings.reduce((acc, item) => acc + item.investment, 0),
        presentValue: sectorHoldings.reduce((acc, item) => acc + item.presentValue, 0),
        gainLoss: sectorHoldings.reduce((acc, item) => acc + item.gainLoss, 0)
      };
    });
    
    return totals;
  };

  const sectorTotals = calculateSectorTotals();

  // Filter holdings by sector
  const filteredHoldings = sectorFilter === "All" 
    ? holdings 
    : holdings.filter(item => item.sector === sectorFilter);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHoldings = filteredHoldings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHoldings.length / itemsPerPage);

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Portfolio Holdings</h2>
      
      {/* Filter Dropdown */}
      <div className="flex justify-end mb-2">
        <div className="relative">
          <select 
            value={sectorFilter}
            onChange={(e) => {
              setSectorFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="block appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="All">Filter by Sector</option>
            {sectors.map((sector, index) => (
              <option key={index} value={sector.name}>{sector.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-sm">
              <th className="p-3 text-left font-medium">Particulars</th>
              <th className="p-3 text-left font-medium">Exchange</th>
              <th className="p-3 text-right font-medium">Purchase Price</th>
              <th className="p-3 text-right font-medium">Qty</th>
              <th className="p-3 text-right font-medium">Investment</th>
              <th className="p-3 text-right font-medium">CMP</th>
              <th className="p-3 text-right font-medium">Present Value</th>
              <th className="p-3 text-right font-medium">Gain/Loss</th>
              <th className="p-3 text-right font-medium">P/E Ratio</th>
              <th className="p-3 text-right font-medium">%</th>
            </tr>
          </thead>
          <tbody>
            {/* Sector rows */}
            {sectorFilter === "All" && Object.keys(sectorTotals).map((sector, index) => {
              // Get the corresponding sector color for styling
              const sectorInfo = sectors.find(s => s.name === sector);
              const bgColor = sectorInfo?.name === "Technology" ? "blue" : 
                            sectorInfo?.name === "Finance" ? "red" : 
                            sectorInfo?.name === "Energy" ? "yellow" : 
                            sectorInfo?.name === "Consumer" ? "green" : "gray";
              
              return (
                <tr key={`sector-${index}`} className={`bg-${bgColor}-50`}>
                  <td colSpan={4} className="p-2 font-medium">{sector}</td>
                  <td className="p-2 text-right font-medium">{formatCurrency(sectorTotals[sector].investment)}</td>
                  <td className="p-2"></td>
                  <td className="p-2 text-right font-medium">{formatCurrency(sectorTotals[sector].presentValue)}</td>
                  <td className={`p-2 text-right font-semibold ${sectorTotals[sector].gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(sectorTotals[sector].gainLoss)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              );
            })}

            {/* Stock rows */}
            {currentHoldings.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-2">{item.particulars}</td>
                <td className="p-2">{item.exchange}</td>
                <td className="p-2 text-right">{formatCurrency(item.purchasePrice)}</td>
                <td className="p-2 text-right">{item.qty}</td>
                <td className="p-2 text-right">{formatCurrency(item.investment)}</td>
                <td className="p-2 text-right">{formatCurrency(item.cmp)}</td>
                <td className="p-2 text-right">{formatCurrency(item.presentValue)}</td>
                <td className={`p-2 text-right font-medium ${item.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(item.gainLoss)}
                </td>
                <td className="p-2 text-right">{item.peRatio}</td>
                <td className={`p-2 text-right font-medium ${item.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.percentage >= 0 ? '+' : ''}{item.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <span className="sr-only">Previous</span>
              ← Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border ${currentPage === i + 1 ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} text-sm font-medium`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <span className="sr-only">Next</span>
              Next →
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default PortfolioHoldings;