import { useAppDispatch } from '@/shared/lib/hooks'
import { useSignInMutation } from '../api/auth-api'
import { setCredentials } from '../model/auth-slice'
import { ISignInFormData } from '../model/types'
import { useNavigate } from 'react-router'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useSignIn = () => {
  const [signInMutation, { isLoading }] = useSignInMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const signIn = async (formData: ISignInFormData): Promise<void> => {
    try {
      const result = await signInMutation(formData).unwrap()

      dispatch(
        setCredentials({
          accessToken: result.token.access,
          role: result.user.role,
        }),
      )

      navigate('/personal-area')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login failed:', err)
    }
  }

  return { signIn, isLoading }
}
