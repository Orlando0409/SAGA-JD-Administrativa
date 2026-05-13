import { createLazyFileRoute } from '@tanstack/react-router'
import Login from '../../../Modules/Auth/Components/Login'

export const Route = createLazyFileRoute('/(app)/(Auth)/Login')({
  component: Login,
})
