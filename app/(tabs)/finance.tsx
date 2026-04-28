import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { PAYMENTS, FINANCIAL_SUMMARY, KITNETS } from '../../data/mockData';
import { Spacing } from '../../constants/theme';

type PayStatus = 'paid' | 'overdue' | 'pending' | 'empty';

const STATUS_CONFIG: Record<PayStatus, { label: string; bg: string; color: string }> = {
  paid:    { label: 'Pago',     bg: 'rgba(245,197,24,0.12)', color: '#F5C518' },
  overdue: { label: 'Atrasado', bg: 'rgba(180,20,20,0.18)',  color: '#ff6b6b' },
  pending: { label: 'Pendente', bg: 'rgba(80,80,80,0.3)',    color: '#aaa'    },
  empty:   { label: 'Vaga',     bg: 'rgba(50,50,50,0.2)',    color: '#555'    },
};

const Badge = ({ status }: { status: PayStatus }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.empty;
  return (
    <View style={[b.wrap, { backgroundColor: cfg.bg }]}>
      <Text style={[b.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
};

const b = StyleSheet.create({
  wrap: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4, alignSelf: 'flex-end' },
  text: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});

const EMOJI_MAP: Record<number, string> = { 1:'🏠',2:'🏡',3:'🏘️',4:'🔨',5:'🏠',6:'🏡',7:'🏘️',8:'🏠' };

const PaymentCard = ({ emoji, name, kitnet, amount, date, status }: {
  emoji: string; name: string; kitnet: string;
  amount: number; date: string; status: PayStatus;
}) => {
  const amountColor = status === 'paid' ? '#4ade80' : status === 'overdue' ? '#ff6b6b' : '#555';
  const iconBg = status === 'paid' ? 'rgba(245,197,24,0.1)' : status === 'overdue' ? 'rgba(180,20,20,0.1)' : '#111';
  return (
    <View style={pc.card}>
      <View style={[pc.icon, { backgroundColor: iconBg }]}>
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
      </View>
      <View style={pc.info}>
        <Text style={pc.name}>{name}</Text>
        <Text style={pc.sub}>{kitnet}</Text>
      </View>
      <View style={pc.right}>
        <Text style={[pc.amount, { color: amountColor }]}>R$ {amount.toLocaleString('pt-BR')}</Text>
        <Text style={pc.date}>{date}</Text>
        <Badge status={status} />
      </View>
    </View>
  );
};

const pc = StyleSheet.create({
  card:   { backgroundColor: '#111', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 16, padding: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  icon:   { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  info:   { flex: 1 },
  name:   { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 3 },
  sub:    { fontSize: 11, color: '#444' },
  right:  { alignItems: 'flex-end' },
  amount: { fontSize: 15, fontWeight: '800' },
  date:   { fontSize: 11, color: '#444', marginTop: 2 },
});

export default function FinanceScreen() {
  const { previsaoMensal, recebido, emAtraso, ocupadas, total } = FINANCIAL_SUMMARY;
  const pct = Math.round((recebido / previsaoMensal) * 100);

  const allPayments = [
    ...PAYMENTS.map(p => ({
      id: p.id, kitnetId: p.kitnetId,
      name: p.tenantName,
      kitnet: `${p.kitnetName} · ${KITNETS.find(k => k.id === p.kitnetId)?.region ?? ''}`,
      amount: p.amount, date: p.date, status: p.status as PayStatus,
    })),
    ...KITNETS
      .filter(k => k.status === 'available' || k.status === 'maintenance')
      .map(k => ({
        id: k.id + 100, kitnetId: k.id, name: k.name,
        kitnet: `${k.region} · ${k.status === 'available' ? 'Vaga' : 'Manutenção'}`,
        amount: k.price, date: '—', status: 'empty' as PayStatus,
      })),
  ];

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        <View style={s.header}>
          <Text style={s.brand}>Casas</Text>
          <View style={s.menuIcon}>
            <View style={s.menuLine} />
            <View style={s.menuLine} />
            <View style={s.menuLine} />
          </View>
        </View>

        <Text style={s.title}>Financeiro</Text>
        <Text style={s.period}>Abril 2025 · Resumo mensal</Text>

        {/* ── Card WIDE — Receita Prevista ── */}
        <View style={s.px}>
          <View style={s.cardWide}>
            <Text style={s.cardLabel}>Receita Prevista</Text>
            <Text style={[s.cardValue, { color: '#F5C518' }]}>
              R$ {previsaoMensal.toLocaleString('pt-BR')}
            </Text>
            <Text style={s.cardSub}>Baseado nas kitnets ocupadas</Text>
            <View style={s.bar}>
              <View style={[s.barFill, { width: `${pct}%` as any }]} />
            </View>
            <View style={s.barRow}>
              <Text style={s.barSub}>Recebido R$ {recebido.toLocaleString('pt-BR')}</Text>
              <Text style={s.barPct}>{pct}%</Text>
            </View>
          </View>

          {/* ── Linha 2 ── */}
          <View style={s.row}>
            <View style={s.card}>
              <Text style={s.cardLabel}>Recebido</Text>
              <Text style={[s.cardValue, { color: '#4ade80' }]}>
                R$ {recebido.toLocaleString('pt-BR')}
              </Text>
              <Text style={s.cardSub}>{PAYMENTS.filter(p => p.status === 'paid').length} pagamentos</Text>
            </View>
            <View style={s.card}>
              <Text style={s.cardLabel}>Em atraso</Text>
              <Text style={[s.cardValue, { color: '#ff6b6b' }]}>
                R$ {emAtraso.toLocaleString('pt-BR')}
              </Text>
              <Text style={s.cardSub}>{PAYMENTS.filter(p => p.status === 'overdue').length} inquilinos</Text>
            </View>
          </View>

          {/* ── Linha 3 ── */}
          <View style={s.row}>
            <View style={s.card}>
              <Text style={s.cardLabel}>Ocupadas</Text>
              <Text style={s.cardValue}>{ocupadas} / {total}</Text>
              <Text style={s.cardSub}>{Math.round((ocupadas / total) * 100)}% ocupação</Text>
            </View>
            <View style={s.card}>
              <Text style={s.cardLabel}>Vacância</Text>
              <Text style={[s.cardValue, { color: '#555' }]}>{total - ocupadas}</Text>
              <Text style={s.cardSub}>Disponíveis</Text>
            </View>
          </View>
        </View>

        {/* ── Lista de pagamentos ── */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Pagamentos do mês</Text>
          <TouchableOpacity><Text style={s.sectionLink}>Ver todos</Text></TouchableOpacity>
        </View>

        <View style={s.list}>
          {allPayments.map(p => (
            <PaymentCard
              key={p.id}
              emoji={EMOJI_MAP[p.kitnetId] ?? '🏠'}
              name={p.name}
              kitnet={p.kitnet}
              amount={p.amount}
              date={p.date}
              status={p.status}
            />
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#000' },
  header:       { paddingTop: 52, paddingHorizontal: Spacing.containerPadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand:        { fontSize: 22, fontWeight: '700', color: '#F5C518' },
  menuIcon:     { gap: 5 },
  menuLine:     { width: 22, height: 2, backgroundColor: '#F5C518', borderRadius: 2 },
  title:        { fontSize: 32, fontWeight: '800', color: '#fff', paddingHorizontal: Spacing.containerPadding, paddingTop: 20, paddingBottom: 2, letterSpacing: -0.5 },
  period:       { fontSize: 13, color: '#555', paddingHorizontal: Spacing.containerPadding, marginBottom: 20 },
  px:           { paddingHorizontal: Spacing.containerPadding, gap: 10, marginBottom: 24 },
  row:          { flexDirection: 'row', gap: 10 },
  cardWide:     { backgroundColor: '#111', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 18, padding: 16 },
  card:         { backgroundColor: '#111', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 18, padding: 16, flex: 1 },
  cardLabel:    { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#444', marginBottom: 10 },
  cardValue:    { fontSize: 22, fontWeight: '800', color: '#fff' },
  cardSub:      { fontSize: 11, color: '#444', marginTop: 4 },
  bar:          { height: 4, backgroundColor: '#1e1e1e', borderRadius: 2, marginTop: 14, overflow: 'hidden' },
  barFill:      { height: 4, backgroundColor: '#F5C518', borderRadius: 2 },
  barRow:       { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  barSub:       { fontSize: 10, color: '#444' },
  barPct:       { fontSize: 10, color: '#F5C518', fontWeight: '700' },
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.containerPadding, marginBottom: 14 },
  sectionTitle: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#333' },
  sectionLink:  { fontSize: 11, color: '#F5C518', fontWeight: '600' },
  list:         { paddingHorizontal: Spacing.containerPadding, gap: 10 },
});