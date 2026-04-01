import { TRole } from '@/shared/model'
import { TMode } from './types'
import { solutionTeacherSchema, taskSchema } from './schemas'

export const useGetSchema = (
  mode: TMode,
  role: TRole,
  page: 'solution' | 'task',
) => {
  // при создании задания
  if (mode === 'create') return taskSchema
  // при редактировании задания
  if (mode === 'edit' && role === 'admin' && page === 'task') return taskSchema
  // при редактировании решения админом
  if (role === 'teacher' && page === 'solution') return solutionTeacherSchema
  // TODO: при редактировании решения студентом
  return taskSchema
}
