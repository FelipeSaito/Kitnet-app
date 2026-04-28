import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, TextInput, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { createUtilityBill } from '../../src/services/utilityService';
import { Spacing } from '../../constants/theme';
import { format } from 'date-fns';

type UtilityType = 'water' | 'energy';

export default function NewUtilityScreen() {
  const router  = useRouter();
  const [loading,    setLoading]    = useState(false);
  const [fetching,   setFetching]   = useState(true);
  const [properties, setProperties] = useState<{ id: string; name: string; region: string; tenant: string }[]>([]);
  const [selectedProp, setSelectedProp] = useState<{ id: string; name: string; region: string; tenant: string } | null>(null);
  const [showProps,  setShowProps]  = useState(false);

  const [type,      setType]      = useState<UtilityType>('water');
  const [amount,    setAmount]    = useState('');
  const [dueDate,   setDueDate]   = useState('');
  const [readStart, setReadStart] = useState('');
  const [readEnd,   setReadEnd]   = useState('');
  const [notes,     setNotes]     = useState('');

  const currentMonth = format(new Date(), 'yyyy-MM');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('properties')
          .select('id, name, regions(name), tenants(full_name)')
          .eq('status', 'occupied');

        if (data) {
          setProperties(data.map((p: any) => ({
            id: p.id,
            name: p.name,
            region: p.regions?.name ?? '—',
            tenant: p.tenants?.[0]?.full_name ?? 'Sem inquilino',
          })));
        }
      } finally {
        setFetching(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!selectedProp || !amount || !dueDate) {
      Alert.alert('Atenção', 'Preencha imóvel, valor e data de vencimento.');
      return;
    }
    try {
      setLoading(true);
      await createUtilityBill({
        property_id:     selectedProp.id,
        type,
        reference_month: currentMonth,
        amount:          Number(amount),
        due_date:        dueDate,
        status:          'pending',
        reading_start:   readStart ? Number(readStart) : undefined,
        reading_end:     readEnd   ? Number(readEnd)   : undefined,
        notes:           notes || undefined,
      });
      router.canGoBack() ? router.back() : router.replace('/(tabs)' as any);
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
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)' as any)}>
          <Text style={s.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>Lançar Conta</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.form}>

        {/* Tipo */}
        <Text style={s.label}>Tipo de conta</Text>
        <View style={s.chips}>
          <TouchableOpacity
            style={[s.chip, s.chipWater, type === 'water' && s.chipWaterActive]}
            onPress={() => setType('water')}
          >
            <Text style={[s.chipText, type === 'water' && { color: '#60a5fa' }]}>🚿 Água</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.chip, s.chipEnergy, type === 'energy' && s.chipEnergyActive]}
            onPress={() => setType('energy')}
          >
            <Text style={[s.chipText, type === 'energy' && { color: '#F5C518' }]}>⚡ Energia</Text>
          </TouchableOpacity>
        </View>

        {/* Imóvel */}
        <Text style={s.label}>Imóvel *</Text>
        <TouchableOpacity style={s.select} onPress={() => setShowProps(!showProps)}>
          <Text style={selectedProp ? s.selectText : s.selectPlaceholder}>
            {selectedProp
              ? `${selectedProp.name} · ${selectedProp.region}`
              : 'Selecionar imóvel...'}
          </Text>
          <Text style={s.selectArrow}>{showProps ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showProps && (
          <View style={s.dropdown}>
            {properties.map(p => (
              <TouchableOpacity key={p.id} style={s.dropdownItem}
                onPress={() => { setSelectedProp(p); setShowProps(false); }}>
                <Text style={s.dropdownText}>{p.name} · {p.region}</Text>
                <Text style={s.dropdownSub}>👤 {p.tenant}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Inquilino selecionado */}
        {selectedProp && (
          <View style={s.tenantInfo}>
            <Text style={s.tenantInfoText}>👤 {selectedProp.tenant}</Text>
          </View>
        )}

        {/* Valor */}
        <Text style={s.label}>Valor (R$) *</Text>
        <TextInput style={s.input} value={amount} onChangeText={setAmount}
          placeholder="Ex: 45.80" placeholderTextColor="#444" keyboardType="numeric" />

        {/* Vencimento */}
        <Text style={s.label}>Data de vencimento *</Text>
        <TextInput style={s.input} value={dueDate} onChangeText={setDueDate}
          placeholder="2026-05-10" placeholderTextColor="#444" />

        {/* Leituras (só para energia) */}
        {type === 'energy' && (
          <>
            <Text style={s.label}>Leitura anterior (kWh)</Text>
            <TextInput style={s.input} value={readStart} onChangeText={setReadStart}
              placeholder="1200" placeholderTextColor="#444" keyboardType="numeric" />

            <Text style={s.label}>Leitura atual (kWh)</Text>
            <TextInput style={s.input} value={readEnd} onChangeText={setReadEnd}
              placeholder="1350" placeholderTextColor="#444" keyboardType="numeric" />
          </>
        )}

        {/* Leituras (só para água) */}
        {type === 'water' && (
          <>
            <Text style={s.label}>Leitura anterior (m³)</Text>
            <TextInput style={s.input} value={readStart} onChangeText={setReadStart}
              placeholder="120" placeholderTextColor="#444" keyboardType="numeric" />

            <Text style={s.label}>Leitura atual (m³)</Text>
            <TextInput style={s.input} value={readEnd} onChangeText={setReadEnd}
              placeholder="135" placeholderTextColor="#444" keyboardType="numeric" />
          </>
        )}

        {/* Observações */}
        <Text style={s.label}>Observações</Text>
        <TextInput style={[s.input, s.multiline]} value={notes} onChangeText={setNotes}
          placeholder="Notas sobre a conta..." placeholderTextColor="#444"
          multiline numberOfLines={3} />

        {/* Resumo */}
        {selectedProp && amount && (
          <View style={s.summary}>
            <Text style={s.summaryTitle}>Resumo do lançamento</Text>
            <Text style={s.summaryLine}>
              {type === 'water' ? '🚿 Água' : '⚡ Energia'} — {selectedProp.name}
            </Text>
            <Text style={s.summaryLine}>
              Inquilino: {selectedProp.tenant}
            </Text>
            <Text style={s.summaryAmount}>
              R$ {Number(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[s.btn, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={s.btnText}>
            {loading ? 'Lançando...' : `${type === 'water' ? '🚿' : '⚡'} Lançar conta`}
          </Text>
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
  multiline:        { height: 80, textAlignVertical: 'top' },
  chips:            { flexDirection: 'row', gap: 10, marginTop: 4 },
  chip:             { flex: 1, borderRadius: 14, borderWidth: 1, borderColor: '#222', padding: 14, alignItems: 'center', backgroundColor: '#111' },
  chipText:         { fontSize: 15, fontWeight: '700', color: '#555' },
  chipWater:        { borderColor: '#222' },
  chipWaterActive:  { backgroundColor: 'rgba(96,165,250,0.1)', borderColor: '#60a5fa' },
  chipEnergy:       { borderColor: '#222' },
  chipEnergyActive: { backgroundColor: 'rgba(245,197,24,0.1)', borderColor: '#F5C518' },
  select:           { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectText:       { color: '#fff', fontSize: 15 },
  selectPlaceholder:{ color: '#444', fontSize: 15 },
  selectArrow:      { color: '#555', fontSize: 12 },
  dropdown:         { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  dropdownItem:     { padding: 14, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  dropdownText:     { color: '#fff', fontSize: 14, fontWeight: '600' },
  dropdownSub:      { color: '#555', fontSize: 12, marginTop: 3 },
  tenantInfo:       { backgroundColor: '#111', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1e1e1e' },
  tenantInfoText:   { color: '#888', fontSize: 13 },
  summary:          { backgroundColor: '#111', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e1e1e', marginTop: 8 },
  summaryTitle:     { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#444', marginBottom: 10 },
  summaryLine:      { fontSize: 13, color: '#888', marginBottom: 4 },
  summaryAmount:    { fontSize: 24, fontWeight: '800', color: '#F5C518', marginTop: 8 },
  btn:              { backgroundColor: '#F5C518', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 16 },
  btnText:          { fontSize: 16, fontWeight: '800', color: '#000' },
});