import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, SearchInput, RegionTabs } from '../../components';
import { KitnetCard } from '../../components/KitnetCard';
import { StatusBadge } from '../../components/StatusBadge';
import { KITNETS } from '../../data/mockData';
import { Kitnet, Region } from '../../types';
import { Colors, Spacing } from '../../constants/theme';

const REGIONS: Region[] = ['Campo Limpo', 'Mitsutani'];

export default function DashboardScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState<Region>('Campo Limpo');

  const filtered = useMemo(() =>
    KITNETS.filter(k =>
      k.region === activeRegion &&
      k.name.toLowerCase().includes(search.toLowerCase())
    ), [activeRegion, search]);

  const renderItem = ({ item, index }: { item: Kitnet; index: number }) => (
    <View style={[styles.cardWrapper, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}>
      <KitnetCard
        kitnet={item}
        onPress={() => router.push(`/kitnet/${item.id}`)}
      />
    </View>
  );

  const MenuIcon = () => (
    <TouchableOpacity style={styles.menuIcon}>
      <View style={styles.menuLine} />
      <View style={styles.menuLine} />
      <View style={styles.menuLine} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Sticky header area */}
      <View style={styles.stickyHeader}>
        <Header title="Casas" serif right={<MenuIcon />} />
        <SearchInput value={search} onChangeText={setSearch} placeholder="Buscar kitnets..." />
        <RegionTabs
          active={activeRegion}
          tabs={REGIONS}
          onChange={r => setActiveRegion(r as Region)}
        />
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma kitnet encontrada.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  stickyHeader: { backgroundColor: Colors.bg },
  grid: { paddingHorizontal: Spacing.containerPadding, paddingTop: 16, paddingBottom: 24 },
  cardWrapper: { flex: 1, marginBottom: Spacing.gridGutter },
  cardLeft: { marginRight: Spacing.gridGutter / 2 },
  cardRight: { marginLeft: Spacing.gridGutter / 2 },
  menuIcon: { padding: 4, gap: 5, alignItems: 'flex-end' },
  menuLine: { width: 22, height: 2, backgroundColor: Colors.gold, borderRadius: 2 },
  empty: { fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.text3, textAlign: 'center', paddingTop: 40 },
});
