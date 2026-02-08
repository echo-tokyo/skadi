import { useGetMeQuery, setUserData } from '@/entities/user'
import { setCredentials } from '@/features/authorization'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { FC, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute: FC = () => {
  const dispatch = useAppDispatch()

  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const { data: userData, isLoading } = useGetMeQuery(undefined, {
    skip: isAuthenticated || !document.cookie.includes('refresh'),
  })

  useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData))
      dispatch(setCredentials())
    }
  }, [userData, dispatch])

  if (isLoading || (userData && !isAuthenticated)) {
    return null
  }

  if (isAuthenticated) {
    return <Outlet />
  }

  return <Navigate to='/authorization' replace />
}

export default ProtectedRoute
