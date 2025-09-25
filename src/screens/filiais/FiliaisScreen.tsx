import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
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
import { filialService } from '@/services/filialService';
import { FilialResponse } from '@/types/api';
import { CompositeMainTabScreenProps } from '@/types/navigation';

type Props = CompositeMainTabScreenProps<'Filiais'>;

export const FiliaisScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();
  const [filiais, setFiliais] = useState<FilialResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedFiliais, setExpandedFiliais] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadFiliais();
  }, []);

  const loadFiliais = async () => {
    try {
      const data = await filialService.getAll(user?.token || '');
      setFiliais(data);
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar filiais');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFiliais();
    setRefreshing(false);
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta filial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await filialService.delete(id, user?.token || '');
              setFiliais(filiais.filter(filial => filial.id !== id));
              showSuccess('Filial excluída com sucesso!');
            } catch (error: any) {
              showError(error.message || 'Erro ao excluir filial');
            }
          },
        },
      ]
    );
  };

  const toggleExpanded = (filialId: number) => {
    const newExpanded = new Set(expandedFiliais);
    if (newExpanded.has(filialId)) {
      newExpanded.delete(filialId);
    } else {
      newExpanded.add(filialId);
    }
    setExpandedFiliais(newExpanded);
  };

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

  const renderFilialItem = ({ item }: { item: FilialResponse }) => {
    const isExpanded = expandedFiliais.has(item.id);
    
    return (
      <Card style={styles.filialCard}>
        {/* Filial Header */}
        <TouchableOpacity
          style={styles.filialHeader}
          onPress={() => toggleExpanded(item.id)}
        >
          <View style={styles.filialInfo}>
            <Text style={[styles.filialName, { color: theme.colors.onSurface }]}>
              {item.name}
            </Text>
            <Text style={[styles.filialEndereco, { color: theme.colors.onSurfaceVariant }]}>
              {item.endereco}
            </Text>
            <Text style={[styles.motosCount, { color: theme.colors.primary }]}>
              {item.motos.length} {item.motos.length === 1 ? 'moto' : 'motos'}
            </Text>
          </View>
          <View style={styles.expandIcon}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.onSurfaceVariant}
            />
          </View>
        </TouchableOpacity>

        {/* Motos da Filial (quando expandida) */}
        {isExpanded && (
          <View style={styles.motosContainer}>
            <View style={styles.motosHeader}>
              <Text style={[styles.motosTitle, { color: theme.colors.onSurface }]}>
                Motos desta filial:
              </Text>
            </View>
            
            {item.motos.length > 0 ? (
              item.motos.map((moto, index) => (
                <View key={moto.id} style={styles.motoItem}>
                  <View style={styles.motoItemInfo}>
                    <Text style={[styles.motoPlaca, { color: theme.colors.onSurface }]}>
                      {moto.placa}
                    </Text>
                    <View style={[
                      styles.motoStatusBadge,
                      { backgroundColor: getStatusColor(moto.status) }
                    ]}>
                      <Text style={styles.motoStatusText}>{moto.status}</Text>
                    </View>
                  </View>
                  {index < item.motos.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyMotos}>
                <Ionicons
                  name="motorcycle"
                  size={32}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text style={[styles.emptyMotosText, { color: theme.colors.onSurfaceVariant }]}>
                  Nenhuma moto cadastrada nesta filial
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Actions */}
        <View style={styles.filialActions}>
          <Button
            title="Editar"
            variant="outline"
            size="small"
            onPress={() => navigation.navigate('FilialForm', { 
              filial: item, 
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
  };

  if (loading) {
    return <LoadingSpinner text="Carregando filiais..." />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Gestão de Filiais" />
      
      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <Button
          title="Adicionar Nova Filial"
          onPress={() => navigation.navigate('FilialForm', { mode: 'create' })}
          leftIcon="add"
        />
      </View>

      {/* Filiais List */}
      <FlatList
        data={filiais}
        renderItem={renderFilialItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="business"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              Nenhuma filial encontrada
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
  filialCard: {
    marginBottom: 16,
    padding: 0,
  },
  filialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  filialInfo: {
    flex: 1,
  },
  filialName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  filialEndereco: {
    fontSize: 14,
    marginBottom: 4,
  },
  motosCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  expandIcon: {
    padding: 4,
  },
  motosContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  motosHeader: {
    paddingVertical: 12,
  },
  motosTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  motoItem: {
    paddingVertical: 8,
  },
  motoItemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  motoPlaca: {
    fontSize: 14,
    fontWeight: '500',
  },
  motoStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  motoStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginTop: 8,
  },
  emptyMotos: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyMotosText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  filialActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
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
