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
      query: ({ queryArg, pageParam }) => ({
        url: '/admin/user',
        method: 'GET',
        params: {
          ...queryArg,
          page: pageParam,
          perPage: queryArg.perPage ?? DEFAULT_PER_PAGE,
        },
      }),
      // TODO: сравнить по total из пагинации
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) =>
          lastPage.data.length < lastPage.pagination.perPage
            ? undefined
            : lastPageParam + 1,
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
      invalidatesTags: ['Member'],
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
