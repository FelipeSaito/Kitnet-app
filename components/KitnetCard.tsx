import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Kitnet } from '../types';
import { Colors, Radius, Spacing } from '../constants/theme';
import { StatusBadge } from './StatusBadge';

interface Props {
  kitnet: Kitnet;
  onPress: (kitnet: Kitnet) => void;
}

export const KitnetCard: React.FC<Props> = ({ kitnet, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, kitnet.featured && styles.featured]}
      onPress={() => onPress(kitnet)}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        {kitnet.image ? (
          <Image
            source={{ uri: kitnet.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.emoji}>🏠</Text>
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
    borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    backgroundColor: Colors.card2,
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