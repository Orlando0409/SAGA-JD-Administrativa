import { createFileRoute } from '@tanstack/react-router'
import React from 'react';

export const Route = createFileRoute('/(app)/(Edicion)/Proyectos')({
  component: RouteComponent,
})

function RouteComponent() {
  const Proyecto = React.lazy(() => import('../../../Modules/Proyectos/components/Proyecto'));

  return (
    <React.Suspense fallback={<div>Cargando...</div>}>
      <Proyecto />
    </React.Suspense>
  );
}
