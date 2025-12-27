
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Settings as SettingsIcon, 
  Bell, 
  ChevronRight,
  LogOut,
  AlertTriangle,
  ExternalLink,
  Database,
  Terminal,
  Copy,
  Check,
  Wrench
} from 'lucide-react';
import { MENU_ITEMS, BOTTOM_MENU_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import Kanban from './components/Kanban';
import Settings from './components/Settings';
import { isSupabaseConfigured } from './services/supabaseClient';

const SQL_SETUP = `-- ATUMIA CORE: SCRIPT DE SINCRONIZAÇÃO FINAL (V1.4)
-- Execute este script no SQL Editor do seu Supabase para garantir a integridade.

-- 1. Garantir que a tabela de Organizações existe
CREATE TABLE IF NOT EXISTS public.organizations (
  id text primary key,
  name text not null,
  whatsapp_number text,
  created_at timestamp with time zone default now()
);

-- 2. Ajustar a tabela 'leads' (Adicionando colunas industriais necessárias)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS telefone text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS nomewpp text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS atendimento_ia text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS org_id text REFERENCES public.organizations(id);

-- 3. Ajustar a tabela 'conversations' para logs de mensagens
CREATE TABLE IF NOT EXISTS public.conversations (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default now(),
  phone text,
  nomewpp text,
  bot_message text,
  user_message text,
  message_type text,
  active boolean default true,
  org_id text references public.organizations(id)
);

-- 4. Habilitar Realtime para a tabela leads
alter publication supabase_realtime add table leads;
`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [needsSetup, setNeedsSetup] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGlobalError = (error: any) => {
    const errorMsg = error.message || '';
    // Detecta falta da tabela leads ou da coluna org_id
    if (
      errorMsg.includes('DATABASE_NOT_INITIALIZED') || 
      errorMsg.includes('column "org_id" does not exist') ||
      errorMsg.includes('relation "public.leads" does not exist') ||
      errorMsg.includes('public.dados_cliente') 
    ) {
      setNeedsSetup(true);
    }
  };

  const copySQL = () => {
    navigator.clipboard.writeText(SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (needsSetup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-titanium-deep p-6 text-center">
        <div className="w-20 h-20 bg-copper-raw/10 rounded-3xl flex items-center justify-center mb-8 border border-copper-raw/20 animate-pulse">
          <Database size={40} className="text-copper-raw" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Sincronização de Banco Necessária</h2>
        <p className="text-steel-grey max-w-xl mb-10 leading-relaxed">
          O motor Atumia Core identificou que a tabela <code className="text-white">leads</code> ou a coluna <code className="text-copper-raw font-bold">org_id</code> não estão prontas para processamento.
        </p>
        
        <div className="w-full max-w-2xl bg-[#0e0e10] border border-steel-grey/20 rounded-2xl overflow-hidden mb-10 text-left shadow-2xl">
          <div className="bg-titanium-surface px-5 py-3 border-b border-steel-grey/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-copper-raw" />
              <span className="text-[10px] font-black text-steel-grey uppercase tracking-widest">SQL Editor Prompt (v1.4)</span>
            </div>
            <button 
              onClick={copySQL}
              className="flex items-center gap-2 text-[10px] font-black text-copper-raw hover:text-white transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'COPIADO' : 'COPIAR SCRIPT'}
            </button>
          </div>
          <div className="p-6 font-mono text-xs text-emerald-500/80 overflow-x-auto max-h-60 custom-scrollbar">
            <pre>{SQL_SETUP}</pre>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <a 
            href="https://supabase.com/dashboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-copper-raw hover:bg-copper-light text-white font-black rounded-2xl transition-all shadow-xl"
          >
            <span>ABRIR SQL EDITOR</span>
            <ExternalLink size={18} />
          </a>
          <button 
            onClick={() => {
              setNeedsSetup(false);
              window.location.reload();
            }}
            className="px-8 py-4 bg-titanium-surface border border-steel-grey/20 text-white font-black rounded-2xl hover:bg-titanium-card transition-all"
          >
            RECARREGAR SISTEMA
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!isSupabaseConfigured) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-2xl mx-auto px-4">
          <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-8 border border-amber-500/20">
            <AlertTriangle size={40} className="text-amber-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Conexão Supabase Pendente</h2>
          <p className="text-steel-grey mb-8 leading-relaxed">
            As chaves de API não foram detectadas. Configure o ambiente Supabase para prosseguir.
          </p>
        </div>
      );
    }

    switch(activeTab) {
      case 'dashboard':
        return <Dashboard onError={handleGlobalError} />;
      case 'kanban':
        return <Kanban onError={handleGlobalError} />;
      case 'settings':
      case 'config':
        return <Settings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-steel-grey">
            <Wrench size={48} className="mb-4 animate-spin-slow text-copper-raw/40" />
            <h2 className="text-2xl font-bold text-white">Módulo em Desenvolvimento</h2>
            <p className="mt-2 uppercase tracking-widest text-xs">Atumia Core Engine 1.4</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-titanium-deep text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-titanium-deep border-r border-steel-grey/10 flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center">
            {/* Logo Oficial Atumia Core - URL Atualizada */}
            <img 
              src="https://n8n-filebrowser.w7sb4c.easypanel.host/api/public/dl/87n4j0xw?inline=true" 
              alt="Atumia Core" 
              className="h-10 w-auto object-contain" 
            />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-copper-raw/20 to-transparent text-copper-raw border border-copper-raw/20' 
                  : 'text-steel-grey hover:bg-titanium-surface hover:text-white'
              }`}
            >
              <div className={`${activeTab === item.id ? 'text-copper-raw' : 'group-hover:text-copper-raw'} transition-colors`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && <div className="ml-auto w-1 h-4 bg-copper-raw rounded-full"></div>}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 space-y-1">
          <div className="h-[1px] bg-steel-grey/10 mb-4 mx-4"></div>
          {BOTTOM_MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-titanium-surface text-white border border-steel-grey/10' 
                  : 'text-steel-grey hover:bg-titanium-surface hover:text-white'
              }`}
            >
              <div className="group-hover:text-copper-raw transition-colors">{item.icon}</div>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-20 border-b border-steel-grey/10 flex items-center justify-between px-8 shrink-0 bg-titanium-deep/80 backdrop-blur-md z-10">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-grey group-focus-within:text-copper-raw transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar leads ou métricas..." 
              className="bg-titanium-surface border border-steel-grey/20 rounded-xl pl-10 pr-4 py-2.5 text-sm w-full outline-none focus:border-copper-raw/50 transition-all text-white placeholder:text-steel-grey/60 font-mono"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{localStorage.getItem('atumia_org_name') || 'Admin'}</p>
              <p className="text-[9px] font-black text-copper-raw uppercase tracking-widest leading-none mt-1">
                {localStorage.getItem('atumia_org_id') || 'SEM ORGANIZAÇÃO'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-titanium-surface border border-steel-grey/20 flex items-center justify-center text-copper-raw overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=${localStorage.getItem('atumia_org_name') || 'Admin'}&background=B87333&color=fff`} className="w-full h-full object-cover" alt="User" />
            </div>
          </div>
        </header>

        {/* View Port */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
