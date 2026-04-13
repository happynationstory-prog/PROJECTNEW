/**
 * Submit Throttling Hook - Duplicate Prevention
 * SulAmérica Saúde - Integrity Layer
 * 
 * Prevents duplicate form submissions by disabling the submit button
 * and tracking submission state
 */

import { useState, useCallback, useRef } from 'react';

interface SubmitThrottleState {
  isSubmitting: boolean;
  submitCount: number;
  lastSubmitTime: number | null;
}

interface UseSubmitThrottleOptions {
  cooldownMs?: number;
  maxSubmissions?: number;
  onMaxSubmissionsReached?: () => void;
}

const DEFAULT_COOLDOWN_MS = 5000; // 5 seconds between submissions
const DEFAULT_MAX_SUBMISSIONS = 3; // Max 3 submissions before cooldown

/**
 * Hook to throttle form submissions
 * Prevents accidental double-clicks and spam submissions
 */
export function useSubmitThrottle(options: UseSubmitThrottleOptions = {}) {
  const {
    cooldownMs = DEFAULT_COOLDOWN_MS,
    maxSubmissions = DEFAULT_MAX_SUBMISSIONS,
    onMaxSubmissionsReached,
  } = options;

  const [state, setState] = useState<SubmitThrottleState>({
    isSubmitting: false,
    submitCount: 0,
    lastSubmitTime: null,
  });

  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Start submission - locks the form
   */
  const startSubmit = useCallback((): boolean => {
    // Check if already submitting
    if (state.isSubmitting) {
      console.warn('Submission already in progress');
      return false;
    }

    // Check cooldown period
    if (state.lastSubmitTime) {
      const timeSinceLastSubmit = Date.now() - state.lastSubmitTime;
      if (timeSinceLastSubmit < cooldownMs) {
        const remainingMs = cooldownMs - timeSinceLastSubmit;
        console.warn(`Submission on cooldown. Wait ${remainingMs}ms`);
        return false;
      }
    }

    // Check max submissions
    if (state.submitCount >= maxSubmissions) {
      console.warn('Max submissions reached');
      onMaxSubmissionsReached?.();
      return false;
    }

    // Lock submission
    setState(prev => ({
      ...prev,
      isSubmitting: true,
    }));

    return true;
  }, [state.isSubmitting, state.lastSubmitTime, state.submitCount, cooldownMs, maxSubmissions, onMaxSubmissionsReached]);

  /**
   * Complete submission - unlocks the form
   */
  const completeSubmit = useCallback((success: boolean = true): void => {
    setState(prev => ({
      isSubmitting: false,
      submitCount: success ? prev.submitCount + 1 : prev.submitCount,
      lastSubmitTime: Date.now(),
    }));

    // Clear cooldown after period
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
    }

    cooldownTimeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        submitCount: 0,
        lastSubmitTime: null,
      }));
    }, cooldownMs);
  }, [cooldownMs]);

  /**
   * Reset throttle state
   */
  const resetThrottle = useCallback((): void => {
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
    }

    setState({
      isSubmitting: false,
      submitCount: 0,
      lastSubmitTime: null,
    });
  }, []);

  /**
   * Get remaining cooldown time
   */
  const getRemainingCooldown = useCallback((): number => {
    if (!state.lastSubmitTime) return 0;
    
    const elapsed = Date.now() - state.lastSubmitTime;
    return Math.max(0, cooldownMs - elapsed);
  }, [state.lastSubmitTime, cooldownMs]);

  /**
   * Check if can submit
   */
  const canSubmit = useCallback((): boolean => {
    if (state.isSubmitting) return false;
    if (state.submitCount >= maxSubmissions) return false;
    if (getRemainingCooldown() > 0) return false;
    return true;
  }, [state.isSubmitting, state.submitCount, maxSubmissions, getRemainingCooldown]);

  return {
    isSubmitting: state.isSubmitting,
    submitCount: state.submitCount,
    startSubmit,
    completeSubmit,
    resetThrottle,
    getRemainingCooldown,
    canSubmit: canSubmit(),
  };
}

/**
 * Hook for debounced submit button
 * Prevents rapid-fire clicks
 */
export function useDebouncedSubmit(debounceMs: number = 300) {
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSubmit = useCallback(<T extends (...args: never[]) => void>(
    callback: T
  ) => {
    if (isDebouncing) {
      return;
    }

    setIsDebouncing(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback();
      setIsDebouncing(false);
    }, debounceMs);
  }, [isDebouncing, debounceMs]);

  const cancelDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDebouncing(false);
  }, []);

  return {
    isDebouncing,
    debouncedSubmit,
    cancelDebounce,
  };
}

export default useSubmitThrottle;
