import { TRole } from '@/shared/types'

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

export interface IAuthState {
  accessToken: string | null
  isAuthenticated: boolean
}

export interface ICredentials {
  accessToken: string
}
