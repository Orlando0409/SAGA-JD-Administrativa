import AfiliadosTable from '@/Modules/Afiliados/components/AfiliadosTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Afiliados/')({
  component: AfiliadosTable,
})

