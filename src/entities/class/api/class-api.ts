import { baseApi } from '@/shared/api'
import {
  IClass,
  IClassQuery,
  IClassResponse,
  ICreateClassRequest,
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
    createClass: builder.mutation<IClass, ICreateClassRequest>({
      query: (data) => ({
        url: '/admin/class',
        method: 'POST',
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
} = classApi
