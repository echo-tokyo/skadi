import { baseApi } from '@/shared/api'
import { IClass, ICreateClassRequest } from '../model/types'

export const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createClass: builder.mutation<IClass, ICreateClassRequest>({
      query: (data) => ({
        url: '/admin/class',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Class'],
    }),
  }),
})
