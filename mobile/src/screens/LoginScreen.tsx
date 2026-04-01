// ══════════════════════════════════════════════════════════
// LOGIN SCREEN
// ══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, BorderRadius, FontSizes } from '../config/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      await login(email.trim(), senha);
      router.replace('/(tabs)');
    } catch (e: any) {
      setErro(e?.message ?? 'Erro ao fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/images/splash-icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.titulo}>Controle Agro</Text>
          <Text style={styles.subtitulo}>Gestão de vendas no campo</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Entrar</Text>

          {/* E-mail */}
          <View style={styles.campoContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={Colors.gray[300]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Senha */}
          <View style={styles.campoContainer}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.senhaContainer}>
              <TextInput
                style={styles.senhaInput}
                placeholder="••••••••"
                placeholderTextColor={Colors.gray[300]}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.olhoBtn}
                onPress={() => setSenhaVisivel(v => !v)}>
                <Text style={styles.olhoTexto}>{senhaVisivel ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Erro */}
          {!!erro && (
            <View style={styles.erroContainer}>
              <Text style={styles.erroTexto}>{erro}</Text>
            </View>
          )}

          {/* Botão */}
          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesabilitado]}
            onPress={handleLogin}
            disabled={carregando}
            activeOpacity={0.85}>
            {carregando ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.botaoTexto}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.rodape}>Controle Agro © {new Date().getFullYear()}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.green[700],
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },

  // Logo
  logoArea: {
    alignItems: 'center',
    marginBottom: Spacing.xxl + 8,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  subtitulo: {
    fontSize: FontSizes.base,
    color: Colors.green[200],
    marginTop: 4,
  },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  cardTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.gray[900],
    marginBottom: Spacing.xl,
  },

  // Campos
  campoContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.base + 1,
    color: Colors.gray[900],
  },
  senhaContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  senhaInput: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.base + 1,
    color: Colors.gray[900],
  },
  olhoBtn: {
    paddingHorizontal: Spacing.md,
  },
  olhoTexto: {
    fontSize: 16,
  },

  // Erro
  erroContainer: {
    backgroundColor: Colors.red[50],
    borderWidth: 1,
    borderColor: Colors.red[100],
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  erroTexto: {
    color: Colors.red[600],
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },

  // Botão
  botao: {
    backgroundColor: Colors.green[600],
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: Colors.white,
    fontSize: FontSizes.base + 2,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Rodapé
  rodape: {
    textAlign: 'center',
    color: Colors.green[200],
    fontSize: FontSizes.xs,
    marginTop: Spacing.xl,
  },
});
