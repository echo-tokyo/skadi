import Authorization from '@/pages/authorization'
import MainPage from '@/pages/main'
import { createBrowserRouter } from 'react-router'
import ProtectedRoute from '../layouts/ProtectedRoute'
import { PersonalArea } from '@/pages/personal-area'
import { Task } from '@/pages/task'

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
      {
        path: '/personal-area/solutions/:id',
        Component: Task,
      },
    ],
  },
])
