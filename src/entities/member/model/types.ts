import { TClass, TProfile, TRole } from '@/shared/model'

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
  classId?: number
  profile: TProfile
}

export interface ICreateMemberRequest {
  classId?: number
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
  free: boolean
  role: TRole[]
  'per-page'?: number
  search?: string
}
