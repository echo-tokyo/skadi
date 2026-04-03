export {
  useGetSolutionByIdQuery,
  useGetSolutionsInfiniteQuery,
  useUpdateSolutionByTeacherMutation,
} from './api/solution-api'

export type { IGetSolutionsQuery } from './model/types'

export type {
  TSolutionTeacherSchema,
  TSolutionStudentSchema,
} from './model/schemas'

export type { IUpdateSolutionByTeacherRequest } from './model/types'

export { solutionTeacherSchema, solutionStudentSchema } from './model/schemas'

export { getSchemaByRole } from './lib/get-schema-by-role'
export { toTeacherFormValues } from './lib/to-teacher-form-values'
