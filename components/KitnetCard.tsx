import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Kitnet } from '../types';
import { Colors, Radius, Spacing } from '../constants/theme';
import { StatusBadge } from './StatusBadge';

interface Props {
  kitnet: Kitnet & { due_day?: number; payment_due_date?: string };
  onPress: (kitnet: Kitnet) => void;
}

function getDaysUntilDue(dueDay?: number): { label: string; color: string } | null {
  if (!dueDay) return null;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear  = today.getFullYear();

  let dueDate = new Date(currentYear, currentMonth, dueDay);

  // Se já passou neste mês, calcula para o próximo
  if (dueDate < today) {
    dueDate = new Date(currentYear, currentMonth + 1, dueDay);
  }

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays  = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `Venceu há ${Math.abs(diffDays)}d`, color: '#E53935' };
  } else if (diffDays === 0) {
    return { label: 'Vence hoje!', color: '#E53935' };
  } else if (diffDays <= 3) {
    return { label: `Vence em ${diffDays}d`, color: '#FF8C00' };
  } else if (diffDays <= 7) {
    return { label: `Vence em ${diffDays}d`, color: '#F5C518' };
  } else {
    return { label: `Vence em ${diffDays}d`, color: '#4ade80' };
  }
}

export const KitnetCard: React.FC<Props> = ({ kitnet, onPress }) => {
  const dueBadge = kitnet.status === 'occupied' || kitnet.status === 'overdue'
    ? getDaysUntilDue(kitnet.due_day)
    : null;

  return (
    <TouchableOpacity
      style={[styles.card, kitnet.featured && styles.featured]}
      onPress={() => onPress(kitnet)}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        {kitnet.image ? (
          <Image source={{ uri: kitnet.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.emoji}>🏠</Text>
          </View>
        )}

        {/* Badge de dias no canto superior direito */}
        {dueBadge && (
          <View style={[styles.dueBadge, { backgroundColor: dueBadge.color + '22', borderColor: dueBadge.color + '55' }]}>
            <Text style={[styles.dueText, { color: dueBadge.color }]}>
              ⏰ {dueBadge.label}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{kitnet.name}</Text>
        <Text style={styles.region}>{kitnet.region}</Text>
        <View style={styles.bottom}>
          <Text style={styles.price}>
            R$ {kitnet.price.toLocaleString('pt-BR')}
          </Text>
          <StatusBadge status={kitnet.status} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
  },
  featured: {
    borderColor: Colors.gold,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    backgroundColor: Colors.card2,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  dueBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dueText: {
    fontSize: 9,
    fontWeight: '700',
  },
  body: {
    padding: 10,
    paddingBottom: 12,
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
    marginBottom: 2,
  },
  region: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.text3,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.text,
  },
});