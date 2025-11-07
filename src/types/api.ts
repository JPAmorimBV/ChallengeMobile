export interface AuthRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  userEmail: string;
  token: string;
  userId: number;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface BikeRequest {
  plate: string; // placa
  model: BikeModel;
  status: AreaStatus;
}

export interface BikeResponse {
  id: number;
  plate: string;
  model: BikeModel;
  status: AreaStatus;
  subsidiaryId?: number;
  yardId?: number;
  tagCode?: string;
}

export enum BikeModel {
  CG_160 = 'CG_160',
  FAZER_250 = 'FAZER_250',
  CB_300 = 'CB_300',
  NINJA_400 = 'NINJA_400',
}

export enum AreaStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export interface YardRequest {
  name: string;
  address: string;
  capacity: number;
}

export interface YardResponse {
  id: number;
  name: string;
  address: string;
  capacity: number;
  currentOccupancy?: number;
  cameras?: CameraResponse[];
  bikes?: BikeResponse[];
}

export interface YardMongoRequest {
  yardId: number;
  tagPositions: TagPosition[];
}

export interface YardMongoResponse {
  yardId: number;
  tagPositions: TagPosition[];
  lastUpdated: string;
}

export interface TagPosition {
  tagCode: string;
  x: number;
  y: number;
  z: number;
}

export interface CameraRequest {
  name: string;
  ipAddress: string;
  port: number;
  yardId: number;
}

export interface CameraResponse {
  id: number;
  name: string;
  ipAddress: string;
  port: number;
  yardId: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
}

export interface ApriltagRequest {
  code: string;
  size: number;
  description?: string;
}

export interface ApriltagResponse {
  id: number;
  code: string;
  size: number;
  description?: string;
  linkedBikeId?: number;
  linkedBikePlate?: string;
}

export interface ApriltagDetectionResponse {
  detectedTags: DetectedTag[];
  imageUrl?: string;
  timestamp: string;
}

export interface DetectedTag {
  tagCode: string;
  confidence: number;
  position: {
    x: number;
    y: number;
  };
}

export interface SubsidiaryRequest {
  name: string;
  address: string;
  phone?: string;
}

export interface SubsidiaryResponse {
  id: number;
  name: string;
  address: string;
  phone?: string;
  yards?: YardResponse[];
}

export interface AreaRequest {
  name: string;
  type: string;
  yardId: number;
}

export interface AreaResponse {
  id: number;
  name: string;
  type: string;
  yardId: number;
  status: AreaStatus;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface MotoRequest {
  placa: string;
  status: string;
  filialId: number;
  userId: number;
  token: string;
}

export interface MotoResponse {
  id: number;
  placa: string;
  status: string;
  nomeFilial: string;
  userId: number;
  userEmail?: string;
}

export interface FilialRequest {
  nome: string;
  endereco: string;
  token: string;
}

export interface FilialResponse {
  id: number;
  name: string;
  endereco: string;
  motos: MotoResponse[];
}
