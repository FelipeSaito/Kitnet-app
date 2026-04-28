import { Linking } from 'react-native';
import { supabase } from '../lib/supabase';

interface WhatsAppData {
  phone: string;
  tenantName: string;
  propertyName: string;
  amount: number;
  dueDate: string;
  pixKey?: string;
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ─── Cobrança de aluguel ──────────────────────────────────────

export async function sendRentReminder(data: WhatsAppData): Promise<void> {
  const { data: settings } = await supabase
    .from('app_settings')
    .select('whatsapp_msg_rent, pix_key')
    .single();

  const pix = data.pixKey ?? settings?.pix_key ?? '';

  const msg = (settings?.whatsapp_msg_rent ?? 
    'Olá {nome}, o aluguel de {imovel} no valor de {valor} vence em {vencimento}. Pix: {pix}')
    .replace('{nome}',       data.tenantName)
    .replace('{imovel}',     data.propertyName)
    .replace('{valor}',      formatCurrency(data.amount))
    .replace('{vencimento}', data.dueDate)
    .replace('{pix}',        pix);

  const url = `https://wa.me/55${cleanPhone(data.phone)}?text=${encodeURIComponent(msg)}`;
  await Linking.openURL(url);
}

// ─── Cobrança de água ─────────────────────────────────────────

export async function sendWaterBillMessage(data: WhatsAppData): Promise<void> {
  const { data: settings } = await supabase
    .from('app_settings')
    .select('whatsapp_msg_water')
    .single();

  const msg = (settings?.whatsapp_msg_water ??
    'Olá {nome}, a conta de água de {imovel} no valor de {valor} está disponível.')
    .replace('{nome}',   data.tenantName)
    .replace('{imovel}', data.propertyName)
    .replace('{valor}',  formatCurrency(data.amount));

  const url = `https://wa.me/55${cleanPhone(data.phone)}?text=${encodeURIComponent(msg)}`;
  await Linking.openURL(url);
}

// ─── Cobrança de luz ──────────────────────────────────────────

export async function sendEnergyBillMessage(data: WhatsAppData): Promise<void> {
  const { data: settings } = await supabase
    .from('app_settings')
    .select('whatsapp_msg_energy')
    .single();

  const msg = (settings?.whatsapp_msg_energy ??
    'Olá {nome}, a conta de luz de {imovel} no valor de {valor} está disponível.')
    .replace('{nome}',   data.tenantName)
    .replace('{imovel}', data.propertyName)
    .replace('{valor}',  formatCurrency(data.amount));

  const url = `https://wa.me/55${cleanPhone(data.phone)}?text=${encodeURIComponent(msg)}`;
  await Linking.openURL(url);
}

// ─── Contato direto ───────────────────────────────────────────

export async function openWhatsApp(phone: string, message?: string): Promise<void> {
  const msg = message ?? 'Olá, tudo bem?';
  const url = `https://wa.me/55${cleanPhone(phone)}?text=${encodeURIComponent(msg)}`;
  await Linking.openURL(url);
}
