import { baseApi } from '@/shared/api'
import {
  ICreateMemberRequest,
  ICreateMemberResponse,
  IMember,
  IMembersRequest,
  IMembersResponse,
  IUpdateMemberRequest,
} from '../model/types'

export const memberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query<IMembersResponse, IMembersRequest>({
      query: (params) => ({
        url: '/admin/user',
        method: 'GET',
        params,
      }),
      providesTags: ['Member'],
    }),

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
  useGetMembersQuery,
  useDeleteMemberMutation,
  useUpdateMemberMutation,
} = memberApi
