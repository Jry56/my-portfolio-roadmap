import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    // Never ship source maps to production - they leak original source
    // and inflate the deploy artifact for no end-user benefit.
    sourcemap: mode !== 'production',
    // Fail the build (rather than silently shipping) if a bundle balloons,
    // so oversized chunks get noticed before they ship.
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        // Split heavy/rarely-changing vendor code into its own cacheable
        // chunk instead of one monolithic bundle.
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          realtime: ['socket.io-client'],
        },
      },
    },
  },
}));
