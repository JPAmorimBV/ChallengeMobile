// Tipos para autenticação
export interface AuthRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  userEmail: string;
  token: string;
}

// Tipos para Filiais
export interface FilialRequest {
  nome: string;
  endereco: string;
  token: string; // Has to be Admin
}

export interface FilialResponse {
  id: number;
  name: string;
  endereco: string;
  motos: MotoResponse[];
}

// Tipos para Motos
export interface MotoRequest {
  placa: string;
  status: string;
  filialId: number;
  token: string; // Has to be Admin
}

export interface MotoResponse {
  id: number;
  placa: string;
  status: string;
  nomeFilial: string;
}

// Tipos para cadastro de usuário
export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

// Tipos de resposta de erro da API
export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// Tipo genérico para respostas da API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Status disponíveis para motos
export type MotoStatus = 'Disponível' | 'Em uso' | 'Manutenção' | 'Indisponível';

// Constantes de status
export const MOTO_STATUS: MotoStatus[] = [
  'Disponível',
  'Em uso', 
  'Manutenção',
  'Indisponível'
];
