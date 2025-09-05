import { createFileRoute } from '@tanstack/react-router'
import Proveedores from '@/Modules/Proveedores/components/Proveedores'

export const Route = createFileRoute('/(app)/(Gestion)/Proveedores')({
  component: Proveedores,
})