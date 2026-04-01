import { TRole } from '@/shared/model'
import { TMode } from './types'
import { taskSchema } from './schemas'

export const useGetSchema = (mode: TMode, role: TRole) => {
  // при создании задания
  if (mode === 'create') return taskSchema
  // при редактировании задания
  if (mode === 'edit' && role === 'admin') return taskSchema

  // TODO: при редактировании решения админом, при редактировании решения студентом

  return taskSchema
}
