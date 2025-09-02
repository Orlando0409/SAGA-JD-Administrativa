import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Edicion)/Imagenes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/(Edicion)/Imagenes"!</div>
}
