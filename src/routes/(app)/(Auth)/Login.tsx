import { createFileRoute } from '@tanstack/react-router'
import Login from '../../../Modules/Auth/Components/Login';

export const Route = createFileRoute('/(app)/(Auth)/Login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Login />;
}