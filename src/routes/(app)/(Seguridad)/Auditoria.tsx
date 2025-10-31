import CatálogoAuditorias from '@/Modules/Bitacora/components/CatálogoAuditorias';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Seguridad)/Auditoria')({
  component: CatálogoAuditorias,
})
