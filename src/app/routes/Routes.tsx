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
        path: '/personal-area/tasks/new',
        Component: Task,
      },
      {
        path: '/personal-area/tasks/:id',
        Component: Task,
      },
    ],
  },
])
