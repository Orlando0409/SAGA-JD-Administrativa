import { createLazyFileRoute } from '@tanstack/react-router'
import SolicitudesTable from '@/Modules/Solicitudes/components/SolicitudesTable'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Solicitudes')({
  component: SolicitudesTable,
})
