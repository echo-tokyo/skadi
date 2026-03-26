import { TRole } from '@/shared/model'
import { useMemo } from 'react'
import { useGetMembersInfiniteQuery } from '../api/member-api'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/api'

export const useMemberSelectOptions = (role: TRole) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useGetMembersInfiniteQuery({ roles: [role], free: false, perPage: 5 })

  if (error) {
    toast.error(getErrorMessage(error))
  }

  const options = useMemo(
    () =>
      data?.pages
        .flatMap((p) => p.data)
        .map((el) => ({
          label: el.profile?.fullname ?? '',
          value: String(el.id),
        })) ?? [],
    [data],
  )

  return {
    options,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }
}
