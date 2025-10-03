import React, { useState } from 'react';
import { InventarioDashboard } from './InventarioDashboard';
import CatalogoMateriales from '../Materiales/Catálogo de Materiales';
import CatalogoCategorias from '../Categorias/Catálogo de Categorias';
import CatalogoUnidadesMedicion from '../UnidadesMedicion/Catálogo de Unidades de medicion';
import CatalogoMovimientos from '../Movimientos/CatalogoMovimientos';


export const InventarioWrapper: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const handleNavigate = (section: string) => {
    setCurrentView(section);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'materiales':
        return <CatalogoMateriales onBack={handleBackToDashboard} />;
      case 'categorias':
        return <CatalogoCategorias onBack={handleBackToDashboard} />;
      case 'unidades':
        return <CatalogoUnidadesMedicion onBack={handleBackToDashboard} />;
      case 'movimientos':
        return <CatalogoMovimientos onBack={handleBackToDashboard} />;
      default:
        return <InventarioDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="p-6">
      {renderCurrentView()}
    </div>
  );
};