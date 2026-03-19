import { initializeAuthActions } from '@/shared/api'
import { router } from '../routes/Routes'
import { store } from '../store/store'
import { clearUserData } from '@/entities/user'

initializeAuthActions({
  onAuthFailure: () => {
    store.dispatch(clearUserData())
    router.navigate('/authorization', { replace: true })
  },
})

export { baseApi } from '@/shared/api'
