import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiAlertTriangle, FiInfo, FiX, FiAlertCircle } = FiIcons;

const Toast = ({ id, message, type, duration, onClose }) => {
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);
    
    return () => {
      clearInterval(timer);
    };
  }, [duration]);
  
  useEffect(() => {
    if (progress === 0) {
      onClose(id);
    }
  }, [progress, onClose, id]);
  
  const getIcon = () => {
    switch (type) {
      case 'success': return FiCheck;
      case 'error': return FiAlertCircle;
      case 'warning': return FiAlertTriangle;
      case 'info': return FiInfo;
      default: return FiInfo;
    }
  };
  
  const getColor = () => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="flex items-center p-4">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getColor()} flex items-center justify-center mr-3`}>
          <SafeIcon icon={getIcon()} className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 pr-6">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <SafeIcon icon={FiX} className="w-5 h-5" />
        </button>
      </div>
      <div
        className={`h-1 ${getColor()}`}
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;