import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, CACHE_DURATION } from '@/constants/storage';

export class StorageUtils {
  /**
   * Salva dados no AsyncStorage
   */
  static async setItem(key: string, value: any): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
      return false;
    }
  }

  /**
   * Recupera dados do AsyncStorage
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Erro ao recuperar ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove item do AsyncStorage
   */
  static async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
      return false;
    }
  }

  /**
   * Limpa todo o AsyncStorage
   */
  static async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar storage:', error);
      return false;
    }
  }

  /**
   * Salva dados com timestamp para cache
   */
  static async setCacheItem(key: string, value: any, duration: number = CACHE_DURATION.MEDIUM): Promise<boolean> {
    const cacheData = {
      data: value,
      timestamp: Date.now(),
      duration,
    };
    return this.setItem(key, cacheData);
  }

  /**
   * Recupera dados do cache se ainda válidos
   */
  static async getCacheItem<T>(key: string): Promise<T | null> {
    try {
      const cacheData = await this.getItem<{
        data: T;
        timestamp: number;
        duration: number;
      }>(key);

      if (!cacheData) return null;

      const now = Date.now();
      const isExpired = now - cacheData.timestamp > cacheData.duration;

      if (isExpired) {
        await this.removeItem(key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error(`Erro ao recuperar cache ${key}:`, error);
      return null;
    }
  }

  /**
   * Verifica se o cache está válido
   */
  static async isCacheValid(key: string): Promise<boolean> {
    const cacheData = await this.getCacheItem(key);
    return cacheData !== null;
  }

  /**
   * Limpa todos os caches
   */
  static async clearCache(): Promise<boolean> {
    try {
      const cacheKeys = [
        STORAGE_KEYS.CACHE_MOTOS,
        STORAGE_KEYS.CACHE_FILIAIS,
        STORAGE_KEYS.LAST_SYNC,
      ];

      await Promise.all(cacheKeys.map(key => this.removeItem(key)));
      return true;
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      return false;
    }
  }

  /**
   * Obtém informações sobre o storage
   */
  static async getStorageInfo(): Promise<{
    totalKeys: number;
    keys: string[];
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return {
        totalKeys: keys.length,
        keys,
      };
    } catch (error) {
      console.error('Erro ao obter informações do storage:', error);
      return { totalKeys: 0, keys: [] };
    }
  }
}
