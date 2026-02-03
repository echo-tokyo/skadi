import { TRole } from '@/entities/user'

export interface ISignInFormData {
  username: string
  password: string
}

export interface IAuthResponse {
  user: {
    id: string
    role: TRole
    username: string
  }
}

export interface IAuthState {
  isAuthenticated: boolean
}
