import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components';
import { StatusBadge } from '../../components/StatusBadge';
import { KITNETS } from '../../data/mockData';
import { Kitnet } from '../../types';
import { Colors, Spacing, Radius } from '../../constants/theme';

const EMOJI_MAP: Record<number, string> = { 1:'🏠',2:'🏡',3:'🏘️',4:'🔨',5:'🏠',6:'🏡',7:'🏘️',8:'🏠' };

export default function KitnetsScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: Kitnet }) => (
    <TouchableOpacity style={styles.row} onPress={() => router.push(`/kitnet/${item.id}`)}>
      <View style={styles.avatar}>
        <Text style={{ fontSize: 20 }}>{EMOJI_MAP[item.id] ?? '🏠'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sub}>{item.region} · {item.address.split('—')[0].trim()}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <Text style={styles.price}>R$ {item.price.toLocaleString('pt-BR')}</Text>
        <StatusBadge status={item.status} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Kitnets"
        right={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/kitnet/new')}
          >
            <Text style={styles.addTxt}>+ Nova</Text>
          </TouchableOpacity>
        }
      />
      <FlatList
        data={KITNETS}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: Spacing.containerPadding,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatar: {
    width: 46, height: 46, backgroundColor: Colors.card2,
    borderRadius: 13, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border2,
  },
  name: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.text },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.text3, marginTop: 2 },
  price: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.gold },
  addBtn: {
    backgroundColor: Colors.gold, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  addTxt: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.black },
});
