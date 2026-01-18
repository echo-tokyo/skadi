import { useGetMeQuery, setUserData } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { FC, PropsWithChildren, useEffect } from 'react'
import { Navigate } from 'react-router'

const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { data, isLoading } = useGetMeQuery(undefined, {
    skip: isAuthenticated,
  })

  useEffect(() => {
    if (data) {
      dispatch(setUserData(data))
    }
  }, [data, dispatch])

  if (isAuthenticated) {
    return children
  }

  if (!isLoading) {
    return <Navigate to='/authorization' replace />
  }

  return null
}

export default ProtectedRoute
