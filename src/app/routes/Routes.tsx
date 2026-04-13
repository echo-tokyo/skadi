import Authorization from '@/pages/authorization'
import MainPage from '@/pages/main'
import { createBrowserRouter } from 'react-router'
import ProtectedRoute from '../layouts/ProtectedRoute'
import RoleRoute from '../layouts/RoleRoute'
import { PersonalArea } from '@/pages/personal-area'
import { Task } from '@/pages/task'
import { Dashboard } from '@/pages/dashboard'

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
      {
        element: <RoleRoute role='student' />,
        children: [
          {
            path: '/personal-area/dashboard',
            Component: Dashboard,
          },
        ],
      },
    ],
  },
])
