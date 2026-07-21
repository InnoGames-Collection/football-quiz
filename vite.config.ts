import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          babylon: ['@babylonjs/core'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
});
