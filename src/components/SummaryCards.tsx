// components/SummaryCards.tsx
import React from 'react';

interface SummaryCardsProps {
  totalInvestment: number;
  presentValue: number;
  totalGain: number;
  gainPercentage: number;
}

export const formatCurrency = (value: number): string => {
  return `₹${value.toFixed(2)}`;
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ 
  totalInvestment, 
  presentValue, 
  totalGain, 
  gainPercentage 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-gray-500 text-sm mb-1">Total Investment</div>
        <div className="text-2xl font-bold">{formatCurrency(totalInvestment)}</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-gray-500 text-sm mb-1">Present Value</div>
        <div className="text-2xl font-bold">{formatCurrency(presentValue)}</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-gray-500 text-sm mb-1">Total Gain/Loss</div>
        <div className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)}
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-gray-500 text-sm mb-1">Gain/Loss %</div>
        <div className={`text-2xl font-bold ${gainPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {gainPercentage >= 0 ? '+' : ''}{gainPercentage}%
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;