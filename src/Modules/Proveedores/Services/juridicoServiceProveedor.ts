import apiAuth from '@/Api/apiAuth';
import type { ProveedorJuridico, CreateProveedorJuridicoData, UpdateProveedorJuridicoData } from '../Models/TablaProveedo/tablaJuridicoProveedor';

// Función para obtener todos los proveedores jurídicos
export const getProveedoresJuridicos = async (): Promise<ProveedorJuridico[]> => {
  try {
    const response = await apiAuth.get('/Proveedores/juridico/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener proveedores jurídicos:', error);
    throw error;
  }
};

// Función para obtener un proveedor jurídico por ID
export const getProveedorJuridicoById = async (id: number): Promise<ProveedorJuridico> => {
  try {
    const response = await apiAuth.get(`/Proveedores/juridico/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener proveedor jurídico por ID:', error);
    throw error;
  }
};

// Función para crear un proveedor jurídico
export const createProveedorJuridico = async (proveedor: CreateProveedorJuridicoData): Promise<ProveedorJuridico> => {
  try {
    console.log('🔄 Creando proveedor jurídico:', proveedor);
    const response = await apiAuth.post('/Proveedores/juridico/create', proveedor);
    console.log('✅ Proveedor jurídico creado correctamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear proveedor jurídico:', error);
    throw error;
  }
};

// Función para actualizar un proveedor jurídico
export const updateProveedorJuridico = async (id: number, proveedor: UpdateProveedorJuridicoData): Promise<ProveedorJuridico> => {
  try {
    const response = await apiAuth.put(`/Proveedores/juridico/${id}`, proveedor);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar proveedor jurídico:', error);
    throw error;
  }
};

// Función para eliminar un proveedor jurídico
export const deleteProveedorJuridico = async (id: number): Promise<void> => {
  try {
    console.log(`🗑️ Eliminando proveedor jurídico ID: ${id}`);
    await apiAuth.delete(`/Proveedores/juridico/${id}`);
    console.log(`✅ Proveedor jurídico ID: ${id} eliminado correctamente`);
  } catch (error) {
    console.error(`❌ Error al eliminar proveedor jurídico ID: ${id}`, error);
    throw error;
  }
};

// Función para cambiar el estado de un proveedor jurídico
export const changeProveedorJuridicoStatus = async (id: number, nuevoEstado: number): Promise<ProveedorJuridico> => {
  try {
    console.log(`🔄 Cambiando estado del proveedor jurídico ID: ${id} al estado: ${nuevoEstado}`);
    const response = await apiAuth.patch(`/Proveedores/juridico/${id}/estado`, { 
      Id_Estado_Proveedor: nuevoEstado 
    });
    console.log(`✅ Estado del proveedor jurídico ID: ${id} cambiado correctamente`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al cambiar estado del proveedor jurídico ID: ${id}`, error);
    throw error;
  }
};
