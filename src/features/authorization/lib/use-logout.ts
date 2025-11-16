import { useAppDispatch } from '@/shared/lib/hooks'
import { useLogoutMutation } from '../api/auth-api'
import { logout as logoutActions } from '../model/auth-slice'

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
    }
  }

  return { logout, isLoading }
}
