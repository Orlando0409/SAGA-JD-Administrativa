import Inventario from '@/Modules/Inventario/components/Inventario'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Inventario')({
  component: Inventario,
})

