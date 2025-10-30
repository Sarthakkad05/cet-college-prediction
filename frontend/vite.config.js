import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy API calls to the Node backend during dev
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backend = 'http://localhost:5001';
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backend,
          changeOrigin: true
        }
      }
    }
  };
});


