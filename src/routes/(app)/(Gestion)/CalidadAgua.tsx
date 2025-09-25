import CalidadAgua from '@/Modules/Calidad De Agua/components/CalidadAgua';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/(Gestion)/CalidadAgua')({
  component: CalidadAgua, // Directamente el componente
});