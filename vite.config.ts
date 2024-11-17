import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Définit le chemin de base pour tous les assets
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});