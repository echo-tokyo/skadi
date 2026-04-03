import { TSolution } from '@/shared/model'
import { TDisplayValues } from '@/widgets/task-card'

export const toTaskValues = (
  solutionData: TSolution | undefined,
): TDisplayValues => ({
  description: solutionData?.task.description ?? '',
  student: solutionData?.student?.fullname ?? '',
  title: solutionData?.task.title ?? '',
  answer: solutionData?.answer ?? '',
})
