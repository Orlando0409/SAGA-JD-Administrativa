import { createLazyFileRoute } from '@tanstack/react-router'
import CalidadAguaTable from '@/Modules/Calidad De Agua/components/CalidadAguaTable'

export const Route = createLazyFileRoute('/(app)/(Gestion)/CalidadAgua')({
  component: CalidadAguaTable,
})
