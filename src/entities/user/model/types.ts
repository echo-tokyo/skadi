import { TProfile, TRole } from '@/shared/model'

export interface IUser {
  id: string
  profile?: TProfile
  role: TRole
  username: string
}

export type IUserResponse = IUser
