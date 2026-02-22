export type TRole = 'admin' | 'teacher' | 'student'

type TContact = { email: string; phone: string }

export type TProfile = {
  address: string
  contact: TContact
  extra?: string
  fullname: string
  parentContact?: TContact
}
