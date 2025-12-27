
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  Files, 
  PhoneCall, 
  CheckCircle2, 
  Timer, 
  Flame, 
  HelpCircle, 
  Wrench
} from 'lucide-react';

export const COLORS = {
  titanium: '#141416',
  steel: '#808285',
  copper: '#B87333',
};

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'kanban', label: 'CRM Kanban', icon: <Users size={20} /> },
  { id: 'settings', label: 'Ajustes do SDR IA', icon: <Wrench size={20} /> },
  { id: 'analytics', label: 'Análise de Dados', icon: <BarChart3 size={20} /> },
  { id: 'docs', label: 'Meus Documentos', icon: <Files size={20} /> },
];

export const BOTTOM_MENU_ITEMS = [
  { id: 'config', label: 'Configurações', icon: <Settings size={20} /> },
  { id: 'support', label: 'Ajuda & Suporte', icon: <HelpCircle size={20} /> },
];

export const MOCK_LEADS: any[] = [
  {
    id: '1',
    name: 'Roberto Silva',
    phone: '+55 11 98888-7777',
    status: 'qualificando',
    score: 85,
    lastInteraction: '2023-11-25T14:30:00Z',
    aiSummary: 'Interessado em infraestrutura robusta. Demonstrou urgência alta por solução de escala.',
    interest: 'Consultoria Enterprise',
    urgency: 'alta'
  },
  {
    id: '2',
    name: 'Carla Menezes',
    phone: '+55 21 97777-6666',
    status: 'qualificado',
    score: 95,
    lastInteraction: '2023-11-25T16:45:00Z',
    aiSummary: 'Lead pronto para fechamento. Validou orçamento e tem autonomia de decisão.',
    interest: 'Atumia Core Pro',
    urgency: 'alta'
  },
  {
    id: '3',
    name: 'Joaquim Souza',
    phone: '+55 31 96666-5555',
    status: 'frio',
    score: 42,
    lastInteraction: '2023-11-24T09:00:00Z',
    aiSummary: 'Apenas sondando preços. Não apresentou dor clara no momento.',
    interest: 'Dúvidas Gerais',
    urgency: 'baixa'
  }
];
