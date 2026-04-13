/**
 * Hero Section
 * SulAmérica Saúde - Main Landing Section
 * 
 * Features Hospital São Carlos background with dark overlay
 * and the main call-to-action form
 */

import React from 'react';
import { Building2, Shield, Clock, Award } from 'lucide-react';
import { LeadForm } from '@/components/form/LeadForm';

// SulAmérica Logo SVG Component
const SulAmericaLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    viewBox="0 0 200 50" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* S wave icon */}
    <path
      d="M10 35C10 35 5 30 5 25C5 20 10 15 15 15C20 15 25 20 25 25C25 30 20 35 15 35"
      stroke="#FF7900"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M15 35C20 35 25 30 25 25"
      stroke="#002F6C"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    {/* SulAmérica text */}
    <text x="35" y="28" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#002F6C">
      SulAmérica
    </text>
    {/* Saúde text */}
    <text x="35" y="42" fontFamily="Arial, sans-serif" fontSize="12" fill="#FF7900">
      Saúde
    </text>
  </svg>
);

/**
 * Hero Section Component
 */
export const HeroSection: React.FC = () => {
  const handleFormSuccess = () => {
    // Additional success handling if needed
    console.log('Form submitted successfully');
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Hospital São Carlos */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />
      
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#002F6C]/90 via-[#002F6C]/80 to-[#001a3d]/95" />
      
      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-2 shadow-lg">
                <SulAmericaLogo className="h-10 w-auto" />
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <Shield className="w-5 h-5 text-[#FF7900]" />
                <span className="text-sm font-medium">100% Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="w-5 h-5 text-[#FF7900]" />
                <span className="text-sm font-medium">Atendimento 24h</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
                  {/* Main Headline */}
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#FF7900] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      <Building2 className="w-4 h-4" />
                      Para Empresas e MEI
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      Mora em{' '}
                      <span className="text-[#FF7900]">Fortaleza</span>
                      <br />
                      e possui um{' '}
                      <span className="text-[#FF7900]">CNPJ/MEI</span>?
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-white/90 max-w-xl mx-auto lg:mx-0">
                      Tenha acesso aos melhores hospitais da cidade com planos a partir de{' '}
                      <span className="text-[#FF7900] font-bold">R$ 292,08</span>{' '}
                      para o seu negócio.
                    </p>
                  </div>

                  {/* Price Highlight */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <div className="text-center sm:text-left">
                        <p className="text-white/70 text-sm mb-1">A partir de</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-white text-2xl font-medium">R$</span>
                          <span className="text-[#FF7900] text-5xl sm:text-6xl font-bold">292</span>
                          <span className="text-[#FF7900] text-2xl">,08</span>
                        </div>
                      </div>
                      
                      <div className="hidden sm:block w-px h-16 bg-white/30" />
                      
                      <div className="text-center sm:text-left">
                        <div className="flex items-center gap-2 text-white">
                          <UsersIcon className="w-5 h-5 text-[#FF7900]" />
                          <span className="font-semibold">À partir de 3 vidas</span>
                        </div>
                        <p className="text-white/70 text-sm mt-1">
                          Idade: 0 - 18 anos
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hospitals List */}
                  <div className="space-y-3">
                    <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
                      Hospitais Inclusos:
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                      {[
                        'São Carlos',
                        'Oto Meireles',
                        'Hosp da Criança',
                        'E muito mais...',
                      ].map((hospital, index) => (
                        <span
                          key={index}
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            index === 0
                              ? 'bg-[#FF7900] text-white'
                              : 'bg-white/20 text-white border border-white/30'
                          }`}
                        >
                          {hospital}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                    <div className="flex items-center gap-2 text-white/80">
                      <Award className="w-5 h-5 text-[#FF7900]" />
                      <span className="text-sm">ANS Certified</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Shield className="w-5 h-5 text-[#FF7900]" />
                      <span className="text-sm">Cobertura Nacional</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Form Card */}
                <div className="relative">
                  {/* Form Card */}
                  <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-200">
                    {/* Form Header */}
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-[#002F6C] mb-2">
                        Solicite sua Cotação
                      </h2>
                      <p className="text-slate-600 text-sm">
                        Preencha o formulário e receba atendimento personalizado no WhatsApp
                      </p>
                    </div>

                    {/* Form Component */}
                    <LeadForm onSuccess={handleFormSuccess} />

                    {/* Form Footer */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span>Dados Seguros</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#FF7900]" />
                          <span>Resposta em 5min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FF7900]/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#002F6C]/20 rounded-full blur-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-[#001a3d]/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-white/70 text-sm">
              <span className="text-[#FF7900] font-semibold">Clique no botão</span> de saiba mais e faça sua cotação{' '}
              <span className="text-[#FF7900] font-semibold">100% online</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper icon component
const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
    />
  </svg>
);

export default HeroSection;
