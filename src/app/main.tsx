import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainPage from '../pages/main'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainPage />
  </StrictMode>,
)
