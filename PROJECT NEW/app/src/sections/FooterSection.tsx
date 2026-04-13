/**
 * Footer Section
 * SulAmérica Saúde - Footer with contact info and legal
 */

import React from 'react';
import { Phone, Mail, MapPin, Shield, ExternalLink } from 'lucide-react';

/**
 * Footer Section Component
 */
export const FooterSection: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#001a3d] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">
                <span className="text-white">Sul</span>
                <span className="text-[#FF7900]">América</span>
                <span className="text-white text-lg block">Saúde</span>
              </h3>
            </div>
            
            <p className="text-white/70 mb-6 max-w-md">
              Há mais de 120 anos cuidando da saúde dos brasileiros. 
              Planos empresariais com os melhores hospitais de Fortaleza.
            </p>
            
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Shield className="w-4 h-4" />
              <span>Registro ANS: 000000</span>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#FF7900]">
              Contato
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/5585989491026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-[#FF7900] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  (85) 98949-1026
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@sulamerica.com.br"
                  className="flex items-center gap-2 text-white/70 hover:text-[#FF7900] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  contato@sulamerica.com.br
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-white/70">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Fortaleza, CE</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#FF7900]">
              Links Úteis
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.sulamerica.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-[#FF7900] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Site Oficial
                </a>
              </li>
              <li>
                <a
                  href="https://www.ans.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-[#FF7900] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  ANS
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-white/70 hover:text-[#FF7900] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {currentYear} SulAmérica Saúde. Todos os direitos reservados.
            </p>
            
            <p className="text-white/50 text-sm text-center md:text-right">
              Este é um site de captação de leads autorizado.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
