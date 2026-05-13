import { createLazyFileRoute } from '@tanstack/react-router'
import Usuarios from '@/Modules/Usuarios/Components/Usuarios'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Usuarios/')({
  component: Usuarios,
})
