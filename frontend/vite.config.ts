import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // Backend uses ?path= routing, rewrite /api/foo to /?path=api/foo
        rewrite: (path) => `/?path=${path.slice(1)}`,
      },
    },
  },
})
