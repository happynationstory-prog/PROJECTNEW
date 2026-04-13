/**
 * Benefits Section
 * SulAmérica Saúde - Features & Benefits
 * 
 * Showcases the key benefits and hospitals included in the plan
 */

import React from 'react';
import { 
  Building2, 
  Stethoscope, 
  Heart, 
  Clock, 
  Baby,
  Activity,
  Users,
  CheckCircle2
} from 'lucide-react';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}

interface Hospital {
  name: string;
  specialties: string[];
  highlight?: boolean;
}

const benefits: Benefit[] = [
  {
    icon: <Building2 className="w-8 h-8" />,
    title: 'Hospitais de Excelência',
    description: 'Acesso aos melhores hospitais de Fortaleza, incluindo Hospital São Carlos e Oto Meireles.',
    highlight: true,
  },
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: 'Consultas Ilimitadas',
    description: 'Agende consultas com especialistas sem limite de utilização no plano.',
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Cobertura Completa',
    description: 'Procedimentos, exames, internações e tratamentos com cobertura integral.',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Atendimento 24h',
    description: 'Pronto atendimento disponível 24 horas por dia, 7 dias por semana.',
  },
  {
    icon: <Baby className="w-8 h-8" />,
    title: 'Pediatria Especializada',
    description: 'Cuidado completo para os pequenos com pediatras experientes.',
  },
  {
    icon: <Activity className="w-8 h-8" />,
    title: 'Exames de Alta Complexidade',
    description: 'Tomografia, ressonância magnética e outros exames avançados.',
  },
];

const hospitals: Hospital[] = [
  {
    name: 'Hospital São Carlos',
    specialties: ['Clínica Médica', 'Cirurgia', 'UTI', 'Pronto Atendimento 24h'],
    highlight: true,
  },
  {
    name: 'Hospital Oto Meireles',
    specialties: ['Ortopedia', 'Traumatologia', 'Fisioterapia'],
  },
  {
    name: 'Hospital da Criança',
    specialties: ['Pediatria', 'Neonatologia', 'UTI Pediátrica'],
  },
  {
    name: 'Hospital Monte Klinikum',
    specialties: ['Cardiologia', 'Neurologia', 'Oncologia'],
  },
];

const planFeatures = [
 'Sem carência para urgência e emergência',
  'Cobertura nacional',
  'Reembolso para consultas fora da rede',
  'Desconto em farmácias parceiras',
  'Programa de prevenção à saúde',
  'App exclusivo para agendamentos',
];

/**
 * Benefits Section Component
 */
export const BenefitsSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#FF7900]/10 text-[#FF7900] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Por que escolher SulAmérica?
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#002F6C] mb-4">
            Benefícios Exclusivos para sua Empresa
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Planos corporativos com cobertura completa e os melhores hospitais de Fortaleza.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                benefit.highlight 
                  ? 'border-[#FF7900] hover:border-[#FF7900]' 
                  : 'border-transparent hover:border-[#002F6C]/20'
              }`}
            >
              {benefit.highlight && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#FF7900] text-white text-xs font-bold px-3 py-1 rounded-full">
                    DESTAQUE
                  </span>
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                benefit.highlight 
                  ? 'bg-[#FF7900] text-white' 
                  : 'bg-[#002F6C]/10 text-[#002F6C] group-hover:bg-[#002F6C] group-hover:text-white'
              }`}>
                {benefit.icon}
              </div>
              
              <h3 className="text-xl font-bold text-[#002F6C] mb-2">
                {benefit.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Hospitals Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-[#002F6C] mb-4">
              Hospitais da Rede Credenciada
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Acesso imediato às melhores unidades de saúde de Fortaleza
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {hospitals.map((hospital, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${
                  hospital.highlight 
                    ? 'border-l-[#FF7900]' 
                    : 'border-l-[#002F6C]'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-[#002F6C] mb-1">
                      {hospital.name}
                    </h4>
                    {hospital.highlight && (
                      <span className="inline-flex items-center gap-1 text-[#FF7900] text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Principal parceiro
                      </span>
                    )}
                  </div>
                  <div className={`p-2 rounded-lg ${
                    hospital.highlight 
                      ? 'bg-[#FF7900]/10' 
                      : 'bg-[#002F6C]/10'
                  }`}>
                    <Building2 className={`w-6 h-6 ${
                      hospital.highlight 
                        ? 'text-[#FF7900]' 
                        : 'text-[#002F6C]'
                    }`} />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-sm px-3 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Features */}
        <div className="bg-gradient-to-br from-[#002F6C] to-[#0047A0] rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Tudo que seu plano inclui
              </h3>
              <p className="text-white/80 text-lg mb-6">
                Benefícios completos para você e seus colaboradores terem 
                a melhor experiência em saúde.
              </p>
              
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <Users className="w-8 h-8 text-[#FF7900]" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Para empresas de todos os portes</p>
                  <p className="text-white/70 text-sm">Do MEI às grandes corporações</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {planFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-[#FF7900] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
