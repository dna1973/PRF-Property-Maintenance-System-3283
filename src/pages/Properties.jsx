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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useForm from '../hooks/useForm';
import { useToastContext } from '../contexts/ToastContext';

const { FiBuilding, FiMapPin, FiCalendar, FiPlus, FiEdit, FiTrash2, FiFilter, FiSearch, FiMoreVertical, FiEye } = FiIcons;

const Properties = () => {
  const { properties, addProperty, updateProperty, deleteProperty } = useData();
  const toast = useToastContext();
  const [showModal, setShowModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPropertyId, setCurrentPropertyId] = useState(null);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  // Definir valores iniciais do formulário
  const initialFormValues = {
    name: '',
    location: '',
    type: 'Sede Administrativa',
    area: '',
    status: 'Ativo',
    notes: ''
  };

  // Função de validação
  const validateProperty = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Nome do imóvel é obrigatório';
    }
    if (!values.location) {
      errors.location = 'Localização é obrigatória';
    }
    if (!values.area) {
      errors.area = 'Área é obrigatória';
    } else if (isNaN(values.area) || values.area <= 0) {
      errors.area = 'Área deve ser um número positivo';
    }
    return errors;
  };

  // Inicializar hook de formulário com valores iniciais e função de validação
  const { 
    values, 
    errors, 
    handleChange, 
    handleBlur, 
    handleSubmit, 
    isSubmitting, 
    resetForm, 
    setValues 
  } = useForm(initialFormValues, validateProperty);

  // Filtrar propriedades com base nos critérios de busca
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Função para abrir modal de criação/edição
  const handleOpenModal = (property = null) => {
    if (property) {
      // Se estamos editando uma propriedade existente
      setCurrentPropertyId(property.id);
      
      // Criar um objeto com os valores da propriedade para o formulário
      const propertyFormValues = {
        name: property.name || '',
        location: property.location || '',
        type: property.type || 'Sede Administrativa',
        area: property.area ? property.area.toString() : '',
        status: property.status || 'Ativo',
        notes: property.notes || ''
      };
      
      // Definir os valores do formulário
      setValues(propertyFormValues);
    } else {
      // Se estamos criando uma nova propriedade
      setCurrentPropertyId(null);
      resetForm();
    }
    setShowModal(true);
  };

  // Função para fechar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      resetForm();
      setCurrentPropertyId(null);
    }, 200);
  };

  // Função para visualizar detalhes da propriedade
  const handleViewDetails = (property) => {
    setCurrentProperty(property);
    setDetailsModal(true);
  };

  // Função para abrir confirmação de exclusão
  const openDeleteConfirmation = (id) => {
    setCurrentPropertyId(id);
    setConfirmDeleteModal(true);
  };

  // Função para excluir propriedade
  const handleDeleteProperty = () => {
    if (currentPropertyId) {
      deleteProperty(currentPropertyId);
      setConfirmDeleteModal(false);
      setCurrentPropertyId(null);
      toast.success('Imóvel excluído com sucesso');
    }
  };

  // Função para submeter formulário
  const onSubmitProperty = async (formData) => {
    try {
      const propertyData = {
        ...formData,
        area: parseFloat(formData.area)
      };
      
      if (currentPropertyId) {
        // Atualizar propriedade existente
        await updateProperty({
          id: currentPropertyId,
          ...propertyData
        });
        toast.success('Imóvel atualizado com sucesso');
      } else {
        // Criar nova propriedade
        await addProperty(propertyData);
        toast.success('Imóvel adicionado com sucesso');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar imóvel:', error);
      toast.error('Erro ao salvar imóvel');
    }
  };

  // Função para obter cor de status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Em Manutenção':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Inativo':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Opções para selects
  const typeOptions = [
    { value: 'Sede Administrativa', label: 'Sede Administrativa' },
    { value: 'Posto Operacional', label: 'Posto Operacional' },
    { value: 'Base Operacional', label: 'Base Operacional' },
    { value: 'Delegacia', label: 'Delegacia' }
  ];

  const statusOptions = [
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Em Manutenção', label: 'Em Manutenção' },
    { value: 'Inativo', label: 'Inativo' }
  ];

  // Função para lidar com filtros avançados
  const handleFilterClick = () => {
    toast.info('Funcionalidade de filtros avançados em desenvolvimento');
  };

  // Função para lidar com menu de opções
  const handleOptionsClick = (property) => {
    setCurrentProperty(property);
    toast.info(`Menu de opções para ${property.name}`);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Imóveis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie os imóveis da PRF
          </p>
        </div>
        <Button icon={FiPlus} onClick={() => handleOpenModal()}>
          Novo Imóvel
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
                  placeholder="Buscar por nome ou localização..."
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
                <option value="Ativo">Ativo</option>
                <option value="Em Manutenção">Em Manutenção</option>
                <option value="Inativo">Inativo</option>
              </select>
              <Button variant="outline" icon={FiFilter} onClick={handleFilterClick}>
                Filtros
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-prf-100 dark:bg-prf-900 p-2 rounded-lg mr-3">
                      <SafeIcon icon={FiBuilding} className="w-6 h-6 text-prf-600 dark:text-prf-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {property.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          property.status
                        )}`}
                      >
                        {property.status}
                      </span>
                    </div>
                  </div>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Mais opções"
                    onClick={() => handleOptionsClick(property)}
                  >
                    <SafeIcon icon={FiMoreVertical} className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2" />
                    {property.location}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Tipo</p>
                      <p className="font-medium text-gray-900 dark:text-white">{property.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Área</p>
                      <p className="font-medium text-gray-900 dark:text-white">{property.area}m²</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                      Última Manutenção
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {format(property.lastMaintenance, 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiEye}
                    className="flex-1"
                    onClick={() => handleViewDetails(property)}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiEdit}
                    className="flex-1"
                    onClick={() => handleOpenModal(property)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={FiTrash2}
                    onClick={() => openDeleteConfirmation(property.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center p-8">
            <div className="text-center">
              <SafeIcon icon={FiBuilding} className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Não foram encontrados imóveis com os critérios de busca atuais
              </p>
              <Button onClick={() => handleOpenModal()} icon={FiPlus} className="mt-4">
                Adicionar Imóvel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Property Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={currentPropertyId ? "Editar Imóvel" : "Novo Imóvel"}
        size="lg"
      >
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmitProperty);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome do Imóvel"
              id="name"
              name="name"
              placeholder="Ex: PRF - Superintendência Regional DF"
              value={values.name || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              required
            />
            <Input
              label="Localização"
              id="location"
              name="location"
              placeholder="Ex: Brasília, DF"
              value={values.location || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.location}
              required
            />
            <Select
              label="Tipo"
              id="type"
              name="type"
              value={values.type || 'Sede Administrativa'}
              onChange={handleChange}
              onBlur={handleBlur}
              options={typeOptions}
              required
            />
            <Input
              label="Área Construída (m²)"
              id="area"
              name="area"
              type="number"
              placeholder="Ex: 2500"
              value={values.area || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.area}
              required
            />
            <Select
              label="Status"
              id="status"
              name="status"
              value={values.status || 'Ativo'}
              onChange={handleChange}
              onBlur={handleBlur}
              options={statusOptions}
              required
            />
          </div>

          <TextArea
            label="Observações"
            id="notes"
            name="notes"
            placeholder="Informações adicionais sobre o imóvel..."
            value={values.notes || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={3}
          />

          <div className="flex justify-end space-x-3">
            <Button 
              variant="secondary" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCloseModal();
              }} 
              type="button"
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {currentPropertyId ? "Atualizar" : "Salvar"} Imóvel
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Property Details Modal */}
      <Modal
        isOpen={detailsModal}
        onClose={() => setDetailsModal(false)}
        title="Detalhes do Imóvel"
        size="lg"
      >
        {currentProperty && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  currentProperty.status
                )}`}
              >
                {currentProperty.status}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ID: {currentProperty.id}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentProperty.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2" />
                {currentProperty.location}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo</p>
                <p className="text-gray-900 dark:text-white">{currentProperty.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Área</p>
                <p className="text-gray-900 dark:text-white">{currentProperty.area}m²</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Última Manutenção</p>
                <p className="text-gray-900 dark:text-white">
                  {format(currentProperty.lastMaintenance, 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Próxima Manutenção</p>
                <p className="text-gray-900 dark:text-white">
                  {format(currentProperty.nextMaintenance, 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>

            {currentProperty.notes && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Observações</p>
                <p className="text-gray-900 dark:text-white whitespace-pre-line p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {currentProperty.notes}
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Ordens de Serviço Relacionadas
              </h4>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Não há ordens de serviço associadas a este imóvel
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDetailsModal(false);
                }}
              >
                Fechar
              </Button>
              <Button
                variant="outline"
                icon={FiEdit}
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailsModal(false);
                  handleOpenModal(currentProperty);
                }}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                icon={FiTrash2}
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailsModal(false);
                  openDeleteConfirmation(currentProperty.id);
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
            Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDeleteModal(false);
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteProperty();
              }}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Properties;