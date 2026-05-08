import { createLazyFileRoute } from '@tanstack/react-router'
import ContactoTable from '@/Modules/QuejasSugerenciasReportes/components/ContactoTable'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Contacto')({
  component: ContactoTable,
})
