import { TProfile, TRole } from '@/shared/types'

export interface IMember {
  id: number
  profile?: TProfile
  role: TRole
  username: string
}

export interface IMemberCreateRequest {
  password: string
  profile: TProfile
  role: TRole
  username: string
}

// TODO: роль не передается ?
export interface IMemberUpdateRequest {
  profile: TProfile
}

export type IMemberResponse = IMember
