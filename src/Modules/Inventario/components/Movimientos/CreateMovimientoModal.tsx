import React from 'react';
import type { CreateMovimientoModalProps } from '../../types/MovimientoTypes';
import { useMovimientoForm } from '../../hooks/useMovimientos';
import MovimientoTypeSelector from './ui/MovimientoTypeSelector';
import MaterialSelector from './ui/MaterialSelector';
import CantidadControl from './ui/CantidadControl';
import DescripcionField from './ui/DescripcionField';

const CreateMovimientoModal: React.FC<CreateMovimientoModalProps> = ({
  isOpen,
  onClose,
  initialMaterial
}) => {
  const {
    formData,
    materialesFiltrados,
    loadingMateriales,
    isLoading,
    setTipoMovimiento,
    setDescripcion,
    setBusquedaMaterial,
    setShowMaterialSelector,
    handleSelectMaterial,
    handleCantidadChange,
    handleDirectCantidadChange,
    handleSubmit,
    resetForm
  } = useMovimientoForm(initialMaterial);

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Crear Nuevo Movimiento
          </h2>
        </div>

      
        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100 max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">          
              <MovimientoTypeSelector
                tipoMovimiento={formData.tipoMovimiento}
                setTipoMovimiento={setTipoMovimiento}
              />
         
              <CantidadControl
                cantidad={formData.cantidad}
                selectedMaterial={formData.selectedMaterial}
                onCantidadChange={handleCantidadChange}
                onDirectCantidadChange={handleDirectCantidadChange}
              />

              <DescripcionField
                descripcion={formData.descripcion}
                onDescripcionChange={setDescripcion}
              />
            </div>

   
            <div className="space-y-6">
              <MaterialSelector
                selectedMaterial={formData.selectedMaterial}
                showMaterialSelector={formData.showMaterialSelector}
                setShowMaterialSelector={setShowMaterialSelector}
                materialesFiltrados={materialesFiltrados}
                loadingMateriales={loadingMateriales}
                busquedaMaterial={formData.busquedaMaterial}
                setBusquedaMaterial={setBusquedaMaterial}
                handleSelectMaterial={handleSelectMaterial}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleFormSubmit}
            disabled={!formData.selectedMaterial || !formData.descripcion.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Registrando...' : 'Crear Movimiento'}
          </button>
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMovimientoModal;