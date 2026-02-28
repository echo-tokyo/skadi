import { baseApi } from '@/shared/api'
import { ICreateMemberRequest, ICreateMemberResponse } from '../model/types'

export const memberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getMembers: builder.query<IMemberResponse[], void>({
    //   query: () => ({
    //     url: '/admin/user',
    //     method: 'GET',
    //   }),
    //   providesTags: ['Member'],
    // }),

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

    // updateMemberProfile: builder.mutation<
    //   IUpdateMemberRequest,
    //   { id: string; data: IUpdateMemberRequest }
    // >({
    //   query: ({ id, data }) => ({
    //     url: `/admin/user/${id}/profile`,
    //     method: 'PUT',
    //     body: data,
    //   }),
    //   invalidatesTags: ['Member'],
    // }),

    // deleteMember: builder.mutation<void, string>({
    //   query: (id) => ({
    //     url: `/admin/user/${id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Member'],
    // }),
  }),
})

export const { useCreateMemberMutation } = memberApi
