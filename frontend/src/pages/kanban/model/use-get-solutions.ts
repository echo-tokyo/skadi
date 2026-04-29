import { useGetSolutionsForStudentQuery } from '@/entities/solution'
import { getErrorMessage } from '@/shared/api'
import { TSolution } from '@/shared/model'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useGetSolutions = () => {
  const { data, isError, error, isLoading } = useGetSolutionsForStudentQuery()

  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error))
    }
  }, [error, isError])

  const solutions: TSolution[] | undefined = data?.data.filter(
    (el) => el.status.id !== 4,
  )

  return { solutions: solutions ?? [], isLoading }
}
