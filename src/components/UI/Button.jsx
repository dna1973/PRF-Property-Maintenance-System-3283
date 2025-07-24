import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-prf-600 hover:bg-prf-700 text-white focus:ring-prf-500 disabled:bg-prf-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white focus:ring-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-800',
    outline: 'border-2 border-prf-600 text-prf-600 hover:bg-prf-600 hover:text-white focus:ring-prf-500 disabled:border-prf-300 disabled:text-prf-300 disabled:hover:bg-transparent disabled:hover:text-prf-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-300',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // Melhorar contraste no modo escuro
  const darkVariants = {
    primary: 'dark:bg-prf-500 dark:hover:bg-prf-600 dark:text-white dark:focus:ring-prf-400',
    secondary: 'dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:focus:ring-gray-400',
    outline: 'dark:border-prf-500 dark:text-prf-400 dark:hover:bg-prf-500 dark:hover:text-white dark:focus:ring-prf-400',
    danger: 'dark:bg-red-600 dark:hover:bg-red-700 dark:text-white dark:focus:ring-red-400',
  };

  const variantClass = `${variants[variant]} ${darkVariants[variant]}`;

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variantClass} ${sizes[size]} ${disabled ? 'cursor-not-allowed opacity-70' : ''} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      ) : icon ? (
        <SafeIcon icon={icon} className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;