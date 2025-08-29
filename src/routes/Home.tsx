import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from '../Modules/Global/Layout/HomeLayout'
import Modulos from '../Modules/Global/components/DashboardGlobal/Modulos'

export const Route = createFileRoute('/Home')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <HomeLayout>
      {() => (
        <Modulos />
      )}
    </HomeLayout>
  )
}