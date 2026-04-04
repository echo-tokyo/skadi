export {
  useGetSolutionByIdQuery,
  useGetSolutionsInfiniteQuery,
  useUpdateSolutionByTeacherMutation,
  useUpdateSolutionByStudentMutation,
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

export { solutionTeacherSchema, solutionStudentSchema } from './model/schemas'

export { getSchemaByRole } from './lib/get-schema-by-role'
export { toFormValuesByRole } from './lib/to-form-values-by-role'
