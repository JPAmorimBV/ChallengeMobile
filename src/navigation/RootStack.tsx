import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { MotoFormScreen } from '@/screens/forms/MotoFormScreen';
import { FilialFormScreen } from '@/screens/forms/FilialFormScreen';
import { AboutScreen } from '@/screens/about/AboutScreen';
import { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

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
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{
              gestureEnabled: false,
            }}
          />
          
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
            <Stack.Screen
              name="About"
              component={AboutScreen}
              options={{
                title: 'Sobre',
                animation: 'slide_from_right',
              }}
            />
          </Stack.Group>
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};
