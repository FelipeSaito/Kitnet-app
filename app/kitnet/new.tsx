import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { createProperty } from '../../src/services/propertiesService';
import { supabase } from '../../src/lib/supabase';
import { Spacing } from '../../constants/theme';
import { Region } from '../../types';

type KitnetStatus = 'available' | 'occupied' | 'maintenance' | 'overdue';

export default function NewKitnetScreen() {
  const router = useRouter();
  const [loading,   setLoading]   = useState(false);
  const [regions,   setRegions]   = useState<{ id: string; name: string }[]>([]);
  const [regionId,  setRegionId]  = useState('');
  const [showRegions, setShowRegions] = useState(false);

  const [name,      setName]      = useState('');
  const [address,   setAddress]   = useState('');
  const [price,     setPrice]     = useState('');
  const [dueDay,    setDueDay]    = useState('10');
  const [area,      setArea]      = useState('');
  const [status,    setStatus]    = useState<KitnetStatus>('available');
  const [water,     setWater]     = useState<'included' | 'individual'>('included');
  const [energy,    setEnergy]    = useState<'included' | 'individual'>('individual');
  const [internet,  setInternet]  = useState(false);
  const [notes,     setNotes]     = useState('');

  useEffect(() => {
    supabase.from('regions').select('*').then(({ data }) => {
      if (data) setRegions(data);
      if (data?.[0]) setRegionId(data[0].id);
    });
  }, []);

  const STATUSES: { value: KitnetStatus; label: string }[] = [
    { value: 'available',   label: 'Disponível' },
    { value: 'occupied',    label: 'Ocupada' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'overdue',     label: 'Em atraso' },
  ];

  const handleSave = async () => {
  if (!name || !address || !price || !regionId) {
    Alert.alert('Atenção', 'Preencha nome, endereço, valor e região.');
    return;
  }
  try {
    setLoading(true);
    await createProperty({
      region_id:   regionId,
      name,
      address,
      type:        'Kitnet Studio',
      area_m2:     area ? Number(area) : undefined,
      rent_value:  Number(price),
      due_day:     Number(dueDay),
      status,
      water_type:  water,
      energy_type: energy,
      internet,
      notes: notes || undefined,
    });
    router.back();
  } catch (e: any) {
    Alert.alert('Erro', e.message);
  } finally {
    setLoading(false);
  }
};

  const selectedRegion = regions.find(r => r.id === regionId);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>Nova Kitnet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.form}>

        {/* Nome */}
        <Text style={s.label}>Nome da Kitnet *</Text>
        <TextInput style={s.input} value={name} onChangeText={setName}
          placeholder="Ex: Kitnet 9" placeholderTextColor="#444" />

        {/* Região */}
        <Text style={s.label}>Região *</Text>
        <TouchableOpacity style={s.select} onPress={() => setShowRegions(!showRegions)}>
          <Text style={s.selectText}>{selectedRegion?.name ?? 'Selecionar...'}</Text>
          <Text style={s.selectArrow}>{showRegions ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showRegions && (
          <View style={s.dropdown}>
            {regions.map(r => (
              <TouchableOpacity key={r.id} style={s.dropdownItem}
                onPress={() => { setRegionId(r.id); setShowRegions(false); }}>
                <Text style={s.dropdownText}>{r.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Endereço */}
        <Text style={s.label}>Endereço *</Text>
        <TextInput style={s.input} value={address} onChangeText={setAddress}
          placeholder="Rua, número, bairro" placeholderTextColor="#444" />

        {/* Valor */}
        <Text style={s.label}>Valor do aluguel (R$) *</Text>
        <TextInput style={s.input} value={price} onChangeText={setPrice}
          placeholder="850" placeholderTextColor="#444" keyboardType="numeric" />

        {/* Dia de vencimento */}
        <Text style={s.label}>Dia de vencimento</Text>
        <TextInput style={s.input} value={dueDay} onChangeText={setDueDay}
          placeholder="10" placeholderTextColor="#444" keyboardType="numeric" />

        {/* Área */}
        <Text style={s.label}>Área útil (m²)</Text>
        <TextInput style={s.input} value={area} onChangeText={setArea}
          placeholder="32" placeholderTextColor="#444" keyboardType="numeric" />

        {/* Status */}
        <Text style={s.label}>Status</Text>
        <View style={s.chips}>
          {STATUSES.map(st => (
            <TouchableOpacity
              key={st.value}
              style={[s.chip, status === st.value && s.chipActive]}
              onPress={() => setStatus(st.value)}
            >
              <Text style={[s.chipText, status === st.value && s.chipTextActive]}>
                {st.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Água */}
        <Text style={s.label}>Água</Text>
        <View style={s.chips}>
          {(['included', 'individual'] as const).map(v => (
            <TouchableOpacity key={v}
              style={[s.chip, water === v && s.chipActive]}
              onPress={() => setWater(v)}>
              <Text style={[s.chipText, water === v && s.chipTextActive]}>
                {v === 'included' ? 'Incluso' : 'Individual'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Energia */}
        <Text style={s.label}>Energia</Text>
        <View style={s.chips}>
          {(['included', 'individual'] as const).map(v => (
            <TouchableOpacity key={v}
              style={[s.chip, energy === v && s.chipActive]}
              onPress={() => setEnergy(v)}>
              <Text style={[s.chipText, energy === v && s.chipTextActive]}>
                {v === 'included' ? 'Incluso' : 'Individual'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Internet */}
        <Text style={s.label}>Internet</Text>
        <View style={s.chips}>
          <TouchableOpacity
            style={[s.chip, internet && s.chipActive]}
            onPress={() => setInternet(true)}>
            <Text style={[s.chipText, internet && s.chipTextActive]}>Disponível</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.chip, !internet && s.chipActive]}
            onPress={() => setInternet(false)}>
            <Text style={[s.chipText, !internet && s.chipTextActive]}>Não incluso</Text>
          </TouchableOpacity>
        </View>

        {/* Observações */}
        <Text style={s.label}>Observações</Text>
        <TextInput style={[s.input, s.multiline]} value={notes} onChangeText={setNotes}
          placeholder="Notas sobre a kitnet..." placeholderTextColor="#444"
          multiline numberOfLines={3} />

        {/* Botão */}
        <TouchableOpacity
          style={[s.btn, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={s.btnText}>{loading ? 'Salvando...' : '💾  Salvar kitnet'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#000' },
  header:          { paddingTop: 52, paddingHorizontal: Spacing.containerPadding, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn:         { width: 34, height: 34, backgroundColor: '#111', borderRadius: 10, borderWidth: 1, borderColor: '#222', alignItems: 'center', justifyContent: 'center' },
  backArrow:       { fontSize: 20, color: '#fff', marginTop: -2 },
  title:           { fontSize: 20, fontWeight: '700', color: '#fff' },
  form:            { padding: Spacing.containerPadding, paddingBottom: 40, gap: 8 },
  label:           { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7, color: '#555', marginTop: 8 },
  input:           { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 14, padding: 16, color: '#fff', fontSize: 15 },
  multiline:       { height: 96, textAlignVertical: 'top' },
  select:          { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectText:      { color: '#fff', fontSize: 15 },
  selectArrow:     { color: '#555', fontSize: 12 },
  dropdown:        { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  dropdownItem:    { padding: 14, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  dropdownText:    { color: '#fff', fontSize: 14, fontWeight: '600' },
  chips:           { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip:            { borderRadius: 999, borderWidth: 1, borderColor: '#222', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#111' },
  chipActive:      { backgroundColor: 'rgba(245,197,24,0.12)', borderColor: '#F5C518' },
  chipText:        { fontSize: 13, fontWeight: '600', color: '#555' },
  chipTextActive:  { color: '#F5C518' },
  btn:             { backgroundColor: '#F5C518', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 16 },
  btnText:         { fontSize: 16, fontWeight: '800', color: '#000' },
});