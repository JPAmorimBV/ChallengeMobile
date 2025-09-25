import { apiService } from './api';
import {
  AuthRequest,
  AuthResponse,
  RegisterRequest,
  ApiResponse,
} from '@/types/api';

class AuthService {
  private readonly endpoints = {
    login: '/usuarios/login',
    register: '/usuarios/register',
  };

  /**
   * Realiza login do usuário
   */
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        this.endpoints.login,
        credentials
      );
      
      return response;
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.message || 'Erro ao realizar login');
    }
  }

  /**
   * Registra novo usuário
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // A API Java espera o campo 'role' para registro
      const registerData = {
        email: userData.email,
        senha: userData.senha,
        role: 'ADMIN', // Sempre ADMIN conforme documentação da API
      };

      const response = await apiService.post<AuthResponse>(
        this.endpoints.register,
        registerData
      );

      return response;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      // Tratamento específico para erros de registro
      if (error.message.includes('422')) {
        throw new Error('Email já está em uso ou dados inválidos');
      }
      
      throw new Error(error.message || 'Erro ao criar conta');
    }
  }

  /**
   * Valida se um token ainda é válido
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      // Tenta fazer uma requisição simples para validar o token
      await apiService.requestWithToken('GET', '/filiais', token);
      return true;
    } catch (error) {
      console.log('Token inválido:', error);
      return false;
    }
  }

  /**
   * Refresh token - Re-autentica o usuário
   * Como a API Java não tem refresh token, implementamos re-login
   */
  async refreshToken(email: string, senha: string): Promise<AuthResponse> {
    return this.login({ email, senha });
  }
}

export const authService = new AuthService();
