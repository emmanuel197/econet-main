import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Import any "*.svg?react" as a React component. Figma exports colours as
    // `var(--stroke-0/--fill-0, <fallback>)`; map the monochrome fallbacks to
    // currentColor so icons inherit Tailwind text colour (text-brand etc.).
    // Non-monochrome fills (e.g. the notification bubble's #ff0e10) are left alone.
    svgr({
      include: '**/*.svg?react',
      svgrOptions: {
        replaceAttrValues: {
          'var(--stroke-0, white)': 'currentColor',
          'var(--stroke-0, black)': 'currentColor',
          'var(--stroke-0, #da1375)': 'currentColor',
          'var(--fill-0, white)': 'currentColor',
          'var(--fill-0, black)': 'currentColor',
        },
      },
    })
  ],
  build: {
    // deploy.yml syncs ./build/ to the server, so emit there (not Vite's default dist/)
    outDir: 'build',
    sourcemap: false,
    minify: 'esbuild'
  },
  base: '/',
  server: {
    port: 5173,
    strictPort: true, // fail loudly if an old server still holds the port
    open: false
  },
  preview: {
    port: 4173
  }
})
