// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envDir: '.',    // garante que a raíz do projeto é onde está o .env
  server: { port: 5173, strictPort: false },
  preview: { port: 4173 }
});
