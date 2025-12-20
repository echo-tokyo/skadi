import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@/features/authorization'
import { baseApi } from '@/app/api'
import { userReducer } from '@/entities/user'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    user: userReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
