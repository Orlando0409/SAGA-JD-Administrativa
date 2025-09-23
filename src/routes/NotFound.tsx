import NotFound from '@/Modules/Auth/Components/NotFound';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/NotFound')({
  component: NotFound,
});