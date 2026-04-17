import { createBrowserRouter } from 'react-router'
import Authorization from '@/pages/authorization'
import MainPage from '@/pages/main'
import { PersonalArea } from '@/pages/personal-area'
import { Task } from '@/pages/task'
import { Dashboard } from '@/pages/dashboard'
import ProtectedRoute from '../layouts/ProtectedRoute'
import RoleRoute from '../layouts/RoleRoute'

const crumb = {
  home: { label: 'Главная', to: '/' },
  personalArea: { label: 'Личный кабинет', to: '/personal-area' },
  dashboard: { label: 'Дашборд', to: '/personal-area/dashboard' },
  task: { label: (p: { id?: string }) => `Задача ${p.id}` },
} as const

const teacherRoutes = [
  {
    path: '/personal-area/solutions/:id',
    Component: Task,
    handle: {
      breadcrumbs: [crumb.home, crumb.personalArea, crumb.task],
    },
  },
]

const studentRoutes = [
  {
    path: '/personal-area/dashboard',
    Component: Dashboard,
    handle: {
      breadcrumbs: [crumb.home, crumb.personalArea, { label: 'Дашборд' }],
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
        handle: {
          breadcrumbs: [crumb.home, { label: 'Личный кабинет' }],
        },
      },
      {
        element: <RoleRoute role='teacher' />,
        children: teacherRoutes,
      },
      {
        element: <RoleRoute role='student' />,
        children: studentRoutes,
      },
    ],
  },
])
