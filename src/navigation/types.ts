import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { 
  RootStackParamList, 
  AuthStackParamList, 
  MainTabParamList 
} from '@/types/navigation';

// Props de navegação para telas específicas
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Props de rota para telas específicas
export type AuthRouteProp<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;
export type MainTabRouteProp<T extends keyof MainTabParamList> = RouteProp<MainTabParamList, T>;
export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

// Props combinadas (navegação + rota)
export type AuthScreenProps<T extends keyof AuthStackParamList> = {
  navigation: AuthNavigationProp;
  route: AuthRouteProp<T>;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = {
  navigation: MainTabNavigationProp;
  route: MainTabRouteProp<T>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: RootStackNavigationProp;
  route: RootStackRouteProp<T>;
};

// Configurações de tela
export interface ScreenConfig {
  title?: string;
  headerShown?: boolean;
  gestureEnabled?: boolean;
  animation?: 'default' | 'slide_from_right' | 'slide_from_bottom' | 'fade';
}

// Estado da navegação
export interface NavigationState {
  isReady: boolean;
  currentRoute?: string;
  previousRoute?: string;
  canGoBack: boolean;
}
