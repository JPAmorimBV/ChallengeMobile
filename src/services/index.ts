// Exportações centralizadas dos services
export { apiService } from './api';
export { authService } from './authService';
export { motoService } from './motoService';
export { filialService } from './filialService';

// Re-exportar tipos relacionados aos services
export type {
  AuthRequest,
  AuthResponse,
  MotoRequest,
  MotoResponse,
  FilialRequest,
  FilialResponse,
  ApiResponse,
  ApiError,
} from '@/types/api';
