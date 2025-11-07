import { apiService } from './api';
import { SubsidiaryRequest, SubsidiaryResponse } from '@/types/api';

class SubsidiaryService {
  private readonly endpoints = {
    base: '/subsidiaries',
    getAll: '/subsidiaries',
    getById: (id: number) => `/subsidiaries/${id}`,
    create: '/subsidiaries',
    update: (id: number) => `/subsidiaries/${id}`,
    delete: (id: number) => `/subsidiaries/${id}`,
  };

  async getAll(): Promise<SubsidiaryResponse[]> {
    try {
      return await apiService.get<SubsidiaryResponse[]>(this.endpoints.getAll);
    } catch (error: any) {
      console.error('Erro ao buscar subsidiárias:', error);
      throw new Error(error.message || 'Erro ao carregar subsidiárias');
    }
  }

  async getById(id: number): Promise<SubsidiaryResponse> {
    try {
      return await apiService.get<SubsidiaryResponse>(this.endpoints.getById(id));
    } catch (error: any) {
      console.error(`Erro ao buscar subsidiária ${id}:`, error);
      throw new Error(error.message || 'Erro ao carregar subsidiária');
    }
  }

  async create(subsidiaryData: SubsidiaryRequest): Promise<SubsidiaryResponse> {
    try {
      this.validateSubsidiaryData(subsidiaryData);
      return await apiService.post<SubsidiaryResponse>(
        this.endpoints.create,
        subsidiaryData
      );
    } catch (error: any) {
      console.error('Erro ao criar subsidiária:', error);
      throw new Error(error.message || 'Erro ao criar subsidiária');
    }
  }

  async update(id: number, subsidiaryData: SubsidiaryRequest): Promise<SubsidiaryResponse> {
    try {
      this.validateSubsidiaryData(subsidiaryData);
      return await apiService.put<SubsidiaryResponse>(
        this.endpoints.update(id),
        subsidiaryData
      );
    } catch (error: any) {
      console.error(`Erro ao atualizar subsidiária ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar subsidiária');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiService.delete<void>(this.endpoints.delete(id));
    } catch (error: any) {
      console.error(`Erro ao deletar subsidiária ${id}:`, error);
      throw new Error(error.message || 'Erro ao excluir subsidiária');
    }
  }

  private validateSubsidiaryData(subsidiaryData: SubsidiaryRequest): void {
    if (!subsidiaryData.name || !subsidiaryData.name.trim()) {
      throw new Error('Nome da subsidiária é obrigatório');
    }
    if (!subsidiaryData.address || !subsidiaryData.address.trim()) {
      throw new Error('Endereço é obrigatório');
    }
  }
}

export const subsidiaryService = new SubsidiaryService();
