import { useContext } from 'react'
import { DialogContext } from './context'
import { DialogParams } from './types'

export const useDialog = (): ((params: DialogParams) => string) => {
  const ctx = useContext(DialogContext)

  if (!ctx) {
    throw new Error('useDialog must be used within DialogProvider')
  }

  return ctx.show
}
