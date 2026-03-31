import {
  baseApi,
  DEFAULT_PER_PAGE,
  paginatedInfiniteQueryOptions,
} from '@/shared/api'
import {
  ICreateTaskRequest,
  ICreateTaskResponse,
  IGetTaskQuery,
  IGetTaskResponse,
} from '../model/types'

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation<ICreateTaskResponse, ICreateTaskRequest>({
      query: (data) => ({
        url: '/teacher/task',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    getTasks: builder.infiniteQuery<IGetTaskResponse, IGetTaskQuery, number>({
      query: ({ queryArg, pageParam }) => {
        const { 'per-page': perPage, ...rest } = queryArg
        return {
          url: '/teacher/task',
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

export const { useCreateTaskMutation, useGetTasksInfiniteQuery } = taskApi
