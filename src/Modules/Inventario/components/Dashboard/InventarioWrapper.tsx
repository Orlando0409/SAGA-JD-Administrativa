import { InventarioDashboard } from './InventarioDashboard';
import { useNavigate } from '@tanstack/react-router';

export const InventarioWrapper = () => {
  const navigate = useNavigate();

  const handleNavigate = (section: string) => {
    const routes: Record<string, string> = {
      materiales: '/Inventario/Materiales',
      categorias: '/Inventario/Categorias',
      unidades: '/Inventario/UnidadesMedicion',
      movimientos: '/Inventario/Movimientos',
      medidores: '/Inventario/Medidores',
    };
    
    if (routes[section]) {
      navigate({ to: routes[section] as any });
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen overflow-y-auto">
      <InventarioDashboard onNavigate={handleNavigate} />
    </div>
  );
};