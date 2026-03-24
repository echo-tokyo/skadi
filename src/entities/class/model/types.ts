import { TProfile } from '@/shared/model'
import { TClassSchema } from './class-form-schema'

type TClassPagination = {
  page: number
  perPage: number
}

export interface IClassRequest {
  name: string
  schedule: string
  students: number[]
  teacher_id: number
}

export interface IClass {
  id: number
  name: string
  schedule?: string
  students?: TProfile[]
  teacher?: TProfile
}

export interface IClassResponse {
  data: IClass[]
  pagination?: TClassPagination
}

// TODO: должно быть больше query параметров после обновления бэка
export interface IClassQuery {
  perPage: number
}

export interface IClassFieldsRef {
  validate: () => Promise<boolean>
  getFieldsData: () => TClassSchema
  reset: () => void
}
