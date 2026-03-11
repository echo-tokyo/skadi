import { useAppDispatch } from '@/shared/lib'
import { useLogoutMutation } from '../../api/auth-api'
import { clearUserData } from '@/entities/user'
import { logout as logoutActions } from '../slices/auth-slice'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/api'

export const useLogout = () => {
  const [logoutMutation, { isLoading, error }] = useLogoutMutation()
  const dispatch = useAppDispatch()

  const logout = async (): Promise<void> => {
    try {
      await logoutMutation().unwrap()
    } catch {
      toast.error(getErrorMessage(error))
    } finally {
      dispatch(logoutActions())
      dispatch(clearUserData())
    }
  }

  return { logout, isLoading }
}
