export type TRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export interface IUserDataResponse {
  id: string | null
  role: TRole | null
  username: string | null
}

export type IUserData = Required<IUserDataResponse>
