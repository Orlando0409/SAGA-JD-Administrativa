import ImagenesTable from '@/Modules/EdiImagen/Components/EdiImagenTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Edicion)/Imagenes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ImagenesTable />;
}
