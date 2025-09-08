import Bitacora from '@/Modules/Bitacora/components/Bitacora';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Seguridad)/Bitacora')({
  component: Bitacora,
})
