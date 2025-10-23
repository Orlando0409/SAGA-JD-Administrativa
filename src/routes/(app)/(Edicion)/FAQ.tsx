import FAQTable from '@/Modules/PreguntasFrecuentes/components/FAQTable';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(Edicion)/FAQ')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FAQTable />;
}
