import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export type ToastVariant = 'success' | 'warning' | 'danger' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (message: Omit<ToastMessage, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ title, description, variant = 'info', duration = 3000 }: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant, duration }]);

    setTimeout(() => {
      dismiss(id);
    }, duration);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      
      {/* Toast Portal View */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const iconMap = {
            success: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />,
            warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
            danger: <XCircle className="h-5 w-5 text-red-500 shrink-0" />,
            info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
          };

          const bgMap = {
            success: 'bg-white border-l-4 border-l-emerald-500 shadow-lg border border-slate-100',
            warning: 'bg-white border-l-4 border-l-amber-500 shadow-lg border border-slate-100',
            danger: 'bg-white border-l-4 border-l-red-500 shadow-lg border border-slate-100',
            info: 'bg-white border-l-4 border-l-blue-500 shadow-lg border border-slate-100',
          };

          return (
            <div
              key={t.id}
              className={`flex items-start gap-3 p-4 rounded-lg animate-fade-in pointer-events-auto ${bgMap[t.variant || 'info']}`}
              role="alert"
            >
              {iconMap[t.variant || 'info']}
              <div className="flex-1 flex flex-col gap-0.5">
                <h4 className="text-sm font-semibold text-slate-800">{t.title}</h4>
                {t.description && <p className="text-xs text-slate-500">{t.description}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
export default ToastProvider;
