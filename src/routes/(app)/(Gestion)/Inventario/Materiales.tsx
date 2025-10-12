import CatalogoMateriales from '@/Modules/Inventario/components/Materiales/Catálogo de Materiales'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(app)/(Gestion)/Inventario/Materiales',
)({
  component: CatalogoMateriales,
})
