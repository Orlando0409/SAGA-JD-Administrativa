import { createLazyFileRoute } from '@tanstack/react-router'
import ProyectoTable from '@/Modules/Proyectos/components/ProyectoTable'

export const Route = createLazyFileRoute('/(app)/(Edicion)/Proyectos')({
  component: ProyectoTable,
})
