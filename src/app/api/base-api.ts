import { initializeAuthActions } from '@/shared/api'
import { logout } from '@/features/authorization'
import { router } from '../routes/Routes'
import { store } from '../store/store'

initializeAuthActions({
  onAuthFailure: () => {
    store.dispatch(logout())
    router.navigate('/authorization', { replace: true })
  },
})

export { baseApi } from '@/shared/api'
