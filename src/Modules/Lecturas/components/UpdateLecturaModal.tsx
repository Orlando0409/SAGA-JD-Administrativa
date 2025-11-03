import { useState, useEffect } from "react";
import { useUpdateLectura, useGetTarifas } from "../hook/HookLectura";
import { X } from "lucide-react";
import type { Lectura, UpdateLecturaDTO } from "../model/Lectura";

interface UpdateLecturaModalProps {
  lectura: Lectura;
  onClose: () => void;
}

export default function UpdateLecturaModal({ lectura, onClose }: UpdateLecturaModalProps) {
  const updateLecturaMutation = useUpdateLectura();
  const { data: tarifas } = useGetTarifas();

  const [formData, setFormData] = useState<UpdateLecturaDTO>({
    Id_Tipo_Tarifa_Lectura: lectura.Tipo_Tarifa.Id_Tipo_Tarifa_Lectura,
    Valor_Lectura_Actual: lectura.Valor_Lectura_Actual,
    Fecha_Lectura: lectura.Fecha_Lectura.split("T")[0],
  });

  const [errors, setErrors] = useState({
    lecturaActual: "",
    fecha: "",
  });

  useEffect(() => {
    setFormData({
      Id_Tipo_Tarifa_Lectura: lectura.Tipo_Tarifa.Id_Tipo_Tarifa_Lectura,
      Valor_Lectura_Actual: lectura.Valor_Lectura_Actual,
      Fecha_Lectura: lectura.Fecha_Lectura.split("T")[0],
    });
    setErrors({ lecturaActual: "", fecha: "" });
  }, [lectura]);

  const handleLecturaActualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({ ...formData, Valor_Lectura_Actual: value });

    if (isNaN(value) || value < 0) {
      setErrors({ ...errors, lecturaActual: "Debe ingresar un valor válido mayor o igual a 0" });
    } else if (value < lectura.Valor_Lectura_Anterior) {
      setErrors({
        ...errors,
        lecturaActual: `La lectura actual no puede ser menor a la anterior (${lectura.Valor_Lectura_Anterior} m³)`,
      });
    } else {
      setErrors({ ...errors, lecturaActual: "" });
    }
  };

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, Fecha_Lectura: value });

    if (!value) {
      setErrors({ ...errors, fecha: "La fecha es obligatoria" });
    } else {
      setErrors({ ...errors, fecha: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones finales
    if (
      formData.Valor_Lectura_Actual < lectura.Valor_Lectura_Anterior ||
      !formData.Fecha_Lectura ||
      errors.lecturaActual ||
      errors.fecha
    ) {
      return;
    }

    await updateLecturaMutation.mutateAsync({
      idLectura: lectura.Id_Lectura,
      lectura: formData,
    });

    onClose();
  };

  const consumoCalculado = formData.Valor_Lectura_Actual - lectura.Valor_Lectura_Anterior;

  return (
    <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Editar Lectura</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del Medidor (solo lectura) */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Medidor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Número de Medidor</p>
                <p className="font-medium text-gray-800">{lectura.Medidor.Numero_Medidor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Afiliado</p>
                <p className="font-medium text-gray-800">
                  {lectura.Medidor.Afiliado.Nombre_Afiliado}
                </p>
              </div>
            </div>
          </div>

          {/* Lectura Anterior (solo lectura) */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Lectura Anterior</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-700">
                {lectura.Valor_Lectura_Anterior}
              </span>
              <span className="text-lg text-gray-600">m³</span>
            </div>
          </div>

          {/* Tipo de Tarifa */}
          <div>
            <label htmlFor="tarifa" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Tarifa <span className="text-red-500">*</span>
            </label>
            <select
              id="tarifa"
              value={formData.Id_Tipo_Tarifa_Lectura}
              onChange={(e) =>
                setFormData({ ...formData, Id_Tipo_Tarifa_Lectura: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {tarifas?.map((tarifa) => (
                <option key={tarifa.Id_Tipo_Tarifa_Lectura} value={tarifa.Id_Tipo_Tarifa_Lectura}>
                  {tarifa.Nombre_Tipo_Tarifa} - Cargo Fijo: ₡
                  {tarifa.Cargo_Fijo_Por_Mes.toLocaleString("es-CR")}
                </option>
              ))}
            </select>
          </div>

          {/* Lectura Actual */}
          <div>
            <label htmlFor="lecturaActual" className="block text-sm font-medium text-gray-700 mb-2">
              Lectura Actual (m³) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="lecturaActual"
              value={formData.Valor_Lectura_Actual}
              onChange={handleLecturaActualChange}
              step="0.01"
              min={lectura.Valor_Lectura_Anterior}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.lecturaActual ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.lecturaActual && (
              <p className="mt-1 text-sm text-red-500">{errors.lecturaActual}</p>
            )}
          </div>

          {/* Fecha de Lectura */}
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Lectura <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="fecha"
              value={formData.Fecha_Lectura}
              onChange={handleFechaChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.fecha ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.fecha && <p className="mt-1 text-sm text-red-500">{errors.fecha}</p>}
          </div>

          {/* Consumo Calculado */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Consumo Calculado</p>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">
                {consumoCalculado >= 0 ? consumoCalculado.toFixed(2) : "0.00"}
              </span>
              <span className="text-xl">m³</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={
                updateLecturaMutation.isPending ||
                !!errors.lecturaActual ||
                !!errors.fecha ||
                formData.Valor_Lectura_Actual < lectura.Valor_Lectura_Anterior
              }
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {updateLecturaMutation.isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
