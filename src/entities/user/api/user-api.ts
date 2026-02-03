import { baseApi } from '@/shared/api'
import { IUserDataResponse } from '@/entities/user'

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<IUserDataResponse, void>({
      query: () => ({
        url: '/user/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
})

export const { useGetMeQuery } = userApi
