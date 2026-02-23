import { ReactNode, useState } from 'react'
import { Dialog } from '@/shared/ui'
import { DialogContext } from './context'
import { DialogParams, DialogState } from './types'

const ANIMATION_DURATION = 150

export const DialogProvider = ({
  children,
}: {
  children: ReactNode
}): ReactNode => {
  const [dialogs, setDialogs] = useState<DialogState[]>([])

  const show = (params: DialogParams): string => {
    const id = crypto.randomUUID()
    setDialogs((prev) => [
      ...prev,
      { ...params, id, isClosing: false, isLoading: false },
    ])
    return id
  }

  const hide = (id: string): void => {
    setDialogs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isClosing: true } : d)),
    )
    setTimeout(() => {
      setDialogs((prev) => prev.filter((m) => m.id !== id))
    }, ANIMATION_DURATION)
  }

  const setLoading = (id: string, isLoading: boolean): void => {
    setDialogs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isLoading } : d)),
    )
  }

  const handleClose = (dialog: DialogState): void => {
    dialog.onClose?.()
    hide(dialog.id)
  }

  const handleConfirm = async (dialog: DialogState): Promise<void> => {
    if (!dialog.onConfirm) {
      hide(dialog.id)
      return
    }

    setLoading(dialog.id, true)

    try {
      await dialog.onConfirm()
      hide(dialog.id)
    } catch {
      // Error not handling
    } finally {
      setLoading(dialog.id, false)
    }
  }

  return (
    <DialogContext value={{ show }}>
      {children}
      {dialogs.map((dialog) => (
        <Dialog
          key={dialog.id}
          onClose={() => handleClose(dialog)}
          onConfirm={() => handleConfirm(dialog)}
          title={dialog.title}
          positiveText={dialog.positiveText}
          negativeText={dialog.negativeText}
          isClosing={dialog.isClosing}
          isConfirmDisabled={dialog.isConfirmDisabled}
          isConfirmLoading={dialog.isLoading}
        >
          {dialog.content}
        </Dialog>
      ))}
    </DialogContext>
  )
}
