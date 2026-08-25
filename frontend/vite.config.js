import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Only prefix asset URLs with /static/ for production builds (so Django's
  // WhiteNoise serves them correctly). The dev server must stay at the real
  // root '/' so React Router's routes (/, /login, /product/:slug, ...) match.
  base: command === 'build' ? '/static/' : '/',
  server: {
    port: 5173,
    host: true
  }
}))
