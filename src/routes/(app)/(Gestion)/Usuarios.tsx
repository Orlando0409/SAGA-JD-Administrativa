import { createFileRoute } from '@tanstack/react-router'
import Usuarios from '@/Modules/Usuarios/Components/Usuarios'

export const Route = createFileRoute('/(app)/(Gestion)/Usuarios')({
  component: Usuarios, 
})