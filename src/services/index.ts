export { apiService } from './api';
export { authService } from './authService';
export { motoService } from './motoService';
export { filialService } from './filialService';

export { bikeService } from './bikeService';
export { yardService } from './yardService';
export { cameraService } from './cameraService';
export { apriltagService } from './apriltagService';
export { subsidiaryService } from './subsidiaryService';
export { areaService } from './areaService';

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

export type {
  BikeRequest,
  BikeResponse,
  BikeModel,
  AreaStatus,
  YardRequest,
  YardResponse,
  YardMongoRequest,P
  YardMongoResponse,
  TagPosition,
  CameraRequest,
  CameraResponse,
  ApriltagRequest,
  ApriltagResponse,
  ApriltagDetectionResponse,
  DetectedTag,
  SubsidiaryRequest,
  SubsidiaryResponse,
  AreaRequest,
  AreaResponse,
} from '@/types/api';
