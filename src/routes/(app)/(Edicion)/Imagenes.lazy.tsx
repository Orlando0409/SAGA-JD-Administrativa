import { createLazyFileRoute } from '@tanstack/react-router'
import ImagenesTable from '@/Modules/Imagenes/Components/ImagenesTable'

export const Route = createLazyFileRoute('/(app)/(Edicion)/Imagenes')({
  component: ImagenesTable,
})
