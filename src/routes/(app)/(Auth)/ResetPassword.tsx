import ResetPassword from '../../../Modules/Auth/Components/ResetPassword';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Auth)/ResetPassword')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ResetPassword />;
}
