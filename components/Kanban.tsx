
import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Loader2, AlertCircle, RefreshCw, Layers, SlidersHorizontal, Calendar, Zap, CheckCircle } from 'lucide-react';
import { Lead } from '../types';
import { leadService } from '../services/leadService';
import LeadCard from './LeadCard';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const COLUMNS = [
  { id: 'frio', label: 'Lead Frio', color: '#808285', icon: <Layers size={14} /> },
  { id: 'qualificando', label: 'Processamento', color: '#B87333', icon: <RefreshCw size={14} /> },
  { id: 'qualificado', label: 'Qualificado', color: '#10b981', icon: <Zap size={14} /> },
  { id: 'agendado', label: 'Agendado', color: '#3b82f6', icon: <Calendar size={14} /> },
  { id: 'fechado', label: 'Fechado', color: '#a855f7', icon: <CheckCircle size={14} /> }
];

interface KanbanProps {
  onError?: (error: Error) => void;
}

const Kanban: React.FC<KanbanProps> = ({ onError }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchLeads = async () => {
    try {
      setError(null);
      const data = await leadService.getLeads();
      setLeads(data);
    } catch (err: any) {
      if (err.message === 'DATABASE_NOT_INITIALIZED') {
        if (onError) onError(err);
      } else {
        setError("Erro ao conectar com a esteira de dados.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async () => {
    const name = prompt("Nome do Lead:");
    const phone = prompt("Telefone (ex: 5511999999999):");
    
    if (name && phone) {
      setIsCreating(true);
      try {
        const success = await leadService.createLead({ name, phone, status: 'frio' });
        if (!success) alert("Erro ao salvar no Supabase. Verifique a conexão.");
        fetchLeads(); 
      } catch (err: any) {
        if (err.message === 'DATABASE_NOT_INITIALIZED' && onError) {
          onError(err);
        }
      } finally {
        setIsCreating(false);
      }
    }
  };

  useEffect(() => {
    fetchLeads();

    if (!isSupabaseConfigured || !supabase) return;

    try {
      const channel = supabase
        .channel('kanban-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'leads' }, // Corrigido para a tabela 'leads'
          () => fetchLeads()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      // Ignora erro de realtime se a tabela não estiver pronta
    }
  }, [onError]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-steel-grey">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-[12px] border-titanium-light rounded-full flex items-center justify-center">
            <div className="w-full h-full border-[12px] border-copper-raw border-t-transparent rounded-full animate-spin"></div>
          </div>
          <Layers size={24} className="absolute inset-0 m-auto text-copper-raw animate-pulse" />
        </div>
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-white">Sincronizando Dutos de Dados</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <span className="h-6 w-1 bg-copper-raw rounded-full"></span>
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Pipeline Industrial</h1>
          </div>
          <p className="text-steel-grey font-medium tracking-tight">O fluxo de processamento dos seus ativos de venda.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-steel-grey group-focus-within:text-copper-raw transition-all" />
            <input 
              type="text" 
              placeholder="LOCALIZAR ATIVO..." 
              className="bg-titanium-card border border-steel-grey/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-black tracking-widest text-white w-full outline-none focus:border-copper-raw/30 focus:bg-titanium-surface transition-all shadow-xl uppercase"
            />
          </div>
          <button 
            onClick={handleCreateLead}
            disabled={isCreating}
            className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-copper-raw text-titanium-deep hover:text-white font-black rounded-2xl transition-all shadow-industrial text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {isCreating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            <span>{isCreating ? 'PROCESSANDO...' : 'ENGENHARIA LEAD'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-10 scrollbar-thin">
        <div className="flex gap-8 h-full min-w-max px-2">
          {COLUMNS.map(column => {
            const columnLeads = leads.filter(l => l.status === column.id);
            return (
              <div key={column.id} className="w-80 flex flex-col group/col">
                <div className="flex items-center justify-between mb-6 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-titanium-surface border border-steel-grey/10 flex items-center justify-center text-steel-grey group-hover/col:text-copper-raw transition-colors shadow-inner">
                      {column.icon}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">{column.label}</h3>
                      <div className="flex items-center gap-2 mt-1">
                         <div className="h-1 w-8 bg-titanium-light rounded-full overflow-hidden">
                            <div className="h-full bg-copper-raw/40" style={{ width: '60%' }}></div>
                         </div>
                         <span className="text-[9px] font-black font-mono text-steel-grey">
                           {columnLeads.length} UNID.
                         </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 bg-gradient-to-b from-titanium-surface/40 to-transparent border-x border-t border-steel-grey/5 rounded-t-[32px] p-3 min-h-[600px] transition-colors group-hover/col:bg-titanium-surface/60">
                  <div className="space-y-4">
                    {columnLeads.map(lead => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                  </div>
                  
                  {columnLeads.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-steel-grey/10 rounded-3xl flex flex-col items-center justify-center opacity-40 group-hover/col:opacity-100 transition-opacity mt-4">
                      <Layers size={24} className="text-steel-grey mb-2" />
                      <span className="text-[9px] text-steel-grey uppercase font-black tracking-[0.3em]">Câmara Vazia</span>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleCreateLead}
                    className="w-full mt-4 py-5 border-2 border-dashed border-steel-grey/10 rounded-3xl text-steel-grey hover:border-copper-raw/20 hover:text-white hover:bg-copper-raw/5 transition-all text-xs font-black uppercase tracking-widest"
                  >
                    + INJETAR LEAD
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Kanban;
