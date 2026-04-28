import { supabase } from '../lib/supabase';
import { Tenant, TenantInsert, TenantUpdate } from '../types';

// ─── Listar inquilinos ativos ─────────────────────────────────

export async function getTenants(status = 'active'): Promise<Tenant[]> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*, properties(name, region_id, regions(name))')
    .eq('status', status)
    .order('full_name');
  if (error) throw error;
  return data ?? [];
}

// ─── Buscar inquilino por ID ──────────────────────────────────

export async function getTenantById(id: string): Promise<Tenant | null> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*, properties(name, address, regions(name))')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// ─── Criar inquilino ──────────────────────────────────────────

export async function createTenant(input: TenantInsert): Promise<Tenant> {
  const { data, error } = await supabase
    .from('tenants')
    .insert(input)
    .select()
    .single();
  if (error) throw error;

  // Marcar imóvel como ocupado
  if (input.property_id) {
    await supabase
      .from('properties')
      .update({ status: 'occupied' })
      .eq('id', input.property_id);
  }

  return data;
}

// ─── Atualizar inquilino ──────────────────────────────────────

export async function updateTenant(id: string, input: TenantUpdate): Promise<Tenant> {
  const { data, error } = await supabase
    .from('tenants')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Desativar inquilino (saída) ──────────────────────────────

export async function deactivateTenant(id: string, propertyId: string): Promise<void> {
  const { error } = await supabase
    .from('tenants')
    .update({ status: 'inactive', property_id: null })
    .eq('id', id);
  if (error) throw error;

  // Liberar imóvel
  await supabase
    .from('properties')
    .update({ status: 'available' })
    .eq('id', propertyId);
}

// ─── Upload de avatar ─────────────────────────────────────────

export async function uploadTenantAvatar(
  tenantId: string,
  fileUri: string,
  fileName: string
): Promise<string> {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const path = `${tenantId}/${fileName}`;
  const { error } = await supabase.storage
    .from('tenant-avatars')
    .upload(path, blob, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from('tenant-avatars')
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function deleteTenant(id: string, propertyId?: string): Promise<void> {
  console.log('Deletando inquilino:', id);
  
  const { error } = await supabase.from('tenants').delete().eq('id', id);
  
  if (error) {
    console.log('Erro ao deletar:', error.message, error.code);
    throw error;
  }

  console.log('Inquilino deletado com sucesso!');

  if (propertyId) {
    const { error: propError } = await supabase
      .from('properties')
      .update({ status: 'available' })
      .eq('id', propertyId);
    
    if (propError) console.log('Erro ao atualizar imóvel:', propError.message);
  }
}