import { TRole } from '@/shared/model'
import { ClassManagement } from '@/widgets/class-management'
import { RoleManagement } from '@/widgets/role-management'
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
  // {
  //   name: 'Домашние задания',
  //   component: RoleManagement,
  //   role: 'teacher',
  // },
  // {
  //   name: 'Дашборд',
  //   component: RoleManagement,
  //   role: 'student',
  // },
]
