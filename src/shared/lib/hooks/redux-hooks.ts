import { useDispatch, useSelector } from 'react-redux'

/**
 * Типизированные хуки Redux для использования в приложении
 * Типы AppDispatch и RootState инжектятся из слоя app через настройку store
 */
export const useAppDispatch = useDispatch.withTypes<any>()
export const useAppSelector = useSelector.withTypes<any>()
