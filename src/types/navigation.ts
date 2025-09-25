import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/NativeStackNavigationProp';

// Auth Stack Navigator
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

// Main Tab Navigator
export type MainTabParamList = {
  Dashboard: undefined;
  Motos: undefined;
  Filiais: undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

// Root Stack Navigator
export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: undefined;
  MotoForm: { moto?: any; mode: 'create' | 'edit' };
  FilialForm: { filial?: any; mode: 'create' | 'edit' };
  MotoDetails: { motoId: number };
  FilialDetails: { filialId: number };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Composite screen props for nested navigators
export type CompositeAuthScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    AuthStackScreenProps<T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type CompositeMainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    MainTabScreenProps<T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;
