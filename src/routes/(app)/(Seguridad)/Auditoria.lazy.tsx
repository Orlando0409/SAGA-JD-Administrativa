import { createLazyFileRoute } from '@tanstack/react-router'
import CatálogoAuditorias from '@/Modules/Auditoria/components/CatálogoAuditorias'

export const Route = createLazyFileRoute('/(app)/(Seguridad)/Auditoria')({
  component: CatálogoAuditorias,
})
