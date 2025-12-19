export type TRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | null

export interface ISignInFormData {
  username: string
  password: string
}

export interface IAuthResponse {
  token: {
    access: string
  }
  user: {
    id: string
    role: TRole
    username: string
  }
}

export interface IRefreshResponse {
  accessToken: string
}

export interface IAuthState {
  accessToken: string | null
  isAuthenticated: boolean
  role: TRole
}
