import { createLazyFileRoute } from '@tanstack/react-router'
import FAQTable from '@/Modules/PreguntasFrecuentes/components/FAQTable'

export const Route = createLazyFileRoute('/(app)/(Edicion)/FAQ')({
  component: FAQTable,
})
