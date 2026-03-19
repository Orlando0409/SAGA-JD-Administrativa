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
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-2xl mx-4 flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 break-words [overflow-wrap:anywhere] pr-3">
            Registrar Nueva Lectura
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`min-w-0 flex items-center justify-center gap-2 px-3 py-3 rounded-md transition-all font-medium text-sm sm:text-base ${
                mode === "manual"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <Plus size={20} />
              <span className="break-words [overflow-wrap:anywhere]">Entrada Manual</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("csv")}
              className={`min-w-0 flex items-center justify-center gap-2 px-3 py-3 rounded-md transition-all font-medium text-sm sm:text-base ${
                mode === "csv"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <Upload size={20} />
              <span className="break-words [overflow-wrap:anywhere]">Importar CSV</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
          <div className="p-4 sm:p-6">
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
    </div>
  );
}