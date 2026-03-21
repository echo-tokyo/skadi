import { TProfile } from '@/shared/model'
import { TClassSchema } from './class-form-schema'

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

export interface IClassFieldsRef {
  validate: () => Promise<boolean>
  getFieldsData: () => TClassSchema
  reset: () => void
}
