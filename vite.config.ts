import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter} from '@tanstack/router-vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(),
    tailwindcss(),
    tanstackRouter({ target: 'react'})
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }

          if (id.includes('/node_modules/@tanstack/')) return 'tanstack-vendor';
          if (id.includes('/node_modules/@radix-ui/')) return 'radix-vendor';
          if (id.includes('/node_modules/lucide-react/') || id.includes('/node_modules/react-icons/')) return 'icons-vendor';
          if (id.includes('/node_modules/zod/')) return 'validation-vendor';
          if (id.includes('/node_modules/date-fns/')) return 'date-vendor';

          if (
            id.includes('/node_modules/libphonenumber-js/') ||
            id.includes('/node_modules/react-phone-number-input/') ||
            id.includes('/node_modules/country-flag-icons/')
          ) {
            return 'phone-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
})
