import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular, Inter_500Medium,
  Inter_600SemiBold, Inter_700Bold,
} from '@expo-google-fonts/inter';
import { NotoSerif_700Bold } from '@expo-google-fonts/noto-serif';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter, useSegments } from 'expo-router';
import { getSession } from '../src/services/authService';
import { onAuthStateChange } from '../src/services/authService';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router   = useRouter();
  const segments = useSegments();
  const [session,    setSession]    = useState<any>(undefined);
  const [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium,
    Inter_600SemiBold, Inter_700Bold,
    NotoSerif_700Bold,
  });

  useEffect(() => {
    getSession().then(s => setSession(s));
    const { data: { subscription } } = onAuthStateChange(s => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!fontsLoaded || session === undefined) return;
    SplashScreen.hideAsync();
    const inAuth = segments[0] === 'login';
    if (!session && !inAuth) router.replace('/login' as any);
    if (session  &&  inAuth) router.replace('/(tabs)' as any);
  }, [session, fontsLoaded, segments]);

  if (!fontsLoaded || session === undefined) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0a0a0a' } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="kitnet/[id]"      options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="kitnet/new"       options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="kitnet/[id]/edit" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="tenant/new"       options={{ animation: 'slide_from_bottom' }} />
    </Stack>
        </>
  );
}