import { apiService } from './api';
import {
  FilialRequest,
  FilialResponse,
  ApiResponse,
} from '@/types/api';

class FilialService {
  private readonly endpoints = {
    base: '/filiais',
    getAll: '/filiais',
    getById: (id: number) => `/filiais/${id}`,
    create: '/filiais',
    update: (id: number) => `/filiais/${id}`,
    delete: (id: number) => `/filiais/${id}`,
  };

  /**
   * Busca todas as filiais
   */
  async getAll(token: string): Promise<FilialResponse[]> {
    try {
      const response = await apiService.requestWithToken<FilialResponse[]>(
        'GET',
        this.endpoints.getAll,
        token
      );

      return response;
    } catch (error: any) {
      console.error('Erro ao buscar filiais:', error);
      throw new Error(error.message || 'Erro ao carregar filiais');
    }
  }

  /**
   * Busca uma filial por ID
   */
  async getById(id: number, token: string): Promise<FilialResponse> {
    try {
      const response = await apiService.requestWithToken<FilialResponse>(
        'GET',
        this.endpoints.getById(id),
        token
      );

      return response;
    } catch (error: any) {
      console.error(`Erro ao buscar filial ${id}:`, error);
      throw new Error(error.message || 'Erro ao carregar filial');
    }
  }

  /**
   * Cria uma nova filial
   */
  async create(filialData: FilialRequest): Promise<FilialResponse> {
    try {
      // Validação dos dados antes do envio
      this.validateFilialData(filialData);

      const response = await apiService.requestWithToken<FilialResponse>(
        'POST',
        this.endpoints.create,
        filialData.token,
        {
          nome: filialData.nome.trim(),
          endereco: filialData.endereco.trim(),
        }
      );

      return response;
    } catch (error: any) {
      console.error('Erro ao criar filial:', error);
      
      if (error.message.includes('422')) {
        throw new Error('Dados inválidos. Verifique nome e endereço.');
      }
      
      throw new Error(error.message || 'Erro ao criar filial');
    }
  }

  /**
   * Atualiza uma filial existente
   */
  async update(id: number, filialData: FilialRequest): Promise<FilialResponse> {
    try {
      // Validação dos dados antes do envio
      this.validateFilialData(filialData);

      const response = await apiService.requestWithToken<FilialResponse>(
        'PUT',
        this.endpoints.update(id),
        filialData.token,
        {
          nome: filialData.nome.trim(),
          endereco: filialData.endereco.trim(),
        }
      );

      return response;
    } catch (error: any) {
      console.error(`Erro ao atualizar filial ${id}:`, error);
      
      if (error.message.includes('404')) {
        throw new Error('Filial não encontrada');
      }
      
      if (error.message.includes('422')) {
        throw new Error('Dados inválidos. Verifique nome e endereço.');
      }
      
      throw new Error(error.message || 'Erro ao atualizar filial');
    }
  }

  /**
   * Deleta uma filial
   */
  async delete(id: number, token: string): Promise<void> {
    try {
      await apiService.requestWithToken<void>(
        'DELETE',
        this.endpoints.delete(id),
        token
      );
    } catch (error: any) {
      console.error(`Erro ao deletar filial ${id}:`, error);
      
      if (error.message.includes('404')) {
        throw new Error('Filial não encontrada');
      }
      
      if (error.message.includes('409')) {
        throw new Error('Não é possível excluir filial com motos cadastradas');
      }
      
      throw new Error(error.message || 'Erro ao excluir filial');
    }
  }

  /**
   * Busca filiais com suas motos
   */
  async getFiliaisWithMotos(token: string): Promise<FilialResponse[]> {
    try {
      // A API Java já retorna as motos aninhadas na resposta das filiais
      const filiais = await this.getAll(token);
      
      // Ordenar filiais por nome
      return filiais.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error: any) {
      console.error('Erro ao buscar filiais com motos:', error);
      throw new Error(error.message || 'Erro ao carregar filiais com motos');
    }
  }

  /**
   * Validação de dados da filial
   */
  private validateFilialData(filialData: FilialRequest): void {
    if (!filialData.nome || !filialData.nome.trim()) {
      throw new Error('Nome da filial é obrigatório');
    }

    if (filialData.nome.trim().length < 3) {
      throw new Error('Nome da filial deve ter pelo menos 3 caracteres');
    }

    if (!filialData.endereco || !filialData.endereco.trim()) {
      throw new Error('Endereço é obrigatório');
    }

    if (filialData.endereco.trim().length < 10) {
      throw new Error('Endereço deve ter pelo menos 10 caracteres');
    }

    if (!filialData.token || !filialData.token.trim()) {
      throw new Error('Token de autenticação é obrigatório');
    }
  }
}

export const filialService = new FilialService();
