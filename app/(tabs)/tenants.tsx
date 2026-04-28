import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Image, Linking, Alert,
} from 'react-native';
import { KITNETS } from '../../data/mockData';
import { Colors, Spacing } from '../../constants/theme';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type PaymentStatus = 'paid' | 'overdue' | 'pending' | 'empty';

interface TenantCardProps {
  name: string;
  property: string;
  phone: string;
  status: PaymentStatus;
  avatar?: string;
  onPress: () => void;
  onWhatsApp: () => void;
}

// ─── Badge de status ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  paid:    { label: 'Pago',     bg: 'rgba(245,197,24,0.12)', color: '#F5C518' },
  overdue: { label: 'Atrasado', bg: 'rgba(180,20,20,0.18)',  color: '#ff6b6b' },
  pending: { label: 'Pendente', bg: 'rgba(80,80,80,0.3)',    color: '#aaaaaa' },
  empty:   { label: '—',        bg: 'rgba(80,80,80,0.2)',    color: '#666666' },
};

const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.empty;
  return (
    <View style={[badge.wrap, { backgroundColor: cfg.bg }]}>
      <Text style={[badge.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
};

const badge = StyleSheet.create({
  wrap: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  text: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});

// ─── Iniciais do avatar ───────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

const INITIAL_COLORS: Record<PaymentStatus, string> = {
  paid:    '#F5C518',
  overdue: '#ff6b6b',
  pending: '#aaaaaa',
  empty:   '#555555',
};

// ─── Card do inquilino ────────────────────────────────────────────────────────

const TenantCard: React.FC<TenantCardProps> = ({
  name, property, phone, status, avatar, onPress, onWhatsApp,
}) => (
  <TouchableOpacity style={card.wrap} onPress={onPress} activeOpacity={0.8}>
    {/* Avatar */}
    {avatar ? (
      <Image source={{ uri: avatar }} style={card.avatar} />
    ) : (
      <View style={[card.avatar, card.avatarFallback]}>
        <Text style={[card.initials, { color: INITIAL_COLORS[status] ?? '#F5C518' }]}>
          {getInitials(name)}
        </Text>
      </View>
    )}

    {/* Info */}
    <View style={card.info}>
      <Text style={card.name} numberOfLines={1}>{name}</Text>
      <View style={card.row}>
        <Text style={card.propIcon}>🏠</Text>
        <Text style={card.prop} numberOfLines={1}>{property}</Text>
      </View>
      <TouchableOpacity style={card.row} onPress={onWhatsApp}>
        <Text style={card.propIcon}>📞</Text>
        <Text style={card.phone}>{phone}</Text>
      </TouchableOpacity>
    </View>

    {/* Right */}
    <View style={card.right}>
      <StatusBadge status={status} />
      <Text style={card.chevron}>›</Text>
    </View>
  </TouchableOpacity>
);

const card = StyleSheet.create({
  wrap:         { backgroundColor: '#111', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar:       { width: 52, height: 52, borderRadius: 26, flexShrink: 0 },
  avatarFallback:{ backgroundColor: '#1c1c1c', borderWidth: 1.5, borderColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
  initials:     { fontSize: 18, fontWeight: '700' },
  info:         { flex: 1, minWidth: 0 },
  name:         { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 4 },
  row:          { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  propIcon:     { fontSize: 11 },
  prop:         { fontSize: 12, color: '#555', flex: 1 },
  phone:        { fontSize: 12, color: '#444' },
  right:        { flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 },
  chevron:      { fontSize: 18, color: '#333' },
});

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function TenantsScreen() {
  const [search, setSearch] = useState('');

  const tenants = useMemo(() =>
    KITNETS.filter(k => k.tenant).filter(k =>
      k.tenant!.toLowerCase().includes(search.toLowerCase()) ||
      k.name.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const openWhatsApp = (phone: string, name: string) => {
    const clean = phone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá ${name}, tudo bem? Gostaria de falar sobre o aluguel.`);
    Linking.openURL(`https://wa.me/55${clean}?text=${msg}`).catch(() =>
      Alert.alert('Erro', 'WhatsApp não encontrado.')
    );
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.brand}>Casas</Text>
        <View style={s.menuIcon}>
          <View style={s.menuLine} />
          <View style={s.menuLine} />
          <View style={s.menuLine} />
        </View>
      </View>

      {/* Title */}
      <Text style={s.title}>Inquilinos</Text>
      <Text style={s.subtitle}>{tenants.length} inquilinos cadastrados</Text>

      {/* Search */}
      <View style={s.searchBox}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Procurar inquilinos ou propriedades..."
          placeholderTextColor="#444"
        />
      </View>

      {/* Section label */}
      <Text style={s.sectionLabel}>Todos os inquilinos</Text>

      {/* List */}
      <FlatList
        data={tenants}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TenantCard
            name={item.tenant!}
            property={`${item.name} · ${item.region}`}
            phone={item.phone ?? '—'}
            status={(item.paymentStatus as PaymentStatus) ?? 'empty'}
            avatar={item.avatar}
            onPress={() => {}}
            onWhatsApp={() => openWhatsApp(item.phone ?? '', item.tenant ?? '')}
          />
        )}
        contentContainerStyle={s.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={s.empty}>Nenhum inquilino encontrado.</Text>
        }
      />
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#000' },
  header:      { paddingTop: 52, paddingHorizontal: Spacing.containerPadding, paddingBottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand:       { fontSize: 22, fontWeight: '700', color: '#F5C518' },
  menuIcon:    { gap: 5 },
  menuLine:    { width: 22, height: 2, backgroundColor: '#F5C518', borderRadius: 2 },
  title:       { fontSize: 32, fontWeight: '800', color: '#fff', paddingHorizontal: Spacing.containerPadding, paddingTop: 20, paddingBottom: 4, letterSpacing: -0.5 },
  subtitle:    { fontSize: 13, color: '#555', paddingHorizontal: Spacing.containerPadding, marginBottom: 20 },
  searchBox:   { marginHorizontal: Spacing.containerPadding, backgroundColor: '#151515', borderWidth: 1, borderColor: '#222', borderRadius: 18, height: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, marginBottom: 24 },
  searchIcon:  { fontSize: 15 },
  searchInput: { flex: 1, fontWeight: '400', fontSize: 15, color: '#888' },
  sectionLabel:{ fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#333', paddingHorizontal: Spacing.containerPadding, marginBottom: 14 },
  list:        { paddingHorizontal: Spacing.containerPadding, paddingBottom: 32 },
  empty:       { textAlign: 'center', color: '#444', fontSize: 15, paddingTop: 40 },
});