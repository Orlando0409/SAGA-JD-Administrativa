import AbonadosTable from '@/Modules/Abonados/components/AbonadosTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Afiliados/')({
  component: AbonadosTable,
})

