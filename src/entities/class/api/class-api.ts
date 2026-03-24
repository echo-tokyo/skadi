import { baseApi } from '@/shared/api'
import {
  IClass,
  IClassQuery,
  IClassResponse,
  IClassRequest,
} from '../model/types'

const DEFAULT_PER_PAGE = 20

export const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.infiniteQuery<IClassResponse, IClassQuery, number>({
      query: ({ queryArg, pageParam }) => ({
        url: '/class',
        method: 'GET',
        params: {
          ...queryArg,
          page: pageParam,
          perPage: queryArg.perPage ?? DEFAULT_PER_PAGE,
        },
      }),
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) =>
          lastPage.data.length <
          (lastPage.pagination?.perPage ?? DEFAULT_PER_PAGE)
            ? undefined
            : lastPageParam + 1,
      },
      providesTags: ['Class'],
    }),
    createClass: builder.mutation<IClass, IClassRequest>({
      query: (data) => ({
        url: '/admin/class',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Class'],
    }),
    editClass: builder.mutation<IClass, { id: number; data: IClassRequest }>({
      query: ({ id, data }) => ({
        url: `/admin/class/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Class'],
    }),
    deleteClass: builder.mutation<void, number>({
      query: (id) => ({
        url: `admin/class/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class'],
    }),
  }),
})

export const {
  useGetClassesInfiniteQuery,
  useCreateClassMutation,
  useDeleteClassMutation,
  useEditClassMutation,
} = classApi
