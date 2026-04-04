import {
  baseApi,
  DEFAULT_PER_PAGE,
  paginatedInfiniteQueryOptions,
} from '@/shared/api'
import {
  IGetSolutionByIdResponse,
  IGetSolutionsQuery,
  IGetSolutionsResponse,
  IUpdateSolutionByStudentRequest,
  IUpdateSolutionByStudentResponse,
  IUpdateSolutionByTeacherRequest,
  IUpdateSolutionByTeacherResponse,
} from '../model/types'

export const solutionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateSolutionByStudent: builder.mutation<
      IUpdateSolutionByStudentResponse,
      { id: number; data: IUpdateSolutionByStudentRequest }
    >({
      query: ({ data, id }) => ({
        url: `/student/solution/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    updateSolutionByTeacher: builder.mutation<
      IUpdateSolutionByTeacherResponse,
      { id: number; data: IUpdateSolutionByTeacherRequest }
    >({
      query: ({ data, id }) => ({
        url: `/teacher/solution/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
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

export const {
  useGetSolutionByIdQuery,
  useGetSolutionsInfiniteQuery,
  useUpdateSolutionByTeacherMutation,
  useUpdateSolutionByStudentMutation,
} = solutionApi
