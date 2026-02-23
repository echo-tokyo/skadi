import { ReactNode, useState, useCallback } from 'react'
import { Dialog } from '@/shared/ui'
import { DialogContext } from './context'
import { DialogParams, DialogState } from './types'

export const DialogProvider = ({
  children,
}: {
  children: ReactNode
}): ReactNode => {
  const [dialogs, setDialogs] = useState<DialogState[]>([])

  const show = useCallback((params: DialogParams) => {
    const id = crypto.randomUUID()
    setDialogs((prev) => [...prev, { ...params, id }])
    return id
  }, [])

  const hide = useCallback((id: string) => {
    setDialogs((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const handleConfirm = (dialog: DialogState): void => {
    dialog.onConfirm?.()
    hide(dialog.id)
  }

  return (
    <DialogContext value={{ show }}>
      {children}
      {dialogs.map((dialog) => (
        <Dialog
          key={dialog.id}
          onClose={() => hide(dialog.id)}
          onConfirm={() => handleConfirm(dialog)}
          title={dialog.title}
          positiveText={dialog.positiveText}
          negativeText={dialog.negativeText}
        >
          {dialog.content}
        </Dialog>
      ))}
    </DialogContext>
  )
}
