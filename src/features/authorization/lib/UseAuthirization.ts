import { useAppDispatch } from '@/shared/lib/hooks'
import { useSignInMutation } from '../api/auth-api'
import { setCredentials } from '../model/auth-slice'
import { ISignInFormData } from '../model/types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAuthorization = () => {
  const [signInMutation] = useSignInMutation()
  const dispatch = useAppDispatch()

  const handleSignIn = async (
    formData: ISignInFormData,
  ): Promise<void> => {
    try {
      const result = await signInMutation(formData).unwrap()

      dispatch(
        setCredentials({
          accessToken: result.accessToken,
          role: result.role,
        }),
      )
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login failed:', err)
    }
  }

  return { handleSignIn }
}
