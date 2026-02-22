import { useContext } from 'react'
import { DialogContext } from './context'

export const useDialog = () => {
  const ctx = useContext(DialogContext)

  if (!ctx) {
    throw new Error('useDialog must be used within DialogProvider')
  }

  return ctx.show
}
