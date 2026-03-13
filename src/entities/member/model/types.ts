import { TClass, TProfile, TRole } from '@/shared/model'

type TPagination = { page: number; per_page: number }

export interface IMember {
  class?: TClass
  id: number
  // TODO: как profile может быть undefined?
  profile?: TProfile
  role: TRole
  username: string
}

export interface IUpdateMemberRequest {
  profile: TProfile
}

export interface ICreateMemberRequest {
  class_id?: number
  password: string
  profile: TProfile
  role: TRole
  username: string
}

export interface ICreateMemberResponse {
  class?: TClass
  id: number
  profile?: TProfile
  role: TRole
  username: string
}

export interface IMembersResponse {
  data: IMember[]
  pagination: TPagination
}

export interface IMembersRequest {
  free: boolean
  page: number
  perPage: number
  roles: TRole[]
}
