import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store/store'
import { setAccessToken, logout } from '@/features/authorization'
import { Mutex } from 'async-mutex'

interface IRefreshResponse {
  accessToken: string
}

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const refreshResult = await baseQuery(
          {
            url: '/refresh',
            method: 'POST',
            credentials: 'include',
          },
          api,
          extraOptions,
        )

        if (refreshResult.data) {
          const { accessToken } =
            refreshResult.data as IRefreshResponse

          api.dispatch(setAccessToken(accessToken))

          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(logout())
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: ['Auth'],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
})
