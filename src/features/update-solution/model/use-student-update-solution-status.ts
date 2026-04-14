import { useUpdateSolutionByStudentMutation } from '@/entities/solution'
import { useMutationAction } from '@/shared/lib'
import { TStatusId } from '@/shared/model'

export const useStudentUpdateSolutionStatus = () => {
  return useMutationAction({
    mutation: useUpdateSolutionByStudentMutation(),
    prepare: ({ id, status_id }: { id: number; status_id: TStatusId }) => ({
      id,
      data: { status_id },
    }),
  })
}
