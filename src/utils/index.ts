// Exportações centralizadas dos utils
export { ValidationUtils } from './validation';
export { FormatUtils } from './format';
export { StorageUtils } from './storage';

// Re-exportar constantes importantes
export {
  API_CONFIG,
  API_ENDPOINTS,
  HTTP_STATUS,
} from '@/constants/api';

export {
  STORAGE_KEYS,
  CACHE_DURATION,
} from '@/constants/storage';

export {
  APP_INFO,
  MOTO_STATUS_OPTIONS,
  MOTO_STATUS_COLORS,
  MOTO_STATUS_ICONS,
  VALIDATION_REGEX,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '@/constants/app';

// Tipos utilitários
export type StatusColor = keyof typeof MOTO_STATUS_COLORS;
export type StatusIcon = keyof typeof MOTO_STATUS_ICONS;
