import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Multi-page: the main site + standalone previews (Lotus, Crow Head)
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        lotus: resolve(__dirname, 'lotus.html'),
        crowhead: resolve(__dirname, 'crowhead.html'),
      },
    },
  },
})
