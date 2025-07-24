import { useState } from 'react';

/**
 * Hook personalizado para gerenciar formulários
 * @param {Object} initialValues - Valores iniciais do formulário
 * @param {Function} validate - Função de validação
 * @returns {Object} - Retorna funções e estados do formulário
 */
const useForm = (initialValues = {}, validate = () => ({})) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para atualizar valores do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
    
    // Validar campo ao mudar se já foi tocado
    if (touched[name]) {
      const fieldErrors = validate({ ...values, [name]: value });
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  // Função para marcar campo como tocado e validá-lo
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prevTouched => ({ ...prevTouched, [name]: true }));
    
    // Validar campo ao perder foco
    const fieldErrors = validate({ ...values, [name]: values[name] });
    setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
  };

  // Função para submeter o formulário
  const handleSubmit = async (callback) => {
    setIsSubmitting(true);
    
    // Marcar todos os campos como tocados
    const allTouched = Object.keys(values).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validar todos os campos
    const formErrors = validate(values);
    setErrors(formErrors);
    
    // Se não há erros, executar callback
    if (Object.keys(formErrors).length === 0) {
      try {
        await callback(values);
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
      }
    }
    
    setIsSubmitting(false);
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues
  };
};

export default useForm;