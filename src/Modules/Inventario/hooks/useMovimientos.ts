import { useState, useCallback, useMemo } from 'react';
import type { IngresoEgresoMaterialData, Material, MovimientoMaterial } from '../models/Inventario';
import type { MovimientoType, MovimientoFormData } from '../types/MovimientoTypes';
import { useGetAllMaterials } from './useMaterials';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import { useAuth } from '@/Modules/Auth/Context/AuthContext';
import { getAllMovimientos, getMovimientosEntradas, getMovimientosSalidas, getMovimientosEntreFechas, getMovimientosPorUsuarioAutenticado, egresoMaterial, ingresoMaterial } from '../service/MovimientosService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';




export const useGetAllMovimientos = () => {
  return useQuery<MovimientoMaterial[]>({
    queryKey: ['movimientos'],
    queryFn: getAllMovimientos,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

export const useGetMovimientosEntradas = () => {
  return useQuery<MovimientoMaterial[]>({
    queryKey: ['movimientos', 'entradas'],
    queryFn: getMovimientosEntradas,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useGetMovimientosSalidas = () => {
  return useQuery<MovimientoMaterial[]>({
    queryKey: ['movimientos', 'salidas'],
    queryFn: getMovimientosSalidas,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useGetMovimientosEntreFechas = (startDate: string, endDate: string, enabled: boolean = true) => {
  return useQuery<MovimientoMaterial[]>({
    queryKey: ['movimientos', 'fechas', startDate, endDate],
    queryFn: () => getMovimientosEntreFechas(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useGetMovimientosPorUsuario = ( ) => {
  return useQuery<MovimientoMaterial[]>({
    queryKey: ['movimientos', 'usuario', ],
    queryFn: () => getMovimientosPorUsuarioAutenticado(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};


export const useIngresoMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: ( data : IngresoEgresoMaterialData) => 
      ingresoMaterial( data),
    onSuccess: () => {
      showSuccess('Éxito', 'Ingreso de material registrado correctamente');
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['material'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message;
      showError('Error', errorMessage);
    },
  });
};

 export const useEgresoMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: ( data : IngresoEgresoMaterialData) => 
      egresoMaterial( data),
    onSuccess: () => {
      showSuccess('Éxito', 'Egreso de material registrado correctamente');
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['material'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al registrar el egreso de material';
      showError('Error', errorMessage);
    },
  });
};


export const useMovimientoForm = (initialMaterial?: Material) => {
  const { user } = useAuth();
  const [tipoMovimiento, setTipoMovimiento] = useState<MovimientoType>('entrada');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(initialMaterial || null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [descripcion, setDescripcion] = useState<string>('');
  const [busquedaMaterial, setBusquedaMaterial] = useState<string>('');
  const [showMaterialSelector, setShowMaterialSelector] = useState<boolean>(!initialMaterial);

  const { data: materiales = [], isLoading: loadingMateriales, refetch: refetchMateriales } = useGetAllMaterials();
  const ingresoMutation = useIngresoMaterial();
  const egresoMutation = useEgresoMaterial();
  const { showError } = useAlerts();

  const materialesFiltrados = useMemo(() => {
    if (!busquedaMaterial.trim()) return materiales;
    const termino = busquedaMaterial.toLowerCase().trim();
    return materiales.filter((material: Material) => 
      material.Nombre_Material.toLowerCase().includes(termino) ||
      material.Categorias?.some(cat => 
        cat.Nombre_Categoria?.toLowerCase().includes(termino)
      )
    );
  }, [materiales, busquedaMaterial]);


  const handleSelectMaterial = useCallback((material: Material) => {
    setSelectedMaterial(material);
    setShowMaterialSelector(false);
    setBusquedaMaterial('');
  }, []);

  const handleCantidadChange = useCallback((delta: number) => {
    setCantidad(prev => Math.max(1, prev + delta));
  }, []);

  const handleDirectCantidadChange = useCallback((newCantidad: number) => {
    setCantidad(Math.max(1, newCantidad));
  }, []);

  const resetForm = useCallback(() => {
    setSelectedMaterial(initialMaterial || null);
    setCantidad(1);
    setDescripcion('');
    setBusquedaMaterial('');
    setShowMaterialSelector(!initialMaterial);
  }, [initialMaterial]);

  const validateForm = useCallback(() => {
    if (!selectedMaterial) {
      showError('Error', 'Debe seleccionar un material');
      return false;
    }

    if (cantidad <= 0) {
      showError('Error', 'La cantidad debe ser mayor a 0');
      return false;
    }

    if (!descripcion.trim()) {
      showError('Error', 'Debe agregar una descripción');
      return false;
    }

    return true;
  }, [selectedMaterial, cantidad, descripcion, showError]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    
    if (!user?.Id_Usuario) {
      showError('Error', 'Usuario no autenticado');
      return false;
    }

    try {
      const movimientoData = {
        Id_Material: selectedMaterial!.Id_Material,
        Cantidad: cantidad,
        Observaciones: descripcion
      };

      if (tipoMovimiento === 'entrada') {
        await ingresoMutation.mutateAsync(movimientoData);
      } else {
        await egresoMutation.mutateAsync(movimientoData);
      }
      await refetchMateriales();
      resetForm();
      return true; // Indica éxito
    } catch (error) {
      console.error('Error creating movimiento:', error);
      return false; // Indica error
    }
  }, [
    validateForm, 
    user?.Id_Usuario,
    showError,
    cantidad, 
    tipoMovimiento, 
    selectedMaterial, 
    ingresoMutation, 
    egresoMutation, 
    refetchMateriales, 
    resetForm
  ]);

  const formData: MovimientoFormData = {
    tipoMovimiento,
    selectedMaterial,
    cantidad,
    descripcion,
    busquedaMaterial,
    showMaterialSelector
  };

  const isLoading = ingresoMutation.isPending || egresoMutation.isPending;

  return {
    // Estado del formulario
    formData,
    
    // Datos derivados
    materialesFiltrados,
    loadingMateriales,
    isLoading,
    
    // Setters
    setTipoMovimiento,
    setCantidad,
    setDescripcion,
    setBusquedaMaterial,
    setShowMaterialSelector,
    
    // Handlers
    handleSelectMaterial,
    handleCantidadChange,
    handleDirectCantidadChange,
    handleSubmit,
    resetForm
  };
};