import { apiService } from './api';
import { AreaRequest, AreaResponse } from '@/types/api';

class AreaService {
  private readonly endpoints = {
    base: '/areas',
    getAll: '/areas',
    getById: (id: number) => `/areas/${id}`,
    create: '/areas',
    update: (id: number) => `/areas/${id}`,
    delete: (id: number) => `/areas/${id}`,
  };

  async getAll(): Promise<AreaResponse[]> {
    try {
      return await apiService.get<AreaResponse[]>(this.endpoints.getAll);
    } catch (error: any) {
      console.error('Erro ao buscar áreas:', error);
      throw new Error(error.message || 'Erro ao carregar áreas');
    }
  }

  async getById(id: number): Promise<AreaResponse> {
    try {
      return await apiService.get<AreaResponse>(this.endpoints.getById(id));
    } catch (error: any) {
      console.error(`Erro ao buscar área ${id}:`, error);
      throw new Error(error.message || 'Erro ao carregar área');
    }
  }

  async create(areaData: AreaRequest): Promise<AreaResponse> {
    try {
      this.validateAreaData(areaData);
      return await apiService.post<AreaResponse>(this.endpoints.create, areaData);
    } catch (error: any) {
      console.error('Erro ao criar área:', error);
      throw new Error(error.message || 'Erro ao criar área');
    }
  }

  async update(id: number, areaData: AreaRequest): Promise<AreaResponse> {
    try {
      this.validateAreaData(areaData);
      return await apiService.put<AreaResponse>(this.endpoints.update(id), areaData);
    } catch (error: any) {
      console.error(`Erro ao atualizar área ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar área');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiService.delete<void>(this.endpoints.delete(id));
    } catch (error: any) {
      console.error(`Erro ao deletar área ${id}:`, error);
      throw new Error(error.message || 'Erro ao excluir área');
    }
  }

  private validateAreaData(areaData: AreaRequest): void {
    if (!areaData.name || !areaData.name.trim()) {
      throw new Error('Nome da área é obrigatório');
    }
    if (!areaData.type || !areaData.type.trim()) {
      throw new Error('Tipo da área é obrigatório');
    }
    if (!areaData.yardId || areaData.yardId <= 0) {
      throw new Error('ID do pátio é obrigatório');
    }
  }
}

export const areaService = new AreaService();
