import  NewPassword from '../../Modules/Auth/Components/NewPassword'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(Auth)/NewPassword')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NewPassword />
}
