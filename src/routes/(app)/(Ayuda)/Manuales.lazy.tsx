import { createLazyFileRoute } from '@tanstack/react-router'
import Manuales from '@/Modules/Manuales/Components/Manual'

export const Route = createLazyFileRoute('/(app)/(Ayuda)/Manuales')({
  component: Manuales,
})
