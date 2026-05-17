import { createLazyFileRoute } from '@tanstack/react-router'
import ForgotPassword from '../../../Modules/Auth/Components/ForgotPassword'

export const Route = createLazyFileRoute('/(app)/(Auth)/ForgotPassword')({
  component: ForgotPassword,
})
