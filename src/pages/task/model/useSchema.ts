import { TRole } from '@/shared/model'
import { solutionTeacherSchema } from '@/widgets/task-card'
import { solutionStudentSchema } from '@/widgets/task-card/model/schemas'

export const useGetSchema = (role: TRole) => {
  if (role === 'teacher') return solutionTeacherSchema
  return solutionStudentSchema
}
