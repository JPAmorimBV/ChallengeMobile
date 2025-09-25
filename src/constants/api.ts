// URLs da API
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:8080' : 'https://your-production-api.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Endpoints da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/usuarios/login',
    REGISTER: '/usuarios/register',
  },
  MOTOS: {
    BASE: '/motos',
    GET_ALL: '/motos',
    GET_BY_ID: (id: number) => `/motos/${id}`,
    CREATE: '/motos',
    UPDATE: (id: number) => `/motos/${id}`,
    DELETE: (id: number) => `/motos/${id}`,
  },
  FILIAIS: {
    BASE: '/filiais',
    GET_ALL: '/filiais',
    GET_BY_ID: (id: number) => `/filiais/${id}`,
    CREATE: '/filiais',
    UPDATE: (id: number) => `/filiais/${id}`,
    DELETE: (id: number) => `/filiais/${id}`,
  },
} as const;

// Status codes HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Headers padrão
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;
