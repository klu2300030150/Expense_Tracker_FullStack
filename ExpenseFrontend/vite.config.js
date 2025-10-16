import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For integrated Spring Boot deployment or local dev, use root path
  base: '/',
  server: {
    proxy: {
      '/auth': 'http://localhost:4000',
    }
  }
})
