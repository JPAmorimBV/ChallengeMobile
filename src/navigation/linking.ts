import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';

// Configuração de deep linking para navegação via URLs
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['nexustech://', 'https://nexustech.app'],
  config: {
    screens: {
      AuthStack: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
      MainTabs: {
        screens: {
          Dashboard: 'dashboard',
          Motos: 'motos',
          Filiais: 'filiais',
        },
      },
      MotoForm: {
        path: 'moto/:mode/:id?',
        parse: {
          mode: (mode: string) => mode as 'create' | 'edit',
          id: (id: string) => (id ? parseInt(id, 10) : undefined),
        },
        stringify: {
          mode: (mode: 'create' | 'edit') => mode,
          id: (id?: number) => id?.toString() || '',
        },
      },
      FilialForm: {
        path: 'filial/:mode/:id?',
        parse: {
          mode: (mode: string) => mode as 'create' | 'edit',
          id: (id: string) => (id ? parseInt(id, 10) : undefined),
        },
        stringify: {
          mode: (mode: 'create' | 'edit') => mode,
          id: (id?: number) => id?.toString() || '',
        },
      },
    },
  },
};

// Exemplos de URLs:
// nexustech://login
// nexustech://dashboard
// nexustech://moto/create
// nexustech://moto/edit/123
// nexustech://filial/create
// nexustech://filial/edit/456
