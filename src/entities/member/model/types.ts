import { TProfile, TRole } from '@/shared/model'

export type TClass = {
  id: number
  name: string
  schedule?: string
  students?: TProfile[]
  teacher?: TProfile
}
export interface IMember {
  id: number
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
