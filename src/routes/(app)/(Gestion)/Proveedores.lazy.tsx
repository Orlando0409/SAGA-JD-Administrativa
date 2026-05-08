import { createLazyFileRoute } from '@tanstack/react-router'
import ProveedoresTable from '@/Modules/Proveedores/Components/ProveedoresTable'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Proveedores')({
  component: ProveedoresTable,
})
