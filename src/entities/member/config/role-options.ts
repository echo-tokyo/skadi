import { TRole } from '@/shared/model'
import { SelectOption } from '@/shared/ui'

export const ROLE_OPTIONS: SelectOption[] = [
  { value: 'teacher', label: 'Преподаватель' },
  { value: 'student', label: 'Студент' },
]

export const ROLES: TRole[] = ['admin', 'teacher', 'student']
