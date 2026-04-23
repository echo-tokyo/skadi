import {
  baseApi,
  DEFAULT_PER_PAGE,
  paginatedInfiniteQueryOptions,
} from '@/shared/api'
import {
  ICreateCommentRequest,
  IGetCommentsQuery,
  IGetCommentsResponse,
} from '../model/types'
import { TComment } from '@/shared/model'

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation<
      TComment,
      { data: ICreateCommentRequest; id: number }
    >({
      query: ({ data, id }) => ({
        url: `/solution/${id}/comment`,
        body: data,
        method: 'POST',
      }),
      invalidatesTags: ['Comment'],
    }),

    getComments: builder.infiniteQuery<
      IGetCommentsResponse,
      IGetCommentsQuery,
      number
    >({
      query: ({ pageParam, queryArg }) => ({
        url: `/solution/${queryArg.id}/comment`,
        params: {
          page: pageParam,
          'per-page': queryArg['per-page'] ?? DEFAULT_PER_PAGE,
        },
      }),
      infiniteQueryOptions: paginatedInfiniteQueryOptions,
      providesTags: ['Comment'],
    }),
  }),
})

export const { useCreateCommentMutation, useGetCommentsInfiniteQuery } =
  commentApi
