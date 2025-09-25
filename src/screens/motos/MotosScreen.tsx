import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { motoService } from '@/services/motoService';
import { MotoResponse } from '@/types/api';
import { CompositeMainTabScreenProps } from '@/types/navigation';

type Props = CompositeMainTabScreenProps<'Motos'>;

export const MotosScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();
  const [motos, setMotos] = useState<MotoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('Todos');

  useEffect(() => {
    loadMotos();
  }, []);

  const loadMotos = async () => {
    try {
      const data = await motoService.getAll(user?.token || '');
      setMotos(data);
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar motos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMotos();
    setRefreshing(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await motoService.delete(id, user?.token || '');
      setMotos(motos.filter(moto => moto.id !== id));
      showSuccess('Moto excluída com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao excluir moto');
    }
  };

  const filteredMotos = motos.filter(moto => {
    if (filter === 'Todos') return true;
    return moto.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível':
        return theme.colors.success;
      case 'Em uso':
        return theme.colors.warning;
      case 'Manutenção':
        return theme.colors.error;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const renderMotoItem = ({ item }: { item: MotoResponse }) => (
    <Card style={styles.motoCard}>
      <View style={styles.motoHeader}>
        <View style={styles.motoInfo}>
          <Text style={[styles.motoPlaca, { color: theme.colors.onSurface }]}>
            {item.placa}
          </Text>
          <Text style={[styles.motoFilial, { color: theme.colors.onSurfaceVariant }]}>
            {item.nomeFilial}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.motoActions}>
        <Button
          title="Editar"
          variant="outline"
          size="small"
          onPress={() => navigation.navigate('MotoForm', { 
            moto: item, 
            mode: 'edit' 
          })}
          style={styles.actionButton}
        />
        <Button
          title="Excluir"
          variant="danger"
          size="small"
          onPress={() => handleDelete(item.id)}
          style={styles.actionButton}
        />
      </View>
    </Card>
  );

  if (loading) {
    return <LoadingSpinner text="Carregando motos..." />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Gestão de Motos" />
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['Todos', 'Disponível', 'Em uso', 'Manutenção'].map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              {
                backgroundColor: filter === status 
                  ? theme.colors.primary 
                  : theme.colors.surface,
                borderColor: theme.colors.outline,
              }
            ]}
            onPress={() => setFilter(status)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === status 
                    ? theme.colors.onPrimary 
                    : theme.colors.onSurface,
                }
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <Button
          title="Adicionar Nova Moto"
          onPress={() => navigation.navigate('MotoForm', { mode: 'create' })}
          leftIcon="add"
        />
      </View>

      {/* Motos List */}
      <FlatList
        data={filteredMotos}
        renderItem={renderMotoItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="motorcycle"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              Nenhuma moto encontrada
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  motoCard: {
    marginBottom: 12,
  },
  motoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  motoInfo: {
    flex: 1,
  },
  motoPlaca: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  motoFilial: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  motoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
