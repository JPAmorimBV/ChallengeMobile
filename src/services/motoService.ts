import { apiService } from './api';
import {
  MotoRequest,
  MotoResponse,
  ApiResponse,
} from '@/types/api';

class MotoService {
  private readonly endpoints = {
    base: '/motos',
    getAll: '/motos',
    getById: (id: number) => `/motos/${id}`,
    getByUser: (userId: number) => `/motos/user/${userId}`,
    create: '/motos',
    update: (id: number) => `/motos/${id}`,
    delete: (id: number) => `/motos/${id}`,
  };

  /**
   * Busca todas as motos
   */
  async getAll(token: string): Promise<MotoResponse[]> {
    try {
      const response = await apiService.requestWithToken<MotoResponse[]>(
        'GET',
        this.endpoints.getAll,
        token
      );

      return response;
    } catch (error: any) {
      console.error('Erro ao buscar motos:', error);
      throw new Error(error.message || 'Erro ao carregar motos');
    }
  }

  /**
   * Busca motos por usuário
   */
  async getByUser(userId: number, token: string): Promise<MotoResponse[]> {
    try {
      const response = await apiService.requestWithToken<MotoResponse[]>(
        'GET',
        this.endpoints.getByUser(userId),
        token
      );

      return response;
    } catch (error: any) {
      console.error(`Erro ao buscar motos do usuário ${userId}:`, error);
      throw new Error(error.message || 'Erro ao carregar suas motos');
    }
  }

  /**
   * Busca uma moto por ID
   */
  async getById(id: number, token: string): Promise<MotoResponse> {
    try {
      const response = await apiService.requestWithToken<MotoResponse>(
        'GET',
        this.endpoints.getById(id),
        token
      );

      return response;
    } catch (error: any) {
      console.error(`Erro ao buscar moto ${id}:`, error);
      throw new Error(error.message || 'Erro ao carregar moto');
    }
  }

  /**
   * Cria uma nova moto 
   */
  async create(
    motoData: Omit<MotoRequest, 'userId'>, // Remove userId do tipo obrigatório
    userId: number // Passa userId separadamente
  ): Promise<MotoResponse> {
    try {
      // Validação dos dados antes do envio (sem userId)
      this.validateMotoDataWithoutUserId(motoData);

      // Verifica se userId é válido
      if (!userId || userId <= 0) {
        throw new Error('ID do usuário é obrigatório para cadastrar moto');
      }

      const requestPayload = {
        placa: motoData.placa.toUpperCase(),
        status: motoData.status,
        filialId: motoData.filialId,
        userId: userId, // Adicionado automaticamente pelo service
      };

      console.log('🚀 Enviando dados da moto:', requestPayload);

      const response = await apiService.requestWithToken<MotoResponse>(
        'POST',
        this.endpoints.create,
        motoData.token,
        requestPayload
      );

      return response;
    } catch (error: any) {
      console.error('Erro ao criar moto:', error);
      
      if (error.message.includes('422')) {
        throw new Error('Dados inválidos. Verifique a placa e filial.');
      }
      
      throw new Error(error.message || 'Erro ao criar moto');
    }
  }

  /**
   * Atualiza uma moto existente - 
   */
  async update(
    id: number,
    motoData: Omit<MotoRequest, 'userId'>, 
    userId: number 
  ): Promise<MotoResponse> {
    try {
      // Validação dos dados antes do envio (sem userId)
      this.validateMotoDataWithoutUserId(motoData);

      // Verifica se userId é válido
      if (!userId || userId <= 0) {
        throw new Error('ID do usuário é obrigatório para atualizar moto');
      }

      const requestPayload = {
        placa: motoData.placa.toUpperCase(),
        status: motoData.status,
        filialId: motoData.filialId,
        userId: userId, // Adicionado automaticamente pelo service
      };

      console.log('🚀 Atualizando dados da moto:', requestPayload);

      const response = await apiService.requestWithToken<MotoResponse>(
        'PUT',
        this.endpoints.update(id),
        motoData.token,
        requestPayload
      );

      return response;
    } catch (error: any) {
      console.error(`Erro ao atualizar moto ${id}:`, error);
      
      if (error.message.includes('404')) {
        throw new Error('Moto não encontrada');
      }
      
      if (error.message.includes('403')) {
        throw new Error('Você não tem permissão para editar esta moto');
      }
      
      if (error.message.includes('422')) {
        throw new Error('Dados inválidos. Verifique a placa e filial.');
      }
      
      throw new Error(error.message || 'Erro ao atualizar moto');
    }
  }

  /**
   * Deleta uma moto
   */
  async delete(id: number, token: string): Promise<void> {
    try {
      await apiService.requestWithToken<void>(
        'DELETE',
        this.endpoints.delete(id),
        token
      );
    } catch (error: any) {
      console.error(`Erro ao deletar moto ${id}:`, error);
      
      if (error.message.includes('404')) {
        throw new Error('Moto não encontrada');
      }

      if (error.message.includes('403')) {
        throw new Error('Você não tem permissão para excluir esta moto');
      }
      
      throw new Error(error.message || 'Erro ao excluir moto');
    }
  }

  /**
   * Busca motos por filial
   */
  async getByFilial(filialId: number, token: string): Promise<MotoResponse[]> {
    try {
      const allMotos = await this.getAll(token);
      return allMotos.filter(moto => 
        moto.nomeFilial === filialId.toString() || 
        moto.nomeFilial.includes(filialId.toString())
      );
    } catch (error: any) {
      console.error(`Erro ao buscar motos da filial ${filialId}:`, error);
      throw new Error(error.message || 'Erro ao carregar motos da filial');
    }
  }

  /**
   * Busca motos por status
   */
  async getByStatus(status: string, token: string): Promise<MotoResponse[]> {
    try {
      const allMotos = await this.getAll(token);
      return allMotos.filter(moto => moto.status === status);
    } catch (error: any) {
      console.error(`Erro ao buscar motos com status ${status}:`, error);
      throw new Error(error.message || 'Erro ao carregar motos por status');
    }
  }

  /**
   * Validação de dados da moto SEM userId 
   */
  private validateMotoDataWithoutUserId(motoData: Omit<MotoRequest, 'userId'>): void {
    if (!motoData.placa || !motoData.placa.trim()) {
      throw new Error('Placa é obrigatória');
    }

    // Validação do formato da placa brasileira
    const placaRegex = /^[A-Z]{3}-\d{4}$/;
    if (!placaRegex.test(motoData.placa.toUpperCase())) {
      throw new Error('Placa deve estar no formato ABC-1234');
    }

    if (!motoData.status || !motoData.status.trim()) {
      throw new Error('Status é obrigatório');
    }

    if (!motoData.filialId || motoData.filialId <= 0) {
      throw new Error('Filial é obrigatória');
    }

    if (!motoData.token || !motoData.token.trim()) {
      throw new Error('Token de autenticação é obrigatório');
    }
  }

  
  private validateMotoData(motoData: MotoRequest): void {
    this.validateMotoDataWithoutUserId(motoData);

    if (!motoData.userId || motoData.userId <= 0) {
      throw new Error('Usuário é obrigatório');
    }
  }
}

export const motoService = new MotoService();
