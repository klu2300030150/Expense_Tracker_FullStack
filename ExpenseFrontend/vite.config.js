import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages deployment, use repo name as base
  // For local development or custom domain, change to '/'
  base: process.env.NODE_ENV === 'production' ? '/ExpenseTracker/' : '/',
})
