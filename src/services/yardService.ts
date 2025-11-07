import { apiService } from './api';
import {
  YardRequest,
  YardResponse,
  YardMongoRequest,
  YardMongoResponse,
  CameraResponse,
} from '@/types/api';

class YardService {
  private readonly endpoints = {
    base: '/yards',
    getAll: '/yards',
    getById: (id: number) => `/yards/${id}`,
    create: '/yards',
    update: (id: number) => `/yards/${id}`,
    delete: (id: number) => `/yards/${id}`,
    updateTagPositions: (id: number) => `/yards/${id}/tags`,
    getTagPositions: (id: number) => `/yards/${id}/tags`,
    getCameras: (id: number) => `/yards/${id}/cameras`,
  };

  async getAll(): Promise<YardResponse[]> {
    try {
      return await apiService.get<YardResponse[]>(this.endpoints.getAll);
    } catch (error: any) {
      console.error('Erro ao buscar yards:', error);
      throw new Error(error.message || 'Erro ao carregar pátios');
    }
  }

  async getById(id: number): Promise<YardResponse> {
    try {
      return await apiService.get<YardResponse>(this.endpoints.getById(id));
    } catch (error: any) {
      console.error(`Erro ao buscar yard ${id}:`, error);
      throw new Error(error.message || 'Erro ao carregar pátio');
    }
  }

  async create(yardData: YardRequest): Promise<YardResponse> {
    try {
      this.validateYardData(yardData);
      return await apiService.post<YardResponse>(this.endpoints.create, yardData);
    } catch (error: any) {
      console.error('Erro ao criar yard:', error);
      throw new Error(error.message || 'Erro ao criar pátio');
    }
  }

  async update(id: number, yardData: YardRequest): Promise<YardResponse> {
    try {
      this.validateYardData(yardData);
      return await apiService.put<YardResponse>(this.endpoints.update(id), yardData);
    } catch (error: any) {
      console.error(`Erro ao atualizar yard ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar pátio');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiService.delete<void>(this.endpoints.delete(id));
    } catch (error: any) {
      console.error(`Erro ao deletar yard ${id}:`, error);
      throw new Error(error.message || 'Erro ao excluir pátio');
    }
  }

  async updateTagPositions(id: number, positions: YardMongoRequest): Promise<YardMongoResponse> {
    try {
      return await apiService.post<YardMongoResponse>(
        this.endpoints.updateTagPositions(id),
        positions
      );
    } catch (error: any) {
      console.error(`Erro ao atualizar posições das tags no yard ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar posições');
    }
  }

  async getTagPositions(id: number): Promise<YardMongoResponse> {
    try {
      return await apiService.get<YardMongoResponse>(this.endpoints.getTagPositions(id));
    } catch (error: any) {
      console.error(`Erro ao buscar posições das tags no yard ${id}:`, error);
      throw new Error(error.message || 'Erro ao carregar posições');
    }
  }

  async getCameras(id: number): Promise<CameraResponse[]> {
    try {
      return await apiService.get<CameraResponse[]>(this.endpoints.getCameras(id));
    } catch (error: any) {
      console.error(`Erro ao buscar câmeras do yard ${id}:`, error);
      throw new Error(error.message || 'Erro ao carregar câmeras');
    }
  }

  private validateYardData(yardData: YardRequest): void {
    if (!yardData.name || !yardData.name.trim()) {
      throw new Error('Nome do pátio é obrigatório');
    }
    if (!yardData.address || !yardData.address.trim()) {
      throw new Error('Endereço é obrigatório');
    }
    if (!yardData.capacity || yardData.capacity <= 0) {
      throw new Error('Capacidade deve ser maior que zero');
    }
  }
}

export const yardService = new YardService();
