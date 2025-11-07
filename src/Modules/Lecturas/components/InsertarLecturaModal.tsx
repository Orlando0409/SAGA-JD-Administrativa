import { useState } from "react";
import { useCreateLectura, useImportarCSVLecturas, useGetTarifas } from "../hook/HookLectura";
import { X, Upload, Plus } from "lucide-react";
import type { CreateLecturaDTO } from "../model/Lectura";
import CSVUploadForm from "./CSVUploadForm";
import ManualLecturaForm from "./ManualLecturaForm";

interface InsertarLecturaModalProps {
  onClose: () => void;
}

export default function InsertarLecturaModal({ onClose }: InsertarLecturaModalProps) {
  const [mode, setMode] = useState<"csv" | "manual">("manual");
  const createLecturaMutation = useCreateLectura();
  const importCSVMutation = useImportarCSVLecturas();
  const { data: tarifas } = useGetTarifas();

  const handleCSVUpload = async (file: File) => {
    await importCSVMutation.mutateAsync(file);
    onClose();
  };

  const handleManualSubmit = async (data: CreateLecturaDTO) => {
    await createLecturaMutation.mutateAsync(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-10 flex items-center justify-center z-50 p-4">
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
            <CSVUploadForm
              onUpload={handleCSVUpload}
              onCancel={onClose}
              isUploading={importCSVMutation.isPending}
            />
          ) : (
            <ManualLecturaForm
              onSubmit={handleManualSubmit}
              onCancel={onClose}
              tarifas={tarifas ?? []}
              isSubmitting={createLecturaMutation.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}