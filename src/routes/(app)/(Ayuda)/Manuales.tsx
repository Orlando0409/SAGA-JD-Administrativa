import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Ayuda)/Manuales')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/(Ayuda)/Manuales"!</div>
}
