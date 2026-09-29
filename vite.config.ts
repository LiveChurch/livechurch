import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import yaml from '@modyfi/vite-plugin-yaml'

/**
 * Separates libraries and data (Bibles/harpa) from the app code, so that the update-server
 * release obfuscates only the app code (`vendor-*` and `data-*` chunks are left out).
 * Each data file becomes its own chunk (`data-acf`, `data-harpa`...) so that the
 * Bibles, imported on demand, are not dragged along with the static data.
 */
function manualChunk(id: string): string | undefined {
  if (id.includes('/node_modules/')) return 'vendor'
  if (id.includes('/src/core/data/')) return `data-${path.parse(id).name}`
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
    vue(),
    yaml(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // `release/` is left out: on Windows the watcher locks the folders and electron-builder
    // fails with EPERM when renaming `win-unpacked.tmp` if the dev server is open.
    watch: { ignored: ['**/release/**'] },
  },
  build: {
    rollupOptions: {
      output: { manualChunks: manualChunk },
    },
  },
})
