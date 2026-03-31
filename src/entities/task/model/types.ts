import { TPagination, TSolution, TTask } from '@/shared/model'

export interface ICreateTaskRequest {
  classes?: number[]
  description: string
  students?: number[]
  title: string
}

export interface ICreateTaskResponse {
  solutions?: TSolution[]
  task: TTask
}

export interface IGetTaskResponse {
  data: TTask[]
  pagination?: TPagination
}

export interface IGetTaskQuery {
  'per-page'?: number
  search?: string
}
