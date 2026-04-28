import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KitnetStatus } from '../types';
import { Colors, Radius } from '../constants/theme';

interface Props {
  status: KitnetStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<KitnetStatus, { label: string; bg: string; color: string }> = {
  available:   { label: 'Disponível',  bg: 'rgba(76,175,80,0.18)',  color: '#4CAF50' },
  occupied:    { label: 'Ocupada',     bg: 'rgba(255,201,40,0.15)', color: Colors.gold },
  maintenance: { label: 'Manutenção',  bg: 'rgba(255,140,0,0.18)', color: '#FF8C00' },
  overdue:     { label: 'Em atraso',   bg: 'rgba(229,57,53,0.18)', color: '#E53935' },
};

export const StatusBadge: React.FC<Props> = ({ status, size = 'sm' }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, size === 'md' && styles.md]}>
      <Text style={[styles.text, { color: cfg.color }, size === 'md' && styles.textMd]}>
        {cfg.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textMd: {
    fontSize: 12,
  },
});
