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
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useForm from '../hooks/useForm';
import { useToastContext } from '../contexts/ToastContext';

const { FiFileText, FiPlus, FiSearch, FiFilter, FiCalendar, FiDollarSign, FiPhone, FiUser, FiEdit, FiEye, FiTrash2 } = FiIcons;

const Contracts = () => {
  const { contracts, addContract, updateContract, deleteContract } = useData();
  const toast = useToastContext();
  const [showModal, setShowModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentContractId, setCurrentContractId] = useState(null);
  const [currentContract, setCurrentContract] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const initialValues = {
    company: '',
    service: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 365), 'yyyy-MM-dd'),
    value: '',
    status: 'Ativo',
    contact: '',
    phone: '',
    notes: ''
  };

  const validateContract = (values) => {
    const errors = {};
    if (!values.company) {
      errors.company = 'Nome da empresa é obrigatório';
    }
    if (!values.service) {
      errors.service = 'Tipo de serviço é obrigatório';
    }
    if (!values.startDate) {
      errors.startDate = 'Data de início é obrigatória';
    }
    if (!values.endDate) {
      errors.endDate = 'Data de término é obrigatória';
    }
    if (values.startDate && values.endDate && new Date(values.startDate) > new Date(values.endDate)) {
      errors.endDate = 'A data de término deve ser posterior à data de início';
    }
    if (!values.value) {
      errors.value = 'Valor do contrato é obrigatório';
    } else if (isNaN(values.value) || parseFloat(values.value) <= 0) {
      errors.value = 'Valor deve ser um número positivo';
    }
    if (!values.contact) {
      errors.contact = 'Nome do contato é obrigatório';
    }
    if (!values.phone) {
      errors.phone = 'Telefone é obrigatório';
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
  } = useForm(initialValues, validateContract);

  const filteredContracts = contracts.filter(contract => 
    contract.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    contract.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (contract = null) => {
    if (contract) {
      setCurrentContractId(contract.id);
      setValues({
        company: contract.company,
        service: contract.service,
        startDate: format(contract.startDate, 'yyyy-MM-dd'),
        endDate: format(contract.endDate, 'yyyy-MM-dd'),
        value: contract.value.toString(),
        status: contract.status,
        contact: contract.contact,
        phone: contract.phone,
        notes: contract.notes || ''
      });
    } else {
      setCurrentContractId(null);
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
    setCurrentContractId(null);
  };

  const handleViewDetails = (contract) => {
    setCurrentContract(contract);
    setDetailsModal(true);
  };

  const openDeleteConfirmation = (id) => {
    setCurrentContractId(id);
    setConfirmDeleteModal(true);
  };

  const handleDeleteContract = () => {
    if (currentContractId) {
      deleteContract(currentContractId);
      setConfirmDeleteModal(false);
      setCurrentContractId(null);
      toast.success('Contrato excluído com sucesso');
    }
  };

  const onSubmitContract = async (formData) => {
    try {
      const contractData = {
        ...formData,
        value: parseFloat(formData.value),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate)
      };

      if (currentContractId) {
        await updateContract({
          id: currentContractId,
          ...contractData
        });
        toast.success('Contrato atualizado com sucesso');
      } else {
        await addContract(contractData);
        toast.success('Contrato adicionado com sucesso');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar contrato:', error);
      toast.error('Erro ao salvar contrato');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Vencido': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Suspenso': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const serviceOptions = [
    { value: 'Manutenção de Ar Condicionado', label: 'Manutenção de Ar Condicionado' },
    { value: 'Serviços Elétricos', label: 'Serviços Elétricos' },
    { value: 'Serviços Hidráulicos', label: 'Serviços Hidráulicos' },
    { value: 'Pintura e Reforma', label: 'Pintura e Reforma' },
    { value: 'Limpeza e Conservação', label: 'Limpeza e Conservação' },
    { value: 'Segurança', label: 'Segurança' }
  ];

  const statusOptions = [
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Suspenso', label: 'Suspenso' },
    { value: 'Vencido', label: 'Vencido' }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contratos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie os contratos de manutenção
          </p>
        </div>
        <Button icon={FiPlus} onClick={() => handleOpenModal()}>
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
              <Button variant="outline" icon={FiFilter} onClick={handleFilterClick}>
                Filtros
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredContracts.length > 0 ? (
          filteredContracts.map((contract, index) => (
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
                      <SafeIcon
                        icon={FiFileText}
                        className="w-6 h-6 text-prf-600 dark:text-prf-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {contract.id}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          contract.status
                        )}`}
                      >
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
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiEye}
                    className="flex-1"
                    onClick={() => handleViewDetails(contract)}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiEdit}
                    className="flex-1"
                    onClick={() => handleOpenModal(contract)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={FiTrash2}
                    onClick={() => openDeleteConfirmation(contract.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-1 lg:col-span-2 flex justify-center p-8">
            <div className="text-center">
              <SafeIcon 
                icon={FiFileText} 
                className="w-12 h-12 mx-auto text-gray-400 mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Nenhum contrato encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Não foram encontrados contratos com os critérios de busca atuais
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Contract Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={currentContractId ? "Editar Contrato" : "Novo Contrato"}
        size="lg"
      >
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmitContract);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Empresa"
              id="company"
              name="company"
              placeholder="Nome da empresa"
              value={values.company}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.company}
              required
            />
            
            <Select
              label="Tipo de Serviço"
              id="service"
              name="service"
              value={values.service}
              onChange={handleChange}
              onBlur={handleBlur}
              options={serviceOptions}
              error={errors.service}
              required
            />
            
            <Input
              label="Data de Início"
              id="startDate"
              name="startDate"
              type="date"
              value={values.startDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.startDate}
              required
            />
            
            <Input
              label="Data de Término"
              id="endDate"
              name="endDate"
              type="date"
              value={values.endDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.endDate}
              required
            />
            
            <Input
              label="Valor do Contrato (R$)"
              id="value"
              name="value"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={values.value}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.value}
              required
            />
            
            <Select
              label="Status"
              id="status"
              name="status"
              value={values.status}
              onChange={handleChange}
              onBlur={handleBlur}
              options={statusOptions}
              required
            />
            
            <Input
              label="Contato"
              id="contact"
              name="contact"
              placeholder="Nome do responsável"
              value={values.contact}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.contact}
              required
            />
            
            <Input
              label="Telefone"
              id="phone"
              name="phone"
              placeholder="(00) 0000-0000"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              required
            />
          </div>
          
          <TextArea
            label="Observações"
            id="notes"
            name="notes"
            placeholder="Informações adicionais sobre o contrato..."
            value={values.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={3}
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
              {currentContractId ? "Atualizar" : "Salvar"} Contrato
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Contract Details Modal */}
      <Modal
        isOpen={detailsModal}
        onClose={() => setDetailsModal(false)}
        title="Detalhes do Contrato"
        size="lg"
      >
        {currentContract && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  currentContract.status
                )}`}
              >
                {currentContract.status}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentContract.id}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentContract.company}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {currentContract.service}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vigência</p>
                <p className="text-gray-900 dark:text-white">
                  {format(currentContract.startDate, 'dd/MM/yyyy', { locale: ptBR })} - {format(currentContract.endDate, 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor</p>
                <p className="text-gray-900 dark:text-white">
                  {formatCurrency(currentContract.value)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contato</p>
                <p className="text-gray-900 dark:text-white">{currentContract.contact}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Telefone</p>
                <p className="text-gray-900 dark:text-white">{currentContract.phone}</p>
              </div>
            </div>

            {currentContract.notes && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Observações</p>
                <p className="text-gray-900 dark:text-white whitespace-pre-line p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {currentContract.notes}
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Ordens de Serviço Relacionadas
              </h4>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Não há ordens de serviço associadas a este contrato
                </p>
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
                  handleOpenModal(currentContract);
                }}
              >
                Editar
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
            Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.
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
              onClick={handleDeleteContract}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Contracts;