import { TSolution } from '@/shared/model'
import { solutionTeacherSchema, TSolutionTeacherSchema } from '../model/schemas'

const VALID_STATUSES = solutionTeacherSchema.shape.status.options

// FIXME: разрешить пустую строку
export const toTeacherFormValues = (
  solutionData: TSolution | undefined,
): TSolutionTeacherSchema => {
  const raw = solutionData?.status.id?.toString()
  const status = VALID_STATUSES.includes(
    raw as TSolutionTeacherSchema['status'],
  )
    ? (raw as TSolutionTeacherSchema['status'])
    : ''

  return {
    status,
  }
}
