import Proveedores from '@/Modules/Proveedores/Components/Proveedores'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Proveedores')({
  component: Proveedores,
})


