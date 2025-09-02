import Unautorized from '@/Modules/Auth/Components/Unautorized'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Auth)/Unauthorized')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Unautorized/>
}
