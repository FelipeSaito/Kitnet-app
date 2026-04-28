import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, TextInput, ActivityIndicator, Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { updateProperty, uploadPropertyImage, deleteProperty } from '../../../src/services/propertiesService';
import { supabase } from '../../../src/lib/supabase';
import { Spacing } from '../../../constants/theme';

type KitnetStatus = 'available' | 'occupied' | 'maintenance' | 'overdue';

export default function EditKitnetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();

  const [loading,     setLoading]     = useState(false);
  const [fetching,    setFetching]    = useState(true);
  const [regions,     setRegions]     = useState<{ id: string; name: string }[]>([]);
  const [regionId,    setRegionId]    = useState('');
  const [showRegions, setShowRegions] = useState(false);
  const [imageUri,    setImageUri]    = useState<string | null>(null);
  const [imageUrl,    setImageUrl]    = useState<string | null>(null);
  const [name,        setName]        = useState('');
  const [address,     setAddress]     = useState('');
  const [price,       setPrice]       = useState('');
  const [dueDay,      setDueDay]      = useState('10');
  const [area,        setArea]        = useState('');
  const [status,      setStatus]      = useState<KitnetStatus>('available');
  const [water,       setWater]       = useState<'included' | 'individual'>('included');
  const [energy,      setEnergy]      = useState<'included' | 'individual'>('individual');
  const [internet,    setInternet]    = useState(false);
  const [notes,       setNotes]       = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [{ data: regs }, { data: prop }] = await Promise.all([
          supabase.from('regions').select('*'),
          supabase.from('properties').select('*').eq('id', id).single(),
        ]);
        if (regs) setRegions(regs);
        if (prop) {
          setName(prop.name ?? '');
          setAddress(prop.address ?? '');
          setPrice(String(prop.rent_value ?? ''));
          setDueDay(String(prop.due_day ?? 10));
          setArea(prop.area_m2 ? String(prop.area_m2) : '');
          setStatus(prop.status ?? 'available');
          setWater(prop.water_type ?? 'included');
          setEnergy(prop.energy_type ?? 'individual');
          setInternet(prop.internet ?? false);
          setNotes(prop.notes ?? '');
          setRegionId(prop.region_id ?? '');
          setImageUrl(prop.image_url ?? null);
        }
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [id]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const STATUSES: { value: KitnetStatus; label: string }[] = [
    { value: 'available',   label: 'Disponível' },
    { value: 'occupied',    label: 'Ocupada' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'overdue',     label: 'Em atraso' },
  ];

  const handleDelete = async () => {
    const confirmed = window.confirm(`Tem certeza que deseja excluir ${name}? Esta ação não pode ser desfeita.`);
    if (!confirmed) return;
    try {
      await deleteProperty(id);
      router.canGoBack() ? router.back() : router.replace('/(tabs)' as any);
    } catch (e: any) {
      window.alert('Erro ao excluir: ' + e.message);
    }
  };

  const handleSave = async () => {
    if (!name || !address || !price) {
      Alert.alert('Atenção', 'Preencha nome, endereço e valor.');
      return;
    }
    try {
      setLoading(true);
      let finalImageUrl = imageUrl;
      if (imageUri) {
        const fileName = `photo_${Date.now()}.jpg`;
        finalImageUrl = await uploadPropertyImage(id, imageUri, fileName);
      }
      await updateProperty(id, {
        region_id:   regionId,
        name,
        address,
        area_m2:     area ? Number(area) : undefined,
        rent_value:  Number(price),
        due_day:     Number(dueDay),
        status,
        water_type:  water,
        energy_type: energy,
        internet,
        image_url:   finalImageUrl ?? undefined,
        notes:       notes || undefined,
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

  const selectedRegion = regions.find(r => r.id === regionId);
  const previewImage = imageUri ?? imageUrl;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)' as any)}>
          <Text style={s.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>Editar Kitnet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.form}>

        <Text style={s.label}>Foto da Kitnet</Text>
        <TouchableOpacity style={s.photoBox} onPress={pickImage}>
          {previewImage ? (
            <Image source={{ uri: previewImage }} style={s.photoPreview} resizeMode="cover" />
          ) : (
            <View style={s.photoPlaceholder}>
              <Text style={s.photoIcon}>📷</Text>
              <Text style={s.photoText}>Toque para adicionar foto</Text>
            </View>
          )}
        </TouchableOpacity>
        {previewImage && (
          <TouchableOpacity onPress={pickImage} style={s.changePhoto}>
            <Text style={s.changePhotoText}>📷 Trocar foto</Text>
          </TouchableOpacity>
        )}

        <Text style={s.label}>Nome da Kitnet *</Text>
        <TextInput style={s.input} value={name} onChangeText={setName}
          placeholder="Ex: Kitnet 1" placeholderTextColor="#444" />

        <Text style={s.label}>Região</Text>
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

        <Text style={s.label}>Endereço *</Text>
        <TextInput style={s.input} value={address} onChangeText={setAddress}
          placeholder="Rua, número, bairro" placeholderTextColor="#444" />

        <Text style={s.label}>Valor do aluguel (R$) *</Text>
        <TextInput style={s.input} value={price} onChangeText={setPrice}
          placeholder="850" placeholderTextColor="#444" keyboardType="numeric" />

        <Text style={s.label}>Dia de vencimento</Text>
        <TextInput style={s.input} value={dueDay} onChangeText={setDueDay}
          placeholder="10" placeholderTextColor="#444" keyboardType="numeric" />

        <Text style={s.label}>Área útil (m²)</Text>
        <TextInput style={s.input} value={area} onChangeText={setArea}
          placeholder="32" placeholderTextColor="#444" keyboardType="numeric" />

        <Text style={s.label}>Status</Text>
        <View style={s.chips}>
          {STATUSES.map(st => (
            <TouchableOpacity key={st.value}
              style={[s.chip, status === st.value && s.chipActive]}
              onPress={() => setStatus(st.value)}>
              <Text style={[s.chipText, status === st.value && s.chipTextActive]}>
                {st.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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

        <Text style={s.label}>Observações</Text>
        <TextInput style={[s.input, s.multiline]} value={notes} onChangeText={setNotes}
          placeholder="Notas sobre a kitnet..." placeholderTextColor="#444"
          multiline numberOfLines={3} />

        <TouchableOpacity
          style={[s.btn, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={s.btnText}>
            {loading ? 'Salvando...' : '💾  Salvar alterações'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnDelete} onPress={handleDelete}>
          <Text style={s.btnDeleteText}>🗑️  Excluir esta kitnet</Text>
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
  photoBox:         { borderRadius: 16, overflow: 'hidden', height: 180, backgroundColor: '#111', borderWidth: 1, borderColor: '#222' },
  photoPreview:     { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  photoIcon:        { fontSize: 36 },
  photoText:        { fontSize: 14, color: '#555', fontWeight: '500' },
  changePhoto:      { alignItems: 'center', paddingVertical: 8 },
  changePhotoText:  { fontSize: 13, color: '#F5C518', fontWeight: '600' },
  select:           { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectText:       { color: '#fff', fontSize: 15 },
  selectArrow:      { color: '#555', fontSize: 12 },
  dropdown:         { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  dropdownItem:     { padding: 14, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  dropdownText:     { color: '#fff', fontSize: 14, fontWeight: '600' },
  chips:            { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip:             { borderRadius: 999, borderWidth: 1, borderColor: '#222', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#111' },
  chipActive:       { backgroundColor: 'rgba(245,197,24,0.12)', borderColor: '#F5C518' },
  chipText:         { fontSize: 13, fontWeight: '600', color: '#555' },
  chipTextActive:   { color: '#F5C518' },
  btn:              { backgroundColor: '#F5C518', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 16 },
  btnText:          { fontSize: 16, fontWeight: '800', color: '#000' },
  btnDelete:        { backgroundColor: 'rgba(229,57,53,0.1)', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: 'rgba(229,57,53,0.3)' },
  btnDeleteText:    { fontSize: 15, fontWeight: '700', color: '#E53935' },
});