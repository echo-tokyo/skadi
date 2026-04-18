import {
  IUpdateSolutionByStudentRequest,
  TSolutionStudentSchema,
  useUpdateSolutionByStudentMutation,
} from '@/entities/solution'
import { useMutationAction } from '@/shared/lib'
import { TStatusId } from '@/shared/model'

export const useStudentUpdateSolution = (id: number) => {
  return useMutationAction({
    mutation: useUpdateSolutionByStudentMutation(),
    prepare: (
      data: TSolutionStudentSchema,
    ): { id: number; data: IUpdateSolutionByStudentRequest } => ({
      id,
      data: {
        status_id: Number(data.status) as TStatusId,
        answer: data.answer,
      },
    }),
    successMessage: 'Решение обновлено',
  })
}
