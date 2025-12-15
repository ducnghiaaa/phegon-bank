import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { LoadingProvider } from './contexts/LoadingContext'
import Loading from './components/Loading'
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
    <LoadingProvider>
      <AuthProvider>
        <LanguageProvider>
          <RouterProvider router={router} />
          <Loading />
        </LanguageProvider>
      </AuthProvider>
    </LoadingProvider>
  </StrictMode>,
)

