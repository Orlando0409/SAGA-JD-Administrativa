import { createLazyFileRoute } from '@tanstack/react-router'
import { InventarioWrapper } from '@/Modules/Inventario/components/Dashboard/InventarioWrapper'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Inventario/')({
  component: InventarioWrapper,
})
