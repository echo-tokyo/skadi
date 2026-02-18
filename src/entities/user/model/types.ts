export type TRole = 'admin' | 'teacher' | 'student'

type TContact = { email: string; phone: string }

type TProfile = {
  address: string
  contact: TContact
  extra?: string
  fullname: string
  parentContact: TContact
}
export interface IUser {
  id: string
  profile: TProfile
  role: TRole
  username: string
}

export type IUserResponse = IUser
