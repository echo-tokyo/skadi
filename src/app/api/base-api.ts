import { initializeAuthActions } from '@/shared/api'
import { setAccessToken, logout } from '@/features/authorization'

initializeAuthActions({
  onTokenRefresh: setAccessToken,
  onAuthFailure: logout,
})

export { baseApi } from '@/shared/api'
