
import CalidadAguaTable from '@/Modules/Calidad De Agua/components/CalidadAguaTable';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/(Gestion)/CalidadAgua')({
  component: CalidadAguaTable, 
});