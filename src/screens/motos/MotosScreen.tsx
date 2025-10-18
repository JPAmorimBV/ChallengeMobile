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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user, getCurrentUserId } = useAuth();
  const { showError, showSuccess } = useToast();
  const [motos, setMotos] = useState<MotoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all');

  useEffect(() => {
    loadMotos();
  }, [viewMode]);

  const loadMotos = async () => {
    try {
      const currentUserId = getCurrentUserId();
      
      let data: MotoResponse[];
      if (viewMode === 'mine' && currentUserId) {
        data = await motoService.getByUser(currentUserId, user?.token || '');
      } else {
        data = await motoService.getAll(user?.token || '');
      }
      
      setMotos(data);
    } catch (error: any) {
      showError(error.message || t('errors.unknown'));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMotos();
    setRefreshing(false);
  };

  const handleDelete = async (moto: MotoResponse) => {
    Alert.alert(
      t('motos.deleteConfirm'),
      `${t('motos.plate')}: ${moto.placa}`,
      [
        { text: t('common.no'), style: 'cancel' },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: async () => {
            try {
              await motoService.delete(moto.id, user?.token || '', moto.placa);
              setMotos(motos.filter(m => m.id !== moto.id));
              showSuccess(t('motos.deleteSuccess'));
            } catch (error: any) {
              showError(error.message || t('errors.unknown'));
            }
          },
        },
      ]
    );
  };

  const filteredMotos = motos.filter(moto => {
    if (filter === 'all') return true;
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

  const canEditMoto = (moto: MotoResponse): boolean => {
    const currentUserId = getCurrentUserId();
    return currentUserId === moto.userId;
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
          {!canEditMoto(item) && item.userEmail && (
            <Text style={[styles.motoOwner, { color: theme.colors.primary }]}>
              {t('motos.owner')}: {item.userEmail}
            </Text>
          )}
          {canEditMoto(item) && (
            <Text style={[styles.motoOwner, { color: theme.colors.success }]}>
              {t('motos.yourMoto')}
            </Text>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.motoActions}>
        {canEditMoto(item) ? (
          <>
            <Button
              title={t('common.edit')}
              variant="outline"
              size="small"
              onPress={() => navigation.navigate('MotoForm', { 
                moto: item, 
                mode: 'edit' 
              })}
              style={styles.actionButton}
            />
            <Button
              title={t('common.delete')}
              variant="danger"
              size="small"
              onPress={() => handleDelete(item)}
              style={styles.actionButton}
            />
          </>
        ) : (
          <Text style={[styles.cannotEditText, { color: theme.colors.onSurfaceVariant }]}>
            {t('motos.onlyOwnerCanEdit')}
          </Text>
        )}
      </View>
    </Card>
  );

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title={t('motos.title')} />
      
      {/* View Toggle */}
      <View style={styles.viewToggleContainer}>
        <TouchableOpacity
          style={[
            styles.viewToggleButton,
            {
              backgroundColor: viewMode === 'all' ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.outline,
            }
          ]}
          onPress={() => setViewMode('all')}
        >
          <Text
            style={[
              styles.viewToggleText,
              {
                color: viewMode === 'all' ? theme.colors.onPrimary : theme.colors.onSurface,
              }
            ]}
          >
            {t('motos.allMotos')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.viewToggleButton,
            {
              backgroundColor: viewMode === 'mine' ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.outline,
            }
          ]}
          onPress={() => setViewMode('mine')}
        >
          <Text
            style={[
              styles.viewToggleText,
              {
                color: viewMode === 'mine' ? theme.colors.onPrimary : theme.colors.onSurface,
              }
            ]}
          >
            {t('motos.myMotos')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['all', 'Disponível', 'Em uso', 'Manutenção'].map(status => (
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
              {status === 'all' ? t('common.all') : status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <Button
          title={t('motos.addNew')}
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
              {viewMode === 'mine' 
                ? t('motos.noYourMotos')
                : t('motos.noMotosFound')}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewToggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewToggleButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  viewToggleText: {
    fontSize: 14,
    fontWeight: '600',
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
  list: { flex: 1 },
  listContent: { padding: 16 },
  motoCard: { marginBottom: 12 },
  motoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  motoInfo: { flex: 1 },
  motoPlaca: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  motoFilial: {
    fontSize: 14,
    marginBottom: 4,
  },
  motoOwner: {
    fontSize: 12,
    fontWeight: '500',
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
    alignItems: 'center',
  },
  actionButton: { marginLeft: 8 },
  cannotEditText: {
    fontSize: 12,
    fontStyle: 'italic',
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
