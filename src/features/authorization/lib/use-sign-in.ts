import { useAppDispatch } from '@/app/store/hooks'
import {
  IAuthResponse,
  ISignInFormData,
  setCredentials,
  useSignInMutation,
} from '@/features/authorization'

// eslint-disable-next-line
export const useSignIn = () => {
  const [signInMutation, { isLoading, error }] = useSignInMutation()
  const dispatch = useAppDispatch()

  const signIn = async (formData: ISignInFormData): Promise<IAuthResponse> => {
    try {
      const result = await signInMutation(formData).unwrap()
      dispatch(
        setCredentials({
          token: result.token,
          role: result.role,
        }),
      )

      return result
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    }
  }

  return { signIn, isLoading, error }
}
