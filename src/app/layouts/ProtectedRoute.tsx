import { useGetMeQuery, setUserData } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/shared/lib'
import { FC, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute: FC = () => {
  const dispatch = useAppDispatch()

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)

  const { data: userData, isLoading } = useGetMeQuery(undefined, {
    skip: isAuthenticated,
  })

  useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData))
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
