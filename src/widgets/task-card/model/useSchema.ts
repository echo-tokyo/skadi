import { TRole } from '@/shared/model'
import { TMode } from './types'
import { taskCreateSchema } from './schemas'

export const useGetSchema = (mode: TMode, _role: TRole) => {
  if (mode === 'create') return taskCreateSchema
  // if (role === 'student') return null
}
