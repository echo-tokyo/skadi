import { baseApi } from '@/shared/api'
import {
  ICreateMemberRequest,
  ICreateMemberResponse,
  IMember,
  IMembersFilter,
  IMembersResponse,
  IUpdateMemberRequest,
} from '../model/types'

const PER_PAGE = 3

export const memberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.infiniteQuery<IMembersResponse, IMembersFilter, number>(
      {
        infiniteQueryOptions: {
          initialPageParam: 1,
          getNextPageParam: (lastPage, _allPages, lastPageParam) =>
            lastPage.data.length < PER_PAGE ? undefined : lastPageParam + 1,
        },
        query: ({ queryArg, pageParam }) => ({
          url: '/admin/user',
          method: 'GET',
          params: { ...queryArg, page: pageParam, perPage: PER_PAGE },
        }),
        providesTags: ['Member'],
      },
    ),

    // getMemberById: builder.query<IMemberResponse, string>({
    //   query: (id) => ({
    //     url: `/admin/user/${id}`,
    //     method: 'GET',
    //   }),
    //   providesTags: ['Member'],
    // }),

    createMember: builder.mutation<ICreateMemberResponse, ICreateMemberRequest>(
      {
        query: (data) => ({
          url: '/admin/user',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Member'],
      },
    ),

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
