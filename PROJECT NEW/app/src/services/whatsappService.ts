/**
 * WhatsApp Service - Data Sanitization & Redirection Layer
 * SulAmérica Saúde - Enterprise Grade Integration
 * 
 * TARGET: +5585989491026
 * REDIRECT: https://wa.me/5585989491026
 */

import type { LeadFormData, WhatsAppMessage } from '@/types/leadForm';
import { parseAges, sanitizeInput } from '@/lib/validation';

// Target WhatsApp number (Brazilian format)
const TARGET_WHATSAPP = '5585989491026';

// Base WhatsApp URL
const WHATSAPP_BASE_URL = 'https://wa.me';

/**
 * Sanitize all form inputs to prevent injection attacks
 */
function sanitizeFormData(data: LeadFormData): LeadFormData {
  return {
    fullName: sanitizeInput(data.fullName),
    livesCount: data.livesCount,
    ages: sanitizeInput(data.ages),
    city: sanitizeInput(data.city),
    phone: sanitizeInput(data.phone),
    email: sanitizeInput(data.email.toLowerCase()),
  };
}

/**
 * Format current date for the message
 */
function formatCurrentDate(): string {
  const now = new Date();
  return now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate age statistics for the message
 */
function calculateAgeStats(agesString: string): { 
  count: number; 
  min: number; 
  max: number; 
  average: number;
  hasChildren: boolean;
} {
  const parsed = parseAges(agesString);
  
  if (!parsed.isValid || parsed.ages.length === 0) {
    return { count: 0, min: 0, max: 0, average: 0, hasChildren: false };
  }

  const ages = parsed.ages;
  const count = ages.length;
  const min = Math.min(...ages);
  const max = Math.max(...ages);
  const average = Math.round(ages.reduce((a, b) => a + b, 0) / count);
  const hasChildren = ages.some(age => age < 18);

  return { count, min, max, average, hasChildren };
}

/**
 * Generate professional Markdown-formatted message
 * This creates a structured lead report for the sales team
 */
function generateMarkdownMessage(data: LeadFormData): string {
  const sanitized = sanitizeFormData(data);
  const ageStats = calculateAgeStats(sanitized.ages);
  const parsedAges = parseAges(sanitized.ages);
  
  const message = `
*🎯 NOVO LEAD - SULAMÉRICA SAÚDE*

*📅 Data do Contato:* ${formatCurrentDate()}

━━━━━━━━━━━━━━━━━━━━━

*👤 DADOS DO CLIENTE*

*Nome:* ${sanitized.fullName}
*Cidade:* ${sanitized.city}
*Celular:* ${sanitized.phone}
*E-mail:* ${sanitized.email}

━━━━━━━━━━━━━━━━━━━━━

*🏥 PLANO DE SAÚDE*

*Quantidade de Vidas:* ${sanitized.livesCount}
*Idades:* ${parsedAges.ages.join(', ')} anos

*Resumo das Idades:*
• Total: ${ageStats.count} pessoa(s)
• Menor idade: ${ageStats.min} anos
• Maior idade: ${ageStats.max} anos
• Média: ${ageStats.average} anos
${ageStats.hasChildren ? '• ⚠️ Possui criança(s) no plano' : ''}

━━━━━━━━━━━━━━━━━━━━━

*💼 PERFIL DO LEAD*

✅ Empresário com CNPJ/MEI
✅ Localização: ${sanitized.city}
✅ Interesse: Plano SulAmérica Saúde

━━━━━━━━━━━━━━━━━━━━━

*🎯 ORIGEM*

Landing Page - Cotação Online
Hospital São Carlos Incluso

━━━━━━━━━━━━━━━━━━━━━

*Por favor, entre em contato com o cliente o mais breve possível.*
  `.trim();

  return message;
}

/**
 * Safely encode message for URL parameter
 * Uses encodeURIComponent with additional safety checks
 */
function safeUrlEncode(text: string): string {
  // First, normalize the text
  const normalized = text
    .normalize('NFC')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  
  // Encode for URL
  return encodeURIComponent(normalized);
}

/**
 * Build complete WhatsApp URL with encoded message
 */
function buildWhatsAppUrl(encodedMessage: string): string {
  // Validate the encoded message doesn't exceed WhatsApp limits
  // WhatsApp has a practical limit around 2000-4000 characters for the URL
  const MAX_URL_LENGTH = 4000;
  
  const url = `${WHATSAPP_BASE_URL}/${TARGET_WHATSAPP}?text=${encodedMessage}`;
  
  if (url.length > MAX_URL_LENGTH) {
    // If too long, generate a shorter version
    const shortMessage = `
*🎯 NOVO LEAD - SULAMÉRICA SAÚDE*

*Nome:* ${safeUrlEncode.name}
*Cidade:* ${safeUrlEncode.name}
*Celular:* ${safeUrlEncode.name}
*E-mail:* ${safeUrlEncode.name}
*Vidas:* ${safeUrlEncode.name}
*Idades:* ${safeUrlEncode.name}

*Por favor, entre em contato.*
    `.trim();
    
    return `${WHATSAPP_BASE_URL}/${TARGET_WHATSAPP}?text=${safeUrlEncode(shortMessage)}`;
  }
  
  return url;
}

/**
 * Main service function: Generate WhatsApp message and URL
 * This is the primary entry point for form submission
 */
export function generateWhatsAppRedirect(data: LeadFormData): WhatsAppMessage {
  try {
    // Generate the formatted message
    const message = generateMarkdownMessage(data);
    
    // Safely encode for URL
    const encodedMessage = safeUrlEncode(message);
    
    // Build the complete URL
    const encodedUrl = buildWhatsAppUrl(encodedMessage);
    
    return {
      text: message,
      encodedUrl,
    };
  } catch (error) {
    // Fallback in case of any error - never fail silently
    console.error('WhatsApp Service Error:', error);
    
    const fallbackMessage = `Novo Lead SulAmérica: ${data.fullName}, ${data.phone}`;
    return {
      text: fallbackMessage,
      encodedUrl: `${WHATSAPP_BASE_URL}/${TARGET_WHATSAPP}?text=${encodeURIComponent(fallbackMessage)}`,
    };
  }
}

/**
 * Execute the redirect to WhatsApp
 * This should be called after form validation succeeds
 */
export function redirectToWhatsApp(encodedUrl: string): void {
  try {
    // Validate URL before redirect
    if (!encodedUrl.startsWith(WHATSAPP_BASE_URL)) {
      throw new Error('Invalid WhatsApp URL');
    }
    
    // Perform the redirect
    window.location.href = encodedUrl;
  } catch (error) {
    console.error('Redirect Error:', error);
    
    // Fallback: open in new tab if location change fails
    window.open(encodedUrl, '_blank');
  }
}

/**
 * Validate WhatsApp number format
 */
export function isValidWhatsAppNumber(number: string): boolean {
  // Brazilian numbers: 55 (country) + 2 digits (DDD) + 9 digits (number)
  const cleanNumber = number.replace(/\D/g, '');
  return cleanNumber.length === 13 && cleanNumber.startsWith('55');
}

/**
 * Service configuration
 */
export const whatsappConfig = {
  targetNumber: TARGET_WHATSAPP,
  baseUrl: WHATSAPP_BASE_URL,
  fullTargetUrl: `${WHATSAPP_BASE_URL}/${TARGET_WHATSAPP}`,
};

// Default export for convenience
export default {
  generateWhatsAppRedirect,
  redirectToWhatsApp,
  isValidWhatsAppNumber,
  config: whatsappConfig,
};
