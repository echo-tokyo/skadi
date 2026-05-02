import {
  IUpdateSolutionByTeacherRequest,
  TSolutionTeacherSchema,
  useUpdateSolutionByTeacherMutation,
} from '@/entities/solution'
import { useMutationAction } from '@/shared/lib'

export const useTeacherUpdateSolution = (id: number) => {
  return useMutationAction({
    mutation: useUpdateSolutionByTeacherMutation(),
    prepare: (
      data: TSolutionTeacherSchema,
    ): { id: number; data: IUpdateSolutionByTeacherRequest } => ({
      id,
      data: {
        status_id: Number(data.status),
        grade: data.status === 4 ? data.grade : undefined,
      },
    }),
    successMessage: 'Решение обновлено',
  })
}
