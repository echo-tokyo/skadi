import { TProfile } from '@/shared/model'

type TTask = {
  description?: string
  id: number
  teacher?: TProfile
  title: string
}

type TStatus = {
  id?: number
  name: string
}

type TSolution = {
  answer?: string
  grade?: string
  id: number
  status: TStatus
  student?: TProfile
  task: TTask
  updated_at: string
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
