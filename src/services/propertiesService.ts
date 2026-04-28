import { supabase } from '../lib/supabase';
import { Property, PropertyInsert, PropertyUpdate, PropertyFull } from '../types';

// ─── Listar todos os imóveis (view completa) ──────────────────

export async function getProperties(regionName?: string): Promise<PropertyFull[]> {
  let query = supabase
    .from('v_properties_full')
    .select('*')
    .order('name');

  if (regionName) {
    query = query.eq('region_name', regionName);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ─── Buscar imóvel por ID ─────────────────────────────────────

export async function getPropertyById(id: string): Promise<PropertyFull | null> {
  const { data, error } = await supabase
    .from('v_properties_full')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// ─── Criar imóvel ─────────────────────────────────────────────

export async function createProperty(input: PropertyInsert): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Atualizar imóvel ─────────────────────────────────────────

export async function updateProperty(id: string, input: PropertyUpdate): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Deletar imóvel ───────────────────────────────────────────

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw error;
}

// ─── Upload de foto do imóvel ─────────────────────────────────

export async function uploadPropertyImage(
  propertyId: string,
  fileUri: string,
  fileName: string
): Promise<string> {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const path = `${propertyId}/${fileName}`;
  const { error } = await supabase.storage
    .from('property-images')
    .upload(path, blob, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from('property-images')
    .getPublicUrl(path);

  return data.publicUrl;
}
