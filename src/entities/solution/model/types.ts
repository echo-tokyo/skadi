import { TPagination, TProfile, TSolution } from '@/shared/model'

export interface IGetSolutionByIdResponse {
  other_students: TProfile[]
  solution: TSolution
}

export interface IGetSolutionsResponse {
  data: TSolution[]
  pagination: TPagination
}

export interface IGetSolutionsQuery {
  archived?: boolean
  'per-page'?: number
  search?: string
}
