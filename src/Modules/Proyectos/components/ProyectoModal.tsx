import { Calendar, RefreshCcw, Eye, EyeOff, FileText, Info } from "lucide-react";
import type { Proyecto } from "../Models/ProyectoModels";
import { formatDate } from "../../Inventario/helper/DateFormater.ts";
import ProyectoImagenPreview from "./ProyectoImagenPreview";

interface ProyectoModalProps {
    isOpen: boolean;
    onClose: () => void;
    proyecto: Proyecto;
    refetch: () => void;
}

export default function ProyectoModal({ isOpen, onClose, proyecto }: ProyectoModalProps) {
   

    if (!isOpen) return null;

    const isVisible = proyecto.Visible;


    const getEstadoClass = (estado: string) => {

                let colorClass = '';

                switch (estado) {
                    case 'En Planeamiento':
                        colorClass = 'bg-yellow-100 text-yellow-700 border border-yellow-300';
                        break;
                    case 'En Progreso':
                        colorClass = 'bg-blue-100 text-blue-700 border border-blue-300';
                        break;
                    case 'Terminado':
                        colorClass = 'bg-green-100 text-green-700 border border-green-300';
                        break;
                    default:
                        colorClass = 'bg-gray-200 text-gray-700 border border-gray-300';
                }
                return colorClass;
            }

    return (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">Detalles del Proyecto</h1>
                        <button 
                            onClick={onClose} 
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100 p-6">
                    <div className="space-y-6">
                        {/* Información General */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Info className="size-4 text-blue-600" />
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900">Información General</h3>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                                            Título del Proyecto
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 break-words">{proyecto.Titulo}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                                            Descripción
                                        </div>
                                        <p className="text-sm text-gray-900 break-words">
                                            {proyecto.Descripcion || "Sin descripción disponible"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                                                Estado
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoClass(proyecto.Estado.Nombre_Estado)}`}>
                                                {proyecto.Estado.Nombre_Estado}
                                            </span>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                                                Visibilidad
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {
                                                    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${isVisible
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                                                    {isVisible ? 'Visible' : 'Oculto'}
                                                </span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Archivo y Fechas */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="size-4 text-blue-600" />
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900">Archivos y Registro</h3>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="grid grid-cols-1 gap-6">
                                    {proyecto.Imagen_Url && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                                                Vista Previa
                                            </div>
                                            <ProyectoImagenPreview url={proyecto.Imagen_Url} />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                                                <Calendar size={14} className="inline mr-1" />
                                                Fecha de Creación
                                            </div>
                                            <p className="text-sm text-gray-900">
                                                {formatDate(proyecto.Fecha_Creacion)}
                                            </p>
                                        </div>

                                        {proyecto.Fecha_Actualizacion && (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                                                    <RefreshCcw size={14} className="inline mr-1" />
                                                    Última Actualización
                                                </div>
                                                <p className="text-sm text-gray-900">
                                                    {formatDate(proyecto.Fecha_Actualizacion)}
                                                </p>
                                            </div>
                                        )}

                                        {proyecto.Usuario && (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                                                    Creado por
                                                </div>
                                                <p className="text-sm text-gray-900">
                                                    {proyecto.Usuario.Nombre_Usuario || 'Desconocido'}
                                                </p>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t bg-gray-50 z-10">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
