import { createFileRoute } from '@tanstack/react-router'
import  ForgotPassword from '../../Modules/Auth/Components/ForgotPassword'

export const Route = createFileRoute('/(Auth)/ForgotPassword')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ForgotPassword />
}
