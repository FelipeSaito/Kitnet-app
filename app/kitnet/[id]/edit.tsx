import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { InputField, PrimaryButton } from '../../../components';
import { KITNETS } from '../../../data/mockData';
import { Colors, Spacing, Radius } from '../../../constants/theme';
import { KitnetStatus, Region } from '../../../types';

const REGIONS: Region[] = ['Campo Limpo', 'Mitsutani'];
const STATUSES: { value: KitnetStatus; label: string }[] = [
  { value: 'available',   label: 'Disponível' },
  { value: 'occupied',    label: 'Ocupada' },
  { value: 'maintenance', label: 'Manutenção' },
  { value: 'overdue',     label: 'Em atraso' },
];

function SelectChips<T extends string>({ label, options, value, onChange }: {
  label: string; options: { value: T; label: string }[];
  value: T; onChange: (v: T) => void;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.selectLabel}>{label}</Text>
      <View style={styles.chips}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, value === opt.value && styles.chipActive]}
            onPress={() => onChange(opt.value)}
          >
            <Text style={[styles.chipText, value === opt.value && styles.chipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function KitnetFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const existing = KITNETS.find(k => String(k.id) === id) ?? null;

  const [name,    setName]    = useState(existing?.name    ?? '');
  const [region,  setRegion]  = useState<Region>(existing?.region ?? 'Campo Limpo');
  const [address, setAddress] = useState(existing?.address ?? '');
  const [price,   setPrice]   = useState(existing?.price ? String(existing.price) : '');
  const [status,  setStatus]  = useState<KitnetStatus>(existing?.status ?? 'available');
  const [tenant,  setTenant]  = useState(existing?.tenant  ?? '');
  const [phone,   setPhone]   = useState(existing?.phone   ?? '');
  const [notes,   setNotes]   = useState(existing?.notes   ?? '');

  const handleSave = () => {
    if (!name || !address || !price) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios: nome, endereço e valor.');
      return;
    }
    Alert.alert('Salvo!', `${name} atualizada com sucesso.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.backBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.backLabel}>Editar Kitnet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
        <InputField label="Nome da Kitnet *" value={name} onChangeText={setName} placeholder="Ex: Kitnet 1" />

        <SelectChips
          label="Região *"
          options={REGIONS.map(r => ({ value: r, label: r }))}
          value={region}
          onChange={setRegion}
        />

        <InputField label="Endereço *" value={address} onChangeText={setAddress} placeholder="Rua, número, bairro" />

        <InputField
          label="Valor do Aluguel (R$) *"
          value={price}
          onChangeText={setPrice}
          placeholder="850"
          keyboardType="numeric"
        />

        <SelectChips
          label="Status *"
          options={STATUSES}
          value={status}
          onChange={setStatus}
        />

        <InputField label="Nome do Inquilino" value={tenant} onChangeText={setTenant} placeholder="Nome completo" />

        <InputField
          label="Telefone"
          value={phone}
          onChangeText={setPhone}
          placeholder="(11) 99999-9999"
          keyboardType="phone-pad"
        />

        <InputField
          label="Observações"
          value={notes}
          onChangeText={setNotes}
          placeholder="Notas sobre a kitnet..."
          multiline
        />

        <PrimaryButton label="💾 Salvar" onPress={handleSave} style={{ marginTop: 8 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  backBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingTop: 52, paddingBottom: 16, paddingHorizontal: Spacing.containerPadding,
  },
  backBtn: {
    width: 34, height: 34, backgroundColor: Colors.card,
    borderRadius: 10, borderWidth: 1, borderColor: Colors.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 20, color: Colors.text, marginTop: -2 },
  backLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: Colors.text2 },
  form: { padding: Spacing.containerPadding, paddingBottom: 40 },
  selectLabel: {
    fontFamily: 'Inter_700Bold', fontSize: 11,
    textTransform: 'uppercase', letterSpacing: 0.7,
    color: Colors.text3, marginBottom: 8,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: Radius.full, borderWidth: 1,
    borderColor: Colors.border2, paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: Colors.card,
  },
  chipActive: { backgroundColor: 'rgba(255,201,40,0.12)', borderColor: Colors.gold },
  chipText:   { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.text3 },
  chipTextActive: { color: Colors.gold },
});