import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import { useData } from '../contexts/DataContext';
import useForm from '../hooks/useForm';
import { useToastContext } from '../contexts/ToastContext';

const { FiUsers, FiPlus, FiSearch, FiFilter, FiMail, FiEdit, FiTrash2, FiShield, FiUser, FiEye } = FiIcons;

const Users = () => {
  const { users, addUser, updateUser, deleteUser } = useData();
  const toast = useToastContext();
  const [showModal, setShowModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const initialValues = {
    name: '',
    email: '',
    role: 'manager',
    unit: '',
    password: '',
    status: 'Ativo'
  };

  const validateUser = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Nome é obrigatório';
    }
    if (!values.email) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'E-mail inválido';
    }
    if (!values.unit) {
      errors.unit = 'Unidade/Empresa é obrigatória';
    }
    if (!currentUserId && !values.password) {
      errors.password = 'Senha é obrigatória';
    } else if (!currentUserId && values.password.length < 6) {
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
    isSubmitting,
    resetForm,
    setValues
  } = useForm(initialValues, validateUser);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleOpenModal = (user = null) => {
    if (user) {
      setCurrentUserId(user.id);
      setValues({
        name: user.name,
        email: user.email,
        role: user.role,
        unit: user.unit,
        password: '',
        status: user.status
      });
    } else {
      setCurrentUserId(null);
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
    setCurrentUserId(null);
  };

  const handleViewDetails = (user) => {
    setCurrentUser(user);
    setDetailsModal(true);
  };

  const openDeleteConfirmation = (id) => {
    setCurrentUserId(id);
    setConfirmDeleteModal(true);
  };

  const handleDeleteUser = () => {
    if (currentUserId) {
      deleteUser(currentUserId);
      setConfirmDeleteModal(false);
      setCurrentUserId(null);
      toast.success('Usuário excluído com sucesso');
    }
  };

  const onSubmitUser = async (formData) => {
    try {
      if (currentUserId) {
        await updateUser({
          id: currentUserId,
          ...formData
        });
        toast.success('Usuário atualizado com sucesso');
      } else {
        await addUser(formData);
        toast.success('Usuário criado com sucesso');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast.error('Erro ao salvar usuário');
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'administrator': return 'Administrador';
      case 'manager': return 'Gestor';
      case 'technician': return 'Técnico';
      case 'contractor': return 'Empresa Terceirizada';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'administrator': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'technician': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'contractor': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'administrator': return FiShield;
      case 'manager': case 'technician': case 'contractor': return FiUser;
      default: return FiUser;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Inativo': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const roleOptions = [
    { value: 'administrator', label: 'Administrador' },
    { value: 'manager', label: 'Gestor' },
    { value: 'technician', label: 'Técnico' },
    { value: 'contractor', label: 'Empresa Terceirizada' }
  ];

  const statusOptions = [
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Usuários</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button icon={FiPlus} onClick={() => handleOpenModal()}>
          Novo Usuário
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
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-prf-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
              >
                <option value="all">Todos os Perfis</option>
                <option value="administrator">Administrador</option>
                <option value="manager">Gestor</option>
                <option value="technician">Técnico</option>
                <option value="contractor">Empresa Terceirizada</option>
              </select>
              <Button variant="outline" icon={FiFilter} onClick={handleFilterClick}>
                Filtros
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-prf-100 dark:bg-prf-900 p-2 rounded-lg mr-3">
                      <SafeIcon
                        icon={getRoleIcon(user.role)}
                        className="w-6 h-6 text-prf-600 dark:text-prf-400"
                      />
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <img
                    src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80`}
                    alt={user.name}
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500 dark:text-gray-400">Unidade</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.unit}</p>
                  </div>
                </div>

                <div className="flex space-x-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiEye}
                    className="flex-1"
                    onClick={() => handleViewDetails(user)}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiEdit}
                    className="flex-1"
                    onClick={() => handleOpenModal(user)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={FiTrash2}
                    onClick={() => openDeleteConfirmation(user.id)}
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
              <SafeIcon 
                icon={FiUsers} 
                className="w-12 h-12 mx-auto text-gray-400 mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Nenhum usuário encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Não foram encontrados usuários com os critérios de busca atuais
              </p>
              <Button 
                onClick={() => handleOpenModal()} 
                icon={FiPlus} 
                className="mt-4"
              >
                Adicionar Usuário
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={currentUserId ? "Editar Usuário" : "Novo Usuário"}
        size="lg"
      >
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmitUser);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome Completo"
              id="name"
              name="name"
              placeholder="Nome do usuário"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              required
            />
            
            <Input
              label="E-mail"
              id="email"
              name="email"
              type="email"
              placeholder="email@exemplo.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
            />
            
            <Select
              label="Perfil de Acesso"
              id="role"
              name="role"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              options={roleOptions}
              required
            />
            
            <Input
              label="Unidade/Empresa"
              id="unit"
              name="unit"
              placeholder="Ex: Superintendência Regional DF"
              value={values.unit}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.unit}
              required
            />
            
            <Input
              label={currentUserId ? "Nova Senha (opcional)" : "Senha Temporária"}
              id="password"
              name="password"
              type="password"
              placeholder={currentUserId ? "Deixe em branco para manter a atual" : "Senha temporária"}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              required={!currentUserId}
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
          </div>
          
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
              {currentUserId ? "Atualizar" : "Criar"} Usuário
            </Button>
          </div>
        </form>
      </Modal>

      {/* View User Details Modal */}
      <Modal
        isOpen={detailsModal}
        onClose={() => setDetailsModal(false)}
        title="Detalhes do Usuário"
        size="md"
      >
        {currentUser && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <img
                src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face&auto=format&q=80`}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentUser.name}
              </h3>
              <div className="flex justify-center space-x-2 mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                    currentUser.role
                  )}`}
                >
                  {getRoleLabel(currentUser.role)}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    currentUser.status
                  )}`}
                >
                  {currentUser.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">E-mail</p>
                <p className="text-gray-900 dark:text-white flex items-center">
                  <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
                  {currentUser.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unidade/Empresa</p>
                <p className="text-gray-900 dark:text-white">{currentUser.unit}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Último acesso</p>
                <p className="text-gray-900 dark:text-white">Hoje às 10:25</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Atividades Recentes
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  • Criou ordem de serviço <span className="font-medium">OS-2024-003</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • Atualizou dados do imóvel <span className="font-medium">PRF - Posto Rodoviário BR-040</span>
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
                  handleOpenModal(currentUser);
                }}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                icon={FiTrash2}
                onClick={() => {
                  setDetailsModal(false);
                  openDeleteConfirmation(currentUser.id);
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
            Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
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
              onClick={handleDeleteUser}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;