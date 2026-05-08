import { createLazyFileRoute } from '@tanstack/react-router'
import Unautorized from '@/Modules/Auth/Components/Unautorized'

export const Route = createLazyFileRoute('/(app)/(Auth)/Unauthorized')({
  component: Unautorized,
})
