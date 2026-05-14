import { createLazyFileRoute } from '@tanstack/react-router'
import CatálogoMedidores from '@/Modules/Inventario/components/Medidores/CatálogoMedidores'

export const Route = createLazyFileRoute('/(app)/(Gestion)/Inventario/Materiales/Medidores')({
  component: CatálogoMedidores,
})
