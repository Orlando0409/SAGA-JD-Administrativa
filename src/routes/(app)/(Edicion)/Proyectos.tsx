import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Edicion)/Proyectos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/(Edicion)/Proyectos"!</div>
}
