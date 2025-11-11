import { useAppDispatch } from '@/app/store/hooks'
import {
  logout as logoutAction,
  useLogoutMutation,
} from '@/features/authorization'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useLogout = () => {
  const [logoutMutation, { isLoading }] = useLogoutMutation()
  const dispatch = useAppDispatch()

  const logout = async (): Promise<void> => {
    try {
      await logoutMutation().unwrap()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Logout failed:', err)
    } finally {
      dispatch(logoutAction())
    }
  }

  return { logout, isLoading }
}
