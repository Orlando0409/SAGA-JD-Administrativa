import ContactoTable from '@/Modules/QuejasSugerenciasReportes/components/ContactoTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/Contacto')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ContactoTable />;
}
