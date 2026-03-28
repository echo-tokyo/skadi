import { useAppDispatch } from '@/shared/lib'
import { useLogoutMutation } from '../../api/auth-api'
import { clearUserData } from '@/entities/user'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/api'

export const useLogout = () => {
  const [logoutMutation, { isLoading }] = useLogoutMutation()
  const dispatch = useAppDispatch()

  const logout = async (): Promise<void> => {
    try {
      await logoutMutation().unwrap()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      dispatch(clearUserData())
    }
  }

  return { logout, isLoading }
}
