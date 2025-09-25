import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, ApiError } from '@/types/api';

// Configuração da base URL da API Java
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8080' // Desenvolvimento
  : 'https://your-production-api.com'; // Produção

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 segundos
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor - Adiciona token automaticamente
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const userData = await AsyncStorage.getItem('@nexus_tech:user');
          if (userData) {
            const user = JSON.parse(userData);
            if (user.token) {
              config.headers.Authorization = `Bearer ${user.token}`;
            }
          }
        } catch (error) {
          console.log('Erro ao recuperar token:', error);
        }
        
        // Log das requisições em desenvolvimento
        if (__DEV__) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
          if (config.data) {
            console.log('📤 Request Data:', config.data);
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor - Tratamento global de respostas
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log das respostas em desenvolvimento
        if (__DEV__) {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
          console.log('📥 Response Data:', response.data);
        }
        return response;
      },
      async (error: AxiosError) => {
        // Log dos erros em desenvolvimento
        if (__DEV__) {
          console.log(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`);
          console.log('📥 Error Data:', error.response?.data);
        }

        // Tratamento específico para diferentes códigos de erro
        if (error.response) {
          const { status, data } = error.response;
          
          switch (status) {
            case 401:
              // Token expirado ou inválido
              await this.handleUnauthorized();
              throw new Error('Sessão expirada. Faça login novamente.');
              
            case 403:
              throw new Error('Acesso negado. Permissões insuficientes.');
              
            case 404:
              throw new Error('Recurso não encontrado.');
              
            case 422:
              // Erro de validação
              throw new Error(
                (data as any)?.message || 'Dados inválidos. Verifique os campos.'
              );
              
            case 500:
              throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
              
            default:
              throw new Error(
                (data as any)?.message || 'Ocorreu um erro inesperado.'
              );
          }
        } else if (error.request) {
          // Erro de rede
          throw new Error('Erro de conexão. Verifique sua internet.');
        } else {
          // Outro tipo de erro
          throw new Error('Ocorreu um erro inesperado.');
        }
      }
    );
  }

  private async handleUnauthorized(): Promise<void> {
    try {
      // Remove dados do usuário do AsyncStorage
      await AsyncStorage.removeItem('@nexus_tech:user');
      
      // Aqui você pode implementar navegação para tela de login
      // Por exemplo, usando um evento ou callback global
      console.log('Token expirado - usuário será redirecionado para login');
    } catch (error) {
      console.log('Erro ao limpar dados do usuário:', error);
    }
  }

  // Método para fazer requisições GET
  async get<T>(url: string): Promise<T> {
    const response = await this.api.get<T>(url);
    return response.data;
  }

  // Método para fazer requisições POST
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  // Método para fazer requisições PUT
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  // Método para fazer requisições DELETE
  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }

  // Método para requisições com token personalizado
  async requestWithToken<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    token?: string,
    data?: any
  ): Promise<T> {
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };

    let response: AxiosResponse<T>;

    switch (method) {
      case 'GET':
        response = await this.api.get<T>(url, config);
        break;
      case 'POST':
        response = await this.api.post<T>(url, data, config);
        break;
      case 'PUT':
        response = await this.api.put<T>(url, data, config);
        break;
      case 'DELETE':
        response = await this.api.delete<T>(url, config);
        break;
    }

    return response.data;
  }
}

export const apiService = new ApiService();
