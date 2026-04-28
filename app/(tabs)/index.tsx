import React, { useState } from 'react';
import {
  View, FlatList, StyleSheet, TouchableOpacity,
  Text, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Header, SearchInput, RegionTabs } from '../../components';
import { KitnetCard } from '../../components/KitnetCard';
import { useProperties } from '../../src/hooks';
import { PropertyFull } from '../../src/types';
import { Colors, Spacing } from '../../constants/theme';
import { QuickMenu } from '../../components/QuickMenu';

const REGIONS = ['Campo Limpo', 'Mitsutani'];

export default function DashboardScreen() {
  const router = useRouter();
  const [search,       setSearch]       = useState('');
  const [activeRegion, setActiveRegion] = useState('Campo Limpo');
  const [menuOpen,     setMenuOpen]     = useState(false);

  const { data, loading, error, refetch } = useProperties(activeRegion);

  const filtered = data.filter(k =>
    k.name.toLowerCase().includes(search.toLowerCase())
  );

  const MenuIcon = () => (
    <TouchableOpacity style={s.menuIcon} onPress={() => setMenuOpen(true)}>
      <View style={s.menuLine} />
      <View style={s.menuLine} />
      <View style={s.menuLine} />
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }: { item: PropertyFull; index: number }) => (
    <View style={[s.cardWrapper, index % 2 === 0 ? s.cardLeft : s.cardRight]}>
      <KitnetCard
        kitnet={{
          id: item.id as any,
          name: item.name,
          region: item.region_name as any,
          address: item.address,
          status: item.status,
          price: item.rent_value,
          image: item.image_url,
          featured: false,
          paymentStatus: item.payment_status as any,
        }}
        onPress={() => router.push(`/kitnet/${item.id}` as any)}
      />
    </View>
  );

  return (
    <View style={s.container}>
      <View style={s.stickyHeader}>
        <Header title="Casas" serif right={<MenuIcon />} />
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar kitnets..."
        />
        <RegionTabs
          active={activeRegion}
          tabs={REGIONS}
          onChange={r => { setActiveRegion(r); setSearch(''); }}
        />
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color={Colors.gold} size="large" />
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorText}>Erro ao carregar kitnets.</Text>
          <TouchableOpacity onPress={refetch} style={s.retryBtn}>
            <Text style={s.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={renderItem}
          contentContainerStyle={s.grid}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={loading}
          ListEmptyComponent={
            <Text style={s.empty}>Nenhuma kitnet encontrada.</Text>
          }
        />
      )}

      <QuickMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.bg },
  stickyHeader: { backgroundColor: Colors.bg },
  grid:         { paddingHorizontal: Spacing.containerPadding, paddingTop: 16, paddingBottom: 24 },
  cardWrapper:  { flex: 1, marginBottom: Spacing.gridGutter },
  cardLeft:     { marginRight: Spacing.gridGutter / 2 },
  cardRight:    { marginLeft: Spacing.gridGutter / 2 },
  menuIcon:     { padding: 4, gap: 5, alignItems: 'flex-end' },
  menuLine:     { width: 22, height: 2, backgroundColor: Colors.gold, borderRadius: 2 },
  center:       { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText:    { color: Colors.text3, fontSize: 15, marginBottom: 12 },
  retryBtn:     { backgroundColor: Colors.gold, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  retryText:    { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#000' },
  empty:        { fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.text3, textAlign: 'center', paddingTop: 40 },
});