import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import TextArea from '../components/UI/TextArea';
import { useData } from '../contexts/DataContext';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useForm from '../hooks/useForm';
import { useToastContext } from '../contexts/ToastContext';

const { FiClipboard, FiPlus, FiSearch, FiFilter, FiCalendar, FiUser, FiMapPin, FiClock, FiCheckCircle, FiAlertTriangle, FiEdit, FiEye, FiTrash2 } = FiIcons;

const WorkOrders = () => {
  const { workOrders, properties, addWorkOrder, updateWorkOrder, deleteWorkOrder } = useData();
  const toast = useToastContext();
  const [showModal, setShowModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentWorkOrderId, setCurrentWorkOrderId] = useState(null);
  const [currentWorkOrder, setCurrentWorkOrder] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const initialValues = {
    title: '',
    propertyId: '',
    category: 'Climatização',
    priority: 'Média',
    assignedTo: '',
    description: '',
    status: 'Aberta',
    dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  };

  const validateWorkOrder = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = 'Título é obrigatório';
    }
    if (!values.propertyId) {
      errors.propertyId = 'Imóvel é obrigatório';
    }
    if (!values.assignedTo) {
      errors.assignedTo = 'Responsável é obrigatório';
    }
    if (!values.description) {
      errors.description = 'Descrição é obrigatória';
    }
    if (!values.dueDate) {
      errors.dueDate = 'Data de prazo é obrigatória';
    }
    return errors;
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    resetForm,
    setValues
  } = useForm(initialValues, validateWorkOrder);

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          wo.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || wo.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (workOrder = null) => {
    if (workOrder) {
      setCurrentWorkOrderId(workOrder.id);
      setValues({
        title: workOrder.title,
        propertyId: workOrder.propertyId,
        category: workOrder.category,
        priority: workOrder.priority,
        assignedTo: workOrder.assignedTo,
        description: workOrder.description,
        status: workOrder.status,
        dueDate: format(workOrder.dueDate, 'yyyy-MM-dd')
      });
    } else {
      setCurrentWorkOrderId(null);
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
    setCurrentWorkOrderId(null);
  };

  const handleViewDetails = (workOrder) => {
    setCurrentWorkOrder(workOrder);
    setDetailsModal(true);
  };

  const openDeleteConfirmation = (id) => {
    setCurrentWorkOrderId(id);
    setConfirmDeleteModal(true);
  };

  const handleDeleteWorkOrder = () => {
    if (currentWorkOrderId) {
      deleteWorkOrder(currentWorkOrderId);
      setConfirmDeleteModal(false);
      setCurrentWorkOrderId(null);
      toast.success('Ordem de serviço excluída com sucesso');
    }
  };

  const onSubmitWorkOrder = async (formData) => {
    try {
      if (currentWorkOrderId) {
        await updateWorkOrder({
          id: currentWorkOrderId,
          ...formData,
          dueDate: new Date(formData.dueDate)
        });
        toast.success('Ordem de serviço atualizada com sucesso');
      } else {
        await addWorkOrder({
          ...formData,
          dueDate: new Date(formData.dueDate)
        });
        toast.success('Ordem de serviço criada com sucesso');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar ordem de serviço:', error);
      toast.error('Erro ao salvar ordem de serviço');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aberta': return FiAlertTriangle;
      case 'Em Andamento': return FiClock;
      case 'Concluída': return FiCheckCircle;
      default: return FiClipboard;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aberta': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Em Andamento': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Concluída': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return 'bg-red-500';
      case 'Média': return 'bg-yellow-500';
      case 'Baixa': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const categoryOptions = [
    { value: 'Climatização', label: 'Climatização' },
    { value: 'Elétrica', label: 'Elétrica' },
    { value: 'Hidráulica', label: 'Hidráulica' },
    { value: 'Pintura', label: 'Pintura' },
    { value: 'Estrutural', label: 'Estrutural' },
    { value: 'Limpeza', label: 'Limpeza' }
  ];

  const priorityOptions = [
    { value: 'Baixa', label: 'Baixa' },
    { value: 'Média', label: 'Média' },
    { value: 'Alta', label: 'Alta' }
  ];

  const propertyOptions = properties.map(property => ({
    value: property.id,
    label: property.name
  }));

  const companyOptions = [
    { value: 'Empresa ABC Climatização', label: 'Empresa ABC Climatização' },
    { value: 'Eletro Serviços Ltda', label: 'Eletro Serviços Ltda' },
    { value: 'Pinturas e Reformas Silva', label: 'Pinturas e Reformas Silva' }
  ];

  const statusOptions = [
    { value: 'Aberta', label: 'Aberta' },
    { value: 'Em Andamento', label: 'Em Andamento' },
    { value: 'Concluída', label: 'Concluída' }
  ];

  const handleFilterClick = () => {
    toast.info('Funcionalidade de filtros avançados em desenvolvimento');
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
        <Button icon={FiPlus} onClick={() => handleOpenModal()}>
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
              <Button variant="outline" icon={FiFilter} onClick={handleFilterClick}>
                Filtros
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Work Orders List */}
      <div className="space-y-4">
        {filteredWorkOrders.length > 0 ? (
          filteredWorkOrders.map((workOrder, index) => (
            <motion.div
              key={workOrder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(workOrder.priority)} mr-2`}></div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {workOrder.id}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          workOrder.status
                        )}`}
                      >
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
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
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
                  <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FiEye}
                      onClick={() => handleViewDetails(workOrder)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FiEdit}
                      onClick={() => handleOpenModal(workOrder)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={FiTrash2}
                      onClick={() => openDeleteConfirmation(workOrder.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="p-8">
            <div className="text-center">
              <SafeIcon 
                icon={FiClipboard} 
                className="w-12 h-12 mx-auto text-gray-400 mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Nenhuma ordem de serviço encontrada
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Não foram encontradas ordens de serviço com os critérios de busca atuais
              </p>
              <Button 
                onClick={() => handleOpenModal()} 
                icon={FiPlus} 
                className="mt-4"
              >
                Criar Nova Ordem
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Work Order Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={currentWorkOrderId ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
        size="lg"
      >
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmitWorkOrder);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Título"
                id="title"
                name="title"
                placeholder="Ex: Manutenção Sistema de Ar Condicionado"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.title}
                required
              />
            </div>
            
            <Select
              label="Imóvel"
              id="propertyId"
              name="propertyId"
              value={values.propertyId}
              onChange={handleChange}
              onBlur={handleBlur}
              options={[{ value: '', label: 'Selecione um imóvel' }, ...propertyOptions]}
              error={errors.propertyId}
              required
            />
            
            <Select
              label="Categoria"
              id="category"
              name="category"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              options={categoryOptions}
              required
            />
            
            <Select
              label="Prioridade"
              id="priority"
              name="priority"
              value={values.priority}
              onChange={handleChange}
              onBlur={handleBlur}
              options={priorityOptions}
              required
            />
            
            <Select
              label="Empresa Responsável"
              id="assignedTo"
              name="assignedTo"
              value={values.assignedTo}
              onChange={handleChange}
              onBlur={handleBlur}
              options={[{ value: '', label: 'Selecione uma empresa' }, ...companyOptions]}
              error={errors.assignedTo}
              required
            />
            
            <Input
              label="Data Limite"
              id="dueDate"
              name="dueDate"
              type="date"
              value={values.dueDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.dueDate}
              required
            />

            <Select
              label="Status"
              id="status"
              name="status"
              value={values.status || 'Aberta'}
              onChange={handleChange}
              onBlur={handleBlur}
              options={statusOptions}
              required
            />
          </div>
          
          <TextArea
            label="Descrição"
            id="description"
            name="description"
            placeholder="Descreva detalhadamente o serviço a ser realizado..."
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.description}
            rows={4}
            required
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
            >
              {currentWorkOrderId ? "Atualizar" : "Criar"} Ordem
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Work Order Details Modal */}
      <Modal
        isOpen={detailsModal}
        onClose={() => setDetailsModal(false)}
        title="Detalhes da Ordem de Serviço"
        size="lg"
      >
        {currentWorkOrder && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  currentWorkOrder.status
                )}`}
              >
                <SafeIcon icon={getStatusIcon(currentWorkOrder.status)} className="w-3 h-3 mr-1" />
                {currentWorkOrder.status}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentWorkOrder.priority === 'Alta'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : currentWorkOrder.priority === 'Média'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}
              >
                Prioridade: {currentWorkOrder.priority}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentWorkOrder.id}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentWorkOrder.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Imóvel</p>
                <p className="text-gray-900 dark:text-white">{currentWorkOrder.propertyName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categoria</p>
                <p className="text-gray-900 dark:text-white">{currentWorkOrder.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Responsável</p>
                <p className="text-gray-900 dark:text-white">{currentWorkOrder.assignedTo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prazo</p>
                <p className="text-gray-900 dark:text-white">
                  {format(currentWorkOrder.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Criação</p>
                <p className="text-gray-900 dark:text-white">
                  {format(currentWorkOrder.createdDate, 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Descrição</p>
              <p className="text-gray-900 dark:text-white whitespace-pre-line p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {currentWorkOrder.description}
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Atualizações
              </h4>
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <SafeIcon icon={FiClock} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">Status alterado</span> para "Em Andamento"
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(subDays(new Date(), 1), 'dd/MM/yyyy', { locale: ptBR })} às 14:30
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">Responsável atribuído</span>: {currentWorkOrder.assignedTo}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(currentWorkOrder.createdDate, 'dd/MM/yyyy', { locale: ptBR })} às 09:15
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setDetailsModal(false)}>
                Fechar
              </Button>
              <Button
                variant="outline"
                icon={FiEdit}
                onClick={() => {
                  setDetailsModal(false);
                  handleOpenModal(currentWorkOrder);
                }}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                icon={FiTrash2}
                onClick={() => {
                  setDetailsModal(false);
                  openDeleteConfirmation(currentWorkOrder.id);
                }}
              >
                Excluir
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={confirmDeleteModal}
        onClose={() => setConfirmDeleteModal(false)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setConfirmDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteWorkOrder}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkOrders;