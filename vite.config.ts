
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This polyfills process.env for the browser environment
    'process.env': {
      API_KEY: process.env.API_KEY || ''
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
