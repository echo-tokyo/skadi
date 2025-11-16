import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'

interface IRefreshResponse {
  accessToken: string
}

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as {
      auth?: { accessToken?: string | null }
    }
    const token = state.auth?.accessToken

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

export interface IAuthActions {
  onTokenRefresh: (accessToken: string) => {
    type: string
    payload: string
  }
  onAuthFailure: () => { type: string }
}

let authActions: IAuthActions | null = null

export const initializeAuthActions = (
  actions: IAuthActions,
): void => {
  authActions = actions
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (!authActions) {
    throw new Error(
      'Auth actions not initialized. Call initializeAuthActions() in app layer.',
    )
  }

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

          api.dispatch(authActions.onTokenRefresh(accessToken))

          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(authActions.onAuthFailure())
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
