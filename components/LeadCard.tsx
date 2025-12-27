
import React from 'react';
import { User, Phone, MoreVertical } from 'lucide-react';
import { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const urgencyColors = {
    baixa: 'bg-emerald-500/20 text-emerald-400',
    media: 'bg-amber-500/20 text-amber-400',
    alta: 'bg-rose-500/20 text-rose-400'
  };

  return (
    <div className="bg-titanium-card border border-steel-grey/10 p-4 rounded-xl mb-3 hover:border-copper-raw/40 transition-all cursor-grab active:cursor-grabbing group">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${urgencyColors[lead.urgency]}`}>
          {lead.urgency}
        </span>
        <button className="text-steel-grey hover:text-white">
          <MoreVertical size={16} />
        </button>
      </div>

      <h4 className="font-semibold text-white mb-1 group-hover:text-copper-raw transition-colors">{lead.name}</h4>
      <p className="text-xs text-steel-grey mb-3 font-mono">{lead.phone}</p>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-steel-grey/10">
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-titanium-surface flex items-center justify-center text-copper-raw font-bold text-xs">
            {lead.score}
          </div>
          <span className="text-[10px] text-steel-grey uppercase font-bold">Score</span>
        </div>
        <div className="text-[10px] text-steel-grey font-mono">
          {new Date(lead.lastInteraction).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
