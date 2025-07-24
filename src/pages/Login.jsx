import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Button from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/UI/Input';
import useForm from '../hooks/useForm';
import { useToastContext } from '../contexts/ToastContext';

const { FiShield, FiMail, FiLock, FiEye, FiEyeOff } = FiIcons;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToastContext();

  const validateLogin = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'E-mail inválido';
    }
    
    if (!values.password) {
      errors.password = 'Senha é obrigatória';
    } else if (values.password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    return errors;
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  } = useForm(
    { email: 'admin@prf.gov.br', password: '123456' },
    validateLogin
  );

  const onSubmit = async () => {
    try {
      await login(values.email, values.password);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao realizar login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-prf-50 to-prf-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="mx-auto h-16 w-16 bg-prf-600 rounded-full flex items-center justify-center mb-4"
            >
              <SafeIcon icon={FiShield} className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              PRF
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sistema de Gestão de Manutenção Predial
            </p>
          </div>

          {/* Form */}
          <form 
            className="mt-8 space-y-6" 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit);
            }}
          >
            <div className="space-y-4">
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="E-mail"
                  required
                  placeholder="Digite seu e-mail"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  className="pl-10"
                />
                <SafeIcon 
                  icon={FiMail} 
                  className="absolute left-3 top-10 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-2 border 
                      ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} 
                      rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                      placeholder-gray-500 focus:ring-2 
                      ${errors.password ? 'focus:ring-red-500' : 'focus:ring-prf-500'} 
                      focus:border-transparent`}
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <SafeIcon
                      icon={showPassword ? FiEyeOff : FiEye}
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
              size="lg"
            >
              Entrar
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Credenciais de teste: admin@prf.gov.br / 123456
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;