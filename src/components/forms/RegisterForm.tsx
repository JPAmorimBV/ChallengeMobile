import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => void;
  loading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<RegisterData>({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmarSenha.trim()) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateField = (field: keyof RegisterData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Nome Completo"
        value={formData.nome}
        onChangeText={(value) => updateField('nome', value)}
        error={errors.nome}
        leftIcon="person"
        placeholder="Digite seu nome completo"
      />
      <Input
        label="Email"
        value={formData.email}
        onChangeText={(value) => updateField('email', value)}
        error={errors.email}
        leftIcon="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="seu@email.com"
      />
      <Input
        label="Senha"
        value={formData.senha}
        onChangeText={(value) => updateField('senha', value)}
        error={errors.senha}
        leftIcon="lock-closed"
        isPassword
        placeholder="Digite sua senha"
      />
      <Input
        label="Confirmar Senha"
        value={formData.confirmarSenha}
        onChangeText={(value) => updateField('confirmarSenha', value)}
        error={errors.confirmarSenha}
        leftIcon="lock-closed"
        isPassword
        placeholder="Confirme sua senha"
      />
      <Button
        title="Cadastrar"
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  submitButton: {
    marginTop: 8,
  },
});
