import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUserData } from './types'

const initialState: IUserData = {
  id: null,
  role: null,
  username: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, { payload }: PayloadAction<IUserData>) => {
      state.role = payload.role
      state.username = payload.username
    },
    clearUserData: (state) => {
      state.role = null
      state.username = null
    },
  },
})

export const { setUserData, clearUserData } = userSlice.actions
export default userSlice.reducer
