import { createSlice } from '@reduxjs/toolkit'
interface IAuthState {
  isAuthenticated: boolean
}

const initialState: IAuthState = {
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state) => {
      state.isAuthenticated = true
    },

    logout: (state) => {
      state.isAuthenticated = false
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
