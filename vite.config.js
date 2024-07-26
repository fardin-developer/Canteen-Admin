import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {}, // Remove this if you don't need PostCSS
  },
  base: '/', // Set this if your app is hosted in a subdirectory, otherwise leave as '/'
  server: {
    host: "0.0.0.0",
  },
  build: {
    outDir: 'dist', // Vercel will use this folder to serve your files
  }
})
