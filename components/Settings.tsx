
import React, { useState, useEffect } from 'react';
import { Building2, Hash, Phone, ShieldCheck, ShieldAlert, Loader2, Save } from 'lucide-react';
import { leadService } from '../services/leadService';
import { Organization } from '../types';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    id: localStorage.getItem('atumia_org_id') || '',
    name: localStorage.getItem('atumia_org_name') || '',
    whatsapp: localStorage.getItem('atumia_org_whatsapp') || ''
  });

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    const result = await leadService.validateOrganization(formData.id, formData.name, formData.whatsapp);

    if (result) {
      localStorage.setItem('atumia_org_id', formData.id);
      localStorage.setItem('atumia_org_name', formData.name);
      localStorage.setItem('atumia_org_whatsapp', formData.whatsapp);
      setStatus('success');
    } else {
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações da Organização</h1>
        <p className="text-steel-grey">Valide sua infraestrutura Atumia Core para habilitar o processamento industrial de leads.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleValidate} className="bg-titanium-card border border-steel-grey/10 rounded-2xl p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-steel-grey uppercase tracking-widest mb-2">ID da Organização</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-grey" size={18} />
                  <input 
                    type="text" 
                    value={formData.id}
                    onChange={e => setFormData({...formData, id: e.target.value})}
                    placeholder="Ex: org_12345" 
                    className="w-full bg-titanium-surface border border-steel-grey/20 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-copper-raw transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-steel-grey uppercase tracking-widest mb-2">Nome da Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-grey" size={18} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Nome Fantasia" 
                    className="w-full bg-titanium-surface border border-steel-grey/20 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-copper-raw transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-steel-grey uppercase tracking-widest mb-2">WhatsApp Oficial</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-grey" size={18} />
                  <input 
                    type="text" 
                    value={formData.whatsapp}
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    placeholder="5511999999999" 
                    className="w-full bg-titanium-surface border border-steel-grey/20 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-copper-raw transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-copper-raw hover:bg-copper-light disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-copper-raw/10"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                <span>Validar e Salvar</span>
              </button>
              
              {status === 'success' && (
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20">
                  <ShieldCheck size={18} />
                  <span>Conexão Ativa</span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm bg-rose-500/10 px-4 py-3 rounded-xl border border-rose-500/20">
                  <ShieldAlert size={18} />
                  <span>Erro de Match</span>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-titanium-surface border border-steel-grey/10 rounded-2xl p-6">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-copper-raw" size={18} />
              Status de Segurança
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-steel-grey">Isolamento RLS</span>
                <span className="text-emerald-400 font-mono font-bold">ATIVO</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-steel-grey">Encriptação SSL</span>
                <span className="text-emerald-400 font-mono font-bold">ATIVO</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-steel-grey">Tenant ID</span>
                <span className="text-white font-mono">{formData.id || '---'}</span>
              </div>
            </div>
          </div>

          <div className="p-6 border border-copper-raw/20 bg-copper-raw/5 rounded-2xl">
            <p className="text-xs text-copper-raw font-medium leading-relaxed uppercase tracking-wider">
              Aviso: As informações inseridas devem corresponder exatamente aos dados da tabela 
              <span className="font-bold"> organizations</span> no Supabase para garantir a integridade do Tenant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
