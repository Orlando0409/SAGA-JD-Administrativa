import { createLazyFileRoute } from '@tanstack/react-router'
import AfiliadosTable from '@/Modules/Afiliados/components/AfiliadosTable'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Afiliados/')({
  component: AfiliadosTable,
})
