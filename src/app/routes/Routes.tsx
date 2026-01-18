import Authorization from '@/pages/authorization'
import MainPage from '@/pages/main'
import PersonalArea from '@/pages/personal-area'
import { createBrowserRouter } from 'react-router'
import ProtectedRoute from '../layouts/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainPage,
  },
  {
    path: '/authorization',
    Component: Authorization,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/personal-area',
        Component: PersonalArea,
      },
    ],
  },
])
