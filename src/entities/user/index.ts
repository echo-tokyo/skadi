export type { IUserResponse, TRole, IUser } from './model/types.ts'

export {
  setUserData,
  clearUserData,
  selectAuthenticatedUser,
} from './model/user-slice.ts'

export { default as userReducer } from './model/user-slice.ts'

export { useGetMeQuery } from './api/user-api.ts'
