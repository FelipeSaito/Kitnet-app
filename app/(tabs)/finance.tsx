import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { usePayments, useFinancialSummary } from '../../src/hooks';
import { markAsPaid } from '../../src/services/paymentsService';
import { Spacing } from '../../constants/theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { QuickMenu } from '../../components/QuickMenu';

type PayStatus = 'paid' | 'overdue' | 'pending' | 'empty';

const STATUS_CONFIG: Record<PayStatus, { label: string; bg: string; color: string }> = {
  paid:    { label: 'Pago',     bg: 'rgba(245,197,24,0.12)', color: '#F5C518' },
  overdue: { label: 'Atrasado', bg: 'rgba(180,20,20,0.18)',  color: '#ff6b6b' },
  pending: { label: 'Pendente', bg: 'rgba(80,80,80,0.3)',    color: '#aaa'    },
  empty:   { label: 'Vaga',     bg: 'rgba(50,50,50,0.2)',    color: '#555'    },
};

const Badge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status as PayStatus] ?? STATUS_CONFIG.empty;
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

const EMOJI_MAP: Record<string, string> = {
  'Kitnet 1': '🏠', 'Kitnet 2': '🏡', 'Kitnet 3': '🏘️',
  'Kitnet 4': '🔨', 'Kitnet 5': '🏠', 'Kitnet 6': '🏡',
  'Kitnet 7': '🏘️', 'Kitnet 8': '🏠',
};

const currentMonth = format(new Date(), 'yyyy-MM');
const monthLabel   = format(new Date(), 'MMMM yyyy', { locale: ptBR });

const PaymentCard = ({
  id, emoji, name, kitnet, amount, date, status, onMarkPaid,
}: {
  id: string; emoji: string; name: string; kitnet: string;
  amount: number; date: string; status: PayStatus;
  onMarkPaid?: () => void;
}) => {
  const amountColor =
    status === 'paid'    ? '#4ade80' :
    status === 'overdue' ? '#ff6b6b' : '#aaa';
  const iconBg =
    status === 'paid'    ? 'rgba(245,197,24,0.1)' :
    status === 'overdue' ? 'rgba(180,20,20,0.1)'  : '#111';

  return (
    <View style={pc.card}>
      <View style={[pc.icon, { backgroundColor: iconBg }]}>
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
      </View>
      <View style={pc.info}>
        <Text style={pc.name}>{name}</Text>
        <Text style={pc.sub}>{kitnet}</Text>
        {status !== 'paid' && onMarkPaid && (
          <TouchableOpacity style={pc.payBtn} onPress={onMarkPaid}>
            <Text style={pc.payBtnText}>✓ Marcar como pago</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={pc.right}>
        <Text style={[pc.amount, { color: amountColor }]}>
          R$ {amount.toLocaleString('pt-BR')}
        </Text>
        <Text style={pc.date}>{date}</Text>
        <Badge status={status} />
      </View>
    </View>
  );
};

const pc = StyleSheet.create({
  card:       { backgroundColor: '#111', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 16, padding: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  icon:       { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  info:       { flex: 1 },
  name:       { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 3 },
  sub:        { fontSize: 11, color: '#444' },
  right:      { alignItems: 'flex-end' },
  amount:     { fontSize: 15, fontWeight: '800' },
  date:       { fontSize: 11, color: '#444', marginTop: 2 },
  payBtn:     { backgroundColor: 'rgba(74,222,128,0.12)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, marginTop: 6, alignSelf: 'flex-start' },
  payBtnText: { fontSize: 11, fontWeight: '700', color: '#4ade80' },
});

export default function FinanceScreen() {
  const { data: payments, loading: loadingP, refetch } = usePayments(currentMonth);
  const { data: summary,  loading: loadingS }          = useFinancialSummary(currentMonth);
  const [menuOpen, setMenuOpen] = useState(false);

  const loading = loadingP || loadingS;

  const received  = summary?.total_received  ?? 0;
  const overdue   = summary?.total_overdue   ?? 0;
  const expected  = summary?.total_expected  ?? 0;
  const paidCount = summary?.paid_count      ?? 0;
  const pct       = expected > 0 ? Math.round((received / expected) * 100) : 0;

  const handleMarkPaid = async (paymentId: string) => {
    try {
      await markAsPaid(paymentId);
      refetch();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

          <View style={s.header}>
            <Text style={s.brand}>Casas</Text>
            <TouchableOpacity
              style={s.menuIcon}
              onPress={() => setMenuOpen(true)}
            >
              <View style={s.menuLine} />
              <View style={s.menuLine} />
              <View style={s.menuLine} />
            </TouchableOpacity>
          </View>

        <Text style={s.title}>Financeiro</Text>
        <Text style={s.period}>
          {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)} · Resumo mensal
        </Text>

        <View style={s.px}>
          <View style={s.cardWide}>
            <Text style={s.cardLabel}>Receita Prevista</Text>
            <Text style={[s.cardValue, { color: '#F5C518' }]}>
              R$ {expected.toLocaleString('pt-BR')}
            </Text>
            <Text style={s.cardSub}>Baseado nas kitnets ocupadas</Text>
            <View style={s.bar}>
              <View style={[s.barFill, { width: `${pct}%` as any }]} />
            </View>
            <View style={s.barRow}>
              <Text style={s.barSub}>Recebido R$ {received.toLocaleString('pt-BR')}</Text>
              <Text style={s.barPct}>{pct}%</Text>
            </View>
          </View>

          <View style={s.row}>
            <View style={s.card}>
              <Text style={s.cardLabel}>Recebido</Text>
              <Text style={[s.cardValue, { color: '#4ade80' }]}>
                R$ {received.toLocaleString('pt-BR')}
              </Text>
              <Text style={s.cardSub}>{paidCount} pagamentos</Text>
            </View>
            <View style={s.card}>
              <Text style={s.cardLabel}>Em atraso</Text>
              <Text style={[s.cardValue, { color: '#ff6b6b' }]}>
                R$ {overdue.toLocaleString('pt-BR')}
              </Text>
              <Text style={s.cardSub}>{summary?.overdue_count ?? 0} inquilinos</Text>
            </View>
          </View>

          <View style={s.row}>
            <View style={s.card}>
              <Text style={s.cardLabel}>Ocupadas</Text>
              <Text style={s.cardValue}>
                {(summary?.paid_count ?? 0) + (summary?.overdue_count ?? 0) + (summary?.pending_count ?? 0)} kitnets
              </Text>
              <Text style={s.cardSub}>com cobrança ativa</Text>
            </View>
            <View style={s.card}>
              <Text style={s.cardLabel}>Pendentes</Text>
              <Text style={[s.cardValue, { color: '#aaa' }]}>
                {summary?.pending_count ?? 0}
              </Text>
              <Text style={s.cardSub}>aguardando</Text>
            </View>
          </View>
        </View>

        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Pagamentos do mês</Text>
          <TouchableOpacity onPress={refetch}>
            <Text style={s.sectionLink}>Atualizar</Text>
          </TouchableOpacity>
        </View>

        <View style={s.list}>
          {payments.map(p => {
            const propName = (p as any).properties?.name ?? '—';
            const region   = (p as any).properties?.regions?.name ?? '—';
            const tenant   = (p as any).tenants?.full_name ?? 'Sem inquilino';
            const emoji    = EMOJI_MAP[propName] ?? '🏠';

            return (
              <PaymentCard
                key={p.id}
                id={p.id}
                emoji={emoji}
                name={tenant}
                kitnet={`${propName} · ${region}`}
                amount={p.amount}
                date={p.due_date}
                status={p.status as PayStatus}
                onMarkPaid={() => handleMarkPaid(p.id)}
              />
            );
          })}
        </View>

      </ScrollView>
      <QuickMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#000' },
  center:       { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
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