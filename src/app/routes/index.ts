import Authorization from '@/pages/authorization'
import MainPage from '@/pages/main'
import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainPage,
  },
  {
    path: '/authorization',
    Component: Authorization,
  },
])
