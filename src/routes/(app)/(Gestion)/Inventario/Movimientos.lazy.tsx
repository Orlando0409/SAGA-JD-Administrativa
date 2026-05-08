import { createLazyFileRoute } from '@tanstack/react-router'
import CatalogoMovimientos from '@/Modules/Inventario/components/Movimientos/CatalogoMovimientos'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Inventario/Movimientos')({
  component: CatalogoMovimientos,
})
