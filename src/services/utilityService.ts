import { supabase } from '../lib/supabase';
import { UtilityBill, UtilityBillInsert, UtilityBillUpdate, UtilityType } from '../types';
import { format } from 'date-fns';

// ─── Listar contas por mês ────────────────────────────────────

export async function getUtilityBillsByMonth(
  month?: string,
  type?: UtilityType
): Promise<UtilityBill[]> {
  const ref = month ?? format(new Date(), 'yyyy-MM');
  let query = supabase
    .from('utility_bills')
    .select('*, properties(name, regions(name)), tenants(full_name, phone)')
    .eq('reference_month', ref)
    .order('due_date');

  if (type) query = query.eq('type', type);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ─── Listar contas de um imóvel ───────────────────────────────

export async function getUtilityBillsByProperty(
  propertyId: string,
  type?: UtilityType
): Promise<UtilityBill[]> {
  let query = supabase
    .from('utility_bills')
    .select('*')
    .eq('property_id', propertyId)
    .order('reference_month', { ascending: false });

  if (type) query = query.eq('type', type);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ─── Lançar conta de água ou luz ─────────────────────────────

export async function createUtilityBill(input: UtilityBillInsert): Promise<UtilityBill> {
  const { data, error } = await supabase
    .from('utility_bills')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Atualizar conta ──────────────────────────────────────────

export async function updateUtilityBill(
  id: string,
  input: UtilityBillUpdate
): Promise<UtilityBill> {
  const { data, error } = await supabase
    .from('utility_bills')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Marcar conta como paga ───────────────────────────────────

export async function markUtilityAsPaid(id: string): Promise<UtilityBill> {
  const { data, error } = await supabase
    .from('utility_bills')
    .update({
      status: 'paid',
      paid_date: format(new Date(), 'yyyy-MM-dd'),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Deletar conta ────────────────────────────────────────────

export async function deleteUtilityBill(id: string): Promise<void> {
  const { error } = await supabase.from('utility_bills').delete().eq('id', id);
  if (error) throw error;
}
