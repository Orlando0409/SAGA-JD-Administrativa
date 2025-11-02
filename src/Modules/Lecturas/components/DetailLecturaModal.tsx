import { X } from "lucide-react";
import type { Lectura } from "../model/Lectura";

interface DetailLecturaModalProps {
  lectura: Lectura;
  onClose: () => void;
}

export default function DetailLecturaModal({ lectura, onClose }: DetailLecturaModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-10 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Detalles de la Lectura</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">ID Lectura</p>
                <p className="font-medium text-gray-800">{lectura.Id_Lectura}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Lectura</p>
                <p className="font-medium text-gray-800">
                  {new Date(lectura.Fecha_Lectura).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Información del Medidor */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Medidor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Número de Medidor</p>
                <p className="font-medium text-gray-800">{lectura.Medidor.Numero_Medidor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado del Medidor</p>
                <p className="font-medium text-gray-800">
                  {lectura.Medidor.Estado_Medidor.Nombre_Estado}
                </p>
              </div>
            </div>
          </div>

          {/* Información del Afiliado */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Afiliado</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-medium text-gray-800">
                  {lectura.Medidor.Afiliado.Nombre_Afiliado}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo de Afiliado</p>
                <p className="font-medium text-gray-800">
                  {lectura.Medidor.Afiliado.Tipo_Afiliado.Nombre_Tipo}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-medium text-gray-800">
                  {lectura.Medidor.Afiliado.Estado.Nombre_Estado}
                </p>
              </div>
            </div>
          </div>

          {/* Información de Tarifa */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tarifa Aplicada</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Tipo de Tarifa</p>
                <p className="font-medium text-gray-800">{lectura.Tipo_Tarifa.Nombre_Tipo_Tarifa}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cargo Fijo Mensual</p>
                <p className="font-medium text-gray-800">
                  ₡{lectura.Tipo_Tarifa.Cargo_Fijo_Por_Mes.toLocaleString("es-CR")}
                </p>
              </div>
            </div>
          </div>

          {/* Detalles de Consumo */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalles de Consumo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Lectura Anterior</p>
                <p className="font-medium text-gray-800">{lectura.Valor_Lectura_Anterior} m³</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lectura Actual</p>
                <p className="font-medium text-gray-800">{lectura.Valor_Lectura_Actual} m³</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Consumo Calculado</p>
                <p className="font-medium text-blue-600 text-lg">
                  {lectura.Consumo_Calculado_M3} m³
                </p>
              </div>
            </div>
          </div>

          {/* Total a Pagar */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total a Pagar</p>
                <p className="text-3xl font-bold">
                  ₡{lectura.Total_A_Pagar.toLocaleString("es-CR")}
                </p>
              </div>
            </div>
          </div>

          {/* Usuario que Registró */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrado Por</h3>
            <div>
              <p className="text-sm text-gray-600">Usuario</p>
              <p className="font-medium text-gray-800">{lectura.Usuario.Nombre_Usuario}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
