import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, './src/shared'),
      },
    },
    server:
      mode === 'development'
        ? {
            proxy: {
              '/scanner': {
                target: env.VITE_API_BASE,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/scanner/, '/scanner'),
              },
            },
          }
        : undefined,
  };
});
