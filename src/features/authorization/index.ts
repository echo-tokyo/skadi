export { useSignInMutation, useLogoutMutation } from './api/auth-api'

export {
  setCredentials,
  logout,
  setAccessToken,
} from './model/auth-slice'

export { default as authReducer } from './model/auth-slice'

export { useSignIn } from './lib/use-sign-in.ts'
export { useLogout } from './lib/use-logout.ts'

export type {
  ISignInFormData,
  IAuthResponse,
  IRefreshResponse,
  IAuthState,
  ICredentials,
} from './model/types'

export { SignIn } from './ui/SignIn.tsx'
