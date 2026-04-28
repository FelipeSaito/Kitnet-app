import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUtilityBills } from '../../src/hooks';
import { markUtilityAsPaid } from '../../src/services/utilityService';
import { QuickMenu } from '../../components/QuickMenu';
import { Spacing } from '../../constants/theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type BillStatus = 'paid' | 'pending' | 'overdue';

const STATUS_CONFIG = {
  paid:    { label: 'Pago',     bg: 'rgba(245,197,24,0.12)', color: '#F5C518' },
  pending: { label: 'Pendente', bg: 'rgba(80,80,80,0.3)',    color: '#aaa'    },
  overdue: { label: 'Atrasado', bg: 'rgba(180,20,20,0.18)',  color: '#ff6b6b' },
};

const Badge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status as BillStatus] ?? STATUS_CONFIG.pending;
  return (
    <View style={[b.wrap, { backgroundColor: cfg.bg }]}>
      <Text style={[b.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
};

const b = StyleSheet.create({
  wrap: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  text: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});

const currentMonth = format(new Date(), 'yyyy-MM');
const monthLabel   = format(new Date(), 'MMMM yyyy', { locale: ptBR });

export default function UtilitiesScreen() {
  const router = useRouter();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeType, setActiveType] = useState<'all' | 'water' | 'energy'>('all');
  const { data: bills, loading, refetch } = useUtilityBills(currentMonth);

  const filtered = bills.filter(b =>
    activeType === 'all' ? true : (b as any).type === activeType
  );

  const totalPaid    = filtered.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0);
  const totalPending = filtered.filter(b => b.status !== 'paid').reduce((s, b) => s + b.amount, 0);

  const handleMarkPaid = async (id: string) => {
    try {
      await markUtilityAsPaid(id);
      refetch();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
  };

  const handleWhatsApp = (bill: any) => {
    const tenant  = bill.tenants?.full_name;
    const phone   = bill.tenants?.phone;
    const prop    = bill.properties?.name;
    const tipo    = bill.type === 'water' ? 'água' : 'energia';
    if (!phone) { Alert.alert('Aviso', 'Inquilino sem telefone cadastrado.'); return; }
    const clean = phone.replace(/\D/g, '');
    const msg   = encodeURIComponent(`Olá ${tenant}, a conta de ${tipo} de ${prop} no valor de R$ ${bill.amount.toLocaleString('pt-BR')} está disponível.`);
    Linking.openURL(`https://wa.me/55${clean}?text=${msg}`);
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
      {/* Header */}
      <View style={s.header}>
        <Text style={s.brand}>Casas</Text>
        <View style={s.headerRight}>
          <TouchableOpacity
            style={s.addBtn}
            onPress={() => router.push('/utility/new' as any)}
          >
            <Text style={s.addBtnText}>+ Lançar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.menuIcon} onPress={() => setMenuOpen(true)}>
            <View style={s.menuLine} />
            <View style={s.menuLine} />
            <View style={s.menuLine} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={s.title}>Água & Luz</Text>
      <Text style={s.subtitle}>
        {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
      </Text>

      {/* Cards resumo */}
      <View style={s.summaryRow}>
        <View style={s.summaryCard}>
          <Text style={s.summaryLabel}>Pago</Text>
          <Text style={[s.summaryValue, { color: '#4ade80' }]}>
            R$ {totalPaid.toLocaleString('pt-BR')}
          </Text>
        </View>
        <View style={s.summaryCard}>
          <Text style={s.summaryLabel}>Pendente</Text>
          <Text style={[s.summaryValue, { color: '#ff6b6b' }]}>
            R$ {totalPending.toLocaleString('pt-BR')}
          </Text>
        </View>
        <View style={s.summaryCard}>
          <Text style={s.summaryLabel}>Total</Text>
          <Text style={s.summaryValue}>{filtered.length}</Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={s.filters}>
        {(['all', 'water', 'energy'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[s.filter, activeType === f && s.filterActive]}
            onPress={() => setActiveType(f)}
          >
            <Text style={[s.filterText, activeType === f && s.filterTextActive]}>
              {f === 'all' ? 'Todas' : f === 'water' ? '🚿 Água' : '⚡ Energia'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        onRefresh={refetch}
        refreshing={loading}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Text style={s.emptyIcon}>💧</Text>
            <Text style={s.empty}>Nenhuma conta lançada</Text>
            <TouchableOpacity
              style={s.emptyBtn}
              onPress={() => router.push('/utility/new' as any)}
            >
              <Text style={s.emptyBtnText}>+ Lançar primeira conta</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const prop   = (item as any).properties?.name ?? '—';
          const region = (item as any).properties?.regions?.name ?? '—';
          const tenant = (item as any).tenants?.full_name ?? 'Sem inquilino';
          const isWater = (item as any).type === 'water';
          const iconBg  = isWater ? 'rgba(96,165,250,0.12)' : 'rgba(245,197,24,0.1)';

          return (
            <View style={card.wrap}>
              {/* Ícone */}
              <View style={[card.icon, { backgroundColor: iconBg }]}>
                <Text style={{ fontSize: 22 }}>{isWater ? '🚿' : '⚡'}</Text>
              </View>

              {/* Info */}
              <View style={card.info}>
                <Text style={card.prop}>{prop} · {region}</Text>
                <Text style={card.tenant}>👤 {tenant}</Text>
                <Text style={card.date}>📅 Vence: {item.due_date}</Text>
                {item.reading_start && item.reading_end && (
                  <Text style={card.reading}>
                    📊 {item.reading_start} → {item.reading_end} {isWater ? 'm³' : 'kWh'}
                  </Text>
                )}
              </View>

              {/* Right */}
              <View style={card.right}>
                <Text style={card.amount}>R$ {item.amount.toLocaleString('pt-BR')}</Text>
                <Badge status={item.status} />
                {item.status !== 'paid' && (
                  <View style={card.actions}>
                    <TouchableOpacity
                      style={card.payBtn}
                      onPress={() => handleMarkPaid(item.id)}
                    >
                      <Text style={card.payTxt}>✓ Pago</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={card.waBtn}
                      onPress={() => handleWhatsApp(item)}
                    >
                      <Text style={card.waTxt}>💬</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
  wrap:    { backgroundColor: '#111', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  icon:    { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  info:    { flex: 1 },
  prop:    { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 3 },
  tenant:  { fontSize: 12, color: '#555', marginBottom: 2 },
  date:    { fontSize: 11, color: '#444', marginBottom: 2 },
  reading: { fontSize: 11, color: '#444' },
  right:   { alignItems: 'flex-end', gap: 6, flexShrink: 0 },
  amount:  { fontSize: 15, fontWeight: '800', color: '#fff' },
  actions: { flexDirection: 'row', gap: 6, marginTop: 4 },
  payBtn:  { backgroundColor: 'rgba(74,222,128,0.12)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  payTxt:  { fontSize: 11, fontWeight: '700', color: '#4ade80' },
  waBtn:   { backgroundColor: '#25D366', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  waTxt:   { fontSize: 13 },
});

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#000' },
  center:       { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  header:       { paddingTop: 52, paddingHorizontal: Spacing.containerPadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand:        { fontSize: 22, fontWeight: '700', color: '#F5C518' },
  headerRight:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon:     { gap: 5 },
  menuLine:     { width: 22, height: 2, backgroundColor: '#F5C518', borderRadius: 2 },
  addBtn:       { backgroundColor: '#F5C518', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText:   { fontSize: 13, fontWeight: '800', color: '#000' },
  title:        { fontSize: 32, fontWeight: '800', color: '#fff', paddingHorizontal: Spacing.containerPadding, paddingTop: 20, paddingBottom: 2, letterSpacing: -0.5 },
  subtitle:     { fontSize: 13, color: '#555', paddingHorizontal: Spacing.containerPadding, marginBottom: 16 },
  summaryRow:   { flexDirection: 'row', paddingHorizontal: Spacing.containerPadding, gap: 10, marginBottom: 16 },
  summaryCard:  { flex: 1, backgroundColor: '#111', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 14, padding: 12 },
  summaryLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7, color: '#444', marginBottom: 6 },
  summaryValue: { fontSize: 16, fontWeight: '800', color: '#fff' },
  filters:      { flexDirection: 'row', paddingHorizontal: Spacing.containerPadding, gap: 8, marginBottom: 16 },
  filter:       { borderRadius: 999, borderWidth: 1, borderColor: '#222', paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#111' },
  filterActive: { backgroundColor: 'rgba(245,197,24,0.12)', borderColor: '#F5C518' },
  filterText:   { fontSize: 13, fontWeight: '600', color: '#555' },
  filterTextActive: { color: '#F5C518' },
  list:         { paddingHorizontal: Spacing.containerPadding, paddingBottom: 32 },
  emptyWrap:    { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIcon:    { fontSize: 48 },
  empty:        { fontSize: 15, color: '#444' },
  emptyBtn:     { backgroundColor: '#F5C518', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10, marginTop: 8 },
  emptyBtnText: { fontSize: 14, fontWeight: '800', color: '#000' },
});