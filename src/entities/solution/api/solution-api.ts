import { baseApi } from '@/shared/api'
import { IGetSolutionByIdResponse } from '../model/types'

export const solutionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSolutionById: builder.query<IGetSolutionByIdResponse, number>({
      query: (id) => ({
        url: `/solution/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['Solution'],
    }),
  }),
})

export const { useGetSolutionByIdQuery } = solutionApi
