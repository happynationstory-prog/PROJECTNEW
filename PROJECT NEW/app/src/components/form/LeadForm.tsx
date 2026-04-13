/**
 * Lead Form Component
 * SulAmérica Saúde - Main Form UI
 * 
 * Enterprise-grade form with validation, persistence, and WhatsApp integration
 */

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Send,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

import { leadFormSchema, formatPhoneNumber, parseAges } from '@/lib/validation';
import { generateWhatsAppRedirect, redirectToWhatsApp } from '@/services/whatsappService';
import { useFormPersistence, clearStorage } from '@/hooks/useFormPersistence';
import { useSubmitThrottle } from '@/hooks/useSubmitThrottle';
import type { LeadFormData } from '@/types/leadForm';

interface LeadFormProps {
  onSuccess?: () => void;
  className?: string;
}

/**
 * Lead Form Component
 */
export const LeadForm: React.FC<LeadFormProps> = ({ onSuccess, className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasRestoredData, setHasRestoredData] = useState(false);

  // Initialize React Hook Form with Zod resolver
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    mode: 'onChange',
    defaultValues: {
      city: 'Fortaleza',
      livesCount: 3,
      fullName: '',
      ages: '',
      phone: '',
      email: '',
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid, dirtyFields }, reset } = form;

  // Form persistence hook
  const { restoreData, clearSavedData, hasData, getRestoreTime } = useFormPersistence(watch, setValue);

  // Submit throttling hook
  const { isSubmitting: isThrottled, startSubmit, completeSubmit } = useSubmitThrottle({
    cooldownMs: 10000, // 10 seconds cooldown
    maxSubmissions: 2,
    onMaxSubmissionsReached: () => {
      toast.error('Muitas tentativas. Aguarde alguns segundos.');
    },
  });

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Check for saved data
      if (hasData()) {
        const restored = restoreData();
        if (restored) {
          setHasRestoredData(true);
          const restoreTime = getRestoreTime();
          toast.info(
            'Dados recuperados',
            {
              description: `Seus dados foram restaurados de ${restoreTime?.toLocaleTimeString('pt-BR') || 'uma sessão anterior'}.`,
              action: {
                label: 'Limpar',
                onClick: () => {
                  clearSavedData();
                  reset({ city: 'Fortaleza', livesCount: 3, fullName: '', ages: '', phone: '', email: '' });
                  setHasRestoredData(false);
                  toast.success('Dados limpos');
                },
              },
            }
          );
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [restoreData, hasData, getRestoreTime, clearSavedData, reset]);

  // Phone number mask handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('phone', formatted, { shouldValidate: true });
  };

  // Ages validation helper
  const validateAges = (value: string) => {
    const parsed = parseAges(value);
    const livesCount = watch('livesCount');
    
    if (parsed.isValid && livesCount && parsed.ages.length !== livesCount) {
      return `Número de idades (${parsed.ages.length}) não corresponde à quantidade de vidas (${livesCount})`;
    }
    
    return parsed.isValid || parsed.error;
  };

  // Form submission handler
  const onSubmit = async (data: LeadFormData) => {
    // Start throttling check
    if (!startSubmit()) {
      toast.warning('Aguarde um momento antes de enviar novamente.');
      return;
    }

    try {
      toast.loading('Processando sua solicitação...', { id: 'submit' });

      // Generate WhatsApp message and URL
      const { encodedUrl } = generateWhatsAppRedirect(data);

      // Clear saved data on successful submission
      clearSavedData();
      clearStorage();

      toast.success('Redirecionando para o WhatsApp...', { id: 'submit' });

      // Complete throttle tracking
      completeSubmit(true);

      // Call success callback
      onSuccess?.();

      // Redirect to WhatsApp
      setTimeout(() => {
        redirectToWhatsApp(encodedUrl);
      }, 500);

    } catch (error) {
      console.error('Form submission error:', error);
      completeSubmit(false);
      
      toast.error(
        'Erro ao processar solicitação',
        {
          id: 'submit',
          description: 'Por favor, tente novamente ou entre em contato pelo WhatsApp.',
        }
      );
    }
  };

  // Error handler
  const onError = () => {
    toast.error('Por favor, corrija os erros no formulário.');
  };

  // Reset form handler
  const handleReset = () => {
    clearSavedData();
    reset({ city: 'Fortaleza', livesCount: 3, fullName: '', ages: '', phone: '', email: '' });
    setHasRestoredData(false);
    toast.success('Formulário limpo');
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className={`space-y-5 ${className}`}>
      {/* Restored data alert */}
      {hasRestoredData && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            Seus dados anteriores foram recuperados. Verifique se estão corretos antes de enviar.
          </AlertDescription>
        </Alert>
      )}

      {/* Full Name Field */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-slate-700 font-medium flex items-center gap-2">
          <User className="w-4 h-4 text-[#002F6C]" />
          Nome Completo
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Digite seu nome completo"
          className={`h-12 ${
            errors.fullName 
              ? 'border-red-500 focus-visible:ring-red-500' 
              : dirtyFields.fullName && !errors.fullName
              ? 'border-green-500 focus-visible:ring-green-500'
              : 'border-slate-300 focus-visible:ring-[#002F6C]'
          }`}
          {...register('fullName')}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Lives Count Field */}
      <div className="space-y-2">
        <Label htmlFor="livesCount" className="text-slate-700 font-medium flex items-center gap-2">
          <Users className="w-4 h-4 text-[#002F6C]" />
          Quantidade de Vidas
        </Label>
        <Input
          id="livesCount"
          type="number"
          min={1}
          max={50}
          placeholder="Ex: 3"
          className={`h-12 ${
            errors.livesCount 
              ? 'border-red-500 focus-visible:ring-red-500' 
              : dirtyFields.livesCount && !errors.livesCount
              ? 'border-green-500 focus-visible:ring-green-500'
              : 'border-slate-300 focus-visible:ring-[#002F6C]'
          }`}
          {...register('livesCount', { valueAsNumber: true })}
        />
        <p className="text-slate-500 text-xs">
          Mínimo 1 vida (máximo 50)
        </p>
        {errors.livesCount && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.livesCount.message}
          </p>
        )}
      </div>

      {/* Ages Field */}
      <div className="space-y-2">
        <Label htmlFor="ages" className="text-slate-700 font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#002F6C]" />
          Idades
        </Label>
        <Input
          id="ages"
          type="text"
          placeholder="Ex: 20, 30, 5"
          className={`h-12 ${
            errors.ages 
              ? 'border-red-500 focus-visible:ring-red-500' 
              : dirtyFields.ages && !errors.ages
              ? 'border-green-500 focus-visible:ring-green-500'
              : 'border-slate-300 focus-visible:ring-[#002F6C]'
          }`}
          {...register('ages', { validate: validateAges })}
        />
        <p className="text-slate-500 text-xs">
          Separe as idades por vírgula (ex: 25, 30, 8)
        </p>
        {errors.ages && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.ages.message}
          </p>
        )}
      </div>

      {/* City Field */}
      <div className="space-y-2">
        <Label htmlFor="city" className="text-slate-700 font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#002F6C]" />
          Cidade
        </Label>
        <Input
          id="city"
          type="text"
          placeholder="Sua cidade"
          className={`h-12 ${
            errors.city 
              ? 'border-red-500 focus-visible:ring-red-500' 
              : dirtyFields.city && !errors.city
              ? 'border-green-500 focus-visible:ring-green-500'
              : 'border-slate-300 focus-visible:ring-[#002F6C]'
          }`}
          {...register('city')}
        />
        {errors.city && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.city.message}
          </p>
        )}
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-slate-700 font-medium flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#002F6C]" />
          Celular (WhatsApp)
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(00) 00000-0000"
          maxLength={15}
          className={`h-12 ${
            errors.phone 
              ? 'border-red-500 focus-visible:ring-red-500' 
              : dirtyFields.phone && !errors.phone
              ? 'border-green-500 focus-visible:ring-green-500'
              : 'border-slate-300 focus-visible:ring-[#002F6C]'
          }`}
          {...register('phone', { onChange: handlePhoneChange })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700 font-medium flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#002F6C]" />
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          className={`h-12 ${
            errors.email 
              ? 'border-red-500 focus-visible:ring-red-500' 
              : dirtyFields.email && !errors.email
              ? 'border-green-500 focus-visible:ring-green-500'
              : 'border-slate-300 focus-visible:ring-[#002F6C]'
          }`}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="space-y-3 pt-4">
        <Button
          type="submit"
          disabled={isThrottled || !isValid}
          className={`w-full h-14 text-lg font-bold transition-all duration-300 ${
            isValid && !isThrottled
              ? 'bg-gradient-to-r from-[#FF7900] to-[#ff9933] hover:from-[#e66d00] hover:to-[#ff8c1a] text-white shadow-lg hover:shadow-xl animate-pulse-subtle'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isThrottled ? (
            <>
              <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Solicitar Cotação no WhatsApp
            </>
          )}
        </Button>

        {hasRestoredData && (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="w-full h-10 border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpar Formulário
          </Button>
        )}
      </div>

      {/* Privacy notice */}
      <p className="text-center text-xs text-slate-500 pt-2">
        Ao enviar, você concorda com o processamento dos seus dados para contato.
        <br />
        Seus dados estão protegidos e não serão compartilhados.
      </p>
    </form>
  );
};

export default LeadForm;
