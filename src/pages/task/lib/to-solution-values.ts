import { TSolution } from '@/shared/model'
import { TSolutionTeacherSchema } from '@/widgets/task-card'

export const toSolutionValues = (
  solutionData: TSolution | undefined,
): TSolutionTeacherSchema => ({
  status: solutionData?.status.id?.toString() as TSolutionTeacherSchema['status'],
})
