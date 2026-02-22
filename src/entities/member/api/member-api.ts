import { baseApi } from '@/shared/api'
import {
  IMemberCreateRequest,
  IMemberUpdateRequest,
  IMemberResponse,
} from '../model/types'

export const memberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query<IMemberResponse[], void>({
      query: () => ({
        url: '/admin/user',
        method: 'GET',
      }),
      providesTags: ['Member'],
    }),

    getMemberById: builder.query<IMemberResponse, string>({
      query: (id) => ({
        url: `/admin/user/${id}`,
        method: 'GET',
      }),
      providesTags: ['Member'],
    }),

    createMember: builder.mutation<
      IMemberResponse,
      IMemberCreateRequest
    >({
      query: (data) => ({
        url: '/admin/user',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Member'],
    }),

    updateMemberProfile: builder.mutation<
      IMemberResponse,
      { id: string; data: IMemberUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/user/${id}/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Member'],
    }),

    deleteMember: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Member'],
    }),
  }),
})

export const {
  useGetMembersQuery,
  useGetMemberByIdQuery,
  useCreateMemberMutation,
  useUpdateMemberProfileMutation,
  useDeleteMemberMutation,
} = memberApi
