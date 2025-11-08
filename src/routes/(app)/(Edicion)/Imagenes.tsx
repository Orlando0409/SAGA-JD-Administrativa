import ImagenesTable from '@/Modules/Imagenes/Components/ImagenesTable';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Edicion)/Imagenes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ImagenesTable />;
}
