import { TRole } from '../model'
import { SelectOption } from '../ui'

// Селекту не нужен admin
export const ROLE_OPTIONS: SelectOption[] = [
  { value: 'teacher', label: 'Преподаватель' },
  { value: 'student', label: 'Студент' },
]

export const ROLE_VALUES: TRole[] = ['teacher', 'student']
