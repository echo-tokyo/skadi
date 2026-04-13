import { useUpdateSolutionByStudentMutation } from '@/entities/solution'
import { useMutationAction } from '@/shared/lib'

export const useStudentUpdateSolutionStatus = () => {
  return useMutationAction({
    mutation: useUpdateSolutionByStudentMutation(),
    prepare: ({ id, status_id }: { id: number; status_id: number }) => ({
      id,
      data: { status_id },
    }),
  })
}
