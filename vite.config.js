import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages under https://<user>.github.io/ExpenseTracker/
  base: '/ExpenseTracker/',
})
