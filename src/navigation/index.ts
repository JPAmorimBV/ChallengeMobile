// Exportações centralizadas da navegação
export { NavigationContainer } from './NavigationContainer';
export { AuthStack } from './AuthStack';
export { MainTabs } from './MainTabs';
export { RootStack } from './RootStack';
export { NavigationUtils, useNavigation, navigationRef } from './navigationUtils';
export { linking } from './linking';

// Re-exportar tipos
export type {
  AuthNavigationProp,
  MainTabNavigationProp,
  RootStackNavigationProp,
  AuthRouteProp,
  MainTabRouteProp,
  RootStackRouteProp,
  AuthScreenProps,
  MainTabScreenProps,
  RootStackScreenProps,
  ScreenConfig,
  NavigationState,
} from './types';
