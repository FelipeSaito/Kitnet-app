import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image,
} from 'react-native';

interface UnitDetailsProps {
  image?: string;
  kitnetName?: string;
  region?: string;
  status?: 'occupied' | 'available' | 'maintenance' | 'overdue';
  tenantName?: string;
  rentValue?: number;
  dueDay?: number;
  contractStart?: string;
  area?: string;
  financialStatus?: 'Em dia' | 'Atrasado' | 'Pendente';
  water?: string;
  energy?: string;
  internet?: string;
  type?: string;
  onRegisterPayment?: () => void;
  onViewContract?: () => void;
  onEdit?: () => void;
  onBack?: () => void;
}

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
  isLast?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, valueColor, isLast }) => (
  <View style={[s.detailRow, isLast && { borderBottomWidth: 0 }]}>
    <View style={s.detailLeft}>
      <View style={s.detailIcon}>
        <Text style={s.detailIconText}>{icon}</Text>
      </View>
      <Text style={s.detailLabel}>{label}</Text>
    </View>
    <Text style={[s.detailValue, valueColor ? { color: valueColor } : {}]}>
      {value}
    </Text>
  </View>
);

export const UnitDetails: React.FC<UnitDetailsProps> = ({
  image,
  kitnetName = 'Casa 1',
  region = 'Campo Limpo',
  status = 'occupied',
  tenantName = '—',
  rentValue = 0,
  dueDay = 15,
  contractStart = 'Jan 2024',
  area = '32m²',
  financialStatus = 'Em dia',
  water = 'Incluso',
  energy = 'Individual',
  internet = 'Disponível',
  type = 'Kitnet Studio',
  onRegisterPayment,
  onViewContract,
  onEdit,
  onBack,
}) => {
  const financialColor =
    financialStatus === 'Em dia'   ? '#00d4aa' :
    financialStatus === 'Atrasado' ? '#E53935'  : '#FF8C00';

  const statusLabel =
    status === 'occupied'    ? 'Ocupada'    :
    status === 'available'   ? 'Disponível' :
    status === 'maintenance' ? 'Manutenção' : 'Em atraso';

  const DETAILS: DetailRowProps[] = [
    { icon: '📅', label: 'Início do Contrato', value: contractStart },
    { icon: '📐', label: 'Área Útil',          value: area },
    { icon: '💳', label: 'Status Financeiro',  value: financialStatus, valueColor: financialColor },
    { icon: '🚿', label: 'Água',               value: water },
    { icon: '⚡', label: 'Energia',            value: energy },
    { icon: '📶', label: 'Internet',           value: internet },
    { icon: '🏠', label: 'Tipo',               value: type, isLast: true },
  ];

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={s.hero}>
        {image ? (
          <Image source={{ uri: image }} style={s.heroImage} resizeMode="cover" />
        ) : (
          <View style={s.heroBg} />
        )}
        <View style={s.heroOverlay} />
        <View style={s.header}>
          <TouchableOpacity style={s.backRow} onPress={onBack}>
            <Text style={s.backArrow}>←</Text>
            <Text style={s.headerTitle}>Casas</Text>
          </TouchableOpacity>
          <View style={s.menuIcon}>
            <View style={s.menuLine} />
            <View style={s.menuLine} />
            <View style={s.menuLine} />
          </View>
        </View>
        <View style={s.statusBadge}>
          <View style={s.statusDot} />
          <Text style={s.statusText}>{statusLabel}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={s.body}>
        <Text style={s.kitnetTitle}>{kitnetName}</Text>
        <View style={s.locationRow}>
          <Text style={s.locationPin}>📍</Text>
          <Text style={s.locationText}>{region}</Text>
        </View>

        {/* Tenant card */}
        <View style={s.tenantCard}>
          <Text style={s.cardLabel}>Inquilino Atual</Text>
          <View style={s.tenantRow}>
            <View style={s.tenantAvatar}>
              <Text style={s.tenantAvatarIcon}>👤</Text>
            </View>
            <Text style={s.tenantName}>{tenantName}</Text>
          </View>
        </View>

        {/* Rent + Due */}
        <View style={s.twoCol}>
          <View style={s.miniCard}>
            <Text style={s.miniLabel}>Aluguel</Text>
            <Text style={s.miniValueGold}>
              R$ {rentValue.toLocaleString('pt-BR')}
            </Text>
          </View>
          <View style={s.miniCard}>
            <Text style={s.miniLabel}>Vencimento</Text>
            <Text style={s.miniValueWhite}>Dia {dueDay}</Text>
          </View>
        </View>

        {/* Details */}
        <Text style={s.sectionTitle}>Detalhes da Unidade</Text>
        <View style={s.detailsList}>
          {DETAILS.map((item, i) => (
            <DetailRow key={i} {...item} />
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity style={s.btnPrimary} onPress={onRegisterPayment}>
          <Text style={s.btnPrimaryText}>📋  Registrar pagamento</Text>
        </TouchableOpacity>

        <View style={s.btnRow}>
          <TouchableOpacity style={s.btnSecondary} onPress={onViewContract}>
            <Text style={s.btnSecondaryText}>📄  Ver contrato</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnSecondary} onPress={onEdit}>
            <Text style={s.btnSecondaryText}>✏️  Editar dados</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const GOLD = '#F5C518';
const BG   = '#0a0a0a';
const CARD = '#1c1c14';

const s = StyleSheet.create({
  container:        { flex: 1, backgroundColor: BG },
  hero:             { height: 240, backgroundColor: '#0f2420', position: 'relative', justifyContent: 'flex-end' },
  heroImage:        { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  heroBg:           { ...StyleSheet.absoluteFillObject, backgroundColor: '#0d2420' },
  heroOverlay:      { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  header:           { position: 'absolute', top: 44, left: 0, right: 0, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backRow:          { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backArrow:        { fontSize: 22, color: GOLD, fontWeight: '700' },
  headerTitle:      { fontSize: 20, fontWeight: '700', color: GOLD },
  menuIcon:         { gap: 4 },
  menuLine:         { width: 20, height: 2, backgroundColor: GOLD, borderRadius: 2 },
  statusBadge:      { margin: 16, borderWidth: 1.5, borderColor: GOLD, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: 'rgba(0,0,0,0.35)', alignSelf: 'flex-start' },
  statusDot:        { width: 7, height: 7, borderRadius: 999, backgroundColor: GOLD },
  statusText:       { fontSize: 13, fontWeight: '500', color: GOLD },
  body:             { padding: 20, paddingBottom: 36 },
  kitnetTitle:      { fontSize: 28, fontWeight: '800', color: GOLD, marginBottom: 4, letterSpacing: -0.3 },
  locationRow:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 18 },
  locationPin:      { fontSize: 14 },
  locationText:     { fontSize: 15, fontWeight: '600', color: '#fff' },
  tenantCard:       { backgroundColor: CARD, borderRadius: 14, padding: 14, paddingHorizontal: 16, marginBottom: 12 },
  cardLabel:        { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, color: '#7a7060', marginBottom: 10 },
  tenantRow:        { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tenantAvatar:     { width: 38, height: 38, backgroundColor: GOLD, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  tenantAvatarIcon: { fontSize: 18 },
  tenantName:       { fontSize: 17, fontWeight: '700', color: '#fff' },
  twoCol:           { flexDirection: 'row', gap: 10, marginBottom: 22 },
  miniCard:         { flex: 1, backgroundColor: CARD, borderRadius: 14, padding: 14, paddingHorizontal: 16 },
  miniLabel:        { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, color: '#7a7060', marginBottom: 8 },
  miniValueGold:    { fontSize: 20, fontWeight: '800', color: GOLD },
  miniValueWhite:   { fontSize: 20, fontWeight: '800', color: '#fff' },
  sectionTitle:     { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.4, color: '#5a5040', marginBottom: 2 },
  detailsList:      { marginBottom: 22 },
  detailRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1e1e14' },
  detailLeft:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailIcon:       { width: 34, height: 34, backgroundColor: CARD, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  detailIconText:   { fontSize: 16 },
  detailLabel:      { fontSize: 14, fontWeight: '500', color: '#b0a890' },
  detailValue:      { fontSize: 15, fontWeight: '700', color: '#fff' },
  btnPrimary:       { backgroundColor: GOLD, borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  btnPrimaryText:   { fontSize: 15, fontWeight: '700', color: '#000' },
  btnRow:           { flexDirection: 'row', gap: 10 },
  btnSecondary:     { flex: 1, backgroundColor: CARD, borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  btnSecondaryText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});