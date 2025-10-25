import { baseApi } from '@/shared/api'
import type { ISignInFormData, IAuthResponse } from '@/features/authorization'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<IAuthResponse, ISignInFormData>({
      query: (credentials) => ({
        url: '/signin',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const { useSignInMutation } = authApi
