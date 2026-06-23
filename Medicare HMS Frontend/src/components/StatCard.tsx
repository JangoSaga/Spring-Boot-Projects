import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon, trend }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between relative overflow-hidden transition-all hover:shadow-md">
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <span className="block text-2xl font-bold font-heading text-slate-800">{value}</span>
        
        {(subtext || trend) && (
          <div className="flex items-center gap-1.5 text-xs">
            {trend && (
              <span className={`font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {trend.value}
              </span>
            )}
            {subtext && <span className="text-slate-400 font-medium">{subtext}</span>}
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50 text-slate-600 rounded-lg border border-slate-100">
        {icon}
      </div>
    </div>
  );
};
export default StatCard;
