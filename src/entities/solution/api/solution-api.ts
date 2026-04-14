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
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          solutionApi.util.updateQueryData(
            'getSolutionForStudent',
            undefined,
            (draft) => {
              if (data.status_id === undefined) return
              const solution = draft.data.find((s) => s.id === id)
              if (solution) solution.status.id = data.status_id
            },
          ),
        )
        try {
          await queryFulfilled
          dispatch(solutionApi.util.invalidateTags([{ type: 'Solution', id }]))
        } catch {
          patch.undo()
        }
      },
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
      invalidatesTags: ['Solution'],
    }),

    getSolutionById: builder.query<IGetSolutionByIdResponse, number>({
      query: (id) => ({
        url: `/solution/get/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Solution', id }],
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

    getSolutionForStudent: builder.query<IGetSolutionsResponse, void>({
      query: () => ({
        url: '/student/solution',
        method: 'GET',
      }),
      providesTags: ['Solution'],
    }),
  }),
})

export const {
  useGetSolutionByIdQuery,
  useGetSolutionsInfiniteQuery,
  useUpdateSolutionByTeacherMutation,
  useUpdateSolutionByStudentMutation,
  useGetSolutionForStudentQuery,
} = solutionApi
