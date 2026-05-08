import { createLazyFileRoute } from '@tanstack/react-router'
import CatalogoUnidadesMedicion from '@/Modules/Inventario/components/UnidadesMedicion/Catálogo de Unidades de medicion'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Inventario/UnidadesMedicion')({
  component: CatalogoUnidadesMedicion,
})
