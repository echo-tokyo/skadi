import { TRole, TSolution, TStatusId } from '@/shared/model'
import {
  solutionTeacherSchema,
  solutionStudentSchema,
  TSolutionTeacherSchema,
  TSolutionStudentSchema,
} from '../model/schemas'

const TEACHER_VALID_STATUSES = solutionTeacherSchema.shape.status.options
const STUDENT_VALID_STATUSES = solutionStudentSchema.shape.status.options

const DEFAULT_TEACHER_STATUS = TEACHER_VALID_STATUSES[0]
const DEFAULT_STUDENT_STATUS = STUDENT_VALID_STATUSES[0]

const resolveStatus = <T extends string>(
  raw: TStatusId | undefined,
  validOptions: readonly T[],
  fallback: T,
): T => {
  const normalized = raw?.toString() as T | undefined
  return normalized && validOptions.includes(normalized) ? normalized : fallback
}

const toTeacherFormValues = (
  solutionData: TSolution | undefined,
): TSolutionTeacherSchema => {
  const raw: TStatusId | undefined = solutionData?.status.id
  const status = resolveStatus(
    raw,
    TEACHER_VALID_STATUSES,
    DEFAULT_TEACHER_STATUS,
  )
  return {
    status,
  }
}

const toStudentFormValues = (
  solutionData: TSolution | undefined,
): TSolutionStudentSchema => {
  const raw = solutionData?.status.id
  const status = resolveStatus(
    raw,
    STUDENT_VALID_STATUSES,
    DEFAULT_STUDENT_STATUS,
  )
  return {
    status,
    answer: solutionData?.answer ?? '',
  }
}

export const toFormValuesByRole = (
  solutionData: TSolution | undefined,
  role: TRole,
): TSolutionTeacherSchema | TSolutionStudentSchema => {
  if (role === 'teacher') {
    return toTeacherFormValues(solutionData)
  }
  if (role === 'student') {
    return toStudentFormValues(solutionData)
  }
  throw new Error(`Unexpected role ${role}`)
}
