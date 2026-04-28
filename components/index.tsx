import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ViewStyle, TextStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

// ─── Header ─────────────────────────────────────────────────────────────────

interface HeaderProps {
  title: string;
  serif?: boolean;
  right?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, serif = false, right }) => (
  <View style={header.container}>
    <Text style={serif ? header.titleSerif : header.titleSans}>{title}</Text>
    {right}
  </View>
);

const header = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: Colors.bg,
  },
  titleSerif: {
    fontFamily: 'NotoSerif_700Bold',
    fontSize: 30,
    color: Colors.gold,
    letterSpacing: -0.5,
  },
  titleSans: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: Colors.text,
  },
});

// ─── SearchInput ─────────────────────────────────────────────────────────────

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChangeText, placeholder }) => (
  <View style={search.container}>
    <Text style={search.icon}>🔍</Text>
    <TextInput
      style={search.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder ?? 'Buscar...'}
      placeholderTextColor={Colors.text3}
    />
  </View>
);

const search = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E18',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border2,
    height: 48,
    paddingHorizontal: 16,
    marginHorizontal: Spacing.containerPadding,
    gap: 10,
  },
  icon: { fontSize: 14, opacity: 0.6 },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.text2,
  },
});

// ─── RegionTabs ───────────────────────────────────────────────────────────────

interface RegionTabsProps {
  active: string;
  tabs: string[];
  onChange: (tab: string) => void;
}

export const RegionTabs: React.FC<RegionTabsProps> = ({ active, tabs, onChange }) => (
  <View style={tabs_.container}>
    {tabs.map(tab => (
      <TouchableOpacity key={tab} onPress={() => onChange(tab)} style={tabs_.tab}>
        <Text style={[tabs_.text, active === tab && tabs_.activeText]}>{tab}</Text>
        {active === tab && <View style={tabs_.underline} />}
      </TouchableOpacity>
    ))}
  </View>
);

const tabs_ = StyleSheet.create({
  container: { flexDirection: 'row', paddingHorizontal: Spacing.containerPadding, paddingTop: 16, gap: 24 },
  tab: { paddingBottom: 10 },
  text: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.text3 },
  activeText: { color: Colors.gold },
  underline: { height: 2, backgroundColor: Colors.gold, borderRadius: 1, marginTop: 2 },
});

// ─── PrimaryButton ────────────────────────────────────────────────────────────

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'whatsapp' | 'danger';
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onPress, variant = 'primary', style }) => {
  const variantStyle = {
    primary: { bg: Colors.gold, text: Colors.black, border: Colors.gold },
    secondary: { bg: Colors.card, text: Colors.text, border: Colors.border2 },
    whatsapp: { bg: '#25D366', text: '#fff', border: '#25D366' },
    danger: { bg: Colors.card, text: Colors.red, border: Colors.red },
  }[variant];

  return (
    <TouchableOpacity
      style={[btn.base, { backgroundColor: variantStyle.bg, borderColor: variantStyle.border }, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[btn.text, { color: variantStyle.text }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const btn = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontFamily: 'Inter_700Bold', fontSize: 14 },
});

// ─── InputField ───────────────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  multiline?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false,
}) => (
  <View style={input.group}>
    <Text style={input.label}>{label}</Text>
    <TextInput
      style={[input.field, multiline && input.multiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.text3}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

const input = StyleSheet.create({
  group: { marginBottom: 16 },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: Colors.text3,
    marginBottom: 8,
  },
  field: {
    backgroundColor: '#2A2A24',
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.text,
  },
  multiline: { height: 96, textAlignVertical: 'top' },
});

// ─── SummaryCard ─────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: string;
  valueColor?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, valueColor }) => (
  <View style={summary.card}>
    <Text style={summary.label}>{label}</Text>
    <Text style={[summary.value, valueColor ? { color: valueColor } : {}]}>{value}</Text>
  </View>
);

const summary = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    flex: 1,
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: Colors.text3,
    marginBottom: 8,
  },
  value: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.text,
  },
});

// ─── TenantListItem ────────────────────────────────────────────────────────────

interface TenantListItemProps {
  name: string;
  kitnetName: string;
  region: string;
  phone: string;
  paymentStatus: string;
  onPress: () => void;
  onWhatsApp: () => void;
}

export const TenantListItem: React.FC<TenantListItemProps> = ({
  name, kitnetName, region, phone, paymentStatus, onPress, onWhatsApp,
}) => {
  const statusColor = paymentStatus === 'paid' ? Colors.green : paymentStatus === 'overdue' ? Colors.red : Colors.text3;
  return (
    <TouchableOpacity style={tenant.row} onPress={onPress}>
      <View style={tenant.avatar}><Text style={{ fontSize: 20 }}>👤</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={tenant.name}>{name}</Text>
        <Text style={tenant.sub}>{kitnetName} · {region}</Text>
        <Text style={[tenant.phone, { color: Colors.gold }]}>{phone}</Text>
      </View>
      <TouchableOpacity style={tenant.waBtn} onPress={onWhatsApp}>
        <Text style={tenant.waTxt}>WhatsApp</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const tenant = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatar: { width: 46, height: 46, backgroundColor: Colors.card2, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border2 },
  name: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.text },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.text3, marginTop: 2 },
  phone: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 2 },
  waBtn: { backgroundColor: '#25D366', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  waTxt: { fontFamily: 'Inter_700Bold', fontSize: 11, color: '#fff' },
});

// ─── PaymentListItem ──────────────────────────────────────────────────────────

interface PaymentListItemProps {
  tenantName: string;
  kitnetName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue' | 'empty';
}

const PAYMENT_STATUS_MAP = {
  paid:    { label: 'Pago',     color: Colors.green },
  pending: { label: 'Pendente', color: Colors.orange },
  overdue: { label: 'Atrasado', color: Colors.red },
  empty:   { label: 'Vaga',     color: Colors.text3 },
};

export const PaymentListItem: React.FC<PaymentListItemProps> = ({
  tenantName, kitnetName, amount, date, status,
}) => {
  const cfg = PAYMENT_STATUS_MAP[status];
  return (
    <View style={pay.row}>
      <View style={pay.avatar}><Text style={{ fontSize: 18 }}>🏠</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={pay.name}>{tenantName}</Text>
        <Text style={pay.sub}>{kitnetName} · {date}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[pay.amount, { color: cfg.color }]}>
          R$ {amount.toLocaleString('pt-BR')}
        </Text>
        <Text style={[pay.status, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    </View>
  );
};

const pay = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, paddingHorizontal: Spacing.containerPadding, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatar: { width: 42, height: 42, backgroundColor: Colors.card2, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.text },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.text3, marginTop: 2 },
  amount: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  status: { fontFamily: 'Inter_700Bold', fontSize: 11, marginTop: 2 },
});
