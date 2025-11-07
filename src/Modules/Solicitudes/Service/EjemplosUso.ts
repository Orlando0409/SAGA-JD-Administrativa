/**
 * 📝 Ejemplos de uso del ServiceEstadoSolicitudes
 * 
 * Este archivo muestra cómo usar el servicio unificado
 * para cambiar estados de solicitudes
 */

import { ServiceEstadoSolicitudes, mapearTipoSolicitud, mapearTipoPersona } from './EstadoSolicitudes';
import { EstadoSolicitud } from "../Types/EstadoSolicitudes";

// ============================================
// Ejemplo 1: Cambio de estado básico
// ============================================
async function ejemploCambioEstadoBasico() {
    await ServiceEstadoSolicitudes.cambiarEstado({
        tipoSolicitud: 'afiliacion',
        tipoPersona: 'fisica',
        solicitudId: 123,
        nuevoEstado: EstadoSolicitud.EnRevision
    });
}

// ============================================
// Ejemplo 2: Usando métodos de conveniencia
// ============================================
async function ejemploMetodosConveniencia() {
    const solicitudId = 123;

    // Marcar en revisión
    await ServiceEstadoSolicitudes.marcarEnRevision('afiliacion', 'fisica', solicitudId);

    // Aprobar y poner en espera
    await ServiceEstadoSolicitudes.aprobarYEnEspera('afiliacion', 'fisica', solicitudId);

    // Completar
    await ServiceEstadoSolicitudes.completar('afiliacion', 'fisica', solicitudId);

    // O rechazar desde cualquier estado
    await ServiceEstadoSolicitudes.rechazar('afiliacion', 'fisica', solicitudId);
}

// ============================================
// Ejemplo 3: Uso con datos del backend
// ============================================
async function ejemploConDatosBackend() {
    // Datos que vienen del backend
    const solicitud = {
        Id_Solicitud: 123,
        Tipo_Solicitud: 'Afiliacion',
        Tipo_Persona: 'Físico',
        Estado: { Id_Estado_Solicitud: 1 }
    };

    // Mapear tipos del backend a nuestros tipos internos
    const tipoSolicitud = mapearTipoSolicitud(solicitud.Tipo_Solicitud);
    const tipoPersona = mapearTipoPersona(solicitud.Tipo_Persona);

    // Cambiar estado
    await ServiceEstadoSolicitudes.marcarEnRevision(
        tipoSolicitud,
        tipoPersona,
        solicitud.Id_Solicitud
    );
}

// ============================================
// Ejemplo 4: Validación de transiciones
// ============================================
function ejemploValidacionTransiciones() {
    const estadoActual = EstadoSolicitud.EnRevision;
    const nuevoEstado = EstadoSolicitud.AprobadaEnEspera;

    if (ServiceEstadoSolicitudes.esTransicionValida(estadoActual, nuevoEstado)) {
        console.log('✅ Transición válida');
    } else {
        console.log('❌ Transición no permitida');
    }
}

// ============================================
// Ejemplo 5: Todas las combinaciones posibles
// ============================================
async function ejemploTodasLasCombinaciones() {
    const solicitudId = 123;

    // Física - Afiliación
    await ServiceEstadoSolicitudes.marcarEnRevision('afiliacion', 'fisica', solicitudId);

    // Física - Asociado
    await ServiceEstadoSolicitudes.marcarEnRevision('asociado', 'fisica', solicitudId);

    // Física - Cambio de Medidor
    await ServiceEstadoSolicitudes.marcarEnRevision('cambio-medidor', 'fisica', solicitudId);

    // Física - Desconexión
    await ServiceEstadoSolicitudes.marcarEnRevision('desconexion', 'fisica', solicitudId);

    // Jurídica - Afiliación
    await ServiceEstadoSolicitudes.marcarEnRevision('afiliacion', 'juridica', solicitudId);

    // Jurídica - Asociado
    await ServiceEstadoSolicitudes.marcarEnRevision('asociado', 'juridica', solicitudId);

    // Jurídica - Cambio de Medidor
    await ServiceEstadoSolicitudes.marcarEnRevision('cambio-medidor', 'juridica', solicitudId);

    // Jurídica - Desconexión
    await ServiceEstadoSolicitudes.marcarEnRevision('desconexion', 'juridica', solicitudId);
}

// ============================================
// COMPARACIÓN: Antes vs Después
// ============================================

// ❌ ANTES: Necesitabas importar 16 servicios diferentes
/*
import { ServiceSolicitudAfiliacion } from './EstadoSolicitudesFisicas/ServiceSolicitudAfiliacion';
import { ServiceSolicitudAsociado } from './EstadoSolicitudesFisicas/ServiceSolicitudAsociado';
import { ServiceSolicitudCambioMedidor } from './EstadoSolicitudesFisicas/ServiceSolicitudCambioMedidor';
import { ServiceSolicitudDesconexion } from './EstadoSolicitudesFisicas/ServiceSolicitudDesconexion';
import { ServiceSolicitudAfiliacionJuridica } from './EstadoSolicitudesJuridicas/ServiceSolicitudAfiliacionJuridica';
// ... y así con todos los demás

await ServiceSolicitudAfiliacion.EnRevision(solicitudId);
await ServiceSolicitudAsociado.EnRevision(solicitudId);
// etc...
*/

// ✅ AHORA: Solo un servicio para todo
/*
import { ServiceEstadoSolicitudes } from './EstadoSolicitudes';

await ServiceEstadoSolicitudes.marcarEnRevision('afiliacion', 'fisica', solicitudId);
await ServiceEstadoSolicitudes.marcarEnRevision('asociado', 'fisica', solicitudId);
// etc...
*/
