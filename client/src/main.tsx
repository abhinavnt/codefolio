import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Providers } from "@/redux/provider"
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <Toaster richColors position="bottom-right"/>
    <App />
    </Providers>
  </StrictMode>,
)
