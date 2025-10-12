import CatalogoMovimientos from '@/Modules/Inventario/components/Movimientos/CatalogoMovimientos'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(app)/(Gestion)/Inventario/Movimientos',
)({
  component: CatalogoMovimientos,
})
