import CatálogoMedidores from '@/Modules/Inventario/components/Medidores/CatálogoMedidores'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(app)/(Gestion)/Inventario/Materiales/Medidores',
)({
  component: CatálogoMedidores,
})
