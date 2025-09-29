import React, { useState, useEffect } from 'react';
import { LuX, LuPackage, LuTrendingUp, LuTrendingDown } from 'react-icons/lu';
import { useMaterials } from '../../hooks/InventarioHook';
import { useIngresoMaterial, useEgresoMaterial } from '../../hooks/useMovimientos';
import type { Material } from '../../models/Inventario';
import type { TipoMovimiento } from '../../models/MovimientoMaterial';

interface CreateMovimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTipo?: TipoMovimiento;
  initialMaterial?: Material;
}

interface FormData {
  materialId: number;
  tipoMovimiento: TipoMovimiento;
  cantidad: number;
  motivo: string;
  observaciones: string;
}

const CreateMovimientoModal: React.FC<CreateMovimientoModalProps> = ({
  isOpen,
  onClose,
  initialTipo = 'INGRESO',
  initialMaterial
}) => {
  const [formData, setFormData] = useState<FormData>({
    materialId: initialMaterial?.Id_Material || 0,
    tipoMovimiento: initialTipo,
    cantidad: 1,
    motivo: '',
    observaciones: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: materials = [], isLoading: isLoadingMaterials } = useMaterials();
  const ingresoMutation = useIngresoMaterial();
  const egresoMutation = useEgresoMaterial();

  const selectedMaterial = materials.find((m: Material) => m.Id_Material === formData.materialId);
  const isIngreso = formData.tipoMovimiento === 'INGRESO';

  useEffect(() => {
    if (isOpen) {
      setFormData({
        materialId: initialMaterial?.Id_Material || 0,
        tipoMovimiento: initialTipo,
        cantidad: 1,
        motivo: '',
        observaciones: ''
      });
      setErrors({});
    }
  }, [isOpen, initialMaterial?.Id_Material, initialTipo]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.materialId) newErrors.materialId = 0;
    if (!formData.cantidad || formData.cantidad <= 0) newErrors.cantidad = 0;
    if (
      !isIngreso &&
      selectedMaterial &&
      formData.cantidad > selectedMaterial.Cantidad
    )
      newErrors.cantidad = 0;
    if (!formData.motivo.trim()) newErrors.motivo = '';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const movimientoData = {
        Cantidad: formData.cantidad,
        Motivo: formData.motivo,
        Observaciones: formData.observaciones || ''
      };
      const mutation = isIngreso ? ingresoMutation : egresoMutation;
      await mutation.mutateAsync({
        materialId: formData.materialId,
        data: movimientoData
      });
      setFormData({
        materialId: 0,
        tipoMovimiento: 'INGRESO',
        cantidad: 1,
        motivo: '',
        observaciones: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error al crear movimiento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaterialChange = (materialId: number) => {
    setFormData(prev => ({ ...prev, materialId }));
    setErrors(prev => ({ ...prev, materialId: undefined }));
  };

  const handleCantidadChange = (cantidad: number) => {
    setFormData(prev => ({ ...prev, cantidad }));
    setErrors(prev => ({ ...prev, cantidad: undefined }));
  };

  const renderTipoMovimiento = () => (
    <div className="space-y-3">
      <label htmlFor="tipoMovimiento" className="block text-sm font-medium text-gray-700">
        Tipo de Movimiento
      </label>
      <div className="flex gap-3">
        {['INGRESO', 'EGRESO'].map(tipo => (
          <label key={tipo} className="flex items-center">
            <input
              type="radio"
              name="tipoMovimiento"
              value={tipo}
              checked={formData.tipoMovimiento === tipo}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  tipoMovimiento: e.target.value as TipoMovimiento
                }))
              }
              className={`h-4 w-4 ${
                tipo === 'INGRESO'
                  ? 'text-green-600 focus:ring-green-500'
                  : 'text-red-600 focus:ring-red-500'
              } border-gray-300`}
            />
            <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
              {tipo === 'INGRESO' ? (
                <LuTrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <LuTrendingDown className="w-4 h-4 text-red-600" />
              )}
              {tipo === 'INGRESO' ? 'Ingreso' : 'Egreso'}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderMaterialSelect = () => (
    <div className="space-y-3">
      <label htmlFor="material" className="block text-sm font-medium text-gray-700">
        Material <span className="text-red-500">*</span>
      </label>
      <select
        id="material"
        value={formData.materialId}
        onChange={e => handleMaterialChange(Number(e.target.value))}
        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          errors.materialId ? 'border-red-500' : 'border-gray-300'
        }`}
        disabled={isLoadingMaterials}
      >
        <option value={0}>Seleccionar material...</option>
        {materials.map((material: Material) => (
          <option key={material.Id_Material} value={material.Id_Material}>
            {material.Nombre_Material} (Stock: {material.Cantidad})
          </option>
        ))}
      </select>
      {errors.materialId !== undefined && (
        <p className="text-sm text-red-600">Debe seleccionar un material</p>
      )}
    </div>
  );

  const renderCantidadInput = () => (
    <div className="space-y-3">
      <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">
        Cantidad <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        id="cantidad"
        min="1"
        step="1"
        value={formData.cantidad}
        onChange={e => handleCantidadChange(Number(e.target.value))}
        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          errors.cantidad ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Ingrese la cantidad"
      />
      {errors.cantidad !== undefined && (
        <p className="text-sm text-red-600">
          {!isIngreso && selectedMaterial && formData.cantidad > selectedMaterial.Cantidad
            ? `No hay suficiente stock (disponible: ${selectedMaterial.Cantidad})`
            : 'La cantidad debe ser mayor a 0'}
        </p>
      )}
    </div>
  );

  const renderMotivoInput = () => (
    <div className="space-y-3">
      <label htmlFor="motivo" className="block text-sm font-medium text-gray-700">
        Motivo <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="motivo"
        value={formData.motivo}
        onChange={e => {
          setFormData(prev => ({ ...prev, motivo: e.target.value }));
          setErrors(prev => ({ ...prev, motivo: undefined }));
        }}
        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          errors.motivo ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={`Motivo del ${isIngreso ? 'ingreso' : 'egreso'}...`}
      />
      {errors.motivo !== undefined && (
        <p className="text-sm text-red-600">El motivo es requerido</p>
      )}
    </div>
  );

  const renderObservacionesInput = () => (
    <div className="space-y-3">
      <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
        Observaciones
      </label>
      <textarea
        id="observaciones"
        rows={3}
        value={formData.observaciones}
        onChange={e =>
          setFormData(prev => ({ ...prev, observaciones: e.target.value }))
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Observaciones adicionales (opcional)..."
      />
    </div>
  );

  const renderStockActual = () =>
    selectedMaterial && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-800 mb-1">
          <LuPackage className="w-4 h-4" />
          Stock Actual
        </div>
        <p className="text-lg font-bold text-blue-900">
          {selectedMaterial.Cantidad.toLocaleString('es-CR')}{' '}
          {selectedMaterial.Unidad_Medicion?.Nombre_Unidad || 'unidades'}
        </p>
      </div>
    );

  const renderNuevoStock = () =>
    selectedMaterial &&
    formData.cantidad > 0 && (
      <div
        className={`border rounded-lg p-3 ${
          isIngreso ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex items-center gap-2 text-sm font-medium mb-1">
          <LuPackage className="w-4 h-4" />
          Nuevo Stock Proyectado
        </div>
        <p
          className={`text-lg font-bold ${
            isIngreso ? 'text-green-900' : 'text-red-900'
          }`}
        >
          {isIngreso
            ? (selectedMaterial.Cantidad + formData.cantidad).toLocaleString('es-CR')
            : (selectedMaterial.Cantidad - formData.cantidad).toLocaleString('es-CR')}{' '}
          {selectedMaterial.Unidad_Medicion?.Nombre_Unidad || 'unidades'}
        </p>
      </div>
    );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Nuevo {isIngreso ? 'Ingreso' : 'Egreso'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LuX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {renderTipoMovimiento()}
          {renderMaterialSelect()}
          {renderStockActual()}
          {renderCantidadInput()}
          {renderMotivoInput()}
          {renderObservacionesInput()}
          {renderNuevoStock()}
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.materialId ||
                !formData.cantidad ||
                !formData.motivo.trim()
              }
              className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                isIngreso
                  ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                  : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
              }`}
            >
              {(() => {
                if (isSubmitting) return 'Procesando...';
                return isIngreso ? 'Registrar Ingreso' : 'Registrar Egreso';
              })()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMovimientoModal;