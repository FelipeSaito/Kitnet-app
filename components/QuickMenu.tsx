import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, Pressable, Alert, Linking,
} from 'react-native';
import { generateMonthlyPayments } from '../src/services/paymentsService';
import { supabase } from '../src/lib/supabase';
import { format } from 'date-fns';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.78;

export const QuickMenu: React.FC<Props> = ({ visible, onClose }) => {
  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
  if (visible) {
    Animated.parallel([
      Animated.spring(translateX, { toValue: 0, useNativeDriver: false, tension: 65, friction: 11 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: false }),
    ]).start();
  } else {
    Animated.parallel([
      Animated.spring(translateX, { toValue: DRAWER_WIDTH, useNativeDriver: false, tension: 65, friction: 11 }),
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: false }),
    ]).start();
  }
}, [visible]);

  const handleGerarCobranças = async () => {
    try {
      await generateMonthlyPayments();
      Alert.alert('✅ Sucesso', 'Cobranças do mês geradas com sucesso!');
      onClose();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
  };

  const handleWhatsAppMassa = async () => {
    try {
      const month = format(new Date(), 'yyyy-MM');
      const { data: payments } = await supabase
        .from('payments')
        .select('*, tenants(full_name, phone), properties(name)')
        .eq('reference_month', month)
        .neq('status', 'paid');

      if (!payments || payments.length === 0) {
        Alert.alert('', 'Todos os pagamentos já foram realizados! 🎉');
        onClose();
        return;
      }

      const first = payments[0];
      const tenant = (first as any).tenants;
      const property = (first as any).properties;

      if (!tenant?.phone) {
        Alert.alert('Aviso', 'Nenhum inquilino com telefone cadastrado.');
        onClose();
        return;
      }

      const clean = tenant.phone.replace(/\D/g, '');
      const msg = encodeURIComponent(
        `Olá ${tenant.full_name}, o aluguel de ${property?.name} está pendente. Por favor, realize o pagamento o quanto antes. Obrigado!`
      );
      await Linking.openURL(`https://wa.me/55${clean}?text=${msg}`);
      onClose();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
  };

  const handleExportar = () => {
    Alert.alert('📊 Exportar', 'Funcionalidade de exportação em breve!');
    onClose();
  };

  const handleNotificacoes = async () => {
    try {
      const month = format(new Date(), 'yyyy-MM');
      const { data: overdue } = await supabase
        .from('payments')
        .select('*, properties(name)')
        .eq('reference_month', month)
        .eq('status', 'overdue');

      const { data: pending } = await supabase
        .from('payments')
        .select('*, properties(name)')
        .eq('reference_month', month)
        .eq('status', 'pending');

      const overdueNames = (overdue ?? [])
        .map(p => (p as any).properties?.name)
        .filter(Boolean)
        .join(', ');

      const msg = [
        overdue?.length ? `🔴 ${overdue.length} pagamento(s) em atraso: ${overdueNames}` : '',
        pending?.length ? `🟡 ${pending.length} pagamento(s) pendente(s)` : '',
        !overdue?.length && !pending?.length ? '✅ Tudo em dia!' : '',
      ].filter(Boolean).join('\n\n');

      Alert.alert('🔔 Notificações', msg);
      onClose();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
  };

  if (!visible) return null;

  const ITEMS = [
    {
      icon: '📋',
      label: 'Gerar cobranças do mês',
      sub: 'Cria pagamentos para todas as kitnets ocupadas',
      color: '#F5C518',
      bg: 'rgba(245,197,24,0.08)',
      onPress: handleGerarCobranças,
    },
    {
      icon: '💬',
      label: 'WhatsApp para pendentes',
      sub: 'Envia cobrança para o próximo inquilino em atraso',
      color: '#25D366',
      bg: 'rgba(37,211,102,0.08)',
      onPress: handleWhatsAppMassa,
    },
    {
      icon: '📊',
      label: 'Exportar relatório',
      sub: 'Gerar PDF com resumo do mês',
      color: '#60a5fa',
      bg: 'rgba(96,165,250,0.08)',
      onPress: handleExportar,
    },
    {
      icon: '🔔',
      label: 'Ver notificações',
      sub: 'Pagamentos em atraso e pendentes',
      color: '#f97316',
      bg: 'rgba(249,115,22,0.08)',
      onPress: handleNotificacoes,
    },
  ];

  return (
    <View style={s.overlay}>
      {/* Backdrop */}
      <Animated.View style={[s.backdrop, { opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Drawer */}
      <Animated.View style={[s.drawer, { transform: [{ translateX }] }]}>
        {/* Header */}
        <View style={s.drawerHeader}>
          <Text style={s.drawerTitle}>Ações Rápidas</Text>
          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <Text style={s.closeTxt}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.drawerSub}>O que deseja fazer?</Text>

        {/* Items */}
        <View style={s.items}>
          {ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[s.item, { backgroundColor: item.bg }]}
              onPress={item.onPress}
              activeOpacity={0.75}
            >
              <View style={[s.itemIcon, { borderColor: item.color + '33' }]}>
                <Text style={s.itemEmoji}>{item.icon}</Text>
              </View>
              <View style={s.itemText}>
                <Text style={[s.itemLabel, { color: item.color }]}>{item.label}</Text>
                <Text style={s.itemSub}>{item.sub}</Text>
              </View>
              <Text style={s.itemArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Casas Kitnet Manager v1.0</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  overlay:      { position: 'absolute', inset: 0, zIndex: 50 } as any,
  backdrop:     { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  drawer:       {
    position: 'absolute', top: 0, bottom: 0, right: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#0a0a0a',
    borderLeftWidth: 1,
    borderLeftColor: '#1e1e1e',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  drawerTitle:  { fontSize: 22, fontWeight: '800', color: '#fff' },
  closeBtn:     { width: 32, height: 32, backgroundColor: '#1a1a1a', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  closeTxt:     { fontSize: 14, color: '#888' },
  drawerSub:    { fontSize: 13, color: '#444', marginBottom: 28 },
  items:        { gap: 12 },
  item:         { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: '#1e1e1e' },
  itemIcon:     { width: 44, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
  itemEmoji:    { fontSize: 20 },
  itemText:     { flex: 1 },
  itemLabel:    { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  itemSub:      { fontSize: 11, color: '#555' },
  itemArrow:    { fontSize: 20, color: '#333' },
  footer:       { position: 'absolute', bottom: 32, left: 20, right: 20, alignItems: 'center' },
  footerText:   { fontSize: 11, color: '#222' },
});