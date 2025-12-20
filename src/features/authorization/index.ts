export { useSignInMutation, useLogoutMutation } from './api/auth-api'

export {
  setCredentials,
  setAccessToken,
  logout,
} from './model/auth-slice'

export { default as authReducer } from './model/auth-slice'

export { useSignIn } from './lib/use-sign-in.ts'
export { useLogout } from './lib/use-logout.ts'

export type {
  ISignInFormData,
  IAuthResponse,
  IAuthState,
  ICredentials,
} from './model/types'

export { SignIn } from './ui/SignIn.tsx'
