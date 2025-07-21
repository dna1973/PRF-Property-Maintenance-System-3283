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
  FiClipboard, FiPlus, FiSearch, FiFilter, FiCalendar, 
  FiUser, FiMapPin, FiClock, FiCheckCircle, FiAlertTriangle,
  FiEdit, FiEye 
} = FiIcons;

const WorkOrders = () => {
  const { workOrders } = useData();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || wo.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aberta':
        return FiAlertTriangle;
      case 'Em Andamento':
        return FiClock;
      case 'Concluída':
        return FiCheckCircle;
      default:
        return FiClipboard;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aberta':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Em Andamento':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Concluída':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-500';
      case 'Média':
        return 'bg-yellow-500';
      case 'Baixa':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ordens de Serviço</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie as ordens de serviço de manutenção
          </p>
        </div>
        <Button
          icon={FiPlus}
          onClick={() => setShowModal(true)}
        >
          Nova Ordem
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
                  placeholder="Buscar por título ou imóvel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-prf-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="Aberta">Aberta</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluída">Concluída</option>
              </select>
              <Button variant="outline" icon={FiFilter}>
                Filtros
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Work Orders List */}
      <div className="space-y-4">
        {filteredWorkOrders.map((workOrder, index) => (
          <motion.div
            key={workOrder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(workOrder.priority)} mr-2`}></div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {workOrder.id}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workOrder.status)}`}>
                      <SafeIcon icon={getStatusIcon(workOrder.status)} className="w-3 h-3 mr-1" />
                      {workOrder.status}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Prioridade: {workOrder.priority}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {workOrder.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {workOrder.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2" />
                      {workOrder.propertyName}
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                      {workOrder.assignedTo}
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                      Prazo: {format(workOrder.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm" icon={FiEye}>
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" icon={FiEdit}>
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Work Order Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nova Ordem de Serviço"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
                placeholder="Ex: Manutenção Sistema de Ar Condicionado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imóvel
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent">
                <option>Selecione um imóvel</option>
                <option>PRF - Superintendência Regional DF</option>
                <option>PRF - Posto Rodoviário BR-040</option>
                <option>PRF - Base Operacional Taguatinga</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent">
                <option>Climatização</option>
                <option>Elétrica</option>
                <option>Hidráulica</option>
                <option>Pintura</option>
                <option>Estrutural</option>
                <option>Limpeza</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prioridade
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent">
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Empresa Responsável
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent">
                <option>Selecione uma empresa</option>
                <option>Empresa ABC Climatização</option>
                <option>Eletro Serviços Ltda</option>
                <option>Pinturas e Reformas Silva</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
              placeholder="Descreva detalhadamente o serviço a ser realizado..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Ordem
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WorkOrders;