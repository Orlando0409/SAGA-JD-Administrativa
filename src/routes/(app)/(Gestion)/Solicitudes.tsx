import Solicitudes from '@/Modules/Solicitudes/components/Solicitudes';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Solicitudes')({
  component: Solicitudes,
})

