import { useUpdateSolutionByTeacherMutation } from '@/entities/solution'
import { IUpdateSolutionByTeacherRequest } from '@/entities/solution/model/types'
import { useMutationAction } from '@/shared/lib'
import { TSolutionTeacherSchema } from '@/widgets/task-card'

export const useUpdateTask = (id: number) => {
  return useMutationAction({
    mutation: useUpdateSolutionByTeacherMutation(),
    prepare: (
      data: TSolutionTeacherSchema,
    ): { id: number; data: IUpdateSolutionByTeacherRequest } => ({
      id,
      data: { status_id: Number(data.status) },
    }),
    successMessage: 'Решение обновлено',
  })
}
