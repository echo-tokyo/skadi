import { SelectOption } from '../ui'

// Поля для селекта, admin не нужен
export const ROLE_OPTIONS: SelectOption[] = [
  { value: 'teacher', label: 'Преподаватель' },
  { value: 'student', label: 'Студент' },
]

export const ROLES = ['admin', 'teacher', 'student'] as const
