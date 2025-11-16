export {
  useSignInMutation,
  useLogoutMutation,
} from './api/auth-api'

export {
  setCredentials,
  setAccessToken,
  logout,
} from './model/auth-slice'

export { default as authReducer } from './model/auth-slice'

export type {
  ISignInFormData,
  IAuthResponse,
  IAuthState,
  TRole,
} from './model/types'

export { SignIn } from './ui/SignIn.tsx'
