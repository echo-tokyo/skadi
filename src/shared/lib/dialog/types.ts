import { ReactNode } from 'react'

export interface DialogParams {
  title?: string
  content: ReactNode
  positiveText?: string
  negativeText?: string
  onConfirm?: () => void
  onClose?: () => void
}

export interface DialogState extends DialogParams {
  id: string
}

export interface DialogContextType {
  show: (params: DialogParams) => string
}
