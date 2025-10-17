import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use base '/' for local/integrated; '/ExpenseTracker/' for GitHub Pages builds
  // Use a relative base for GitHub Pages to avoid broken asset URLs if the repo/name or path changes.
  // This makes the built index reference assets like './assets/...', which is robust for project pages.
  base: mode === 'pages' ? './' : '/',
  server: {
    // During development proxy API calls to the Spring Boot backend (default 8080)
    proxy: {
      '/auth': 'http://localhost:4000',
      '/api': 'http://localhost:4000',
    }
  }
}))
