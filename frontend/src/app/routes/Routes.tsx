import { createBrowserRouter } from 'react-router'
import Authorization from '@/pages/authorization'
import MainPage from '@/pages/main'
import { PersonalArea } from '@/pages/personal-area'
import { Task } from '@/pages/task'
import { Dashboard } from '@/pages/dashboard'
import AppLayout from '../layouts/AppLayout'
import ProtectedRoute from '../layouts/ProtectedRoute'
import RoleRoute from '../layouts/RoleRoute'

const crumb = {
  home: { label: 'Главная', to: '/' },
  authorization: { label: 'Авторизация', to: '/authorization' },
  personalArea: { label: 'Личный кабинет', to: '/personal-area' },
  dashboard: { label: 'Канбан-доска', to: '/personal-area/dashboard' },
  task: { label: 'Задача' },
} as const

const studentRoutes = [
  {
    path: '/personal-area/dashboard',
    Component: Dashboard,
    handle: {
      breadcrumbs: [crumb.home, crumb.personalArea, { label: 'Канбан-доска' }],
    },
  },
  {
    path: '/personal-area/dashboard/solutions/:id',
    Component: Task,
    handle: {
      breadcrumbs: [
        crumb.home,
        crumb.personalArea,
        crumb.dashboard,
        crumb.task,
      ],
    },
  },
]

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        Component: MainPage,
      },
      {
        path: '/authorization',
        Component: Authorization,
        handle: { breadcrumbs: [crumb.home, crumb.authorization] },
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/personal-area',
            Component: PersonalArea,
            handle: {
              breadcrumbs: [crumb.home, { label: 'Личный кабинет' }],
            },
          },
          {
            path: '/personal-area/solutions/:id',
            Component: Task,
            handle: {
              breadcrumbs: [crumb.home, crumb.personalArea, crumb.task],
            },
          },
          {
            element: <RoleRoute role='student' />,
            children: studentRoutes,
          },
        ],
      },
    ],
  },
])
