import ManualesTable from '@/Modules/Manuales/Components/ManualTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Ayuda)/Manuales')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ManualesTable/>
}
  