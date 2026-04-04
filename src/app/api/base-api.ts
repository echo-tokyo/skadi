import { initializeAuthActions } from '@/shared/api'
import { router } from '../routes/Routes'
import { store } from '../store/store'
import { clearUserData } from '@/entities/user'
import { toast } from 'sonner'

initializeAuthActions({
  onAuthFailure: () => {
    store.dispatch(clearUserData())
    router.navigate('/authorization', { replace: true })
    toast.error('Требуется авторизация')
  },
})

export { baseApi } from '@/shared/api'
