import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
}) => {
  return (
    <div className="bg-white shadow rounded p-4 flex items-center space-x-4">
      {icon && <div className="text-primary">{icon}</div>}
      <div className="flex-1">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      {trend && trendValue !== undefined && (
        <div
          className={`flex items-center ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {trend === 'up' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
          <span className="ml-1 text-sm">{trendValue}%</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
