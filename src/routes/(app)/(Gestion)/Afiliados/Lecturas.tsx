import LecturaTable from '@/Modules/Lecturas/components/LecturaTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Afiliados/Lecturas')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LecturaTable />;
}
