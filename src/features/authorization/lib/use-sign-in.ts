import { useAppDispatch } from '@/app/store/hooks'
import {
  IAuthResponse,
  ISignInFormData,
  setCredentials,
  useSignInMutation,
} from '@/features/authorization'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useSignIn = () => {
  const [signInMutation, { isLoading, error }] = useSignInMutation()
  const dispatch = useAppDispatch()

  const signIn = async (
    formData: ISignInFormData,
  ): Promise<IAuthResponse> => {
    try {
      const result = await signInMutation(formData).unwrap()

      dispatch(
        setCredentials({
          accessToken: result.accessToken,
          role: result.role,
        }),
      )

      return result
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login failed:', err)
      throw err
    }
  }

  return { signIn, isLoading, error }
}
