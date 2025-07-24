import React, { createContext, useContext, useState, useCallback } from 'react';
import { format, addDays, subDays } from 'date-fns';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Função simples para gerar IDs únicos
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const DataProvider = ({ children }) => {
  // Mock data
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: 'PRF - Superintendência Regional DF',
      location: 'Brasília, DF',
      type: 'Sede Administrativa',
      area: 2500,
      status: 'Ativo',
      lastMaintenance: subDays(new Date(), 15),
      nextMaintenance: addDays(new Date(), 30),
      notes: 'Prédio principal da Superintendência Regional do DF'
    },
    {
      id: 2,
      name: 'PRF - Posto Rodoviário BR-040',
      location: 'Luziânia, GO',
      type: 'Posto Operacional',
      area: 800,
      status: 'Ativo',
      lastMaintenance: subDays(new Date(), 5),
      nextMaintenance: addDays(new Date(), 60),
      notes: 'Posto localizado no KM 40 da BR-040'
    },
    {
      id: 3,
      name: 'PRF - Base Operacional Taguatinga',
      location: 'Taguatinga, DF',
      type: 'Base Operacional',
      area: 1200,
      status: 'Em Manutenção',
      lastMaintenance: subDays(new Date(), 2),
      nextMaintenance: addDays(new Date(), 90),
      notes: 'Base de apoio operacional na região de Taguatinga'
    }
  ]);

  const [workOrders, setWorkOrders] = useState([
    {
      id: 'OS-2024-001',
      propertyId: 1,
      propertyName: 'PRF - Superintendência Regional DF',
      title: 'Manutenção Sistema de Ar Condicionado',
      description: 'Substituição de filtros e limpeza geral do sistema de climatização',
      status: 'Em Andamento',
      priority: 'Alta',
      assignedTo: 'Empresa ABC Climatização',
      createdDate: subDays(new Date(), 3),
      dueDate: addDays(new Date(), 2),
      category: 'Climatização'
    },
    {
      id: 'OS-2024-002',
      propertyId: 2,
      propertyName: 'PRF - Posto Rodoviário BR-040',
      title: 'Reparo Sistema Elétrico',
      description: 'Substituição de disjuntores e verificação da rede elétrica',
      status: 'Aberta',
      priority: 'Média',
      assignedTo: 'Eletro Serviços Ltda',
      createdDate: subDays(new Date(), 1),
      dueDate: addDays(new Date(), 7),
      category: 'Elétrica'
    },
    {
      id: 'OS-2024-003',
      propertyId: 1,
      propertyName: 'PRF - Superintendência Regional DF',
      title: 'Pintura Externa do Prédio',
      description: 'Pintura completa da fachada externa do prédio administrativo',
      status: 'Concluída',
      priority: 'Baixa',
      assignedTo: 'Pinturas e Reformas Silva',
      createdDate: subDays(new Date(), 30),
      dueDate: subDays(new Date(), 5),
      category: 'Pintura'
    }
  ]);

  const [contracts, setContracts] = useState([
    {
      id: 'CTR-2024-001',
      company: 'Empresa ABC Climatização',
      service: 'Manutenção de Ar Condicionado',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      value: 120000,
      status: 'Ativo',
      contact: 'Carlos Silva',
      phone: '(61) 3333-4444',
      notes: 'Contrato anual de manutenção preventiva e corretiva dos sistemas de ar condicionado'
    },
    {
      id: 'CTR-2024-002',
      company: 'Eletro Serviços Ltda',
      service: 'Serviços Elétricos',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2025-01-31'),
      value: 85000,
      status: 'Ativo',
      contact: 'Maria Santos',
      phone: '(61) 2222-3333',
      notes: 'Contrato para manutenção da rede elétrica e instalações'
    }
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@prf.gov.br',
      role: 'administrator',
      unit: 'Superintendência Regional DF',
      status: 'Ativo'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@prf.gov.br',
      role: 'manager',
      unit: 'Posto BR-040',
      status: 'Ativo'
    },
    {
      id: 3,
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@terceirizada.com',
      role: 'contractor',
      unit: 'Empresa ABC Climatização',
      status: 'Ativo'
    }
  ]);

  // Property operations
  const addProperty = useCallback((property) => {
    const newProperty = {
      id: properties.length + 1,
      lastMaintenance: new Date(),
      nextMaintenance: addDays(new Date(), 90),
      ...property
    };
    setProperties(prev => [...prev, newProperty]);
    return newProperty;
  }, [properties]);

  const updateProperty = useCallback((updatedProperty) => {
    setProperties(prev => 
      prev.map(property => 
        property.id === updatedProperty.id 
          ? { ...property, ...updatedProperty } 
          : property
      )
    );
    return updatedProperty;
  }, []);

  const deleteProperty = useCallback((id) => {
    setProperties(prev => prev.filter(property => property.id !== id));
    return id;
  }, []);

  // Work order operations
  const addWorkOrder = useCallback((workOrder) => {
    const property = properties.find(p => p.id === parseInt(workOrder.propertyId));
    const newWorkOrder = {
      id: `OS-2024-${String(workOrders.length + 1).padStart(3, '0')}`,
      propertyName: property ? property.name : 'Desconhecido',
      createdDate: new Date(),
      status: 'Aberta',
      ...workOrder
    };
    setWorkOrders(prev => [...prev, newWorkOrder]);
    return newWorkOrder;
  }, [properties, workOrders]);

  const updateWorkOrder = useCallback((updatedWorkOrder) => {
    if (updatedWorkOrder.propertyId && !updatedWorkOrder.propertyName) {
      const property = properties.find(p => p.id === parseInt(updatedWorkOrder.propertyId));
      if (property) {
        updatedWorkOrder.propertyName = property.name;
      }
    }

    setWorkOrders(prev => 
      prev.map(workOrder => 
        workOrder.id === updatedWorkOrder.id 
          ? { ...workOrder, ...updatedWorkOrder } 
          : workOrder
      )
    );
    return updatedWorkOrder;
  }, [properties]);

  const deleteWorkOrder = useCallback((id) => {
    setWorkOrders(prev => prev.filter(workOrder => workOrder.id !== id));
    return id;
  }, []);

  // Contract operations
  const addContract = useCallback((contract) => {
    const newContract = {
      id: `CTR-2024-${String(contracts.length + 1).padStart(3, '0')}`,
      ...contract
    };
    setContracts(prev => [...prev, newContract]);
    return newContract;
  }, [contracts]);

  const updateContract = useCallback((updatedContract) => {
    setContracts(prev => 
      prev.map(contract => 
        contract.id === updatedContract.id 
          ? { ...contract, ...updatedContract } 
          : contract
      )
    );
    return updatedContract;
  }, []);

  const deleteContract = useCallback((id) => {
    setContracts(prev => prev.filter(contract => contract.id !== id));
    return id;
  }, []);

  // User operations
  const addUser = useCallback((user) => {
    const newUser = {
      id: users.length + 1,
      ...user
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, [users]);

  const updateUser = useCallback((updatedUser) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === updatedUser.id 
          ? { ...user, ...updatedUser } 
          : user
      )
    );
    return updatedUser;
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    return id;
  }, []);

  // Dashboard data
  const getDashboardStats = useCallback(() => {
    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.status === 'Ativo').length;
    const totalWorkOrders = workOrders.length;
    const openWorkOrders = workOrders.filter(wo => wo.status === 'Aberta').length;
    const inProgressWorkOrders = workOrders.filter(wo => wo.status === 'Em Andamento').length;
    const completedWorkOrders = workOrders.filter(wo => wo.status === 'Concluída').length;
    const activeContracts = contracts.filter(c => c.status === 'Ativo').length;

    return {
      totalProperties,
      activeProperties,
      totalWorkOrders,
      openWorkOrders,
      inProgressWorkOrders,
      completedWorkOrders,
      activeContracts
    };
  }, [properties, workOrders, contracts]);

  const getChartData = useCallback(() => {
    const workOrdersByStatus = {
      'Aberta': workOrders.filter(wo => wo.status === 'Aberta').length,
      'Em Andamento': workOrders.filter(wo => wo.status === 'Em Andamento').length,
      'Concluída': workOrders.filter(wo => wo.status === 'Concluída').length
    };

    const workOrdersByCategory = workOrders.reduce((acc, wo) => {
      acc[wo.category] = (acc[wo.category] || 0) + 1;
      return acc;
    }, {});

    return {
      workOrdersByStatus,
      workOrdersByCategory
    };
  }, [workOrders]);

  const value = {
    properties,
    workOrders,
    contracts,
    users,
    getDashboardStats,
    getChartData,
    addProperty,
    updateProperty,
    deleteProperty,
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    addContract,
    updateContract,
    deleteContract,
    addUser,
    updateUser,
    deleteUser
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};