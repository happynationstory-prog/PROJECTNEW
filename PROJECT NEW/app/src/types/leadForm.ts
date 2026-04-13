/**
 * Type definitions for the Insurance Lead Generation Form
 * SulAmérica Saúde - Enterprise Grade System
 */

// Form data structure
export interface LeadFormData {
  fullName: string;
  livesCount: number;
  ages: string;
  city: string;
  phone: string;
  email: string;
}

// Parsed ages array from string input
export interface ParsedAges {
  ages: number[];
  isValid: boolean;
  error?: string;
}

// WhatsApp message format
export interface WhatsAppMessage {
  text: string;
  encodedUrl: string;
}

// Form submission state
export interface FormSubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

// Validation error structure
export interface ValidationError {
  field: keyof LeadFormData;
  message: string;
}

// LocalStorage backup data
export interface PersistedFormData {
  data: Partial<LeadFormData>;
  timestamp: number;
  version: string;
}

// Hospital information
export interface Hospital {
  name: string;
  highlight?: boolean;
}

// Plan information
export interface PlanInfo {
  price: number;
  minLives: number;
  ageRange: string;
}
