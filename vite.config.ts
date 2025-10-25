import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@/shared': '/src/shared',
      '@/features': '/src/features',
      '@/pages': '/src/pages',
      '@/app': '/src/app',
    },
  },
})
