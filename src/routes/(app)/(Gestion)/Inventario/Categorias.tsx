import CatalogoCategorias from '@/Modules/Inventario/components/Categorias/Catálogo de Categorias'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(app)/(Gestion)/Inventario/Categorias',
)({
  component: CatalogoCategorias,
})
