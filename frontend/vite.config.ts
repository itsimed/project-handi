import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // En développement: racine '/', en production: '/~imed/'
  base: mode === 'production' ? '/~imed/' : '/',
}))
