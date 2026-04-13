/**
 * Form Persistence Hook - LocalStorage Backup
 * SulAmérica Saúde - Data Recovery Layer
 * 
 * Automatically saves form progress to prevent data loss on refresh
 */

import { useEffect, useCallback, useRef } from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { LeadFormData, PersistedFormData } from '@/types/leadForm';

// Storage configuration
const STORAGE_KEY = 'sulamerica_lead_form_backup';
const STORAGE_VERSION = '1.0.0';
const SAVE_DEBOUNCE_MS = 1000; // Save 1 second after last change
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Save form data to localStorage
 */
function saveToStorage(data: Partial<LeadFormData>): void {
  try {
    const payload: PersistedFormData = {
      data,
      timestamp: Date.now(),
      version: STORAGE_VERSION,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error('Failed to save form data:', error);
    // Silently fail - don't block user experience
  }
}

/**
 * Load form data from localStorage
 */
function loadFromStorage(): Partial<LeadFormData> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      return null;
    }
    
    const parsed: PersistedFormData = JSON.parse(stored);
    
    // Version check for migration
    if (parsed.version !== STORAGE_VERSION) {
      console.warn('Form data version mismatch, clearing old data');
      clearStorage();
      return null;
    }
    
    // Age check - don't restore very old data
    const age = Date.now() - parsed.timestamp;
    if (age > MAX_AGE_MS) {
      console.warn('Form data too old, clearing');
      clearStorage();
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.error('Failed to load form data:', error);
    return null;
  }
}

/**
 * Clear form data from localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear form data:', error);
  }
}

/**
 * Check if there's saved form data
 */
export function hasSavedData(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    
    const parsed: PersistedFormData = JSON.parse(stored);
    const age = Date.now() - parsed.timestamp;
    
    return parsed.version === STORAGE_VERSION && age <= MAX_AGE_MS;
  } catch {
    return false;
  }
}

/**
 * Get saved data timestamp
 */
export function getSavedDataTimestamp(): number | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed: PersistedFormData = JSON.parse(stored);
    return parsed.timestamp;
  } catch {
    return null;
  }
}

/**
 * React Hook for form persistence
 * 
 * Usage:
 * const { restoreData, clearSavedData, hasData } = useFormPersistence(watch, setValue);
 */
export function useFormPersistence(
  watch: UseFormWatch<LeadFormData>,
  setValue: UseFormSetValue<LeadFormData>
) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRestoredRef = useRef(false);
  
  /**
   * Auto-save form data on changes
   */
  useEffect(() => {
    const subscription = watch((value) => {
      // Clear existing debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      // Debounce save
      debounceRef.current = setTimeout(() => {
        // Only save if there's actual data
        const hasData = Object.values(value).some(v => 
          v !== undefined && v !== '' && v !== null
        );
        
        if (hasData) {
          saveToStorage(value as Partial<LeadFormData>);
        }
      }, SAVE_DEBOUNCE_MS);
    });
    
    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [watch]);
  
  /**
   * Restore saved data to form
   */
  const restoreData = useCallback((): boolean => {
    if (isRestoredRef.current) {
      return false; // Already restored
    }
    
    const saved = loadFromStorage();
    
    if (!saved) {
      return false;
    }
    
    // Restore each field
    Object.entries(saved).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        setValue(key as keyof LeadFormData, value as never, {
          shouldValidate: false,
          shouldDirty: true,
          shouldTouch: false,
        });
      }
    });
    
    isRestoredRef.current = true;
    return true;
  }, [setValue]);
  
  /**
   * Clear saved data
   */
  const clearSavedData = useCallback((): void => {
    clearStorage();
    isRestoredRef.current = false;
  }, []);
  
  /**
   * Check if saved data exists
   */
  const hasData = useCallback((): boolean => {
    return hasSavedData();
  }, []);
  
  /**
   * Get restore timestamp
   */
  const getRestoreTime = useCallback((): Date | null => {
    const timestamp = getSavedDataTimestamp();
    return timestamp ? new Date(timestamp) : null;
  }, []);
  
  return {
    restoreData,
    clearSavedData,
    hasData,
    getRestoreTime,
    isRestored: () => isRestoredRef.current,
  };
}

/**
 * Hook for manual save (on important events)
 */
export function useManualSave() {
  const saveImmediately = useCallback((data: Partial<LeadFormData>) => {
    saveToStorage(data);
  }, []);
  
  return { saveImmediately };
}

export default useFormPersistence;
