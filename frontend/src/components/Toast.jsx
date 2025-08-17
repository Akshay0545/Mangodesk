import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastCtx = createContext(null);
export function useToast() { return useContext(ToastCtx); }

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = 'info', ttl = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      {/* ✅ bottom-right stack, responsive on mobile */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6">
        {toasts.map(t => (
          <div
            key={t.id}
            className={[
              "pointer-events-auto rounded-lg px-4 py-2 text-sm shadow-lg transition",
              "bg-white text-gray-900 border border-gray-200",
              "dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700",
              t.type === 'success' && "ring-1 ring-green-500/30",
              t.type === 'error' && "ring-1 ring-red-500/30",
              t.type === 'info' && "ring-1 ring-blue-500/30"
            ].join(' ')}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
