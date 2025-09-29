import apiAuth from '@/Api/apiAuth';
import type { ProveedorFisico } from '../Models/TablaProveedo/proveedorFisico';

// Función para obtener todos los proveedores físicos
export const getProveedoresFisicos = async (): Promise<ProveedorFisico[]> => {
  try {
    const response = await apiAuth.get('/Proveedores/fisico/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener proveedores físicos:', error);
    throw error;
  }
};

// Función para crear un proveedor físico
export const createProveedorFisico = async (proveedor: Omit<ProveedorFisico, 'Id_Proveedor' | 'Fecha_Creacion' | 'Fecha_Actualizacion'>): Promise<ProveedorFisico> => {
  try {
    const response = await apiAuth.post('/proveedores-fisicos', proveedor);
    return response.data;
  } catch (error) {
    console.error('Error al crear proveedor físico:', error);
    throw error;
  }
};

