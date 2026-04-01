import {
  baseApi,
  DEFAULT_PER_PAGE,
  paginatedInfiniteQueryOptions,
} from '@/shared/api'
import {
  IGetSolutionByIdResponse,
  IGetSolutionsQuery,
  IGetSolutionsResponse,
} from '../model/types'

export const solutionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSolutionById: builder.query<IGetSolutionByIdResponse, number>({
      query: (id) => ({
        url: `/solution/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['Solution'],
    }),
    getSolutions: builder.infiniteQuery<
      IGetSolutionsResponse,
      IGetSolutionsQuery,
      number
    >({
      query: ({ queryArg, pageParam }) => {
        const { 'per-page': perPage, ...rest } = queryArg
        return {
          url: '/teacher/solution',
          method: 'GET',
          params: {
            ...rest,
            page: pageParam,
            'per-page': perPage ?? DEFAULT_PER_PAGE,
          },
        }
      },
      infiniteQueryOptions: paginatedInfiniteQueryOptions,
      providesTags: ['Solution'],
    }),
  }),
})

export const { useGetSolutionByIdQuery, useGetSolutionsInfiniteQuery } =
  solutionApi
