import { TPagination, TSolution, TTask } from '@/shared/model'
import { TTaskSchema } from './schema'

export interface ITaskFieldsRef {
  validate: () => Promise<boolean>
  getFieldsData: () => TTaskSchema
  reset: () => void
}

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

export interface IGetTasksResponse {
  data: TTask[]
  pagination?: TPagination
}

export interface IGetTasksQuery {
  'per-page'?: number
  search?: string
}

export interface IUpdateTaskRequest {
  id: number
  classes?: number[]
  description: string
  students?: number[]
  title: string
}

export interface IUpdateTaskResponse {
  task: TTask
}
