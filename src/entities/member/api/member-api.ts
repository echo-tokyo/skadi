import { baseApi } from '@/shared/api'
import {
  ICreateMemberRequest,
  IMember,
  IMembersQuery,
  IMembersResponse,
  IUpdateMemberRequest,
} from '../model/types'

const DEFAULT_PER_PAGE = 20

export const memberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.infiniteQuery<IMembersResponse, IMembersQuery, number>({
      query: ({ queryArg, pageParam }) => {
        const { 'per-page': perPage, ...rest } = queryArg
        return {
          url: '/admin/user',
          method: 'GET',
          params: {
            ...rest,
            page: pageParam,
            'per-page': perPage ?? DEFAULT_PER_PAGE,
          },
        }
      },
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { pagination } = lastPage
          if (!pagination) {
            return undefined
          }
          return pagination.page < pagination.pages
            ? pagination.page + 1
            : undefined
        },
      },
      providesTags: ['Member'],
    }),

    createMember: builder.mutation<IMember, ICreateMemberRequest>({
      query: (data) => ({
        url: '/admin/user',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Member'],
    }),

    updateMember: builder.mutation<
      IMember,
      { id: number; data: IUpdateMemberRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/user/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => {
        const tags: ('Member' | 'Class')[] = ['Member']
        if (arg.data.class_id !== undefined) tags.push('Class')
        return tags
      },
    }),

    deleteMember: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Member'],
    }),
  }),
})

export const {
  useCreateMemberMutation,
  useGetMembersInfiniteQuery,
  useDeleteMemberMutation,
  useUpdateMemberMutation,
} = memberApi
