import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signIn } from '../src/services/authService';

export default function LoginScreen() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }
    try {
      setLoading(true);
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erro', 'Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Logo */}
      <View style={s.logoArea}>
        <Text style={s.logoTitle}>Casas</Text>
        <Text style={s.logoSub}>Gestão de Kitnets</Text>
      </View>

      {/* Form */}
      <View style={s.form}>
        <Text style={s.label}>Email</Text>
        <TextInput
          style={s.input}
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          placeholderTextColor="#444"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={s.label}>Senha</Text>
        <TextInput
          style={s.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#444"
          secureTextEntry
        />

        <TouchableOpacity
          style={[s.btn, loading && s.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={s.btnText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={s.version}>Casas Kitnet Manager v1.0</Text>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 24 },
  logoArea:    { alignItems: 'center', marginBottom: 48 },
  logoTitle:   { fontSize: 48, fontWeight: '800', color: '#F5C518', letterSpacing: -1 },
  logoSub:     { fontSize: 14, color: '#555', marginTop: 4 },
  form:        { gap: 12 },
  label:       { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7, color: '#555' },
  input:       { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 14, padding: 16, color: '#fff', fontSize: 15 },
  btn:         { backgroundColor: '#F5C518', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText:     { fontSize: 16, fontWeight: '800', color: '#000' },
  version:     { textAlign: 'center', color: '#222', fontSize: 11, marginTop: 40 },
});