import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Card from '../components/UI/Card';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const { 
  FiBuilding, FiClipboard, FiFileText, FiUsers, 
  FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiClock 
} = FiIcons;

const Dashboard = () => {
  const { getDashboardStats, getChartData } = useData();
  const { isDark } = useTheme();
  const stats = getDashboardStats();
  const chartData = getChartData();

  const statCards = [
    {
      title: 'Total de Imóveis',
      value: stats.totalProperties,
      icon: FiBuilding,
      color: 'bg-blue-500',
      change: '+2.5%'
    },
    {
      title: 'Ordens Abertas',
      value: stats.openWorkOrders,
      icon: FiAlertTriangle,
      color: 'bg-yellow-500',
      change: '-5.2%'
    },
    {
      title: 'Em Andamento',
      value: stats.inProgressWorkOrders,
      icon: FiClock,
      color: 'bg-orange-500',
      change: '+12.3%'
    },
    {
      title: 'Concluídas',
      value: stats.completedWorkOrders,
      icon: FiCheckCircle,
      color: 'bg-green-500',
      change: '+8.7%'
    }
  ];

  const workOrdersStatusOption = {
    title: {
      text: 'Ordens de Serviço por Status',
      textStyle: {
        color: isDark ? '#fff' : '#374151'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: isDark ? '#fff' : '#374151'
      }
    },
    series: [
      {
        name: 'Status',
        type: 'pie',
        radius: '50%',
        data: Object.entries(chartData.workOrdersByStatus).map(([name, value]) => ({
          value,
          name
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const workOrdersCategoryOption = {
    title: {
      text: 'Ordens por Categoria',
      textStyle: {
        color: isDark ? '#fff' : '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: Object.keys(chartData.workOrdersByCategory),
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          color: isDark ? '#fff' : '#374151'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: isDark ? '#fff' : '#374151'
        }
      }
    ],
    series: [
      {
        name: 'Quantidade',
        type: 'bar',
        barWidth: '60%',
        data: Object.values(chartData.workOrdersByCategory),
        itemStyle: {
          color: '#3b82f6'
        }
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral do sistema de manutenção predial
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <ReactECharts 
              option={workOrdersStatusOption} 
              style={{ height: '400px' }}
              theme={isDark ? 'dark' : 'light'}
            />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <ReactECharts 
              option={workOrdersCategoryOption} 
              style={{ height: '400px' }}
              theme={isDark ? 'dark' : 'light'}
            />
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <SafeIcon icon={FiClipboard} className="w-6 h-6 text-prf-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Nova Ordem</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Criar ordem de serviço</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <SafeIcon icon={FiBuilding} className="w-6 h-6 text-prf-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Novo Imóvel</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cadastrar imóvel</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <SafeIcon icon={FiFileText} className="w-6 h-6 text-prf-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Relatório</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gerar relatório</p>
              </div>
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;