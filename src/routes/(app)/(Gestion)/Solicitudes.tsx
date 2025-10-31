import SolicitudesTable from '@/Modules/Solicitudes/components/SolicitudesTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Solicitudes')({
  component: SolicitudesTable,
})

