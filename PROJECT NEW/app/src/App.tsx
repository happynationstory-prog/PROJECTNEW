/**
 * SulAmérica Saúde - Lead Generation Application
 * Enterprise-Grade Insurance Lead-Gen System
 * 
 * TARGET WHATSAPP: +5585989491026
 * REDIRECT URL: https://wa.me/5585989491026
 */

import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { HeroSection, BenefitsSection, FooterSection } from '@/sections';

/**
 * Main Application Component
 * Wraps all sections with Error Boundary and Toast notifications
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 5000,
            className: 'font-sans',
          }}
        />
        
        {/* Main Content */}
        <main>
          {/* Hero Section with Form */}
          <HeroSection />
          
          {/* Benefits & Hospitals Section */}
          <BenefitsSection />
          
          {/* Footer */}
          <FooterSection />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
