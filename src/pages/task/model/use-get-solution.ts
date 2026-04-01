import { useGetSolutionByIdQuery } from '@/entities/solution'
import { getErrorMessage } from '@/shared/api'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useGetSolution = (id: string | undefined, isSolution: boolean) => {
  const { data, error, isError, isLoading } = useGetSolutionByIdQuery(
    Number(id),
    {
      skip: !id || !isSolution,
    },
  )

  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error))
    }
  }, [error, isError])

  return {
    data,
    isLoading,
  }
}
