import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useData } from '../contexts/DataContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { 
  FiBarChart3, FiDownload, FiCalendar, FiFilter, 
  FiFileText, FiPieChart, FiTrendingUp, FiBuilding 
} = FiIcons;

const Reports = () => {
  const { workOrders, properties, contracts, getDashboardStats } = useData();
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-12-31'
  });
  const [reportType, setReportType] = useState('work-orders');

  const stats = getDashboardStats();

  const generatePDF = (reportType) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.text('PRF - Relatório de Manutenção Predial', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Período: ${dateRange.start} a ${dateRange.end}`, pageWidth / 2, 30, { align: 'center' });
    
    let yPosition = 50;

    switch (reportType) {
      case 'work-orders':
        doc.setFontSize(16);
        doc.text('Relatório de Ordens de Serviço', 20, yPosition);
        yPosition += 20;

        const workOrdersData = workOrders.map(wo => [
          wo.id,
          wo.title,
          wo.propertyName,
          wo.status,
          wo.priority,
          wo.assignedTo
        ]);

        doc.autoTable({
          head: [['ID', 'Título', 'Imóvel', 'Status', 'Prioridade', 'Responsável']],
          body: workOrdersData,
          startY: yPosition,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246] }
        });
        break;

      case 'properties':
        doc.setFontSize(16);
        doc.text('Relatório de Imóveis', 20, yPosition);
        yPosition += 20;

        const propertiesData = properties.map(property => [
          property.name,
          property.location,
          property.type,
          `${property.area}m²`,
          property.status
        ]);

        doc.autoTable({
          head: [['Nome', 'Localização', 'Tipo', 'Área', 'Status']],
          body: propertiesData,
          startY: yPosition,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246] }
        });
        break;

      case 'summary':
        doc.setFontSize(16);
        doc.text('Relatório Resumo', 20, yPosition);
        yPosition += 20;

        const summaryData = [
          ['Total de Imóveis', stats.totalProperties.toString()],
          ['Imóveis Ativos', stats.activeProperties.toString()],
          ['Total de Ordens', stats.totalWorkOrders.toString()],
          ['Ordens Abertas', stats.openWorkOrders.toString()],
          ['Ordens em Andamento', stats.inProgressWorkOrders.toString()],
          ['Ordens Concluídas', stats.completedWorkOrders.toString()],
          ['Contratos Ativos', stats.activeContracts.toString()]
        ];

        doc.autoTable({
          head: [['Indicador', 'Valor']],
          body: summaryData,
          startY: yPosition,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246] }
        });
        break;
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - 30, doc.internal.pageSize.height - 10);
      doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 20, doc.internal.pageSize.height - 10);
    }

    doc.save(`relatorio-${reportType}-${Date.now()}.pdf`);
  };

  const reportCards = [
    {
      title: 'Ordens de Serviço',
      description: 'Relatório completo das ordens de serviço',
      icon: FiFileText,
      color: 'bg-blue-500',
      type: 'work-orders'
    },
    {
      title: 'Imóveis',
      description: 'Relatório dos imóveis cadastrados',
      icon: FiBuilding,
      color: 'bg-green-500',
      type: 'properties'
    },
    {
      title: 'Contratos',
      description: 'Relatório dos contratos ativos',
      icon: FiPieChart,
      color: 'bg-purple-500',
      type: 'contracts'
    },
    {
      title: 'Resumo Geral',
      description: 'Relatório resumo com indicadores',
      icon: FiTrendingUp,
      color: 'bg-orange-500',
      type: 'summary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gere relatórios detalhados do sistema
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Inicial
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiCalendar} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Final
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiCalendar} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Relatório
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prf-500 focus:border-transparent"
              >
                <option value="work-orders">Ordens de Serviço</option>
                <option value="properties">Imóveis</option>
                <option value="contracts">Contratos</option>
                <option value="summary">Resumo Geral</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((report, index) => (
          <motion.div
            key={report.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className={`${report.color} p-3 rounded-full`}>
                  <SafeIcon icon={report.icon} className="w-6 h-6 text-white" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {report.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {report.description}
              </p>

              <Button
                icon={FiDownload}
                onClick={() => generatePDF(report.type)}
                className="w-full"
                size="sm"
              >
                Gerar PDF
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Indicadores Rápidos
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-prf-600 dark:text-prf-400">{stats.totalProperties}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Imóveis</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.activeProperties}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Imóveis Ativos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalWorkOrders}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Ordens</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.openWorkOrders}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Abertas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgressWorkOrders}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Em Andamento</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completedWorkOrders}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Concluídas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.activeContracts}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contratos Ativos</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Opções de Exportação
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              icon={FiDownload}
              onClick={() => generatePDF('work-orders')}
              variant="outline"
              className="w-full"
            >
              Exportar Ordens (PDF)
            </Button>
            
            <Button
              icon={FiDownload}
              onClick={() => generatePDF('properties')}
              variant="outline"
              className="w-full"
            >
              Exportar Imóveis (PDF)
            </Button>
            
            <Button
              icon={FiDownload}
              onClick={() => generatePDF('summary')}
              variant="outline"
              className="w-full"
            >
              Exportar Resumo (PDF)
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;