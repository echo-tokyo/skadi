import { TRole } from '@/shared/model'
import { ClassManagement } from '@/widgets/class-management'
import { RoleManagement } from '@/widgets/role-management'
import { SolutionManagement } from '@/widgets/solution-management'
import { TaskManagement } from '@/widgets/task-management'
import { FC } from 'react'

export interface ITabConfig {
  name: string
  component: FC
  role: TRole
}

export const TAB_CONFIG: ITabConfig[] = [
  {
    name: 'Менеджмент групп',
    component: ClassManagement,
    role: 'admin',
  },
  {
    name: 'Менеджмент ролей',
    component: RoleManagement,
    role: 'admin',
  },
  {
    name: 'Список заданий',
    component: TaskManagement,
    role: 'teacher',
  },
  {
    name: 'Список решений',
    component: SolutionManagement,
    role: 'teacher',
  },
  // {
  //   name: 'Дашборд',
  //   component: RoleManagement,
  //   role: 'student',
  // },
]
