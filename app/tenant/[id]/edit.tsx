import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, TextInput, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../src/lib/supabase';
import { updateTenant } from '../../../src/services/tenantsService';
import { Spacing } from '../../../constants/theme';

export default function EditTenantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();

  const [fetching,    setFetching]    = useState(true);
  const [loading,     setLoading]     = useState(false);
  const [properties,  setProperties]  = useState<{ id: string; name: string; region_name: string }[]>([]);
  const [selectedProp, setSelectedProp] = useState<{ id: string; name: string; region_name: string } | null>(null);
  const [showProps,   setShowProps]   = useState(false);

  const [name,    setName]    = useState('');
  const [cpf,     setCpf]     = useState('');
  const [phone,   setPhone]   = useState('');
  const [email,   setEmail]   = useState('');
  const [start,   setStart]   = useState('');
  const [deposit, setDeposit] = useState('');
  const [notes,   setNotes]   = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [{ data: tenant }, { data: props }] = await Promise.all([
          supabase.from('tenants').select('*').eq('id', id).single(),
          supabase.from('properties').select('id, name, regions(name)'),
        ]);

        if (tenant) {
          setName(tenant.full_name ?? '');
          setCpf(tenant.cpf ?? '');
          setPhone(tenant.phone ?? '');
          setEmail(tenant.email ?? '');
          setStart(tenant.contract_start ?? '');
          setDeposit(tenant.deposit_value ? String(tenant.deposit_value) : '');
          setNotes(tenant.notes ?? '');
        }

        if (props) {
          const mapped = props.map((p: any) => ({
            id: p.id,
            name: p.name,
            region_name: p.regions?.name ?? '—',
          }));
          setProperties(mapped);

          if (tenant?.property_id) {
            const found = mapped.find((p: any) => p.id === tenant.property_id);
            setSelectedProp(found ?? null);
          }
        }
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [id]);

  const handleSave = async () => {
    if (!name || !phone) {
      Alert.alert('Atenção', 'Nome e telefone são obrigatórios.');
      return;
    }
    try {
      setLoading(true);
      await updateTenant(id, {
        full_name:      name,
        cpf:            cpf || undefined,
        phone,
        email:          email || undefined,
        property_id:    selectedProp?.id || undefined,
        contract_start: start || undefined,
        deposit_value:  deposit ? Number(deposit) : undefined,
        notes:          notes || undefined,
      });
      router.canGoBack() ? router.back() : router.replace('/(tabs)/tenants' as any);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={s.center}>
        <ActivityIndicator color="#F5C518" size="large" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/tenants' as any)}>
          <Text style={s.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>Editar Inquilino</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.form}>

        <Text style={s.label}>Nome completo *</Text>
        <TextInput style={s.input} value={name} onChangeText={setName}
          placeholder="Nome do inquilino" placeholderTextColor="#444" />

        <Text style={s.label}>CPF</Text>
        <TextInput style={s.input} value={cpf} onChangeText={setCpf}
          placeholder="000.000.000-00" placeholderTextColor="#444"
          keyboardType="numeric" />

        <Text style={s.label}>Telefone *</Text>
        <TextInput style={s.input} value={phone} onChangeText={setPhone}
          placeholder="(11) 99999-9999" placeholderTextColor="#444"
          keyboardType="phone-pad" />

        <Text style={s.label}>Email</Text>
        <TextInput style={s.input} value={email} onChangeText={setEmail}
          placeholder="email@exemplo.com" placeholderTextColor="#444"
          keyboardType="email-address" autoCapitalize="none" />

        <Text style={s.label}>Imóvel vinculado</Text>
        <TouchableOpacity style={s.select} onPress={() => setShowProps(!showProps)}>
          <Text style={selectedProp ? s.selectText : s.selectPlaceholder}>
            {selectedProp ? `${selectedProp.name} · ${selectedProp.region_name}` : 'Selecionar imóvel...'}
          </Text>
          <Text style={s.selectArrow}>{showProps ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showProps && (
          <View style={s.dropdown}>
            <TouchableOpacity style={s.dropdownItem}
              onPress={() => { setSelectedProp(null); setShowProps(false); }}>
              <Text style={s.dropdownText}>Nenhum</Text>
            </TouchableOpacity>
            {properties.map(p => (
              <TouchableOpacity key={p.id} style={s.dropdownItem}
                onPress={() => { setSelectedProp(p); setShowProps(false); }}>
                <Text style={s.dropdownText}>{p.name} · {p.region_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={s.label}>Início do contrato</Text>
        <TextInput style={s.input} value={start} onChangeText={setStart}
          placeholder="2025-01-01" placeholderTextColor="#444" />

        <Text style={s.label}>Valor do depósito (R$)</Text>
        <TextInput style={s.input} value={deposit} onChangeText={setDeposit}
          placeholder="900" placeholderTextColor="#444" keyboardType="numeric" />

        <Text style={s.label}>Observações</Text>
        <TextInput style={[s.input, s.multiline]} value={notes} onChangeText={setNotes}
          placeholder="Notas sobre o inquilino..." placeholderTextColor="#444"
          multiline numberOfLines={3} />

        <TouchableOpacity
          style={[s.btn, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={s.btnText}>{loading ? 'Salvando...' : '💾  Salvar alterações'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#000' },
  center:           { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  header:           { paddingTop: 52, paddingHorizontal: Spacing.containerPadding, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn:          { width: 34, height: 34, backgroundColor: '#111', borderRadius: 10, borderWidth: 1, borderColor: '#222', alignItems: 'center', justifyContent: 'center' },
  backArrow:        { fontSize: 20, color: '#fff', marginTop: -2 },
  title:            { fontSize: 20, fontWeight: '700', color: '#fff' },
  form:             { padding: Spacing.containerPadding, paddingBottom: 40, gap: 8 },
  label:            { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7, color: '#555', marginTop: 8 },
  input:            { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 14, padding: 16, color: '#fff', fontSize: 15 },
  multiline:        { height: 96, textAlignVertical: 'top' },
  select:           { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectText:       { color: '#fff', fontSize: 15 },
  selectPlaceholder:{ color: '#444', fontSize: 15 },
  selectArrow:      { color: '#555', fontSize: 12 },
  dropdown:         { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  dropdownItem:     { padding: 14, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  dropdownText:     { color: '#fff', fontSize: 14, fontWeight: '600' },
  btn:              { backgroundColor: '#F5C518', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 16 },
  btnText:          { fontSize: 16, fontWeight: '800', color: '#000' },
});