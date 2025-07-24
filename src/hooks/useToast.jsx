import { useState, useEffect } from 'react';

// Função simples para gerar IDs únicos sem dependência externa
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 3000) => {
    const id = generateId();
    const newToast = {
      id,
      message,
      type,
      duration,
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(prev => {
          if (prev.length > 0) {
            return prev.slice(1);
          }
          return prev;
        });
      }, toasts[0].duration);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  return {
    toasts,
    addToast,
    removeToast,
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
  };
};

export default useToast;