import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/sora'
import '@fontsource-variable/source-sans-3'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './index.css'
import { App } from './App'
import { RouterProvider } from './lib/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
)
