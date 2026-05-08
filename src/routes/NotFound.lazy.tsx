import { createLazyFileRoute } from '@tanstack/react-router'
import NotFound from '@/Modules/Auth/Components/NotFound'

export const Route = createLazyFileRoute('/NotFound')({
  component: NotFound,
})
