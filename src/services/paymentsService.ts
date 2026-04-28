import { supabase } from '../lib/supabase';
import { Payment, PaymentInsert, PaymentUpdate, FinancialSummary } from '../types';
import { format } from 'date-fns';

// ─── Mês atual formatado ──────────────────────────────────────

export function currentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

// ─── Listar pagamentos por mês ────────────────────────────────

export async function getPaymentsByMonth(month?: string): Promise<Payment[]> {
  const ref = month ?? currentMonth();
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      properties (
        name,
        regions ( name )
      ),
      tenants ( full_name, phone )
    `)
    .eq('reference_month', ref)
    .order('due_date');
  if (error) throw error;
  return data ?? [];
}

// ─── Listar pagamentos de um imóvel ──────────────────────────

export async function getPaymentsByProperty(propertyId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('property_id', propertyId)
    .order('reference_month', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ─── Criar cobrança de aluguel ────────────────────────────────

export async function createPayment(input: PaymentInsert): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Gerar cobranças do mês para todos os imóveis ocupados ───

export async function generateMonthlyPayments(month?: string): Promise<void> {
  const ref = month ?? currentMonth();
  const [year, mon] = ref.split('-').map(Number);

  // Busca imóveis ocupados com inquilino ativo
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, rent_value, due_day, tenants!inner(id)')
    .in('status', ['occupied', 'overdue']);

  if (error) throw error;

  for (const prop of properties ?? []) {
    const dueDate = new Date(year, mon - 1, prop.due_day);
    const tenant = (prop as any).tenants?.[0];

    // Evita duplicata
    const { data: existing } = await supabase
      .from('payments')
      .select('id')
      .eq('property_id', prop.id)
      .eq('reference_month', ref)
      .single();

    if (!existing) {
      await supabase.from('payments').insert({
        property_id: prop.id,
        tenant_id: tenant?.id,
        reference_month: ref,
        amount: prop.rent_value,
        due_date: format(dueDate, 'yyyy-MM-dd'),
        status: 'pending',
      });
    }
  }
}

// ─── Marcar como pago ─────────────────────────────────────────

export async function markAsPaid(
  id: string,
  paidAmount?: number,
  paymentMethod = 'pix'
): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .update({
      status: 'paid',
      paid_date: format(new Date(), 'yyyy-MM-dd'),
      paid_amount: paidAmount,
      payment_method: paymentMethod,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Marcar como atrasado ─────────────────────────────────────

export async function markAsOverdue(id: string): Promise<void> {
  const { error } = await supabase
    .from('payments')
    .update({ status: 'overdue' })
    .eq('id', id);
  if (error) throw error;
}

// ─── Atualizar pagamento ──────────────────────────────────────

export async function updatePayment(id: string, input: PaymentUpdate): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Resumo financeiro ────────────────────────────────────────

export async function getFinancialSummary(month?: string): Promise<FinancialSummary | null> {
  const ref = month ?? currentMonth();
  const { data, error } = await supabase
    .from('v_financial_summary')
    .select('*')
    .eq('reference_month', ref)
    .single();
  if (error) return null;
  return data;
}
