import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Bell } from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (item: Omit<NotificationItem, 'id' | 'timestamp'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const newNotification: NotificationItem = { ...item, id, timestamp };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 3));

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        dismissNotification(id);
      }, 6000);
    },
    [dismissNotification]
  );

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, dismissNotification }}>
      {children}

      {/* Floating Notification Toasts */}
      <div
        className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        role="region"
        aria-label="System notifications"
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start justify-between gap-3 transform transition-all animate-slideDown ${
              n.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : n.type === 'warning'
                ? 'bg-amber-900 text-white border-amber-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              {n.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : n.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Bell className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold text-xs uppercase tracking-wide opacity-90 block">
                  {n.title}
                </span>
                <p className="text-xs text-slate-200 leading-snug">{n.message}</p>
                <span className="text-[10px] text-slate-400 block pt-0.5">{n.timestamp}</span>
              </div>
            </div>

            <button
              onClick={() => dismissNotification(n.id)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
