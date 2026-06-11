import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base = nome do repo no GitHub Pages (thauanalbuquerque.github.io/luce-onboarding-app/)
export default defineConfig({
  base: '/luce-onboarding-app/',
  plugins: [react()],
})
