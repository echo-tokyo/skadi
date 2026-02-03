import { useGetMeQuery, setUserData } from '@/entities/user'
import { setCredentials } from '@/features/authorization'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { FC, PropsWithChildren, useEffect } from 'react'
import { Navigate } from 'react-router'

const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch()

  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const { data: userData, isLoading } = useGetMeQuery(undefined, {
    skip: isAuthenticated,
  })

  useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData))
      dispatch(setCredentials())
    }
  }, [userData, dispatch])

  if (isLoading) {
    return null
  }

  if (isAuthenticated || userData) {
    return children
  }

  return <Navigate to='/authorization' replace />
}

export default ProtectedRoute
