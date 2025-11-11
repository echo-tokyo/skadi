import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { IAuthState, TRole } from '@/features/authorization'

const initialState: IAuthState = {
  accessToken: null,
  isAuthenticated: false,
  role: null,
}

interface ICredentials {
  accessToken: string
  role: TRole
}

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setCredentials: (
      state,
      { payload }: PayloadAction<ICredentials>,
    ) => {
      state.accessToken = payload.accessToken
      state.isAuthenticated = true
      state.role = payload.role
    },

    setAccessToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload
      state.isAuthenticated = true
    },

    logout: (state) => {
      state.accessToken = null
      state.isAuthenticated = false
      state.role = null
    },
  },
})

export const { setCredentials, setAccessToken, logout } =
  authSlice.actions
export default authSlice.reducer
