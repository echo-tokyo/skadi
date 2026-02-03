export type TRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

type TContact = { email: string; phone: string }
export interface IUserResponse {
  id: string
  profile: {
    address: string
    contact: TContact
    extra: string | undefined
    fullname: string
    parent_contact: TContact | undefined
  }
  role: TRole
  username: string
}
