import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Image, Linking, Alert, ActivityIndicator,
} from 'react-native';
import { useTenants } from '../../src/hooks';
import { Spacing } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { deleteTenant } from '../../src/services/tenantsService';
import { QuickMenu } from '../../components/QuickMenu';

type PaymentStatus = 'paid' | 'overdue' | 'pending' | 'empty';

const STATUS_CONFIG = {
  paid:    { label: 'Pago',     bg: 'rgba(245,197,24,0.12)', color: '#F5C518' },
  overdue: { label: 'Atrasado', bg: 'rgba(180,20,20,0.18)',  color: '#ff6b6b' },
  pending: { label: 'Pendente', bg: 'rgba(80,80,80,0.3)',    color: '#aaaaaa' },
  empty:   { label: '—',        bg: 'rgba(80,80,80,0.2)',    color: '#666666' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status as PaymentStatus] ?? STATUS_CONFIG.empty;
  return (
    <View style={[b.wrap, { backgroundColor: cfg.bg }]}>
      <Text style={[b.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
};

const b = StyleSheet.create({
  wrap: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  text: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

export default function TenantsScreen() {
  const router = useRouter();
  const [search,   setSearch]   = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: tenants, loading, refetch } = useTenants();

  const filtered = useMemo(() =>
    tenants.filter(t =>
      t.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (t as any).properties?.name?.toLowerCase().includes(search.toLowerCase())
    ), [tenants, search]);

  const openWhatsApp = (phone: string, name: string) => {
    const clean = phone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá ${name}, tudo bem? Gostaria de falar sobre o aluguel.`);
    Linking.openURL(`https://wa.me/55${clean}?text=${msg}`).catch(() =>
      Alert.alert('Erro', 'WhatsApp não encontrado.')
    );
  };

  const handleDelete = async (id: string, propertyId: string | undefined, name: string) => {
    const confirmed = window.confirm(`Tem certeza que deseja excluir ${name}? O imóvel voltará a ficar disponível.`);
    if (!confirmed) return;
    try {
      await deleteTenant(id, propertyId);
      refetch();
    } catch (e: any) {
      window.alert('Erro ao excluir: ' + e.message);
    }
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color="#F5C518" size="large" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.brand}>Casas</Text>
        <View style={s.headerRight}>
          <TouchableOpacity
            style={s.addBtn}
            onPress={() => router.push('/tenant/new' as any)}
          >
            <Text style={s.addBtnText}>+ Novo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.menuIcon} onPress={() => setMenuOpen(true)}>
            <View style={s.menuLine} />
            <View style={s.menuLine} />
            <View style={s.menuLine} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={s.title}>Inquilinos</Text>
      <Text style={s.subtitle}>{filtered.length} inquilinos cadastrados</Text>

      <View style={s.searchBox}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Procurar inquilinos..."
          placeholderTextColor="#444"
        />
      </View>

      <Text style={s.sectionLabel}>Todos os inquilinos</Text>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        onRefresh={refetch}
        refreshing={loading}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <Text style={s.empty}>Nenhum inquilino encontrado.</Text>
        }
        renderItem={({ item }) => {
          const prop      = (item as any).properties;
          const propName  = prop?.name ?? '—';
          const region    = prop?.regions?.name ?? '—';
          const payStatus = (item as any).payment_status ?? 'empty';

          return (
            <View style={card.wrap}>
              {/* Avatar */}
              {item.avatar_url ? (
                <Image source={{ uri: item.avatar_url }} style={card.avatar} />
              ) : (
                <View style={[card.avatar, card.avatarFallback]}>
                  <Text style={card.initials}>{getInitials(item.full_name)}</Text>
                </View>
              )}

              {/* Info */}
              <View style={card.info}>
                <Text style={card.name} numberOfLines={1}>{item.full_name}</Text>
                <View style={card.row}>
                  <Text style={card.propIcon}>🏠</Text>
                  <Text style={card.prop} numberOfLines={1}>{propName} · {region}</Text>
                </View>
                <TouchableOpacity
                  style={card.row}
                  onPress={() => openWhatsApp(item.phone, item.full_name)}
                >
                  <Text style={card.propIcon}>📞</Text>
                  <Text style={card.phone}>{item.phone}</Text>
                </TouchableOpacity>
              </View>

              {/* Right — botões de ação */}
              <View style={card.right}>
                <StatusBadge status={payStatus} />
                <View style={card.actions}>
                  <TouchableOpacity
                    style={card.waBtn}
                    onPress={() => openWhatsApp(item.phone, item.full_name)}
                  >
                    <Text style={card.waTxt}>💬 WhatsApp</Text>
                  </TouchableOpacity>
                  <View style={card.actionRow}>
                    <TouchableOpacity
                      style={card.editBtn}
                      onPress={() => router.push(`/tenant/${item.id}/edit` as any)}
                    >
                      <Text style={card.editTxt}>✏️ Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={card.delBtn}
                      onPress={() => handleDelete(item.id, item.property_id ?? undefined, item.full_name)}
                    >
                      <Text style={card.delTxt}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />

      <QuickMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const card = StyleSheet.create({
  wrap:          { backgroundColor: '#111', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar:        { width: 52, height: 52, borderRadius: 26, flexShrink: 0 },
  avatarFallback:{ backgroundColor: '#1c1c1c', borderWidth: 1.5, borderColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
  initials:      { fontSize: 18, fontWeight: '700', color: '#F5C518' },
  info:          { flex: 1, minWidth: 0 },
  name:          { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 4 },
  row:           { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  propIcon:      { fontSize: 11 },
  prop:          { fontSize: 12, color: '#555', flex: 1 },
  phone:         { fontSize: 12, color: '#444' },
  right:         { alignItems: 'flex-end', gap: 8, flexShrink: 0 },
  actions:       { alignItems: 'flex-end', gap: 6 },
  actionRow:     { flexDirection: 'row', gap: 6 },
  waBtn:         { backgroundColor: '#25D366', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  waTxt:         { fontSize: 12, fontWeight: '700', color: '#fff' },
  editBtn:       { backgroundColor: 'rgba(245,197,24,0.15)', borderWidth: 1, borderColor: 'rgba(245,197,24,0.3)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  editTxt:       { fontSize: 12, fontWeight: '700', color: '#F5C518' },
  delBtn:        { backgroundColor: 'rgba(229,57,53,0.12)', borderWidth: 1, borderColor: 'rgba(229,57,53,0.3)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  delTxt:        { fontSize: 13 },
});

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#000' },
  center:       { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  header:       { paddingTop: 52, paddingHorizontal: Spacing.containerPadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand:        { fontSize: 22, fontWeight: '700', color: '#F5C518' },
  headerRight:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon:     { gap: 5 },
  menuLine:     { width: 22, height: 2, backgroundColor: '#F5C518', borderRadius: 2 },
  title:        { fontSize: 32, fontWeight: '800', color: '#fff', paddingHorizontal: Spacing.containerPadding, paddingTop: 20, paddingBottom: 4, letterSpacing: -0.5 },
  subtitle:     { fontSize: 13, color: '#555', paddingHorizontal: Spacing.containerPadding, marginBottom: 20 },
  searchBox:    { marginHorizontal: Spacing.containerPadding, backgroundColor: '#151515', borderWidth: 1, borderColor: '#222', borderRadius: 18, height: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, marginBottom: 24 },
  searchIcon:   { fontSize: 15 },
  searchInput:  { flex: 1, fontSize: 15, color: '#888' },
  sectionLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#333', paddingHorizontal: Spacing.containerPadding, marginBottom: 14 },
  list:         { paddingHorizontal: Spacing.containerPadding, paddingBottom: 32 },
  empty:        { textAlign: 'center', color: '#444', fontSize: 15, paddingTop: 40 },
  addBtn:       { backgroundColor: '#F5C518', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText:   { fontSize: 13, fontWeight: '800', color: '#000' },
});