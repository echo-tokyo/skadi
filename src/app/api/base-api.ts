import { initializeAuthActions } from '@/shared/api'
import { router } from '../routes/Routes'
import { store } from '../store/store'
import { clearUserData } from '@/entities/user'
import { toast } from 'sonner'

// FIXME: появляется 3 уведомления, если токен истекает
initializeAuthActions({
  onAuthFailure: () => {
    store.dispatch(clearUserData())
    router.navigate('/authorization', { replace: true })
    toast.error('Токен истён, перезайдите в аккаунт')
  },
})

export { baseApi } from '@/shared/api'
