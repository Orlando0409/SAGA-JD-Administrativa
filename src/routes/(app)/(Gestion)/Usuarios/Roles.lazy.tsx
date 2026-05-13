import { createLazyFileRoute } from '@tanstack/react-router'
import Roles from '@/Modules/Roles/Components/RolesTable'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Usuarios/Roles')({
  component: Roles,
})
