import { TRole, TStatusId } from '../model'
import { SelectOption } from '../ui'

// Селекту не нужен admin
export const ROLE_OPTIONS: SelectOption[] = [
  { value: 'teacher', label: 'Преподаватель' },
  { value: 'student', label: 'Студент' },
]

export const ROLE_VALUES: TRole[] = ['teacher', 'student']

export const STATUS_OPTIONS: SelectOption<TStatusId>[] = [
  { value: 1, label: 'Бэклог' },
  { value: 2, label: 'В работе' },
  { value: 3, label: 'На проверке' },
  { value: 4, label: 'Проверено' },
]
