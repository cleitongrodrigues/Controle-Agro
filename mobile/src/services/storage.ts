// ══════════════════════════════════════════════════════════
// STORAGE SERVICE - GERENCIAMENTO DE ASYNC STORAGE
// ══════════════════════════════════════════════════════════

// Try to import AsyncStorage, fallback to mock if not installed
let AsyncStorage: any;
let storageAvailable = true;

try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  console.warn('⚠️ AsyncStorage não instalado. Usando armazenamento em memória temporário.');
  console.warn('📦 Para persistência real, instale: npx expo install @react-native-async-storage/async-storage');
  storageAvailable = false;
  
  // Mock AsyncStorage for development without package installed
  const memoryStorage: Record<string, string> = {};
  AsyncStorage = {
    setItem: async (key: string, value: string) => {
      memoryStorage[key] = value;
    },
    getItem: async (key: string) => {
      return memoryStorage[key] || null;
    },
    removeItem: async (key: string) => {
      delete memoryStorage[key];
    },
    clear: async () => {
      Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
    },
  };
}

const STORAGE_KEYS = {
  SALES: '@agrovendas:sales',
  FARMS: '@agrovendas:farms',
  PRODUCTS: '@agrovendas:products',
  UNSYNCED_COUNT: '@agrovendas:unsynced_count',
} as const;

class StorageService {
  // Verificar se AsyncStorage real está disponível
  isRealStorageAvailable(): boolean {
    return storageAvailable;
  }

  // Salvar dados
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  }

  // Recuperar dados
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  // Remover dados
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  // Limpar tudo
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  // Métodos específicos para o app
  async saveSales(sales: any[]): Promise<void> {
    return this.setItem(STORAGE_KEYS.SALES, sales);
  }

  async getSales(): Promise<any[] | null> {
    return this.getItem(STORAGE_KEYS.SALES);
  }

  async saveFarms(farms: any[]): Promise<void> {
    return this.setItem(STORAGE_KEYS.FARMS, farms);
  }

  async getFarms(): Promise<any[] | null> {
    return this.getItem(STORAGE_KEYS.FARMS);
  }

  async saveProducts(products: any[]): Promise<void> {
    return this.setItem(STORAGE_KEYS.PRODUCTS, products);
  }

  async getProducts(): Promise<any[] | null> {
    return this.getItem(STORAGE_KEYS.PRODUCTS);
  }

  async saveUnsyncedCount(count: number): Promise<void> {
    return this.setItem(STORAGE_KEYS.UNSYNCED_COUNT, count);
  }

  async getUnsyncedCount(): Promise<number> {
    const count = await this.getItem<number>(STORAGE_KEYS.UNSYNCED_COUNT);
    return count ?? 0;
  }
}

export const storageService = new StorageService();
export { STORAGE_KEYS };
