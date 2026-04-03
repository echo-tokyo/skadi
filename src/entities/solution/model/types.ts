import {
  TPagination,
  TProfile,
  TSolution,
  TStatus,
  TTask,
} from '@/shared/model'

export interface IGetSolutionByIdResponse {
  other_students: TProfile[]
  solution: TSolution
}

export interface IGetSolutionsResponse {
  data: TSolution[]
  pagination: TPagination
}

export interface IUpdateSolutionByTeacherRequest {
  grade?: string
  status_id?: number
}

export interface IUpdateSolutionByTeacherResponse {
  answer?: string
  grade?: string
  id: number
  status: TStatus
  student?: TProfile
  task: TTask
  updated_at?: string
}

export interface IGetSolutionsQuery {
  archived?: boolean
  'per-page'?: number
  search?: string
}
