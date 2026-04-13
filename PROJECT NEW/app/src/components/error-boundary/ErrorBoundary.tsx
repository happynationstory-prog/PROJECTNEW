/**
 * Error Boundary Component
 * SulAmérica Saúde - Crash Prevention Layer
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Class Component
 * Required for catching errors in React class components
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Could also send to error reporting service here
    // Example: Sentry, LogRocket, etc.
    this.reportError(error, errorInfo);
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    // Placeholder for error reporting service
    // In production, integrate with Sentry, LogRocket, etc.
    const isDev = import.meta.env.DEV;
    if (!isDev) {
      console.log('Error would be reported to monitoring service:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoBack = (): void => {
    window.history.back();
  };

  private handleContactSupport = (): void => {
    // Redirect to WhatsApp support
    const supportMessage = encodeURIComponent(
      'Olá! Tive um problema técnico no site de cotação da SulAmérica. Poderia me ajudar?'
    );
    window.open(`https://wa.me/5585989491026?text=${supportMessage}`, '_blank');
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-[#002F6C] to-[#0047A0] text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl font-bold">
                  Oops! Algo deu errado
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-slate-600">
                  Pedimos desculpas pelo inconveniente. Nossa equipe foi notificada 
                  e está trabalhando para resolver o problema.
                </p>
              </div>

              {/* Error details (only in development) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 overflow-auto">
                  <p className="text-red-800 font-mono text-sm">
                    <strong>Erro:</strong> {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-red-600 font-mono text-xs mt-2 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={this.handleReload}
                  className="w-full bg-[#002F6C] hover:bg-[#001f4d] text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={this.handleGoBack}
                    className="w-full border-slate-300"
                  >
                    Voltar
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={this.handleContactSupport}
                    className="w-full border-[#FF7900] text-[#FF7900] hover:bg-[#FF7900] hover:text-white"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Falar no WhatsApp
                  </Button>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-400">
                  SulAmérica Saúde - Cotação de Planos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap components with Error Boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
): React.FC<P> {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;
