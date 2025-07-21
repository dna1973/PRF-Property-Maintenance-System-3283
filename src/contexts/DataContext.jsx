import React, { createContext, useContext, useState } from 'react';
import { format, addDays, subDays } from 'date-fns';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Mock data
  const [properties] = useState([
    {
      id: 1,
      name: 'PRF - Superintendência Regional DF',
      location: 'Brasília, DF',
      type: 'Sede Administrativa',
      area: 2500,
      status: 'Ativo',
      lastMaintenance: subDays(new Date(), 15),
      nextMaintenance: addDays(new Date(), 30)
    },
    {
      id: 2,
      name: 'PRF - Posto Rodoviário BR-040',
      location: 'Luziânia, GO',
      type: 'Posto Operacional',
      area: 800,
      status: 'Ativo',
      lastMaintenance: subDays(new Date(), 5),
      nextMaintenance: addDays(new Date(), 60)
    },
    {
      id: 3,
      name: 'PRF - Base Operacional Taguatinga',
      location: 'Taguatinga, DF',
      type: 'Base Operacional',
      area: 1200,
      status: 'Em Manutenção',
      lastMaintenance: subDays(new Date(), 2),
      nextMaintenance: addDays(new Date(), 90)
    }
  ]);

  const [workOrders] = useState([
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

  const [contracts] = useState([
    {
      id: 'CTR-2024-001',
      company: 'Empresa ABC Climatização',
      service: 'Manutenção de Ar Condicionado',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      value: 120000,
      status: 'Ativo',
      contact: 'Carlos Silva',
      phone: '(61) 3333-4444'
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
      phone: '(61) 2222-3333'
    }
  ]);

  const [users] = useState([
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

  const getDashboardStats = () => {
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
  };

  const getChartData = () => {
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
  };

  const value = {
    properties,
    workOrders,
    contracts,
    users,
    getDashboardStats,
    getChartData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};