import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Apply saved theme before first paint (no flash)
try {
  const saved = localStorage.getItem('xeditor_theme')
  document.documentElement.setAttribute('data-theme', saved === 'light' ? 'light' : 'dark')
} catch {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
