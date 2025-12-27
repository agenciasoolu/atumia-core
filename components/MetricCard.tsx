
import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, icon }) => {
  return (
    <div className="bg-titanium-card border border-steel-grey/20 rounded-2xl p-6 transition-all hover:border-copper-raw/30 group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-titanium-surface rounded-xl text-steel-grey group-hover:text-copper-raw transition-colors">
          {icon}
        </div>
        <button className="text-steel-grey hover:text-white transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <div>
        <p className="text-steel-grey text-sm font-medium mb-1 uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-3">
          <h3 className="text-3xl font-bold font-mono text-white">{value}</h3>
          {trend && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
