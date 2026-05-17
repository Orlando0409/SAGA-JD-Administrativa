import { createLazyFileRoute } from '@tanstack/react-router'
import CatalogoMateriales from '@/Modules/Inventario/components/Materiales/Catálogo de Materiales'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Inventario/Materiales/')({
  component: CatalogoMateriales,
})
