import ProveedoresTable from '@/Modules/Proveedores/Components/ProveedoresTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Proveedores')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProveedoresTable />
}
