export type TRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | null

export interface ISignInFormData {
  login: string
  password: string
}

export interface IAuthResponse {
  accessToken: string
  role: TRole
}

export interface IRefreshResponse {
  accessToken: string
}

export interface IAuthState {
  accessToken: string | null
  isAuthenticated: boolean
  role: TRole
}
