import { apiService } from './api';
import { CameraRequest, CameraResponse } from '@/types/api';

class CameraService {
  private readonly endpoints = {
    base: '/cameras',
    getAll: '/cameras',
    getById: (id: number) => `/cameras/${id}`,
    create: '/cameras',
    update: (id: number) => `/cameras/${id}`,
    delete: (id: number) => `/cameras/${id}`,
  };

  async getAll(): Promise<CameraResponse[]> {
    try {
      return await apiService.get<CameraResponse[]>(this.endpoints.getAll);
    } catch (error: any) {
      console.error('Erro ao buscar câmeras:', error);
      throw new Error(error.message || 'Erro ao carregar câmeras');
    }
  }

  async getById(id: number): Promise<CameraResponse> {
    try {
      return await apiService.get<CameraResponse>(this.endpoints.getById(id));
    } catch (error: any) {
      console.error(`Erro ao buscar câmera ${id}:`, error);
      throw new Error(error.message || 'Erro ao carregar câmera');
    }
  }

  async create(cameraData: CameraRequest): Promise<CameraResponse> {
    try {
      this.validateCameraData(cameraData);
      return await apiService.post<CameraResponse>(this.endpoints.create, cameraData);
    } catch (error: any) {
      console.error('Erro ao criar câmera:', error);
      throw new Error(error.message || 'Erro ao criar câmera');
    }
  }

  async update(id: number, cameraData: CameraRequest): Promise<CameraResponse> {
    try {
      this.validateCameraData(cameraData);
      return await apiService.put<CameraResponse>(this.endpoints.update(id), cameraData);
    } catch (error: any) {
      console.error(`Erro ao atualizar câmera ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar câmera');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiService.delete<void>(this.endpoints.delete(id));
    } catch (error: any) {
      console.error(`Erro ao deletar câmera ${id}:`, error);
      throw new Error(error.message || 'Erro ao excluir câmera');
    }
  }

  private validateCameraData(cameraData: CameraRequest): void {
    if (!cameraData.name || !cameraData.name.trim()) {
      throw new Error('Nome da câmera é obrigatório');
    }
    if (!cameraData.ipAddress || !cameraData.ipAddress.trim()) {
      throw new Error('Endereço IP é obrigatório');
    }
    
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(cameraData.ipAddress)) {
      throw new Error('Endereço IP inválido');
    }
    
    if (!cameraData.port || cameraData.port <= 0 || cameraData.port > 65535) {
      throw new Error('Porta deve estar entre 1 e 65535');
    }
    
    if (!cameraData.yardId || cameraData.yardId <= 0) {
      throw new Error('ID do pátio é obrigatório');
    }
  }
}

export const cameraService = new CameraService();
