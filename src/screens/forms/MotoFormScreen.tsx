import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { motoService } from '@/services/motoService';
import { filialService } from '@/services/filialService';
import { MotoRequest, FilialResponse, MOTO_STATUS } from '@/types/api';
import { RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<'MotoForm'>;

// Interface apenas com dados que o usuário preenche
interface MotoFormData {
  placa: string;
  status: string;
  filialId: number;
  // será obtido automaticamente do contexto de autenticação
}

export const MotoFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mode, moto } = route.params;
  const { theme } = useTheme();
  const { user, getCurrentUserId, getCurrentUserEmail } = useAuth();
  const { showError, showSuccess } = useToast();

  const [formData, setFormData] = useState<MotoFormData>({
    placa: moto?.placa || '',
    status: moto?.status || 'Disponível',
    filialId: moto?.filialId || 0,
  });
  const [errors, setErrors] = useState<Partial<MotoFormData>>({});
  const [loading, setLoading] = useState(false);
  const [filiais, setFiliais] = useState<FilialResponse[]>([]);
  const [loadingFiliais, setLoadingFiliais] = useState(true);

  useEffect(() => {
    loadFiliais();
  }, []);

  const loadFiliais = async () => {
    try {
      const data = await filialService.getAll(user?.token || '');
      setFiliais(data);
      
      if (formData.filialId === 0 && data.length > 0) {
        setFormData(prev => ({ ...prev, filialId: data[0].id }));
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar filiais');
    } finally {
      setLoadingFiliais(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<MotoFormData> = {};

    // Validar placa
    if (!formData.placa.trim()) {
      newErrors.placa = 'Placa é obrigatória';
    } else if (!/^[A-Z]{3}-\d{4}$/.test(formData.placa.toUpperCase())) {
      newErrors.placa = 'Placa deve estar no formato ABC-1234';
    }

    // Validar status
    if (!formData.status) {
      newErrors.status = 'Status é obrigatório';
    }

    // Validar filial
    if (!formData.filialId || formData.filialId === 0) {
      newErrors.filialId = 'Filial é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Obter userId do contexto de autenticação
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      showError('Erro: usuário não identificado. Faça login novamente.');
      return;
    }

    setLoading(true);
    try {
      // Criar objeto sem userId (será adicionado pelo service)
      const motoDataWithoutUserId: Omit<MotoRequest, 'userId'> = {
        placa: formData.placa.toUpperCase(),
        status: formData.status,
        filialId: formData.filialId,
        token: user?.token || '',
      };

      if (mode === 'create') {
        // Passar userId separadamente para o service
        await motoService.create(motoDataWithoutUserId, currentUserId);
        showSuccess('Moto criada com sucesso!');
      } else {
        // Passar userId separadamente para o service
        await motoService.update(moto.id, motoDataWithoutUserId, currentUserId);
        showSuccess('Moto atualizada com sucesso!');
      }

      navigation.goBack();
    } catch (error: any) {
      showError(error.message || `Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} moto`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges()) {
      Alert.alert(
        'Descartar Alterações',
        'Tem certeza que deseja descartar as alterações?',
        [
          { text: 'Continuar Editando', style: 'cancel' },
          { text: 'Descartar', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const hasChanges = (): boolean => {
    if (mode === 'create') {
      return formData.placa.trim() !== '' || formData.status !== 'Disponível';
    }
    return (
      formData.placa !== moto?.placa ||
      formData.status !== moto?.status ||
      formData.filialId !== moto?.filialId
    );
  };

  const updateField = (field: keyof MotoFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  if (loadingFiliais) {
    return <LoadingSpinner text="Carregando formulário..." />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title={mode === 'create' ? 'Nova Moto' : 'Editar Moto'}
        showBackButton
        onBackPress={handleCancel}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.formCard}>
            <Text style={[styles.formTitle, { color: theme.colors.onSurface }]}>
              {mode === 'create' ? 'Cadastrar Nova Moto' : 'Editar Dados da Moto'}
            </Text>

            {/* Informação do proprietário (automática) */}
            <View style={styles.ownerInfoCard}>
              <View style={styles.ownerInfoHeader}>
                <Text style={[styles.ownerInfoLabel, { color: theme.colors.onSurfaceVariant }]}>
                  📝 Proprietário (automático):
                </Text>
              </View>
              <Text style={[styles.ownerInfoValue, { color: theme.colors.primary }]}>
                {getCurrentUserEmail()}
              </Text>
              <Text style={[styles.ownerInfoNote, { color: theme.colors.onSurfaceVariant }]}>
                Esta moto será cadastrada automaticamente em seu nome
              </Text>
            </View>

            {/* APENAS CAMPOS QUE O USUÁRIO PREENCHE */}
            
            {/* Campo Placa */}
            <Input
              label="Placa da Moto *"
              value={formData.placa}
              onChangeText={(value) => updateField('placa', value)}
              error={errors.placa}
              placeholder="ABC-1234"
              autoCapitalize="characters"
              maxLength={8}
              leftIcon="car"
            />

            {/* Campo Status */}
            <View style={styles.pickerContainer}>
              <Text style={[styles.pickerLabel, { color: theme.colors.onSurface }]}>
                Status da Moto *
              </Text>
              <View
                style={[
                  styles.pickerWrapper,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: errors.status ? theme.colors.error : theme.colors.outline,
                  },
                ]}
              >
                <Picker
                  selectedValue={formData.status}
                  onValueChange={(value) => updateField('status', value)}
                  style={[styles.picker, { color: theme.colors.onSurface }]}
                >
                  {MOTO_STATUS.map(status => (
                    <Picker.Item key={status} label={status} value={status} />
                  ))}
                </Picker>
              </View>
              {errors.status && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.status}
                </Text>
              )}
            </View>

            {/* Campo Filial */}
            <View style={styles.pickerContainer}>
              <Text style={[styles.pickerLabel, { color: theme.colors.onSurface }]}>
                Filial de Cadastro *
              </Text>
              <View
                style={[
                  styles.pickerWrapper,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: errors.filialId ? theme.colors.error : theme.colors.outline,
                  },
                ]}
              >
                <Picker
                  selectedValue={formData.filialId}
                  onValueChange={(value) => updateField('filialId', value)}
                  style={[styles.picker, { color: theme.colors.onSurface }]}
                >
                  <Picker.Item label="Selecione uma filial" value={0} />
                  {filiais.map(filial => (
                    <Picker.Item key={filial.id} label={filial.name} value={filial.id} />
                  ))}
                </Picker>
              </View>
              {errors.filialId && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.filialId}
                </Text>
              )}
            </View>

            {/* Nota informativa */}
            <View style={styles.infoNote}>
              <Text style={[styles.infoNoteText, { color: theme.colors.onSurfaceVariant }]}>
                💡 Apenas preencha os dados da moto. Seu ID de usuário será enviado automaticamente para o sistema.
              </Text>
            </View>
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancelar"
              variant="outline"
              onPress={handleCancel}
              style={[styles.button, styles.cancelButton]}
            />
            <Button
              title={mode === 'create' ? 'Cadastrar Moto' : 'Salvar Alterações'}
              onPress={handleSubmit}
              loading={loading}
              style={[styles.button, styles.submitButton]}
            />
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
    padding: 16,
  },
  formCard: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  
  // Estilos para card de informações do proprietário
  ownerInfoCard: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.2)',
  },
  ownerInfoHeader: {
    marginBottom: 8,
  },
  ownerInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  ownerInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ownerInfoNote: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 16,
  },

  // Estilos dos campos do formulário
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
  },
  picker: {
    height: 48,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },

  // Nota informativa
  infoNote: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  infoNoteText: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },

  // Botões
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginRight: 8,
  },
  submitButton: {
    marginLeft: 8,
  },
});
