import React from 'react';
import { LuX } from 'react-icons/lu';
import { Button } from '@/Modules/Global/components/Sidebar/ui/button';
import type { ProveedorJuridico } from '../Models/TablaProveedo/proveedorjuridico';

interface EditProveedorJuridicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  proveedor: ProveedorJuridico;
}

const EditProveedorJuridicoModal: React.FC<EditProveedorJuridicoModalProps> = ({ 
  isOpen, 
  onClose, 
  proveedor 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Editar Proveedor Jurídico</h1>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <LuX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-teal-800 mb-2">
              Funcionalidad en Desarrollo
            </h3>
            <p className="text-purple-700 mb-4">
              El modal de edición para proveedores jurídicos está próximamente disponible. 
              Por ahora puedes ver todos los detalles del proveedor seleccionado:
            </p>
            <div className="bg-white p-4 rounded border">
              <h4 className="font-medium text-gray-800 mb-2">Datos del Proveedor:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Nombre:</strong> {proveedor.Nombre_Proveedor}</p>
                <p><strong>Razón Social:</strong> {proveedor.Razon_Social}</p>
                <p><strong>Cédula Jurídica:</strong> {proveedor.Cedula_Juridica}</p>
                <p><strong>Tipo:</strong> Cédula Jurídica</p>
                <p><strong>Teléfono:</strong> {proveedor.Telefono_Proveedor}</p>
                <p><strong>Estado:</strong> {proveedor.Estado_Proveedor?.Estado_Proveedor}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProveedorJuridicoModal;