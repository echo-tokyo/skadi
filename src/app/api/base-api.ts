import { initializeAuthActions } from '@/shared/api'
import { logout } from '@/features/authorization'

initializeAuthActions({
  onAuthFailure: logout,
})

export { baseApi } from '@/shared/api'
