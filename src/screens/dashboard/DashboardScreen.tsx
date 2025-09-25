import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { motoService } from '@/services/motoService';
import { filialService } from '@/services/filialService';
import { CompositeMainTabScreenProps } from '@/types/navigation';

type Props = CompositeMainTabScreenProps<'Dashboard'>;

interface DashboardStats {
  totalMotos: number;
  totalFiliais: number;
  motosDisponiveis: number;
  motosEmUso: number;
}

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMotos: 0,
    totalFiliais: 0,
    motosDisponiveis: 0,
    motosEmUso: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [motosResponse, filiaisResponse] = await Promise.all([
        motoService.getAll(user?.token || ''),
        filialService.getAll(user?.token || ''),
      ]);

      const motosDisponiveis = motosResponse.filter(
        moto => moto.status === 'Disponível'
      ).length;
      const motosEmUso = motosResponse.filter(
        moto => moto.status === 'Em uso'
      ).length;

      setStats({
        totalMotos: motosResponse.length,
        totalFiliais: filiaisResponse.length,
        motosDisponiveis,
        motosEmUso,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const navigateToMotos = () => {
    navigation.navigate('Motos');
  };

  const navigateToFiliais = () => {
    navigation.navigate('Filiais');
  };

  if (loading) {
    return <LoadingSpinner text="Carregando dashboard..." />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Dashboard" showLogout />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: theme.colors.onBackground }]}>
            Bem-vindo, {user?.userEmail}
          </Text>
          <Text style={[styles.welcomeSubtext, { color: theme.colors.onSurfaceVariant }]}>
            Sistema de Gestão Mottu
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <TouchableOpacity style={styles.statCard} onPress={navigateToMotos}>
            <Card style={[styles.statCardContent, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons
                name="motorcycle"
                size={32}
                color={theme.colors.onPrimaryContainer}
              />
              <Text style={[styles.statNumber, { color: theme.colors.onPrimaryContainer }]}>
                {stats.totalMotos}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onPrimaryContainer }]}>
                Total de Motos
              </Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCard} onPress={navigateToFiliais}>
            <Card style={[styles.statCardContent, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Ionicons
                name="business"
                size={32}
                color={theme.colors.onSecondaryContainer}
              />
              <Text style={[styles.statNumber, { color: theme.colors.onSecondaryContainer }]}>
                {stats.totalFiliais}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSecondaryContainer }]}>
                Total de Filiais
              </Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Additional Stats */}
        <View style={styles.additionalStats}>
          <Card style={styles.additionalStatCard}>
            <View style={styles.statRow}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={theme.colors.success}
              />
              <View style={styles.statInfo}>
                <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                  {stats.motosDisponiveis}
                </Text>
                <Text style={[styles.statDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Motos Disponíveis
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.additionalStatCard}>
            <View style={styles.statRow}>
              <Ionicons
                name="time"
                size={24}
                color={theme.colors.warning}
              />
              <View style={styles.statInfo}>
                <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                  {stats.motosEmUso}
                </Text>
                <Text style={[styles.statDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Motos em Uso
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Ações Rápidas
          </Text>
          
          <TouchableOpacity onPress={navigateToMotos}>
            <Card style={styles.actionCard}>
              <View style={styles.actionContent}>
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>
                  Gerenciar Motos
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                />
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToFiliais}>
            <Card style={styles.actionCard}>
              <View style={styles.actionContent}>
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>
                  Gerenciar Filiais
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                />
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statCardContent: {
    alignItems: 'center',
    padding: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  additionalStats: {
    marginBottom: 24,
  },
  additionalStatCard: {
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statInfo: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statDescription: {
    fontSize: 14,
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actionCard: {
    marginBottom: 8,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
  },
});
