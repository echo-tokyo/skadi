import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser, IUserResponse } from './types'

interface IUserState {
  user: IUser | null
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
export const selectAuthenticatedUser = (state: {
  user: IUserState
}): IUser => state.user.user!
