import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, AuthRequest } from '@/types/api';
import { authService } from '@/services/authService';

interface AuthState {
  user: AuthResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'LOADING' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_TOKEN'; payload: AuthResponse | null };

interface AuthContextType extends AuthState {
  login: (credentials: AuthRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      };
    case 'RESTORE_TOKEN':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: !!action.payload,
        user: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    restoreToken();
  }, []);

  const restoreToken = async () => {
    try {
      const userData = await AsyncStorage.getItem('@nexus_tech:user');
      if (userData) {
        const user: AuthResponse = JSON.parse(userData);
        dispatch({ type: 'RESTORE_TOKEN', payload: user });
      } else {
        dispatch({ type: 'RESTORE_TOKEN', payload: null });
      }
    } catch (error) {
      dispatch({ type: 'RESTORE_TOKEN', payload: null });
    }
  };

  const login = async (credentials: AuthRequest) => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await authService.login(credentials);
      await AsyncStorage.setItem('@nexus_tech:user', JSON.stringify(response));
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@nexus_tech:user');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const register = async (data: any) => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await authService.register(data);
      await AsyncStorage.setItem('@nexus_tech:user', JSON.stringify(response));
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
