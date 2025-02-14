import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: number;
  title: string;
  description?: string;
  status: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextValue {
  toast: (props: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, status }: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, description, status }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`p-4 rounded-lg shadow-lg max-w-sm transition-all transform animate-slide-in ${
              t.status === 'success' ? 'bg-green-500' :
              t.status === 'error' ? 'bg-red-500' :
              t.status === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            } text-white`}
          >
            <h4 className="font-medium">{t.title}</h4>
            {t.description && <p className="text-sm mt-1 opacity-90">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};