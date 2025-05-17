// components/SectorAllocationChart.tsx
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { SectorData } from '../types/portfolio';

interface SectorAllocationChartProps {
  sectors: SectorData[];
}

const SectorAllocationChart: React.FC<SectorAllocationChartProps> = ({ sectors }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Sector Allocation</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sectors}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name} (${value}%)`}
            >
              {sectors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-4 mt-2 justify-center">
        {sectors.map((sector, index) => (
          <div key={index} className="flex items-center">
            <div className="w-3 h-3 mr-1" style={{ backgroundColor: sector.color }}></div>
            <span className="text-sm">{sector.name} ({sector.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorAllocationChart;