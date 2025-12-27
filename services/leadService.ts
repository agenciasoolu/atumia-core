
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Lead, Organization } from '../types';

export const leadService = {
  // Retorna o ID da organização ativa no sistema
  getOrgId(): string | null {
    return localStorage.getItem('atumia_org_id');
  },

  async validateOrganization(orgId: string, name: string, whatsapp: string): Promise<Organization | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .eq('name', name)
        .eq('whatsapp_number', whatsapp)
        .single();

      if (error) {
        if (error.message?.includes('does not exist')) {
          throw new Error('DATABASE_NOT_INITIALIZED');
        }
        return null;
      }

      return data as Organization;
    } catch (e: any) {
      if (e.message === 'DATABASE_NOT_INITIALIZED') throw e;
      console.error('Erro na validação de org:', e.message);
      return null;
    }
  },

  async createLead(leadData: Partial<Lead>): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const orgId = this.getOrgId();
    if (!orgId) return false;

    try {
      // Uso estrito da tabela 'leads' e coluna 'org_id'
      const { error } = await supabase
        .from('leads')
        .insert([{
          telefone: leadData.phone,
          nomewpp: leadData.name,
          atendimento_ia: leadData.status || 'frio',
          org_id: orgId, 
          created_at: new Date().toISOString()
        }]);

      if (error) {
        if (error.message?.includes('column "org_id" does not exist') || error.message?.includes('relation "public.leads"')) {
          throw new Error('DATABASE_NOT_INITIALIZED');
        }
        throw error;
      }
      return true;
    } catch (e: any) {
      if (e.message === 'DATABASE_NOT_INITIALIZED') throw e;
      console.error('Erro ao criar lead:', e.message);
      return false;
    }
  },

  async getLeads(): Promise<Lead[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const orgId = this.getOrgId();
    if (!orgId) return [];

    try {
      // Busca exclusivamente na tabela 'leads' com 'org_id'
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('org_id', orgId) 
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message?.includes('column "org_id" does not exist') || error.message?.includes('relation "public.leads"')) {
          throw new Error('DATABASE_NOT_INITIALIZED');
        }
        throw error;
      }

      return (data || []).map(item => ({
        id: String(item.id),
        phone: item.telefone || '',
        name: item.nomewpp || 'Lead Anônimo',
        status: this.mapAtendimentoToStatus(item.atendimento_ia),
        score: this.calculateMockScore(item.atendimento_ia),
        lastInteraction: item.last_interaction || item.created_at || new Date().toISOString(),
        aiSummary: 'Processando via Atumia SDR...',
        interest: 'Identificando interesse...',
        urgency: 'media'
      }));
    } catch (err: any) {
      if (err.message === 'DATABASE_NOT_INITIALIZED' || err.message?.includes('org_id') || err.message?.includes('leads')) {
        throw new Error('DATABASE_NOT_INITIALIZED');
      }
      console.error('Erro ao buscar leads:', err.message);
      return [];
    }
  },

  mapAtendimentoToStatus(atendimento: string): any {
    if (!atendimento) return 'frio';
    const lower = atendimento.toLowerCase();
    if (lower.includes('fechado') || lower.includes('ganho')) return 'fechado';
    if (lower.includes('agendado')) return 'agendado';
    if (lower.includes('qualificado')) return 'qualificado';
    if (lower.includes('andamento') || lower.includes('ia') || lower.includes('qualificando')) return 'qualificando';
    return 'frio';
  },

  calculateMockScore(atendimento: string): number {
    const status = this.mapAtendimentoToStatus(atendimento);
    if (status === 'fechado') return 100;
    if (status === 'agendado') return 95;
    if (status === 'qualificado') return 80;
    if (status === 'qualificando') return 50;
    return 20;
  },

  async getMetrics() {
    if (!isSupabaseConfigured || !supabase) {
      return { leads: 0, messages: 0, qualified: 0 };
    }
    const orgId = this.getOrgId();
    if (!orgId) return { leads: 0, messages: 0, qualified: 0 };

    try {
      const { count: leadsCount, error: e1 } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', orgId);

      const { count: messagesCount, error: e2 } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', orgId);

      if ((e1 || e2)?.message?.includes('org_id') || (e1 || e2)?.message?.includes('leads')) {
        throw new Error('DATABASE_NOT_INITIALIZED');
      }

      return {
        leads: leadsCount || 0,
        messages: messagesCount || 0,
        qualified: Math.floor((leadsCount || 0) * 0.35)
      };
    } catch (e: any) {
      if (e.message === 'DATABASE_NOT_INITIALIZED') throw e;
      return { leads: 0, messages: 0, qualified: 0 };
    }
  }
};
