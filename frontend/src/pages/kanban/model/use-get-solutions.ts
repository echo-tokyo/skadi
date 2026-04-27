import { useGetSolutionsForStudentQuery } from '@/entities/solution'
import { getErrorMessage } from '@/shared/api'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useGetSolutions = () => {
  const { data, isError, error, isLoading } = useGetSolutionsForStudentQuery()

  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error))
    }
  }, [error, isError])

  return { solutions: data?.data ?? [], isLoading }
}
