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
      query: ({ queryArg, pageParam }) => {
        const { 'per-page': perPage, ...rest } = queryArg
        return {
          url: '/class',
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
