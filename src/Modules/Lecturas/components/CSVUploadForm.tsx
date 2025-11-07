import { useState, useRef } from "react";
import { Upload, FileText } from "lucide-react";
import { useAlerts } from '@/Modules/Global/context/AlertContext';

interface CSVUploadFormProps {
  onUpload: (file: File) => Promise<void>;
  onCancel: () => void;
  isUploading: boolean;
}

export default function CSVUploadForm({ onUpload, onCancel, isUploading }: CSVUploadFormProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showError } = useAlerts();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      setCsvFile(null);
      showError(
        'Archivo inválido',
        'Por favor seleccione un archivo CSV válido'
      );
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
      showError(
        'Archivo inválido',
        'Por favor suelte un archivo CSV válido'
      );
    }
  };

  const handleSubmit = async () => {
    if (!csvFile) return;
    await onUpload(csvFile);
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Formato del archivo CSV</h3>
        <p className="text-sm text-blue-700 mb-2">
          El archivo debe contener las siguientes columnas:
        </p>
        <ul className="text-sm text-blue-600 list-disc list-inside space-y-1">
          <li>Numero_Medidor (número del medidor)</li>
          <li>Id_Tipo_Tarifa (ID del tipo de tarifa)</li>
          <li>Valor_Lectura_Actual (valor de la lectura actual)</li>
        </ul>
      </div>

      {/* Zona de carga */}
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

      {/* Botones */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={!csvFile || isUploading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isUploading ? "Importando..." : "Importar Lecturas"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
