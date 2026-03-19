import { TProfile } from '@/shared/model'

export interface ICreateClassRequest {
  name: string
  schedule: string
  students: number[]
  teacherId: number
}

export interface IClass {
  id: number
  name: string
  schedule?: string
  students?: TProfile[]
  teacher?: TProfile
}
