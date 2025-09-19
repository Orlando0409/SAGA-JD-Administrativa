import { useState } from 'react';
import { LuX, LuUser, LuMail, LuPhone, LuMapPin, LuCalendar, LuBuilding, LuFileText, LuMap, LuInfo } from 'react-icons/lu';
import { FaUserEdit } from "react-icons/fa";
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react"
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'

import { Button } from '@/Modules/Global/components/Sidebar/ui/button';
import { CUSTOM_ANIMATION } from '@/Modules/Global/types/Sections';
import type { AfiliadoFisico } from '../Models/TablaAfiliados/ModeloAfiliadoFisico';
import type { AfiliadoJuridico } from '../Models/TablaAfiliados/ModeloAfiliadoJuridico';
import EditModal from './EditModal';

// Tipo unificado para identificar qué estamos viendo
type PersonaParaDetalle = {
    tipo: 'afiliado-fisico' | 'afiliado-juridico';
    datos: AfiliadoFisico | AfiliadoJuridico;
};

interface DetailAbonadosProps {
    persona: PersonaParaDetalle;
    isOpen: boolean;
    onClose: () => void;
}

const DetailAbonados: React.FC<DetailAbonadosProps> = ({ persona, isOpen, onClose }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [openSections, setOpenSections] = useState<number[]>([1, 2, 3, 4]); // Abrir por defecto

    const handleAccordion = (id: number) => {
        setOpenSections(prev =>
            prev.includes(id)
                ? prev.filter(sectionId => sectionId !== id)
                : [...prev, id]
        )
    }

    const getPersonaInfo = () => {
        const { tipo, datos } = persona;

        if (tipo === 'afiliado-fisico') {
            const afiliado = datos as AfiliadoFisico;
            return {
                id: afiliado.Id_Afiliado,
                nombre: `${afiliado.Nombre} ${afiliado.Apellido1} ${afiliado.Apellido2 || ''}`.trim(),
                documento: afiliado.Cedula,
                tipoDocumento: 'Cédula',
                telefono: afiliado.Numero_Telefono,
                correo: afiliado.Correo,
                direccion: afiliado.Direccion_Exacta,
                estado: afiliado.Estado?.Nombre_Estado || 'Sin estado',
                estadoId: afiliado.Estado?.Id_Estado_Afiliado || 0,
                tipoPersona: 'Físico',
                tipoAfiliado: afiliado.Tipo_Afiliado?.Nombre_Tipo_Afiliado || 'Asociado',
                edad: afiliado.Edad,
                fechaCreacion: afiliado.Fecha_Creacion,
                fechaActualizacion: afiliado.Fecha_Actualizacion,
                escritura: afiliado.Escritura_Terreno,
                planos: afiliado.Planos_Terreno,
                motivo: null // Campo no disponible en el modelo actual
            };
        } else { // afiliado-juridico
            const afiliado = datos as AfiliadoJuridico;
            return {
                id: afiliado.Id_Afiliado,
                nombre: afiliado.Razon_Social,
                documento: afiliado.Cedula_Juridica,
                tipoDocumento: 'Cédula Jurídica',
                telefono: afiliado.Numero_Telefono,
                correo: afiliado.Correo,
                direccion: afiliado.Direccion_Exacta,
                estado: afiliado.Estado?.Nombre_Estado || 'Sin estado',
                estadoId: afiliado.Estado?.Id_Estado_Afiliado || 0,
                tipoPersona: 'Jurídico',
                tipoAfiliado: afiliado.Tipo_Afiliado?.Nombre_Tipo_Afiliado || 'Asociado',
                edad: null,
                fechaCreacion: afiliado.Fecha_Creacion,
                fechaActualizacion: afiliado.Fecha_Actualizacion,
                escritura: afiliado.Escritura_Terreno,
                planos: afiliado.Planos_Terreno,
                motivo: null // Campo no disponible en el modelo actual
            };
        }
    };

    const formatDate = (date: string | Date | null) => {
        if (!date) return 'No disponible';
        try {
            return new Date(date).toLocaleDateString('es-CR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Fecha inválida';
        }
    };

    const getStatusColor = (estadoId: number) => {
        // Colores según el estado
        switch (estadoId) {
            case 1: // Activo
                return 'bg-green-100 text-green-800 border-green-200';
            case 2: // Inactivo
                return 'bg-red-100 text-red-800 border-red-200';
            case 3: // Pendiente
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTipoPersonaIcon = (tipo: string) => {
        return tipo === 'Físico' ? LuUser : LuBuilding;
    };

    const getTipoAfiliadoColor = (tipo: string) => {
        return tipo === 'Físico'
            ? 'bg-blue-100 text-blue-800 border-blue-200'
            : 'bg-purple-100 text-purple-800 border-purple-200';
    };

    const getModalTitle = () => {
        switch (persona.tipo) {
            case 'afiliado-fisico':
                return ' Detalle del Afiliado Físico';
            case 'afiliado-juridico':
                return ' Detalle del Afiliado Jurídico';
            default:
                return 'Detalle';
        }
    };

    const getHeaderIcon = () => {
        const Icon = getTipoPersonaIcon(personaInfo.tipoPersona);
        return <Icon className="w-8 h-8 text-blue-600" />;
    };

    if (!isOpen) return null;

    const personaInfo = getPersonaInfo();

    return (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">{getModalTitle()}</h1>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <LuX className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Header Card */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                {getHeaderIcon()}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{personaInfo.nombre}</h2>
                                <p className="text-blue-100">{personaInfo.correo}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-blue-200 text-sm">ID: {personaInfo.id}</span>
                                    <span className="text-blue-200">•</span>
                                    <span className="text-blue-200 text-sm">{personaInfo.tipoPersona}</span>
                                    <span className="text-blue-200">•</span>
                                    <span className="text-blue-200 text-sm">{personaInfo.tipoAfiliado}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accordion Sections */}
                    <div className="space-y-4">
                        {/* Información Personal */}
                        <Accordion
                            open={openSections.includes(1)}
                            animate={CUSTOM_ANIMATION}
                            className="border border-gray-200 rounded-lg shadow-sm bg-white"
                            {...({} as any)}
                        >
                            <AccordionHeader
                                onClick={() => handleAccordion(1)}
                                className="text-base font-semibold px-6 py-4 border-b-0 hover:bg-gray-50"
                                {...({} as any)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <LuUser className="w-5 h-5 text-blue-600" />
                                        <span className="text-gray-900">Información Personal</span>
                                    </div>
                                    <span className="text-gray-500">
                                        {openSections.includes(1) ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                                    </span>
                                </div>
                            </AccordionHeader>
                            <AccordionBody className="px-6 pb-6" placeholder="">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            {personaInfo.tipoPersona === 'Físico' ? 'Nombre Completo' : 'Razón Social'}
                                        </label>
                                        <p className="text-gray-900 font-medium">{personaInfo.nombre}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">{personaInfo.tipoDocumento}</label>
                                        <p className="text-gray-900 font-medium">{personaInfo.documento}</p>
                                    </div>

                                    {personaInfo.edad && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Edad</label>
                                            <p className="text-gray-900 font-medium">{personaInfo.edad} años</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">Estado</label>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(personaInfo.estadoId)}`}>
                                            {personaInfo.estado}
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">Tipo de Persona</label>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                            {personaInfo.tipoPersona}
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">Tipo de Afiliado</label>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTipoAfiliadoColor(personaInfo.tipoAfiliado)}`}>
                                            {personaInfo.tipoAfiliado}
                                        </span>
                                    </div>
                                </div>
                            </AccordionBody>
                        </Accordion>

                        {/* Información de Contacto */}
                        <Accordion
                            open={openSections.includes(2)}
                            animate={CUSTOM_ANIMATION}
                            className="border border-gray-200 rounded-lg shadow-sm bg-white"
                            {...({} as any)}
                        >
                            <AccordionHeader
                                onClick={() => handleAccordion(2)}
                                className="text-base font-semibold px-6 py-4 border-b-0 hover:bg-gray-50"
                                {...({} as any)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <LuPhone className="w-5 h-5 text-blue-600" />
                                        <span className="text-gray-900">Información de Contacto</span>
                                    </div>
                                    <span className="text-gray-500">
                                        {openSections.includes(2) ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                                    </span>
                                </div>
                            </AccordionHeader>
                            <AccordionBody className="px-6 pb-6" placeholder="">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3">
                                        <LuPhone className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
                                            <p className="text-gray-900 font-medium">{personaInfo.telefono}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <LuMail className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Correo Electrónico</label>
                                            <p className="text-gray-900 font-medium">{personaInfo.correo}</p>
                                        </div>
                                    </div>

                                    {personaInfo.direccion && (
                                        <div className="md:col-span-2 flex items-start gap-3">
                                            <LuMapPin className="w-5 h-5 text-gray-400 mt-1" />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Dirección Exacta</label>
                                                <p className="text-gray-900 font-medium">{personaInfo.direccion}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </AccordionBody>
                        </Accordion>

                        {/* Documentos (solo para afiliados) */}
                        {(persona.tipo === 'afiliado-fisico' || persona.tipo === 'afiliado-juridico') && (
                            <Accordion
                                open={openSections.includes(3)}
                                animate={CUSTOM_ANIMATION}
                                className="border border-gray-200 rounded-lg shadow-sm bg-white"
                                {...({} as any)}
                            >
                                <AccordionHeader
                                    onClick={() => handleAccordion(3)}
                                    className="text-base font-semibold px-6 py-4 border-b-0 hover:bg-gray-50"
                                    {...({} as any)}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            <LuFileText className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-900">Documentos</span>
                                        </div>
                                        <span className="text-gray-500">
                                            {openSections.includes(3) ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                                        </span>
                                    </div>
                                </AccordionHeader>
                                <AccordionBody className="px-6 pb-6" placeholder="">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3">
                                            <LuFileText className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Escritura del Terreno</label>
                                                {personaInfo.escritura ? (
                                                    <a
                                                        href={personaInfo.escritura}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 font-medium underline"
                                                    >
                                                         Ver documento
                                                    </a>
                                                ) : (
                                                    <p className="text-gray-500">No disponible</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <LuMap className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Planos del Terreno</label>
                                                {personaInfo.planos ? (
                                                    <a
                                                        href={personaInfo.planos}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 font-medium underline"
                                                    >
                                                         Ver documento
                                                    </a>
                                                ) : (
                                                    <p className="text-gray-500">No disponible</p>
                                                )}
                                            </div>
                                        </div>

                                        {personaInfo.motivo && (
                                            <div className="md:col-span-2 flex items-start gap-3">
                                                <LuInfo className="w-5 h-5 text-gray-400 mt-1" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500 mb-1">Motivo de Afiliación</label>
                                                    <p className="text-gray-900 font-medium">{personaInfo.motivo}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </AccordionBody>
                            </Accordion>
                        )}

                        {/* Información del Sistema */}
                        <Accordion
                            open={openSections.includes(4)}
                            animate={CUSTOM_ANIMATION}
                            className="border border-gray-200 rounded-lg shadow-sm bg-white"
                            {...({} as any)}
                        >
                            <AccordionHeader
                                onClick={() => handleAccordion(4)}
                                className="text-base font-semibold px-6 py-4 border-b-0 hover:bg-gray-50"
                                {...({} as any)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <LuCalendar className="w-5 h-5 text-blue-600" />
                                        <span className="text-gray-900">Información del Sistema</span>
                                    </div>
                                    <span className="text-gray-500">
                                        {openSections.includes(4) ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                                    </span>
                                </div>
                            </AccordionHeader>
                            <AccordionBody className="px-6 pb-6" placeholder="">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3">
                                        <LuCalendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Creación</label>
                                            <p className="text-gray-900 font-medium">{formatDate(personaInfo.fechaCreacion)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <LuCalendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Última Actualización</label>
                                            <p className="text-gray-900 font-medium">{formatDate(personaInfo.fechaActualizacion)}</p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionBody>
                        </Accordion>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8">
                        <Button
                            size="xl"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                            onClick={() => setShowEditModal(true)}
                        >
                            <FaUserEdit className="w-5 h-5" />
                            Editar {personaInfo.tipoAfiliado}
                        </Button>
                    </div>
                </div>

                {/* Edit Modal */}
                {showEditModal && (
                    <EditModal
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        persona={persona}
                    />
                )}
            </div>
        </div>
    );
};

export default DetailAbonados;