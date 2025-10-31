import { FaUserFriends, FaBook,FaHandHoldingWater, FaClipboardList, FaHistory, FaBoxes, FaUsers, FaTruck, FaRegQuestionCircle, FaEdit, FaImage, FaShieldAlt, FaTachometerAlt } from "react-icons/fa";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { GrHelpBook } from "react-icons/gr";
export const modules = [
  // Gestión
  { name: 'Gestión De Abonados', icon: <FaUserFriends />, path: '/Abonados', section: 'Gestión', Permiso: 'abonados' },
  { name: 'Gestión de Actas', icon: <FaBook />, path: '/Actas', section: 'Gestión', Permiso: 'actas' },
  { name: 'Revisión de Solicitudes', icon: <FaClipboardList />, path: '/Solicitudes', section: 'Gestión', Permiso: 'solicitudes' },
  { name: 'Gestión de Inventario', icon: <FaBoxes />, path: '/Inventario', section: 'Gestión', Permiso: 'inventario' },
  { name: 'Gestión de Usuarios', icon: <FaUsers />, path: '/Usuarios', section: 'Gestión', Permiso: 'usuarios' },
  { name: 'Gestión de Proveedores', icon: <FaTruck />, path: '/Proveedores', section: 'Gestión', Permiso: 'proveedores' },
  { name: 'Revisión de Quejas/Sugerencias/Reportes', icon: <MdOutlineReportGmailerrorred />, path: '/Contacto', section: 'Gestión', Permiso: 'contacto' },
  { name: 'Gestión de Calidad de Agua', icon: <FaHandHoldingWater />, path: '/CalidadAgua', section: 'Gestión', Permiso: 'calidadAgua' },

  // Subrutas de Usuarios (ocultas del dashboard)
  { name: 'Gestión de Roles', icon: <FaShieldAlt />, path: '/Usuarios/Roles', Permiso: 'usuarios', hidden: true },

  // Subrutas de Inventario (ocultas del dashboard)
  { name: 'Catálogo de Materiales', icon: <FaBoxes />, path: '/Inventario/Materiales', Permiso: 'inventario', hidden: true },
  { name: 'Categorías', icon: <FaBoxes />, path: '/Inventario/Categorias', Permiso: 'inventario', hidden: true },
  { name: 'Unidades de Medición', icon: <FaBoxes />, path: '/Inventario/UnidadesMedicion', Permiso: 'inventario', hidden: true },
  { name: 'Movimientos de Inventario', icon: <FaBoxes />, path: '/Inventario/Movimientos', Permiso: 'inventario', hidden: true },

  { name: 'Medidores', icon: <FaTachometerAlt />, path: '/Inventario/Materiales/Medidores', section: 'Gestión', Permiso: 'inventario', hidden: true },
 
  // Seguridad
  { name: 'Control de Auditoría', icon: <FaHistory />, path: '/Auditoria', section: 'Seguridad', Permiso: 'auditoria' },

  // Edición
  { name: 'Edición de Preguntas Frecuentes(FAQ)', icon: <FaRegQuestionCircle />, path: '/FAQ', section: 'Edición', Permiso: 'faq' },
  { name: 'Edición de Proyectos', icon: <FaEdit />, path: '/Proyectos', section: 'Edición', Permiso: 'proyectos' },
  { name: 'Edición de Imágenes', icon: <FaImage />, path: '/Imagenes', section: 'Edición', Permiso: 'imagenes' },

    // Ayuda
  { name: 'Manuales de Uso', icon: <GrHelpBook />, path: '/Manuales', section: 'Ayuda', Permiso: 'manuales' },

]
