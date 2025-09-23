import { FaUserFriends, FaBook,FaHandHoldingWater, FaClipboardList, FaHistory, FaBoxes, FaUsers, FaTruck, FaRegQuestionCircle, FaEdit, FaImage } from "react-icons/fa";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { GrHelpBook } from "react-icons/gr";
export const modules = [
  // Gestión
  { name: 'Gestión De Abonados', icon: <FaUserFriends />, path: '/Abonados', section: 'Gestión', permiso: 'abonados' },
  { name: 'Gestión de Actas', icon: <FaBook />, path: '/Actas', section: 'Gestión', permiso: 'actas' },
  { name: 'Revisión de Solicitudes', icon: <FaClipboardList />, path: '/Solicitudes', section: 'Gestión', permiso: 'solicitudes' },
  { name: 'Gestión de Inventario', icon: <FaBoxes />, path: '/Inventario', section: 'Gestión', permiso: 'inventario' },
  { name: 'Gestión de Usuarios', icon: <FaUsers />, path: '/Usuarios', section: 'Gestión', permiso: 'usuarios' },
  { name: 'Gestión de Proveedores', icon: <FaTruck />, path: '/Proveedores', section: 'Gestión', permiso: 'proveedores' },
  { name: 'Revisión de Quejas/Sugerencias/Reportes', icon: <MdOutlineReportGmailerrorred />, path: '/Contacto', section: 'Gestión', permiso: 'contacto' },
  { name: 'Gestión de Calidad de Agua', icon: <FaHandHoldingWater />, path: '/CalidadAgua', section: 'Gestión', permiso: 'calidadAgua' },

  // Seguridad
  { name: 'Bitácora de Cambios', icon: <FaHistory />, path: '/Bitacora', section: 'Seguridad', permiso: 'bitacora' },

  // Edición
  { name: 'Edición de Preguntas Frecuentes(FAQ)', icon: <FaRegQuestionCircle />, path: '/FAQ', section: 'Edición', permiso: 'faq' },
  { name: 'Edición de Proyectos', icon: <FaEdit />, path: '/Proyectos', section: 'Edición', permiso: 'proyectos' },
  { name: 'Edición de Imágenes', icon: <FaImage />, path: '/Imagenes', section: 'Edición', permiso: 'imagenes' },

    // Ayuda
  { name: 'Manuales de Uso', icon: <GrHelpBook />, path: '/Manuales', section: 'Ayuda', permiso: 'manuales' },

]
