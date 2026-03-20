import { TClass, TProfile, TRole } from '@/shared/model'

type TPagination = { page: number; perPage: number }

// TODO: как profile может быть undefined? после обновления бэка убрать все "?" у .profile
export interface IMember {
  class?: TClass
  id: number
  profile?: TProfile
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
  pagination: TPagination
}

export interface IMembersQuery {
  free: boolean
  roles: TRole[]
  perPage?: number
  search?: string
}
