import Manuales from '@/Modules/Manuales/Components/Manual'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Ayuda)/Manuales')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Manuales/>
}
  