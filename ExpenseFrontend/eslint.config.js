import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
// Flat config: compose base configs, then apply our project rules scoped to src

export default [
  // Ignore build artifacts and non-frontend folders
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/build/**',
      '**/target/**',
      '**/*.min.js',
      '**/SpringBootApp/**',
      '**/ExpenseAPI/**'
    ]
  },

  // Base JS recommendations
  js.configs.recommended,
  // React Hooks best practices
  reactHooks.configs['recommended-latest'],
  // Vite + React Fast Refresh rules
  reactRefresh.configs.vite,

  // Our project-specific overrides (scope to src)
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Don't fail CI for fast refresh guidance in non-component files
      'react-refresh/only-export-components': 'warn',
      // Avoid failing build for harmless empty blocks in try/catch
      'no-empty': 'warn'
    }
  }
]
