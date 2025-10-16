import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use base '/' for local/integrated; '/ExpenseTracker/' for GitHub Pages builds
  base: mode === 'pages' ? '/ExpenseTracker/' : '/',
  server: {
    proxy: {
      '/auth': 'http://localhost:4000',
    }
  }
}))
