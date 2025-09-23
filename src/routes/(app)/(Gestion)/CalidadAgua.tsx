import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Gestion)/CalidadAgua')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/(Gestion)/CalidadAgua"!</div>
}
