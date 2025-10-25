import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

// TODO: что нибудь придумать с типизированными хуками. нужно переместить из @app в @shared

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
