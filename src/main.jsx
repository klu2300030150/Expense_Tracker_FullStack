import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './styles/loading.css'
import './styles/auth.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
