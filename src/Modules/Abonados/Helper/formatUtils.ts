/**
 * Función para formatear cédula jurídica para visualización en el módulo de Abonados
 * Aplica el formato 2-222-222222
 */
export const formatCedulaJuridica = (cedula: string): string => {
  if (!cedula) return '';
  
  // Remover cualquier formato existente (espacios, guiones)
  const cleanCedula = cedula.replace(/[\s\-]/g, '');
  
  // Validar que tenga exactamente 10 dígitos
  if (cleanCedula.length !== 10 || !/^\d{10}$/.test(cleanCedula)) {
    return cedula; // Retornar original si no es válido
  }
  
  // Aplicar formato 2-222-222222 (1-3-6)
  return `${cleanCedula.slice(0, 1)}-${cleanCedula.slice(1, 4)}-${cleanCedula.slice(4)}`;
};