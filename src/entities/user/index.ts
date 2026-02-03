export type { IUserResponse, TRole } from './model/types.ts'

export { setUserData, clearUserData } from './model/user-slice.ts'

export { default as userReducer } from './model/user-slice.ts'

export { useGetMeQuery } from './api/user-api.ts'
