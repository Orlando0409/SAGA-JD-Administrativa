import { createLazyFileRoute } from '@tanstack/react-router'
import CatalogoCategorias from '@/Modules/Inventario/components/Categorias/Catálogo de Categorias'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Inventario/Categorias')({
  component: CatalogoCategorias,
})
