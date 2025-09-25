// Chaves para AsyncStorage
export const STORAGE_KEYS = {
  USER_DATA: '@nexus_tech:user',
  THEME: '@nexus_tech:theme',
  SETTINGS: '@nexus_tech:settings',
  CACHE_MOTOS: '@nexus_tech:cache_motos',
  CACHE_FILIAIS: '@nexus_tech:cache_filiais',
  LAST_SYNC: '@nexus_tech:last_sync',
} as const;

// Tempos de cache (em milissegundos)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutos
  MEDIUM: 15 * 60 * 1000, // 15 minutos
  LONG: 60 * 60 * 1000, // 1 hora
  DAY: 24 * 60 * 60 * 1000, // 1 dia
} as const;
