import { TClass, TProfile, TRole } from '@/shared/model'
import { TMemberFullSchema } from './member-fields-schema'

type TPagination = {
  page: number
  per_page: number
  pages: number
  total: number
}

export interface IMember {
  class?: TClass
  id: number
  profile: TProfile
  role: TRole
  username: string
}

export interface IUpdateMemberRequest {
  class_id?: number
  profile: TProfile
}

export interface ICreateMemberRequest {
  class_id?: number
  password: string
  profile: TProfile
  role: TRole
  username: string
}

export interface IMembersResponse {
  data: IMember[]
  pagination?: TPagination
}

export interface IMembersQuery {
  free?: boolean
  role?: TRole[]
  'per-page'?: number
  search?: string
}

export interface IMemberFieldsRef {
  validate: () => Promise<boolean>
  getFieldsData: () => TMemberFullSchema
  reset: () => void
}
