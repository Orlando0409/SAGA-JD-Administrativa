import { LuX, LuPlus } from 'react-icons/lu';
import { useGetCategoriasActivas } from '../../hooks/useCategorias';
import { useCreateMaterial } from '../../hooks/useMaterials';
import { useUnidadesMedicionActivas } from '../../hooks/HookUnidadMedicion';
import { useProveedoresJuridicos } from '@/Modules/Proveedores/Hook/hookjuridicoproveedor';
import { CreateMaterialSchema, type CreateMaterialSchemaData } from '../../schema/CreateMaterialSchema';
import type { CreateMaterialModalProps } from '../../types/MaterialTypes';
import type { CreateMaterialData, CategoriaMaterial } from '../../models/Inventario';
import CreateCategoriaModal from '../Categorias/CreateCategoriaModal';
import CreateUnidadMedicionModal from '../UnidadesMedicion/CreateUnidadMedicionModal';
import CreateModalProveedor from '@/Modules/Proveedores/Components/CreateModalProveedor';
import { 
  NOMBRE_MATERIAL_MAX_LENGTH, 
  DESCRIPCION_MAX_LENGTH, 
  PRECIO_MIN,
  PRECIO_MAX,
  CANTIDAD_MIN,
  CANTIDAD_MAX,
  NUMERO_ESTANTERIA_MIN,
  NUMERO_ESTANTERIA_MAX
} from '../../types/MaterialTypes';
import { useProveedoresFisicos } from '@/Modules/Proveedores/Hook/hookFisicoProveedor';
import { useState } from 'react';

const CreateMaterialModal: React.FC<CreateMaterialModalProps> = ({ isOpen, onClose }) => {

  const createMaterialMutation = useCreateMaterial();
  const { data: categories = [] } = useGetCategoriasActivas();
  const { data: unidadesMedicion = [] } = useUnidadesMedicionActivas();
  const { proveedoresFisicos = [] } = useProveedoresFisicos();
  const { proveedoresJuridicos = [] } = useProveedoresJuridicos();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldCharCounts, setFieldCharCounts] = useState({
    nombreMaterial: 0,
    descripcion: 0
  });
  const [isCreateCategoriaModalOpen, setIsCreateCategoriaModalOpen] = useState(false);
  const [isCreateUnidadMedicionModalOpen, setIsCreateUnidadMedicionModalOpen] = useState(false);
  const [isCreateProveedorModalOpen, setIsCreateProveedorModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<CreateMaterialSchemaData>({
    Nombre_Material: '',
    Descripcion: '',
    Id_Unidad_Medicion: 0,
    Cantidad: 1,
    Precio_Unitario: 5,
    Numero_Estanteria: 1,
    IDS_Categorias: [],
    Id_Tipo_Proveedor: undefined,
    Id_Proveedor: undefined,
  });

  const createInputHandler = (fieldName: keyof CreateMaterialSchemaData, maxLength: number) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      
      if (value.length <= maxLength) {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        
        if (fieldName === 'Nombre_Material') {
          setFieldCharCounts(prev => ({ ...prev, nombreMaterial: value.length }));
        } else if (fieldName === 'Descripcion') {
          setFieldCharCounts(prev => ({ ...prev, descripcion: value.length }));
        }
        
        if (formErrors[fieldName]) {
          setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const validation = CreateMaterialSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    try {
 
      const payload: CreateMaterialData = {
        Nombre_Material: formData.Nombre_Material,
        Descripcion: formData.Descripcion,
        Id_Unidad_Medicion: formData.Id_Unidad_Medicion,
        Cantidad: formData.Cantidad,
        Precio_Unitario: formData.Precio_Unitario,
        Numero_Estanteria: formData.Numero_Estanteria,
        IDS_Categorias: formData.IDS_Categorias ?? [],
        Id_Tipo_Proveedor: formData.Id_Tipo_Proveedor,
        Id_Proveedor: formData.Id_Proveedor,
      };

      await createMaterialMutation.mutateAsync({
        data: payload,
      });
      onClose();
      setFormData({
        Nombre_Material: '',
        Descripcion: '',
        Id_Unidad_Medicion: 0,
        Cantidad: 1,
        Precio_Unitario: 5,
        Numero_Estanteria: 1,
        IDS_Categorias: [],
        Id_Tipo_Proveedor: undefined,
        Id_Proveedor: undefined,
      });
      setFieldCharCounts({ nombreMaterial: 0, descripcion: 0 });
    } catch (error) {
      console.log('Error creating material:', error);
    }
  };

  const renderCharCounter = (current: number, max: number) => {
    const remaining = max - current;
    const isNearLimit = remaining <= 5;
    
    return (
      <div className="flex justify-end items-center mt-1">
        <span className={`text-xs font-medium ${
          isNearLimit ? 'text-orange-600' : 'text-gray-500'
        }`}>
          {current}/{max}
        </span>
      </div>
    );
  };

  const handleCategoryChange = (categoriaId: number, checked: boolean) => {
    const currentValues = formData.IDS_Categorias ?? [];
    if (checked) {
      setFormData(prev => ({ 
        ...prev, 
        IDS_Categorias: [...currentValues, categoriaId] 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        IDS_Categorias: currentValues.filter((id: number) => id !== categoriaId) 
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Material</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <LuX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100 max-h-[calc(90vh-140px)]">
          <form id="create-material-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre-material" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Material <span className="text-red-500">*</span>
              </label>
              <input
                id="nombre-material"
                type="text"
                value={formData.Nombre_Material}
                onChange={createInputHandler('Nombre_Material', NOMBRE_MATERIAL_MAX_LENGTH)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.Nombre_Material ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Cemento Portland"
              />
              {renderCharCounter(fieldCharCounts.nombreMaterial, NOMBRE_MATERIAL_MAX_LENGTH)}
              {formErrors.Nombre_Material && (
                <p className="text-red-500 text-xs mt-1">{formErrors.Nombre_Material}</p>
              )}
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (Opcional)
              </label>
              <textarea
                id="descripcion"
                value={formData.Descripcion}
                onChange={createInputHandler('Descripcion', DESCRIPCION_MAX_LENGTH)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 scrollbar-thin focus:border-transparent resize-none ${
                  formErrors.Descripcion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Descripción del material"
              />
              {renderCharCounter(fieldCharCounts.descripcion, DESCRIPCION_MAX_LENGTH)}
              {formErrors.Descripcion && (
                <p className="text-red-500 text-xs mt-1">{formErrors.Descripcion}</p>
              )}
            </div>

            <div>
              <label htmlFor="unidad-medicion" className="block text-sm flex justify-between font-medium text-gray-700 mb-1">
                <span>Unidad de Medición <span className="text-red-500">*</span></span>
                 <button
                  type="button"
                  onClick={() => setIsCreateUnidadMedicionModalOpen(true)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                >
                  <LuPlus className="w-3 h-3" />
                  Nueva
                </button>
              </label>
              <select
                id="unidad-medicion"
                value={formData.Id_Unidad_Medicion || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, Id_Unidad_Medicion: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.Id_Unidad_Medicion ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar unidad de medición</option>
                {unidadesMedicion.map((unidad) => (
                  <option key={unidad.Id_Unidad_Medicion} value={unidad.Id_Unidad_Medicion}>
                    {unidad.Nombre_Unidad || unidad.Nombre_Unidad_Medicion}
                  </option>
                ))}
              </select>
              {formErrors.Id_Unidad_Medicion && (
                <p className="text-red-500 text-xs mt-1">{formErrors.Id_Unidad_Medicion}</p>
              )}
            </div>

            <div>
              <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad <span className="text-red-500">*</span>
              </label>
              <input
                id="cantidad"
                type="number"
                min={CANTIDAD_MIN}
                max={CANTIDAD_MAX}
                value={formData.Cantidad}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value);
                  if (!Number.isNaN(value) && value >= CANTIDAD_MIN && value <= CANTIDAD_MAX) {
                    setFormData(prev => ({ ...prev, Cantidad: value }));
                  } else if (e.target.value === '') {
                    setFormData(prev => ({ ...prev, Cantidad: CANTIDAD_MIN }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.Cantidad ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                Rango: {CANTIDAD_MIN.toLocaleString()} - {CANTIDAD_MAX.toLocaleString()}
              </div>
              {formErrors.Cantidad && (
                <p className="text-red-500 text-xs mt-1">{formErrors.Cantidad}</p>
              )}
            </div>

            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                Precio Unitario (₡) <span className="text-red-500">*</span>
              </label>
              <input
                id="precio"
                type="number"
                min={PRECIO_MIN}
                max={PRECIO_MAX}
                step="0.01"
                value={formData.Precio_Unitario}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!Number.isNaN(value) && value >= PRECIO_MIN && value <= PRECIO_MAX) {
                    setFormData(prev => ({ ...prev, Precio_Unitario: value }));
                  } else if (e.target.value === '') {
                    setFormData(prev => ({ ...prev, Precio_Unitario: PRECIO_MIN }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.Precio_Unitario ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                Rango: ₡{PRECIO_MIN.toLocaleString()} - ₡{PRECIO_MAX.toLocaleString()}
              </div>
              {formErrors.Precio_Unitario && (
                <p className="text-red-500 text-xs mt-1">{formErrors.Precio_Unitario}</p>
              )}
            </div>

            <div>
              <label htmlFor="numero-estanteria" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Estantería <span className="text-red-500">*</span>
              </label>
              <input
                id="numero-estanteria"
                type="number"
                min={NUMERO_ESTANTERIA_MIN}
                max={NUMERO_ESTANTERIA_MAX}
                value={formData.Numero_Estanteria}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value);
                  if (!Number.isNaN(value) && value >= NUMERO_ESTANTERIA_MIN && value <= NUMERO_ESTANTERIA_MAX) {
                    setFormData(prev => ({ ...prev, Numero_Estanteria: value }));
                  } else if (e.target.value === '') {
                    setFormData(prev => ({ ...prev, Numero_Estanteria: NUMERO_ESTANTERIA_MIN }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.Numero_Estanteria ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 5"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                Rango: {NUMERO_ESTANTERIA_MIN} - {NUMERO_ESTANTERIA_MAX}
              </div>
              {formErrors.Numero_Estanteria && (
                <p className="text-red-500 text-xs mt-1">{formErrors.Numero_Estanteria}</p>
              )}
            </div>

            <div>
              <label htmlFor="tipo-proveedor" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Proveedor (Opcional)
              </label>
              <select
                id="tipo-proveedor"
                value={formData.Id_Tipo_Proveedor || ''}
                onChange={(e) => {
                  const tipoProveedor = e.target.value ? parseInt(e.target.value) : undefined;
                  setFormData(prev => ({ 
                    ...prev, 
                    Id_Tipo_Proveedor: tipoProveedor,
                    Id_Proveedor: undefined // Resetear proveedor cuando cambia el tipo
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sin proveedor</option>
                <option value="1">Proveedor Físico</option>
                <option value="2">Proveedor Jurídico</option>
              </select>
            </div>

            {formData.Id_Tipo_Proveedor && (
              <div>
                <label htmlFor="proveedor" className="block text-sm flex justify-between font-medium text-gray-700 mb-1">
                  <span>Proveedor <span className="text-red-500">*</span></span>
                  <button
                    type="button"
                    onClick={() => setIsCreateProveedorModalOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                  >
                    <LuPlus className="w-3 h-3" />
                    Nuevo
                  </button>
                </label>
                <select
                  id="proveedor"
                  value={formData.Id_Proveedor || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    Id_Proveedor: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar proveedor</option>
                  {formData.Id_Tipo_Proveedor === 1 && proveedoresFisicos.map((proveedor) => (
                    <option key={proveedor.Id_Proveedor} value={proveedor.Id_Proveedor}>
                      {proveedor.Nombre_Proveedor}
                    </option>
                  ))}
                  {formData.Id_Tipo_Proveedor === 2 && proveedoresJuridicos.map((proveedor) => (
                    <option key={proveedor.Id_Proveedor} value={proveedor.Id_Proveedor}>
                      {proveedor.Razon_Social}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="block text-sm font-medium text-gray-700">
                  Categorías (Opcional)
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreateCategoriaModalOpen(true)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                >
                  <LuPlus className="w-3 h-3" />
                  Nueva
                </button>
              </div>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
                {categories.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No hay categor├¡as disponibles. Crea una nueva categor├¡a.
                  </div>
                ) : (
                  categories.map((categoria: CategoriaMaterial) => (
                    <label key={categoria.Id_Categoria} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={(formData.IDS_Categorias ?? []).includes(categoria.Id_Categoria)}
                        onChange={(e) => handleCategoryChange(categoria.Id_Categoria, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{categoria.Nombre_Categoria}</span>
                    </label>
                  ))
                )}
              </div>
              {formErrors.IDS_Categorias && (
                <p className="text-red-500 text-xs mt-1">{formErrors.IDS_Categorias}</p>
              )}
            </div>
          </form>
        </div>
        <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t bg-gray-50 z-10">
          <button
            form='create-material-form'
            type="submit"
            disabled={createMaterialMutation.isPending}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createMaterialMutation.isPending ? 'Creando...' : 'Crear Material'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>

      <CreateCategoriaModal
        isOpen={isCreateCategoriaModalOpen}
        onClose={() => setIsCreateCategoriaModalOpen(false)}
      />
      <CreateUnidadMedicionModal
        isOpen={isCreateUnidadMedicionModalOpen}
        onClose={() => setIsCreateUnidadMedicionModalOpen(false)}
      />
      {isCreateProveedorModalOpen && (
        <CreateModalProveedor
          onClose={() => setIsCreateProveedorModalOpen(false)}
          setShowCreateModal={setIsCreateProveedorModalOpen}
        />
      )}
    </div>
  )
}

export default CreateMaterialModal
