import { createFileRoute } from '@tanstack/react-router'
import Modulos from '../Modules/Global/components/DashboardGlobal/Modulos'

export const Route = createFileRoute('/Home')({
  component: Modulos, 
})