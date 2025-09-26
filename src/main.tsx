import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {  RouterProvider, createRouter } from '@tanstack/react-router'
import { AuthProvider } from './Modules/Auth/Context/AuthContext';
import { AlertContainer } from './Modules/Global/components/Alert/ui/AlertContainer';
import { AlertProvider } from './Modules/Global/context/AlertContext';

const router = createRouter({ routeTree })
const queryClient = new QueryClient()
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AlertProvider>
          <RouterProvider router={router} />
          <AlertContainer />
        </AlertProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
