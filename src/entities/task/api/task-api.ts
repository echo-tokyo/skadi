import { baseApi } from '@/shared/api'
import { ICreateTaskRequest, ICreateTaskResponse } from '../model/types'

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
  }),
})

export const { useCreateTaskMutation } = taskApi
