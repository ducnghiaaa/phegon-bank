import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import router from './routes'
import './index.css'

// Khởi tạo theme từ localStorage
const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.classList.add(savedTheme)

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </StrictMode>,
)

