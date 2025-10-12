import CatalogoUnidadesMedicion from '@/Modules/Inventario/components/UnidadesMedicion/Catálogo de Unidades de medicion'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Inventario/UnidadesMedicion')({
  component: CatalogoUnidadesMedicion,
})
