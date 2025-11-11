import { baseApi } from '@/app/api'
import type {
  ISignInFormData,
  IAuthResponse,
} from '@/features/authorization'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<IAuthResponse, ISignInFormData>({
      query: (credentials) => ({
        url: '/signin',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const { useSignInMutation, useLogoutMutation } = authApi
