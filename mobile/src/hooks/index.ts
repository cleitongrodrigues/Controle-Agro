// ══════════════════════════════════════════════════════════
// CUSTOM HOOKS
// ══════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storage';

/**
 * Hook para gerenciar estado persistido no AsyncStorage
 */
export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar valor inicial
  useEffect(() => {
    loadStoredValue();
  }, [key]);

  const loadStoredValue = async () => {
    try {
      setLoading(true);
      setError(null);
      const value = await storageService.getItem<T>(key);
      if (value !== null) {
        setStoredValue(value);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error loading from storage:', err);
    } finally {
      setLoading(false);
    }
  };

  // Salvar valor
  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        setError(null);
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await storageService.setItem(key, valueToStore);
      } catch (err) {
        setError(err as Error);
        console.error('Error saving to storage:', err);
      }
    },
    [key, storedValue]
  );

  // Remover valor
  const removeValue = useCallback(async () => {
    try {
      setError(null);
      setStoredValue(initialValue);
      await storageService.removeItem(key);
    } catch (err) {
      setError(err as Error);
      console.error('Error removing from storage:', err);
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    loading,
    error,
    refresh: loadStoredValue,
  };
}

/**
 * Hook para debounce de valores
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
