import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Switch, Alert,
} from 'react-native';
import { Spacing } from '../../constants/theme';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface SettingsItemProps {
  icon: string;
  iconBg: string;
  label: string;
  value?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  showChevron?: boolean;
}

// ─── Item de configuração ─────────────────────────────────────────────────────

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon, iconBg, label, value, toggle, toggleValue, onToggle, onPress, showChevron = true,
}) => (
  <TouchableOpacity style={item.row} onPress={onPress} activeOpacity={toggle ? 1 : 0.7}>
    <View style={[item.icon, { backgroundColor: iconBg }]}>
      <Text style={item.iconText}>{icon}</Text>
    </View>
    <Text style={item.label}>{label}</Text>
    <View style={item.right}>
      {value && <Text style={item.value}>{value}</Text>}
      {toggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#1e1e1e', true: 'rgba(245,197,24,0.35)' }}
          thumbColor={toggleValue ? '#F5C518' : '#333'}
          ios_backgroundColor="#1e1e1e"
        />
      )}
      {showChevron && !toggle && (
        <Text style={item.chevron}>›</Text>
      )}
    </View>
  </TouchableOpacity>
);

const item = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: '#161616' },
  icon:     { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 16 },
  label:    { flex: 1, fontSize: 15, fontWeight: '500', color: '#fff' },
  right:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  value:    { fontSize: 12, color: '#444' },
  chevron:  { fontSize: 20, color: '#2a2a2a' },
});

// ─── Grupo de itens ───────────────────────────────────────────────────────────

const SettingsGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={group.wrap}>{children}</View>
);

const group = StyleSheet.create({
  wrap: {
    marginHorizontal: Spacing.containerPadding,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1e1e1e',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
});

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const [notifs,   setNotifs]   = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [whatsapp, setWhatsapp] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.brand}>Casas</Text>
          <View style={s.menuIcon}>
            <View style={s.menuLine} />
            <View style={s.menuLine} />
            <View style={s.menuLine} />
          </View>
        </View>

        <Text style={s.title}>Configurações</Text>

        {/* Profile card */}
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarEmoji}>👤</Text>
          </View>
          <View style={s.profileInfo}>
            <Text style={s.profileName}>João Administrador</Text>
            <Text style={s.profileRole}>Proprietário · São Paulo, SP</Text>
            <View style={s.profileBadge}>
              <Text style={s.profileBadgeText}>Pro · 8 Kitnets</Text>
            </View>
          </View>
        </View>

        {/* Conta */}
        <Text style={s.sectionLabel}>Conta</Text>
        <SettingsGroup>
          <SettingsItem icon="👤" iconBg="#1a1500" label="Dados pessoais" onPress={() => {}} />
          <SettingsItem icon="🔐" iconBg="#001a0a" label="Segurança"      onPress={() => {}} />
          <SettingsItem
            icon="📱" iconBg="#001015" label="WhatsApp"
            toggle toggleValue={whatsapp} onToggle={setWhatsapp}
            showChevron={false}
          />
        </SettingsGroup>

        {/* Preferências */}
        <Text style={s.sectionLabel}>Preferências</Text>
        <SettingsGroup>
          <SettingsItem
            icon="🔔" iconBg="#0a0a1a" label="Notificações"
            toggle toggleValue={notifs} onToggle={setNotifs}
            showChevron={false}
          />
          <SettingsItem
            icon="🌙" iconBg="#1a0a1a" label="Tema escuro"
            toggle toggleValue={darkMode} onToggle={setDarkMode}
            showChevron={false}
          />
          <SettingsItem
            icon="🌐" iconBg="#0a1500" label="Idioma"
            value="Português" onPress={() => {}}
          />
        </SettingsGroup>

        {/* Dados */}
        <Text style={s.sectionLabel}>Dados</Text>
        <SettingsGroup>
          <SettingsItem icon="💾" iconBg="#001a0a" label="Backup"           value="Hoje, 09:30" onPress={() => {}} />
          <SettingsItem icon="📊" iconBg="#1a0a00" label="Exportar relatório"                    onPress={() => {}} />
          <SettingsItem icon="ℹ️" iconBg="#0a0015" label="Sobre o app"      value="v1.0.0"       onPress={() => {}} />
        </SettingsGroup>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutIcon}>🚪</Text>
          <Text style={s.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={s.version}>Casas Kitnet Manager · v1.0.0</Text>

      </ScrollView>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#000' },
  header:           { paddingTop: 52, paddingHorizontal: Spacing.containerPadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand:            { fontSize: 22, fontWeight: '700', color: '#F5C518' },
  menuIcon:         { gap: 5 },
  menuLine:         { width: 22, height: 2, backgroundColor: '#F5C518', borderRadius: 2 },
  title:            { fontSize: 32, fontWeight: '800', color: '#fff', paddingHorizontal: Spacing.containerPadding, paddingTop: 20, paddingBottom: 24, letterSpacing: -0.5 },
  profileCard:      { marginHorizontal: Spacing.containerPadding, backgroundColor: '#111', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 28 },
  avatar:           { width: 68, height: 68, borderRadius: 20, backgroundColor: '#1a1a0a', borderWidth: 2, borderColor: '#F5C518', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarEmoji:      { fontSize: 30 },
  profileInfo:      { flex: 1 },
  profileName:      { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 3 },
  profileRole:      { fontSize: 12, color: '#555', marginBottom: 8 },
  profileBadge:     { backgroundColor: 'rgba(245,197,24,0.12)', borderWidth: 1, borderColor: 'rgba(245,197,24,0.2)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  profileBadgeText: { fontSize: 10, fontWeight: '700', color: '#F5C518', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionLabel:     { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#333', paddingHorizontal: Spacing.containerPadding, marginBottom: 10 },
  logoutBtn:        { marginHorizontal: Spacing.containerPadding, backgroundColor: '#111', borderWidth: 1, borderColor: '#2a0a0a', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 },
  logoutIcon:       { fontSize: 16 },
  logoutText:       { fontSize: 15, fontWeight: '700', color: '#ff4444' },
  version:          { textAlign: 'center', fontSize: 11, color: '#2a2a2a', paddingBottom: 8 },
});