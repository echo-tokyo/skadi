import {
  baseApi,
  DEFAULT_PER_PAGE,
  paginatedInfiniteQueryOptions,
} from '@/shared/api'
import {
  ICreateTaskRequest,
  ICreateTaskResponse,
  IGetTasksQuery,
  IGetTasksResponse,
  IUpdateTaskRequest,
  IUpdateTaskResponse,
} from '../model/types'

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation<ICreateTaskResponse, ICreateTaskRequest>({
      query: (data) => ({
        url: '/task',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<IUpdateTaskResponse, IUpdateTaskRequest>({
      query: ({ id, ...data }) => ({
        url: `/task/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    getTasks: builder.infiniteQuery<IGetTasksResponse, IGetTasksQuery, number>({
      query: ({ queryArg, pageParam }) => {
        const { 'per-page': perPage, ...rest } = queryArg
        return {
          url: '/task',
          method: 'GET',
          params: {
            ...rest,
            page: pageParam,
            'per-page': perPage ?? DEFAULT_PER_PAGE,
          },
        }
      },
      infiniteQueryOptions: paginatedInfiniteQueryOptions,
      providesTags: ['Task'],
    }),
  }),
})

export const {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetTasksInfiniteQuery,
} = taskApi
