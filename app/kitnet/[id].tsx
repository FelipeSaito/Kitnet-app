import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { UnitDetails } from '../../components/UnitDetails';
import { KITNETS } from '../../data/mockData';

export default function KitnetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const k = KITNETS.find(x => String(x.id) === id);

  const financialStatus =
    k?.paymentStatus === 'paid'    ? 'Em dia'   :
    k?.paymentStatus === 'overdue' ? 'Atrasado' : 'Pendente';

  return (
    <View style={styles.container}>
      <UnitDetails
        image={k?.image}
        kitnetName={k?.name}
        region={k?.region}
        status={k?.status ?? 'available'}
        tenantName={k?.tenant ?? '—'}
        rentValue={k?.price ?? 0}
        dueDay={15}
        contractStart="Jan 2024"
        area="32m²"
        financialStatus={financialStatus as any}
        water="Incluso"
        energy="Individual"
        internet="Disponível"
        type="Kitnet Studio"
        onBack={() => router.back()}
        onEdit={() => router.push(`/kitnet/${k?.id}/edit` as any)}
        onRegisterPayment={() => {}}
        onViewContract={() => {}}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
});

