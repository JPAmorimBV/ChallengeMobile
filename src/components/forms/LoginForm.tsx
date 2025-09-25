import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthRequest } from '@/types/api';

interface LoginFormProps {
  onSubmit: (data: AuthRequest) => void;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<AuthRequest>({
    email: '',
    senha: '',
  });
  const [errors, setErrors] = useState<Partial<AuthRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthRequest> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateField = (field: keyof AuthRequest, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <View style={styles.container}>
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
      <Button
        title="Entrar"
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
