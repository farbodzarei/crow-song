import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
// The standalone previews (Lotus, Crow Head experiments) are DEV-ONLY pages:
// they stay reachable via `npm run dev` (/lotus.html, /crowhead*.html) but are
// excluded from the production build so experiments never ship to the live
// site (crowheadgl alone is a ~530 kB chunk).
export default defineConfig(({ command }) => ({
  plugins: [react()],
  build: {
    rollupOptions: {
      input:
        command === 'build'
          ? { main: resolve(__dirname, 'index.html') }
          : {
              main: resolve(__dirname, 'index.html'),
              lotus: resolve(__dirname, 'lotus.html'),
              crowhead: resolve(__dirname, 'crowhead.html'),
              crowhead3d: resolve(__dirname, 'crowhead3d.html'),
              crowheadgl: resolve(__dirname, 'crowheadgl.html'),
            },
    },
  },
}))
