import { TProfile, TRole } from '@/shared/types'

export interface IUser {
  id: string
  profile?: TProfile
  role: TRole
  username: string
}

export type IUserResponse = IUser
