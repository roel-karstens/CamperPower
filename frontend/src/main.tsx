import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import './brand.css'
import { App } from './App'
import { RouterProvider } from './lib/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
)
