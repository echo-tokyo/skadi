import { ReactNode } from 'react'

export interface DialogParams {
  title?: string
  content: ReactNode
  positiveText?: string
  negativeText?: string
  onConfirm?: () => Promise<void>
  onClose?: () => void
  isConfirmDisabled?: boolean
}

export interface DialogState extends DialogParams {
  id: string
  isClosing: boolean
  isLoading: boolean
}

export interface DialogContextType {
  show: (params: DialogParams) => string
}
