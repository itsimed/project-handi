import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/~imed/', // Décommenter pour le déploiement sur serveur avec préfixe
  base: '/', // Utiliser '/' pour le développement local
})
