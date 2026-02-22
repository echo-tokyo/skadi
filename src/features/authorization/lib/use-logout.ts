import { useAppDispatch } from '@/shared/lib'
import { useLogoutMutation } from '../api/auth-api'
import { logout as logoutActions } from '../model/auth-slice'
import { clearUserData } from '@/entities/user'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useLogout = () => {
  const [logoutMutation, { isLoading }] = useLogoutMutation()
  const dispatch = useAppDispatch()

  const logout = async (): Promise<void> => {
    try {
      await logoutMutation().unwrap()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Logout failed: ', err)
    } finally {
      dispatch(logoutActions())
      dispatch(clearUserData())
    }
  }

  return { logout, isLoading }
}
