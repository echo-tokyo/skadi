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

export { useSignIn } from './lib/use-sign-in'
export { useLogout } from './lib/use-logout'

export { SignIn } from './ui/SignIn.tsx'
