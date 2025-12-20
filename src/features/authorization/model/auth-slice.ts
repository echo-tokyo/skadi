import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { IAuthState } from '@/features/authorization'
import { ICredentials } from './types'

const initialState: IAuthState = {
  accessToken: null,
  isAuthenticated: false,
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
    },

    setAccessToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload
      state.isAuthenticated = true
    },

    logout: (state) => {
      state.accessToken = null
      state.isAuthenticated = false
    },
  },
})

export const { setCredentials, setAccessToken, logout } =
  authSlice.actions
export default authSlice.reducer
