export type TRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | null

export interface ISignInFormData {
  login: string
  password: string
}

export interface IAuthResponse {
  token: string
  role: TRole
}

export interface IAuthState {
  token: string | null
  isAuthenticated: boolean
  role: TRole
}
