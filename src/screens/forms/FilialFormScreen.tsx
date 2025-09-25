import React, { useState } from 'react';
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
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { filialService } from '@/services/filialService';
import { FilialRequest } from '@/types/api';
import { RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<'FilialForm'>;

interface FilialFormData {
  nome: string;
  endereco: string;
}

export const FilialFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mode, filial } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [formData, setFormData] = useState<FilialFormData>({
    nome: filial?.name || '',
    endereco: filial?.endereco || '',
  });
  const [errors, setErrors] = useState<Partial<FilialFormData>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FilialFormData> = {};

    // Validar nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Validar endereço
    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    } else if (formData.endereco.trim().length < 10) {
      newErrors.endereco = 'Endereço deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const requestData: FilialRequest = {
        nome: formData.nome.trim(),
        endereco: formData.endereco.trim(),
        token: user?.token || '',
      };

      if (mode === 'create') {
        await filialService.create(requestData);
        showSuccess('Filial criada com sucesso!');
      } else {
        await filialService.update(filial.id, requestData);
        showSuccess('Filial atualizada com sucesso!');
      }

      navigation.goBack();
    } catch (error: any) {
      showError(error.message || `Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} filial`);
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
      return formData.nome.trim() !== '' || formData.endereco.trim() !== '';
    }
    return (
      formData.nome !== filial?.name ||
      formData.endereco !== filial?.endereco
    );
  };

  const updateField = (field: keyof FilialFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title={mode === 'create' ? 'Nova Filial' : 'Editar Filial'}
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
              {mode === 'create' ? 'Cadastrar Nova Filial' : 'Editar Dados da Filial'}
            </Text>

            <Input
              label="Nome da Filial *"
              value={formData.nome}
              onChangeText={(value) => updateField('nome', value)}
              error={errors.nome}
              placeholder="Digite o nome da filial"
              leftIcon="business"
            />

            <Input
              label="Endereço *"
              value={formData.endereco}
              onChangeText={(value) => updateField('endereco', value)}
              error={errors.endereco}
              placeholder="Rua, número, bairro, cidade - UF"
              leftIcon="location"
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancelar"
              variant="outline"
              onPress={handleCancel}
              style={[styles.button, styles.cancelButton]}
            />
            <Button
              title={mode === 'create' ? 'Criar Filial' : 'Salvar Alterações'}
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
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
