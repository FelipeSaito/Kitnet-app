import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { UnitDetails } from '../../components/UnitDetails';
import { useProperty } from '../../src/hooks';
import { Colors } from '../../constants/theme';

export default function KitnetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: k, loading, error, refetch } = useProperty(id);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  if (error || !k) {
    return (
      <View style={s.center}>
        <Text style={s.errorText}>Kitnet não encontrada.</Text>
      </View>
    );
  }

  const financialStatus =
    k.payment_status === 'paid'    ? 'Em dia'   :
    k.payment_status === 'overdue' ? 'Atrasado' : 'Pendente';

  return (
    <View style={s.container}>
      <UnitDetails
        image={k.image_url ?? undefined}
        kitnetName={k.name}
        region={k.region_name}
        status={k.status}
        tenantName={k.tenant_name ?? '—'}
        rentValue={k.rent_value}
        dueDay={k.due_day}
        contractStart={
          k.contract_start
            ? new Date(k.contract_start).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
            : '—'
        }
        area={k.area_m2 ? `${k.area_m2}m²` : '—'}
        financialStatus={financialStatus as any}
        water={k.water_type === 'included' ? 'Incluso' : 'Individual'}
        energy={k.energy_type === 'included' ? 'Incluso' : 'Individual'}
        internet={k.internet ? 'Disponível' : 'Não incluso'}
        type={k.type}
        onBack={() => router.back()}
        onEdit={() => router.push(`/kitnet/${k.id}/edit` as any)}
        onRegisterPayment={() => {}}
        onViewContract={() => {}}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  center:    { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' },
  errorText: { color: Colors.text3, fontSize: 15 },
});