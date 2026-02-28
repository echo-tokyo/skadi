import { useSignInMutation } from '../../api/auth-api'
import { setCredentials } from '../slices/auth-slice'
import { useNavigate } from 'react-router'
import { setUserData } from '@/entities/user'
import { useAppDispatch } from '@/shared/lib'
import { ISignInRequest } from '../types'

export const useSignIn = () => {
  const [signInMutation, { isLoading }] = useSignInMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const signIn = async (formData: ISignInRequest): Promise<void> => {
    try {
      const result = await signInMutation(formData).unwrap()

      dispatch(setCredentials())
      dispatch(setUserData(result))

      navigate('/personal-area')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login failed:', err)
    }
  }

  return { signIn, isLoading }
}
