import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { IAuthState, TRole } from '@/features/authorization'

const initialState: IAuthState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  role: null,
}

interface ICredentials {
  token: string
  role: TRole
}

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setCredentials: (state, { payload }: PayloadAction<ICredentials>) => {
      state.token = payload.token
      state.isAuthenticated = true
      localStorage.setItem('token', payload.token)
      state.role = payload.role
    },

    logout: (state) => {
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      state.role = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
