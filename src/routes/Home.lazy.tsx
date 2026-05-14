import { createLazyFileRoute } from '@tanstack/react-router'
import Modulos from '../Modules/Global/components/DashboardGlobal/Modulos'

export const Route = createLazyFileRoute('/Home')({
  component: Modulos,
})
