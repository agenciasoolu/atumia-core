
// Fix: Import React to resolve the 'Cannot find namespace React' error
import React from 'react';

export type LeadStatus = 'frio' | 'qualificando' | 'qualificado' | 'agendado' | 'fechado';

export interface Lead {
  id: string;
  phone: string;
  name: string;
  status: LeadStatus;
  score: number;
  lastInteraction: string;
  aiSummary: string;
  interest: string;
  urgency: 'baixa' | 'media' | 'alta';
}

export interface ChatMessage {
  id: string;
  phone: string;
  role: 'user' | 'bot' | 'system';
  content: string;
  timestamp: string;
}

export interface Organization {
  id: string;
  name: string;
  whatsapp_number: string;
  created_at?: string;
}

export interface MetricCardData {
  label: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
}
