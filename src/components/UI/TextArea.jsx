import React from 'react';

const TextArea = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  rows = 3,
  error,
  required = false,
  className = '',
  ...props
}) => {
  // Garantir que o valor nunca seja undefined para evitar problemas de componente controlado/não controlado
  const textareaValue = value === undefined || value === null ? '' : value;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={textareaValue}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-prf-500 focus:border-transparent ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TextArea;