// ══════════════════════════════════════════════════════════
// APP CONTEXT - GERENCIAMENTO DE ESTADO
// ══════════════════════════════════════════════════════════

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Sale, Farm } from '../types';
import { storageService } from '../services/storage';
import { FARMS } from '../config/data';

interface AppContextData {
  sales: Sale[];
  farms: Farm[];
  addSale: (sale: Sale) => Promise<void>;
  updateSale: (id: string, sale: Sale) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  addFarm: (farm: Farm) => Promise<void>;
  updateFarm: (id: string, farm: Farm) => Promise<void>;
  deleteFarm: (id: string) => Promise<void>;
  unsyncedCount: number;
  syncData: () => Promise<void>;
  loading: boolean;
  isOffline: boolean;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [farms, setFarms] = useState<Farm[]>(FARMS);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Carregar dados ao iniciar
  useEffect(() => {
    loadInitialData();
    // Simular detecção de rede (em produção, use NetInfo do Expo)
    checkNetworkStatus();
  }, []);

  const checkNetworkStatus = () => {
    // Placeholder - em produção use: NetInfo.addEventListener()
    // Por enquanto, detecta se há vendas não sincronizadas
    setIsOffline(unsyncedCount > 0);
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const savedSales = await storageService.getSales();
      const savedFarms = await storageService.getFarms();
      const savedCount = await storageService.getUnsyncedCount();
      
      if (savedSales) {
        setSales(savedSales);
      }
      if (savedFarms && savedFarms.length > 0) {
        setFarms(savedFarms);
      }
      setUnsyncedCount(savedCount);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (sale: Sale) => {
    try {
      const newSales = [sale, ...sales];
      setSales(newSales);
      
      // Salvar no storage
      await storageService.saveSales(newSales);
      
      // Incrementar contador de não sincronizados
      const newCount = unsyncedCount + 1;
      setUnsyncedCount(newCount);
      await storageService.saveUnsyncedCount(newCount);
      setIsOffline(true);
    } catch (error) {
      console.error('Error adding sale:', error);
      throw error;
    }
  };

  const updateSale = async (id: string, updatedSale: Sale) => {
    try {
      const newSales = sales.map(sale => 
        sale.id === id ? { ...updatedSale, sincronizado: false } : sale
      );
      setSales(newSales);
      await storageService.saveSales(newSales);
      
      // Incrementar unsynced se a venda estava sincronizada
      const oldSale = sales.find(s => s.id === id);
      if (oldSale?.sincronizado) {
        const newCount = unsyncedCount + 1;
        setUnsyncedCount(newCount);
        await storageService.saveUnsyncedCount(newCount);
      }
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  };

  const deleteSale = async (id: string) => {
    try {
      const saleToDelete = sales.find(s => s.id === id);
      const newSales = sales.filter(sale => sale.id !== id);
      setSales(newSales);
      await storageService.saveSales(newSales);
      
      // Decrementar unsynced se a venda não estava sincronizada
      if (saleToDelete && !saleToDelete.sincronizado) {
        const newCount = Math.max(0, unsyncedCount - 1);
        setUnsyncedCount(newCount);
        await storageService.saveUnsyncedCount(newCount);
        setIsOffline(newCount > 0);
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  };

  const syncData = async () => {
    try {
      // Simula sincronização - aqui você faria a chamada para API
      const syncedSales = sales.map(sale => ({ ...sale, sincronizado: true }));
      setSales(syncedSales);
      await storageService.saveSales(syncedSales);
      
      setUnsyncedCount(0);
      await storageService.saveUnsyncedCount(0);
      setIsOffline(false);
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  };

  // ============================================
  // GERENCIAMENTO DE FAZENDAS
  // ============================================

  const addFarm = async (farm: Farm) => {
    try {
      const newFarms = [farm, ...farms];
      setFarms(newFarms);
      await storageService.saveFarms(newFarms);
    } catch (error) {
      console.error('Error adding farm:', error);
      throw error;
    }
  };

  const updateFarm = async (id: string, updatedFarm: Farm) => {
    try {
      const newFarms = farms.map(farm => 
        farm.id === id ? updatedFarm : farm
      );
      setFarms(newFarms);
      await storageService.saveFarms(newFarms);
    } catch (error) {
      console.error('Error updating farm:', error);
      throw error;
    }
  };

  const deleteFarm = async (id: string) => {
    try {
      const newFarms = farms.filter(farm => farm.id !== id);
      setFarms(newFarms);
      await storageService.saveFarms(newFarms);
    } catch (error) {
      console.error('Error deleting farm:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ 
      sales,
      farms,
      addSale, 
      updateSale,
      deleteSale,
      addFarm,
      updateFarm,
      deleteFarm,
      unsyncedCount, 
      syncData, 
      loading,
      isOffline,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
