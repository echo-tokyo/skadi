import { baseApi } from '@/shared/api'
import { ICreateTaskResponse } from '../model/types'

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation<ICreateTaskResponse, ICreateTaskResponse>({
      query: (data) => ({
        url: '/teacher/task',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
  }),
})

export const { useCreateTaskMutation } = taskApi
