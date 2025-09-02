import Abonados from '@/Modules/Abonados/components/Abonados'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Abonados')({
  component: Abonados,
})

