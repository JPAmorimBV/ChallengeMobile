import { apiService } from './api';
import {
  ApriltagRequest,
  ApriltagResponse,
  ApriltagDetectionResponse,
} from '@/types/api';

class ApriltagService {
  private readonly endpoints = {
    base: '/apriltags',
    getAll: '/apriltags',
    getById: (id: number) => `/apriltags/${id}`,
    create: '/apriltags',
    update: (id: number) => `/apriltags/${id}`,
    delete: (id: number) => `/apriltags/${id}`,
    detect: '/apriltags/detect',
  };

  async getAll(): Promise<ApriltagResponse[]> {
    try {
      return await apiService.get<ApriltagResponse[]>(this.endpoints.getAll);
    } catch (error: any) {
      console.error('Erro ao buscar tags:', error);
      throw new Error(error.message || 'Erro ao carregar tags');
    }
  }

  async getById(id: number): Promise<ApriltagResponse> {
    try {
      return await apiService.get<ApriltagResponse>(this.endpoints.getById(id));
    } catch (error: any) {
      console.error(`Erro ao buscar tag ${id}:`, error);
      throw new Error(error.message || 'Erro ao carregar tag');
    }
  }

  async create(tagData: ApriltagRequest): Promise<ApriltagResponse> {
    try {
      this.validateTagData(tagData);
      return await apiService.post<ApriltagResponse>(this.endpoints.create, tagData);
    } catch (error: any) {
      console.error('Erro ao criar tag:', error);
      throw new Error(error.message || 'Erro ao criar tag');
    }
  }

  async update(id: number, tagData: ApriltagRequest): Promise<ApriltagResponse> {
    try {
      this.validateTagData(tagData);
      return await apiService.put<ApriltagResponse>(this.endpoints.update(id), tagData);
    } catch (error: any) {
      console.error(`Erro ao atualizar tag ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar tag');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiService.delete<void>(this.endpoints.delete(id));
    } catch (error: any) {
      console.error(`Erro ao deletar tag ${id}:`, error);
      throw new Error(error.message || 'Erro ao excluir tag');
    }
  }

  // Reconhecimento de tag por imagem
  async detectFromImage(imageFile: File | Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch(
        `${apiService['api'].defaults.baseURL}${this.endpoints.detect}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            // Não definir Content-Type, deixar o browser definir com boundary
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao processar imagem');
      }

      return await response.text();
    } catch (error: any) {
      console.error('Erro ao detectar tag na imagem:', error);
      throw new Error(error.message || 'Erro ao processar reconhecimento de tag');
    }
  }

  private validateTagData(tagData: ApriltagRequest): void {
    if (!tagData.code || !tagData.code.trim()) {
      throw new Error('Código da tag é obrigatório');
    }
    if (!tagData.size || tagData.size <= 0) {
      throw new Error('Tamanho da tag deve ser maior que zero');
    }
  }
}

export const apriltagService = new ApriltagService();
