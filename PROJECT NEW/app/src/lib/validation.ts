/**
 * Zod Validation Schema for Lead Form
 * SulAmérica Saúde - Enterprise Grade Validation
 */

import { z } from 'zod';
import type { LeadFormData, ParsedAges } from '@/types/leadForm';

// Brazilian phone regex: (00) 00000-0000
const BRAZILIAN_PHONE_REGEX = /^\(\d{2}\)\s\d{5}-\d{4}$/;

// RFC 5322 compliant email regex (simplified but robust)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Ages list validation: "20, 30, 5" format
const AGES_REGEX = /^\d+(?:\s*,\s*\d+)*$/;

/**
 * Parse ages string into array of numbers
 * Validates business rules for insurance coverage
 */
export function parseAges(agesString: string): ParsedAges {
  if (!agesString.trim()) {
    return { ages: [], isValid: false, error: 'Informe pelo menos uma idade' };
  }

  if (!AGES_REGEX.test(agesString)) {
    return { ages: [], isValid: false, error: 'Formato inválido. Use: 20, 30, 5' };
  }

  const ages = agesString
    .split(',')
    .map(age => parseInt(age.trim(), 10))
    .filter(age => !isNaN(age));

  if (ages.length === 0) {
    return { ages: [], isValid: false, error: 'Informe pelo menos uma idade válida' };
  }

  // Validate age ranges (0-120 is reasonable for insurance)
  const invalidAges = ages.filter(age => age < 0 || age > 120);
  if (invalidAges.length > 0) {
    return { 
      ages, 
      isValid: false, 
      error: `Idades inválidas detectadas: ${invalidAges.join(', ')}` 
    };
  }

  return { ages, isValid: true };
}

/**
 * Zod schema for lead form validation
 */
export const leadFormSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Nome completo deve ter no mínimo 3 caracteres')
    .max(100, 'Nome completo deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome deve conter apenas letras, espaços, hífens e apóstrofos'),

  livesCount: z
    .number()
    .min(1, 'Mínimo de 1 vida')
    .max(50, 'Máximo de 50 vidas por solicitação'),

  ages: z
    .string()
    .min(1, 'Informe as idades')
    .refine(
      (value: string) => parseAges(value).isValid,
      { message: 'Formato inválido. Use: 20, 30, 5' }
    ),

  city: z
    .string()
    .min(2, 'Cidade é obrigatória')
    .max(50, 'Nome da cidade muito longo'),

  phone: z
    .string()
    .min(1, 'Celular é obrigatório')
    .regex(
      BRAZILIAN_PHONE_REGEX,
      'Formato inválido. Use: (00) 00000-0000'
    ),

  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .regex(EMAIL_REGEX, 'E-mail inválido')
    .max(254, 'E-mail muito longo'),
});

/**
 * Type inference from Zod schema
 */
export type LeadFormSchema = z.infer<typeof leadFormSchema>;

/**
 * Validate form data against schema
 * Returns validation result with errors if any
 */
export function validateFormData(data: unknown): { 
  success: boolean; 
  data?: LeadFormData; 
  errors?: Array<{ field: string; message: string }>;
} {
  const result = leadFormSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data as LeadFormData };
  }

  const errors = result.error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

  return { success: false, errors };
}

/**
 * Sanitize string input to prevent injection
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Format phone number to Brazilian format
 */
export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) {
    return numbers.length ? `(${numbers}` : '';
  }
  
  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  
  if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
  
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

/**
 * Extract raw phone number digits
 */
export function extractPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Validate if phone is a valid Brazilian mobile
 */
export function isValidMobilePhone(phone: string): boolean {
  const digits = extractPhoneDigits(phone);
  
  if (digits.length !== 11) return false;
  
  const ninthDigit = digits.charAt(2);
  if (ninthDigit !== '9') return false;
  
  const ddd = digits.slice(0, 2);
  const validDDDs = [
    '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '21', '22', '24', '27', '28', '31', '32', '33', '34',
    '35', '37', '38', '41', '42', '43', '44', '45', '46',
    '47', '48', '49', '51', '53', '54', '55', '61', '62',
    '63', '64', '65', '66', '67', '68', '69', '71', '73',
    '74', '75', '77', '79', '81', '82', '83', '84', '85',
    '86', '87', '88', '89', '91', '92', '93', '94', '95',
    '96', '97', '98', '99'
  ];
  
  return validDDDs.includes(ddd);
}
