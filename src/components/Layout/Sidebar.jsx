import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const { 
  FiHome, FiBuilding, FiClipboard, FiFileText, FiUsers, 
  FiBarChart3, FiLogOut, FiMenu, FiX, FiShield 
} = FiIcons;

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiBuilding, label: 'Imóveis', path: '/properties' },
    { icon: FiClipboard, label: 'Ordens de Serviço', path: '/work-orders' },
    { icon: FiFileText, label: 'Contratos', path: '/contracts' },
    { icon: FiUsers, label: 'Usuários', path: '/users' },
    { icon: FiBarChart3, label: 'Relatórios', path: '/reports' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiShield} className="w-8 h-8 text-prf-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">PRF</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manutenção</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <SafeIcon 
              icon={isCollapsed ? FiMenu : FiX} 
              className="w-5 h-5 text-gray-600 dark:text-gray-300" 
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-prf-100 dark:bg-prf-900 text-prf-700 dark:text-prf-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <SafeIcon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <SafeIcon icon={FiLogOut} className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium">Sair</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;