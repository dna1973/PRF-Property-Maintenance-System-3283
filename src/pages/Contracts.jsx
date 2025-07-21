import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { 
  FiFileText, FiPlus, FiSearch, FiFilter, FiCalendar, 
  FiDollarSign, FiPhone, FiUser, FiEdit, FiEye 
} = FiIcons;

const Contracts = () => {
  const { contracts } = useData();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContracts = contracts.filter(contract =>
    contract.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Vencido':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Suspenso':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contratos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie os contratos de manutenção
          </p>
        </div>
        <Button
          icon={FiPlus}
          onClick={() => setShowModal(true)}
        >
          Novo Contrato
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SafeIcon 
                  icon={FiSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Buscar por empresa ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-prf-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" icon={FiFilter}>
                Filtros
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredContracts.map((contract, index) => (
          <motion.div
            key={contract.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-prf-100 dark:bg-prf-900 p-2 rounded-lg mr-3">
                    <SafeIcon icon={FiFileText} className="w-6 h-6 text-prf-600 dark:text-prf-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {contract.id}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {contract.company}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {contract.service}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                    Vigência
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {format(contract.startDate, 'dd/MM/yyyy', { locale: ptBR })} - {format(contract.endDate, 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-2" />
                    Valor
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(contract.value)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                    Contato
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {contract.contact}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2" />
                    Telefone
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {contract.phone}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 mt-6">
                <Button variant="outline" size="sm" icon={FiEye} className="flex-1">
                  Ver
                </Button>
                <Button variant="outline" size="sm" icon={FiEdit} className="flex-1">
                  Editar
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Contract Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Contrato"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Empresa
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
                placeholder="Nome da empresa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Serviço
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent">
                <option>Manutenção de Ar Condicionado</option>
                <option>Serviços Elétricos</option>
                <option>Serviços Hidráulicos</option>
                <option>Pintura e Reforma</option>
                <option>Limpeza e Conservação</option>
                <option>Segurança</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Início
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Término
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor do Contrato (R$)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent">
                <option>Ativo</option>
                <option>Suspenso</option>
                <option>Vencido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contato
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
                placeholder="Nome do responsável"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
                placeholder="(00) 0000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
              placeholder="Informações adicionais sobre o contrato..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Contrato
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Contracts;