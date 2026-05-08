import { createLazyFileRoute } from '@tanstack/react-router'
import LecturaTable from '@/Modules/Lecturas/components/LecturaTable'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Afiliados/Lecturas')({
  component: LecturaTable,
})
