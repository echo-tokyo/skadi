import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUserResponse } from './types'

interface IUserState {
  user: IUserResponse | null
}

const initialState: IUserState = {
  user: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (
      state,
      { payload }: PayloadAction<IUserResponse>,
    ) => {
      state.user = payload
    },
    clearUserData: (state) => {
      state.user = null
    },
  },
})

export const { setUserData, clearUserData } = userSlice.actions
export default userSlice.reducer
