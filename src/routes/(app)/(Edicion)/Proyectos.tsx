import ProyectoTable from '@/Modules/Proyectos/components/ProyectoTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Edicion)/Proyectos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProyectoTable />;
}
