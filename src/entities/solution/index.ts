export {
  useGetSolutionByIdQuery,
  useGetSolutionsInfiniteQuery,
  useUpdateSolutionByTeacherMutation,
  useUpdateSolutionByStudentMutation,
  useGetSolutionForStudentQuery,
} from './api/solution-api'

export type { IGetSolutionsQuery } from './model/types'

export type {
  TSolutionTeacherSchema,
  TSolutionStudentSchema,
} from './model/schemas'

export type {
  IUpdateSolutionByTeacherRequest,
  IUpdateSolutionByStudentRequest,
} from './model/types'

export {
  solutionTeacherSchema,
  solutionStudentSchema,
  TEACHER_VALID_STATUSES,
  STUDENT_VALID_STATUSES,
} from './model/schemas'

export { getSchemaByRole } from './lib/get-schema-by-role'
export { toFormValuesByRole } from './lib/to-form-values-by-role'
