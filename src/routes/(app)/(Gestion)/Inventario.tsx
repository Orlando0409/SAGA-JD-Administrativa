import { InventarioWrapper } from '@/Modules/Inventario/components/Dashboard/InventarioWrapper'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Inventario')({
  component: InventarioWrapper,
})

