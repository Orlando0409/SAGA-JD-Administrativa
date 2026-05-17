import { createLazyFileRoute } from '@tanstack/react-router'
import ActasTable from '@/Modules/Actas/components/ActasTable'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Actas')({
  component: ActasTable,
})
