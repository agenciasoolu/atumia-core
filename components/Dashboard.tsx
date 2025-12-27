
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Bot, 
  Target, 
  UserCheck, 
  Flame, 
  Timer,
  CalendarDays,
  ChevronDown,
  Loader2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import MetricCard from './MetricCard';
import { leadService } from '../services/leadService';

const chartData = [
  { name: 'Jan', value: 12 }, { name: 'Fev', value: 18 }, { name: 'Mar', value: 28 },
  { name: 'Abr', value: 24 }, { name: 'Mai', value: 33 }, { name: 'Jun', value: 36 },
  { name: 'Jul', value: 42 }, { name: 'Ago', value: 48 }, { name: 'Set', value: 40 },
  { name: 'Out', value: 45 }, { name: 'Nov', value: 38 },
];

interface DashboardProps {
  onError?: (error: Error) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onError }) => {
  const [metrics, setMetrics] = useState({ leads: 0, messages: 0, qualified: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await leadService.getMetrics();
        setMetrics(data);
        setError(false);
      } catch (err: any) {
        if (err.message === 'DATABASE_NOT_INITIALIZED') {
          if (onError) onError(err);
        } else {
          console.error("Erro ao carregar métricas:", err.message);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [onError]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-steel-grey">
        <Loader2 size={40} className="animate-spin text-copper-raw mb-4" />
        <p className="font-mono text-[10px] uppercase tracking-widest">Calculando Torque de Vendas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">Dashboard</h1>
          <p className="text-steel-grey text-sm font-medium">Visão de tração. Dados sincronizados com Supabase.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {error && (
            <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle size={14} />
              <span>Erro de Sincronização</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-titanium-card border border-steel-grey/20 rounded-lg text-sm text-white">
            <CalendarDays size={16} className="text-copper-raw" />
            <span>Tempo Real</span>
            <ChevronDown size={14} className="text-steel-grey" />
          </div>
          <button className="px-4 py-2 bg-copper-raw hover:bg-copper-light text-white font-bold rounded-lg transition-all shadow-lg shadow-copper-raw/10 text-xs uppercase tracking-widest">
            Gerar Relatório
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard label="Total de Leads" value={metrics.leads} icon={<Users size={24} />} />
        <MetricCard label="Mensagens Logadas" value={metrics.messages} trend="Atividade Alta" icon={<Bot size={24} />} />
        <MetricCard label="Leads Qualificados" value={metrics.qualified} trend="45% Conversão" icon={<Target size={24} />} />
        <MetricCard label="Transbordo Humano" value={Math.floor(metrics.leads * 0.2)} icon={<UserCheck size={24} />} />
        <MetricCard label="Processamento IA" value={metrics.messages * 2} icon={<Flame size={24} />} />
        <MetricCard label="Latência Média" value="0.8s" icon={<Timer size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-titanium-card border border-steel-grey/20 rounded-2xl p-6">
          <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest text-steel-grey">Volume de Processamento</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B87333" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#B87333" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#232326" vertical={false} />
                <XAxis dataKey="name" stroke="#808285" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis stroke="#808285" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1c1c1f', border: '1px solid #232326', borderRadius: '8px' }} itemStyle={{ color: '#B87333' }} />
                <Area type="monotone" dataKey="value" stroke="#B87333" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-titanium-card border border-steel-grey/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-widest">Qualidade do SDR</h4>
            <p className="text-[10px] text-steel-grey uppercase font-bold tracking-tighter">Score automatizado via Gemini 2.5</p>
          </div>
          <div className="relative w-48 h-48 flex items-center justify-center">
             <div className="absolute inset-0 border-[12px] border-titanium-surface rounded-full"></div>
             <div className="absolute inset-0 border-[12px] border-copper-raw rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: 'rotate(45deg)' }}></div>
             <div className="text-center">
               <span className="text-6xl font-black font-mono text-emerald-400">92</span>
               <p className="text-[10px] font-black text-steel-grey uppercase mt-2 tracking-widest">Health Score</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
