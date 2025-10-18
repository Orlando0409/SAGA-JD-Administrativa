import React, { useState } from 'react';
import { LuUserX, LuUserCheck } from 'react-icons/lu';
import { FaUserEdit } from "react-icons/fa";
import { useChangeProveedorFisicoStatus } from '../Hook/hookFisicoProveedor';
import { useChangeProveedorJuridicoStatus } from '../Hook/hookjuridicoproveedor';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogHeader,
    AlertDialogFooter
} from "@/Modules/Global/components/Sidebar/ui/alert-dialog";
import { Button } from '@/Modules/Global/components/Sidebar/ui/button';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import EditProveedorModal from './EditFisicoProveedoresModal';
import EditProveedorJuridicoModal from './EditJuridicoProveedorModal';
import type { ProveedorFisico } from '../Models/TablaProveedo/tablaFisicoProveedor';
import type { ProveedorJuridico } from '../Models/TablaProveedo/tablaJuridicoProveedor';

interface ActionButtonsProps {
    proveedor: ProveedorFisico | ProveedorJuridico;
    tipoProveedor: 'Físico' | 'Jurídico';
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ proveedor, tipoProveedor }) => {
    // Hooks para cambiar estado de proveedores
    const { changeStatus: changeStatusFisico, isChangingStatus: isChangingStatusFisico } = useChangeProveedorFisicoStatus();
    const { changeStatus: changeStatusJuridico, isChangingStatus: isChangingStatusJuridico } = useChangeProveedorJuridicoStatus();

    const [showEditModal, setShowEditModal] = useState(false);
    const { showSuccess, showError } = useAlerts();

    // Determinar estado activo del proveedor
    const isActiveProveedor = (estado: any): boolean => {
        if (!estado) return false;
        const estadoNombre = estado.Estado_Proveedor?.toLowerCase() || '';
        return estadoNombre === 'activo';
    };



    // Manejar cambio de estado
    const handleChangeStatus = async (newStatus: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevenir propagación del evento

        if (!proveedor.Id_Proveedor) {
            showError('Error: No se puede cambiar el estado, ID del proveedor no encontrado');
            return;
        }

        try {
            if (tipoProveedor === 'Físico') {
                await changeStatusFisico({ id: proveedor.Id_Proveedor, nuevoEstado: newStatus });
            } else {
                await changeStatusJuridico({ id: proveedor.Id_Proveedor, nuevoEstado: newStatus });
            }
            
            const statusText = newStatus === 1 ? 'activado' : 'desactivado';
            const tipoText = tipoProveedor === 'Físico' ? 'físico' : 'jurídico';
            showSuccess(`¡Proveedor ${tipoText} ${statusText} exitosamente!`);
        } catch (error) {
            console.error('Error al cambiar estado del proveedor:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cambiar el estado del proveedor';
            showError(`Error al cambiar el estado del proveedor: ${errorMessage}`);
        }
    };

    const handleActivate = (e: React.MouseEvent) => handleChangeStatus(1, e);
    const handleDeactivate = (e: React.MouseEvent) => handleChangeStatus(2, e);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevenir propagación del evento
        setShowEditModal(true);
    };

    const isChangingStatus = tipoProveedor === 'Físico' ? isChangingStatusFisico : isChangingStatusJuridico;

    return (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {/* Botón de Editar */}
            <Button
                size="sm"
                onClick={handleEdit}
                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1 min-w-[32px] h-8"
                title="Editar proveedor"
            >
                <FaUserEdit className="w-3 h-3" />
                <span className="hidden lg:inline text-xs">Editar</span>
            </Button>

            {/* Botón de Cambiar Estado */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className={`px-2 py-1 rounded transition flex items-center gap-1 min-w-[32px] h-8 ${
                            isActiveProveedor(proveedor.Estado_Proveedor)
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                        title="Cambiar estado"
                    >
                        {isActiveProveedor(proveedor.Estado_Proveedor) ? (
                            <LuUserX className="w-3 h-3" />
                        ) : (
                            <LuUserCheck className="w-3 h-3" />
                        )}
                        <span className="hidden lg:inline text-xs">
                            {isActiveProveedor(proveedor.Estado_Proveedor) ? 'Desactivar' : 'Activar'}
                        </span>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Cambiar estado del proveedor?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isActiveProveedor(proveedor.Estado_Proveedor)
                                ? '¿Estás seguro de que deseas desactivar este proveedor? Podrás reactivarlo más tarde si es necesario.'
                                : '¿Estás seguro de que deseas activar este proveedor?'
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={isActiveProveedor(proveedor.Estado_Proveedor) ? handleDeactivate : handleActivate}
                            disabled={isChangingStatus}
                        >
                            {isChangingStatus
                                ? (isActiveProveedor(proveedor.Estado_Proveedor) ? 'Desactivando...' : 'Activando...')
                                : (isActiveProveedor(proveedor.Estado_Proveedor) ? 'Desactivar' : 'Activar')
                            }
                        </AlertDialogAction>
                        <AlertDialogCancel>
                            Cancelar
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modales de Edición */}
            {tipoProveedor === 'Físico' ? (
                <EditProveedorModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    proveedor={proveedor as ProveedorFisico}
                />
            ) : (
                <EditProveedorJuridicoModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    proveedor={proveedor as ProveedorJuridico}
                />
            )}
        </div>
    );
};

export default ActionButtons;