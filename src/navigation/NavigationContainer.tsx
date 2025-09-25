import React from 'react';
import { NavigationContainer as RNNavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { RootStack } from './RootStack';

// Tema personalizado para navegação
const createNavigationTheme = (isDark: boolean, colors: any) => ({
  ...(isDark ? DarkTheme : DefaultTheme),
  colors: {
    ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.onBackground,
    border: colors.outline,
    notification: colors.primary,
  },
});

export const NavigationContainer: React.FC = () => {
  const { theme, isDark } = useTheme();
  
  const navigationTheme = createNavigationTheme(isDark, theme.colors);

  return (
    <RNNavigationContainer theme={navigationTheme}>
      <RootStack />
    </RNNavigationContainer>
  );
};
