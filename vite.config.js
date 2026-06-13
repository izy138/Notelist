import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'node:fs'
import { join } from 'node:path'

export default defineConfig({
  base: '/Notelist/',
  build: {
    outDir: 'docs',
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-404',
      closeBundle() {
        copyFileSync(join('docs', 'index.html'), join('docs', '404.html'))
      },
    },
  ],
})
