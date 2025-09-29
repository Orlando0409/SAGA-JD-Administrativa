import React from 'react';
import { LuPackage, LuTag, LuRuler, LuArrowUpDown } from 'react-icons/lu';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, icon, onClick, color }) => (
  <div
    onClick={onClick}
    className={`${color} p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
      <div className="text-white/80">
        {icon}
      </div>
    </div>
  </div>
);

interface InventarioDashboardProps {
  onNavigate: (section: string) => void;
}

export const InventarioDashboard: React.FC<InventarioDashboardProps> = ({ onNavigate }) => {
  const modules = [
    {
      id: 'materiales',
      title: 'Materiales',
      description: 'Gestionar inventario de materiales',
      icon: <LuPackage className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      id: 'categorias',
      title: 'Categorías',
      description: 'Organizar materiales por categorías',
      icon: <LuTag className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      id: 'unidades',
      title: 'Unidades de Medición',
      description: 'Configurar unidades de medida',
      icon: <LuRuler className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      id: 'movimientos',
      title: 'Movimientos',
      description: 'Ingresos y egresos de inventario',
      icon: <LuArrowUpDown className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard de Inventario</h1>
        <p className="text-gray-600">Seleccione el módulo que desea gestionar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module) => (
          <DashboardCard
            key={module.id}
            title={module.title}
            description={module.description}
            icon={module.icon}
            color={module.color}
            onClick={() => onNavigate(module.id)}
          />
        ))}
      </div>
    </div>
  );
};