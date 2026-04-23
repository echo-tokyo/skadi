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
import { selectAuthenticatedUser } from '@/entities/user'
import type { RootState } from '@/app/store/store'

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
      onQueryStarted: async ({ data, id }, { dispatch, getState, queryFulfilled }) => {
        const user = selectAuthenticatedUser(getState() as RootState)

        const patchResult = dispatch(
          commentApi.util.updateQueryData('getComments', { id }, (draft) => {
            const lastPage = draft.pages[draft.pages.length - 1]
            lastPage?.data.push({
              id: -Date.now(),
              message: data.message,
              role: user.role,
              created_at: new Date().toISOString(),
            })
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
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
