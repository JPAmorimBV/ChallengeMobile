import { MotoStatus } from '@/types/api';

// Informações da aplicação
export const APP_INFO = {
  NAME: 'Nexus Tech',
  SUBTITLE: 'Sistema de Gestão Mottu',
  VERSION: '1.0.0',
  COMPANY: 'Nexus Tech',
} as const;

// Status das motos
export const MOTO_STATUS_OPTIONS: MotoStatus[] = [
  'Disponível',
  'Em uso',
  'Manutenção',
  'Indisponível',
];

// Cores dos status das motos
export const MOTO_STATUS_COLORS = {
  'Disponível': '#4CAF50',
  'Em uso': '#FF9800',
  'Manutenção': '#F44336',
  'Indisponível': '#9E9E9E',
} as const;

// Ícones dos status das motos
export const MOTO_STATUS_ICONS = {
  'Disponível': 'checkmark-circle',
  'Em uso': 'time',
  'Manutenção': 'construct',
  'Indisponível': 'close-circle',
} as const;

// Regex para validação
export const VALIDATION_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PLACA: /^[A-Z]{3}-\d{4}$/,
  PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  CEP: /^\d{5}-\d{3}$/,
} as const;

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Acesso negado. Permissões insuficientes.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION: 'Dados inválidos. Verifique os campos.',
  SERVER: 'Erro interno do servidor. Tente novamente mais tarde.',
  UNKNOWN: 'Ocorreu um erro inesperado.',
} as const;

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso!',
  REGISTER: 'Conta criada com sucesso!',
  LOGOUT: 'Logout realizado com sucesso!',
  MOTO_CREATED: 'Moto criada com sucesso!',
  MOTO_UPDATED: 'Moto atualizada com sucesso!',
  MOTO_DELETED: 'Moto excluída com sucesso!',
  FILIAL_CREATED: 'Filial criada com sucesso!',
  FILIAL_UPDATED: 'Filial atualizada com sucesso!',
  FILIAL_DELETED: 'Filial excluída com sucesso!',
} as const;

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const;
