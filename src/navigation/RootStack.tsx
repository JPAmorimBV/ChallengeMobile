import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { MotoFormScreen } from '@/screens/forms/MotoFormScreen';
import { FilialFormScreen } from '@/screens/forms/FilialFormScreen';
import { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return <LoadingSpinner text="Verificando autenticação..." />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      {!isAuthenticated ? (
        // Stack de autenticação (Login/Register)
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
      ) : (
        // Stack principal autenticado
        <Stack.Group>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{
              gestureEnabled: false, // Desabilita gesto para não sair acidentalmente
            }}
          />
          
          {/* Modais e telas de formulário */}
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen
              name="MotoForm"
              component={MotoFormScreen}
              options={{
                title: 'Moto',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="FilialForm"
              component={FilialFormScreen}
              options={{
                title: 'Filial',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack.Group>
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};
