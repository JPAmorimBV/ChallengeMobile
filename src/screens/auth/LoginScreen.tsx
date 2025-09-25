import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { LoginForm } from '@/components/forms/LoginForm';
import { Card } from '@/components/ui/Card';
import { AuthRequest } from '@/types/api';
import { CompositeAuthScreenProps } from '@/types/navigation';

type Props = CompositeAuthScreenProps<'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const { showError, showSuccess } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials: AuthRequest) => {
    setLoading(true);
    try {
      await login(credentials);
      showSuccess('Login realizado com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons
                name="flash"
                size={48}
                color={theme.colors.primary}
              />
              <Text style={[styles.logoText, { color: theme.colors.primary }]}>
                Nexus Tech
              </Text>
            </View>
            <Text style={[styles.subtitle, { color: theme.colors.onBackground }]}>
              Sistema de Gestão Mottu
            </Text>
          </View>

          {/* Login Form Card */}
          <Card style={styles.formCard}>
            <Text style={[styles.formTitle, { color: theme.colors.onSurface }]}>
              Entrar na sua conta
            </Text>
            <LoginForm onSubmit={handleLogin} loading={loading} />
          </Card>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: theme.colors.onBackground }]}>
              Não tem uma conta?{' '}
            </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={[styles.registerLink, { color: theme.colors.primary }]}>
                Cadastre-se aqui
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
