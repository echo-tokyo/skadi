import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

type ApiErrorData = { message?: string }

const isFetchError = (
  error: FetchBaseQueryError | SerializedError,
): error is FetchBaseQueryError => 'data' in error

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
  fallback = 'Произошла ошибка',
): string => {
  if (!error) {
    return fallback
  }
  if (isFetchError(error)) {
    return (error.data as ApiErrorData)?.message ?? fallback
  }
  return error.message ?? fallback
}
