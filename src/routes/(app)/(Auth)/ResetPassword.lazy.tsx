import { createLazyFileRoute } from '@tanstack/react-router'
import ResetPassword from '../../../Modules/Auth/Components/ResetPassword'

export const Route = createLazyFileRoute('/(app)/(Auth)/ResetPassword')({
  component: ResetPassword,
})
