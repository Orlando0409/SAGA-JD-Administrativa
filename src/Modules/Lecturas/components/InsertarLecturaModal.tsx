import { useState, useRef } from "react";
import { useCreateLectura, useImportarCSVLecturas, useGetTarifas } from "../hook/HookLectura";
import { X, Upload, FileText, Plus } from "lucide-react";
import type { CreateLecturaDTO } from "../model/Lectura";

interface InsertarLecturaModalProps {
  onClose: () => void;
}

export default function InsertarLecturaModal({ onClose }: InsertarLecturaModalProps) {
  const [mode, setMode] = useState<"csv" | "manual">("manual");
  const createLecturaMutation = useCreateLectura();
  const importCSVMutation = useImportarCSVLecturas();
  const { data: tarifas } = useGetTarifas();

  // Estado para modo CSV
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para modo manual
  const [formData, setFormData] = useState<CreateLecturaDTO>({
    Numero_Medidor: 0,
    Id_Tipo_Tarifa_Lectura: tarifas?.[0]?.Id_Tipo_Tarifa_Lectura || 1,
    Valor_Lectura_Anterior: 0,
    Valor_Lectura_Actual: 0,
    Fecha_Lectura: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({
    medidor: "",
    lecturaAnterior: "",
    lecturaActual: "",
    fecha: "",
  });

  // Handlers para CSV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      setCsvFile(null);
      alert("Por favor seleccione un archivo CSV válido");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      alert("Por favor suelte un archivo CSV válido");
    }
  };

  const handleUploadCSV = async () => {
    if (!csvFile) return;

    await importCSVMutation.mutateAsync(csvFile);
    onClose();
  };

  // Handlers para modo manual
  const handleMedidorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFormData({ ...formData, Numero_Medidor: value });

    if (isNaN(value) || value <= 0) {
      setErrors({ ...errors, medidor: "Debe ingresar un ID de medidor válido" });
    } else {
      setErrors({ ...errors, medidor: "" });
    }
  };

  const handleLecturaAnteriorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({ ...formData, Valor_Lectura_Anterior: value });

    if (isNaN(value) || value < 0) {
      setErrors({ ...errors, lecturaAnterior: "Debe ingresar un valor válido mayor o igual a 0" });
    } else {
      setErrors({ ...errors, lecturaAnterior: "" });
    }
  };

  const handleLecturaActualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({ ...formData, Valor_Lectura_Actual: value });

    if (isNaN(value) || value < 0) {
      setErrors({ ...errors, lecturaActual: "Debe ingresar un valor válido mayor o igual a 0" });
    } else if (value < formData.Valor_Lectura_Anterior) {
      setErrors({
        ...errors,
        lecturaActual: `La lectura actual no puede ser menor a la anterior (${formData.Valor_Lectura_Anterior} m³)`,
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

  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones finales
    if (
      formData.Numero_Medidor <= 0 ||
      formData.Valor_Lectura_Actual < formData.Valor_Lectura_Anterior ||
      !formData.Fecha_Lectura ||
      Object.values(errors).some((error) => error !== "")
    ) {
      return;
    }

    await createLecturaMutation.mutateAsync(formData);
    onClose();
  };

  const consumoCalculado = formData.Valor_Lectura_Actual - formData.Valor_Lectura_Anterior;

  return (
    <div className="fixed inset-0 backdrop-blur  bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Registrar Nueva Lectura</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setMode("manual")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all font-medium ${
                mode === "manual"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <Plus size={20} />
              <span>Entrada Manual</span>
            </button>
            <button
              onClick={() => setMode("csv")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all font-medium ${
                mode === "csv"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <Upload size={20} />
              <span>Importar CSV</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {mode === "csv" ? (
            /* Modo CSV */
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📋 Formato del archivo CSV</h3>
                <p className="text-sm text-blue-700 mb-2">
                  El archivo debe contener las siguientes columnas:
                </p>
                <ul className="text-sm text-blue-600 list-disc list-inside space-y-1">
                  <li>Numero_Medidor (número del medidor)</li>
                  <li>Id_Tipo_Tarifa_Lectura</li>
                  <li>Valor_Lectura_Anterior</li>
                  <li>Valor_Lectura_Actual</li>
                  <li>Fecha_Lectura (formato: YYYY-MM-DD)</li>
                </ul>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : csvFile
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {csvFile ? (
                  <div className="space-y-4">
                    <FileText size={48} className="mx-auto text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">{csvFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(csvFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => setCsvFile(null)}
                      className="text-sm text-red-600 hover:text-red-700 underline"
                    >
                      Remover archivo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload size={48} className="mx-auto text-gray-400" />
                    <div>
                      <p className="text-gray-700 font-medium mb-1">
                        Arrastra y suelta tu archivo CSV aquí
                      </p>
                      <p className="text-sm text-gray-500 mb-3">o</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Seleccionar archivo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUploadCSV}
                  disabled={!csvFile || importCSVMutation.isPending}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {importCSVMutation.isPending ? "Importando..." : "Importar Lecturas"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            /* Modo Manual */
            <form onSubmit={handleSubmitManual} className="space-y-6">
              {/* ID Medidor */}
              <div>
                <label htmlFor="medidor" className="block text-sm font-medium text-gray-700 mb-2">
                  Número del Medidor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="medidor"
                  value={formData.Numero_Medidor || ""}
                  onChange={handleMedidorChange}
                  min="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.medidor ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.medidor && <p className="mt-1 text-sm text-red-500">{errors.medidor}</p>}
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
                    setFormData({
                      ...formData,
                      Id_Tipo_Tarifa_Lectura: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {tarifas?.map((tarifa) => (
                    <option
                      key={tarifa.Id_Tipo_Tarifa_Lectura}
                      value={tarifa.Id_Tipo_Tarifa_Lectura}
                    >
                      {tarifa.Nombre_Tipo_Tarifa} - Cargo Fijo: ₡
                      {tarifa.Cargo_Fijo_Por_Mes.toLocaleString("es-CR")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lectura Anterior */}
              <div>
                <label
                  htmlFor="lecturaAnterior"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Lectura Anterior (m³) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="lecturaAnterior"
                  value={formData.Valor_Lectura_Anterior}
                  onChange={handleLecturaAnteriorChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.lecturaAnterior ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.lecturaAnterior && (
                  <p className="mt-1 text-sm text-red-500">{errors.lecturaAnterior}</p>
                )}
              </div>

              {/* Lectura Actual */}
              <div>
                <label
                  htmlFor="lecturaActual"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Lectura Actual (m³) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="lecturaActual"
                  value={formData.Valor_Lectura_Actual}
                  onChange={handleLecturaActualChange}
                  step="0.01"
                  min="0"
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
              {consumoCalculado >= 0 && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <p className="text-sm opacity-90 mb-1">Consumo Calculado</p>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold">{consumoCalculado.toFixed(2)}</span>
                    <span className="text-xl">m³</span>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={
                    createLecturaMutation.isPending ||
                    Object.values(errors).some((error) => error !== "") ||
                    formData.Numero_Medidor <= 0 ||
                    formData.Valor_Lectura_Actual < formData.Valor_Lectura_Anterior
                  }
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {createLecturaMutation.isPending ? "Creando..." : "Crear Lectura"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
