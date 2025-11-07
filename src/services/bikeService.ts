import { apiService } from './api';
import {
  BikeRequest,
  BikeResponse,
  BikeModel,
  AreaStatus,
} from '@/types/api';

class BikeService {
  private readonly endpoints = {
    base: '/bikes',
    getAll: '/bikes',
    getById: (id: number) => `/bikes/${id}`,
    getByPlate: (plate: string) => `/bikes/plate/${plate}`,
    search: '/bikes/search',
    create: '/bikes',
    update: (id: number) => `/bikes/${id}`,
    delete: (id: number) => `/bikes/${id}`,
    linkTag: (plate: string, tagCode: string, subsidiaryId: number) => 
      `/bikes/${plate}/tag/${tagCode}/subsidiary/${subsidiaryId}`,
    unlinkTag: (plate: string) => `/bikes/${plate}/tag`,
  };

  // Listar todas as bikes
  async getAll(): Promise<BikeResponse[]> {
    try {
      return await apiService.get<BikeResponse[]>(this.endpoints.getAll);
    } catch (error: any) {
      console.error('Erro ao buscar bikes:', error);
      throw new Error(error.message || 'Erro ao carregar bikes');
    }
  }

  // Buscar bike por ID
  async getById(id: number): Promise<BikeResponse> {
    try {
      return await apiService.get<BikeResponse>(this.endpoints.getById(id));
    } catch (error: any) {
      console.error(`Erro ao buscar bike ${id}:`, error);
      throw new Error(error.message || 'Erro ao carregar bike');
    }
  }

  // Buscar bike por placa
  async getByPlate(plate: string): Promise<BikeResponse> {
    try {
      return await apiService.get<BikeResponse>(this.endpoints.getByPlate(plate));
    } catch (error: any) {
      console.error(`Erro ao buscar bike com placa ${plate}:`, error);
      throw new Error(error.message || 'Erro ao buscar bike por placa');
    }
  }

  // Buscar bikes por filtro (status e modelo)
  async searchByFilter(status?: AreaStatus, model?: BikeModel): Promise<BikeResponse[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (model) params.append('model', model);
      
      const url = `${this.endpoints.search}?${params.toString()}`;
      return await apiService.get<BikeResponse[]>(url);
    } catch (error: any) {
      console.error('Erro ao buscar bikes por filtro:', error);
      throw new Error(error.message || 'Erro ao filtrar bikes');
    }
  }

  // Criar nova bike
  async create(bikeData: BikeRequest): Promise<BikeResponse> {
    try {
      this.validateBikeData(bikeData);
      return await apiService.post<BikeResponse>(
        this.endpoints.create,
        bikeData
      );
    } catch (error: any) {
      console.error('Erro ao criar bike:', error);
      throw new Error(error.message || 'Erro ao criar bike');
    }
  }

  // Atualizar bike
  async update(id: number, bikeData: BikeRequest): Promise<BikeResponse> {
    try {
      this.validateBikeData(bikeData);
      return await apiService.put<BikeResponse>(
        this.endpoints.update(id),
        bikeData
      );
    } catch (error: any) {
      console.error(`Erro ao atualizar bike ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar bike');
    }
  }

  // Deletar bike
  async delete(id: number): Promise<void> {
    try {
      await apiService.delete<void>(this.endpoints.delete(id));
    } catch (error: any) {
      console.error(`Erro ao deletar bike ${id}:`, error);
      throw new Error(error.message || 'Erro ao excluir bike');
    }
  }

  // Vincular bike a uma tag
  async linkTag(plate: string, tagCode: string, subsidiaryId: number): Promise<void> {
    try {
      await apiService.post<void>(
        this.endpoints.linkTag(plate, tagCode, subsidiaryId)
      );
    } catch (error: any) {
      console.error(`Erro ao vincular tag à bike ${plate}:`, error);
      throw new Error(error.message || 'Erro ao vincular tag');
    }
  }

  // Desvincular tag da bike
  async unlinkTag(plate: string): Promise<void> {
    try {
      await apiService.delete<void>(this.endpoints.unlinkTag(plate));
    } catch (error: any) {
      console.error(`Erro ao desvincular tag da bike ${plate}:`, error);
      throw new Error(error.message || 'Erro ao desvincular tag');
    }
  }

  // Validação de dados
  private validateBikeData(bikeData: BikeRequest): void {
    if (!bikeData.plate || !bikeData.plate.trim()) {
      throw new Error('Placa é obrigatória');
    }

    const plateRegex = /^[A-Z]{3}-?\d{4}$/;
    if (!plateRegex.test(bikeData.plate.toUpperCase())) {
      throw new Error('Placa deve estar no formato ABC-1234 ou ABC1234');
    }

    if (!bikeData.model) {
      throw new Error('Modelo é obrigatório');
    }

    if (!bikeData.status) {
      throw new Error('Status é obrigatório');
    }
  }
}

export const bikeService = new BikeService();
