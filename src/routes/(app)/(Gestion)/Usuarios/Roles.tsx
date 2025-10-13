import Roles from '@/Modules/Roles/Components/RolesTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Usuarios/Roles')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Roles />
}
