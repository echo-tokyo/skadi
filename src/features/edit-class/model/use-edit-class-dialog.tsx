import { useRef } from 'react'
import { useDialog } from '@/shared/lib'
import { IClass, IClassFieldsRef } from '@/entities/class'
import DialogContent from '../ui/DialogContent'
import { useEditClass } from './use-edit-class'

export const useEditClassDialog = (classData: IClass) => {
  const { show, update } = useDialog()
  const formRef = useRef<IClassFieldsRef>(null)
  const { updateClass } = useEditClass(classData.id)
  // const fieldData = useMemo(() => toFormData(member), [member])
  const dialogIdRef = useRef<string | null>(null)

  const showDialog = () => {
    const id = show({
      title: 'Редактирование группы',
      content: () => (
        <DialogContent
          classData={classData}
          classFieldsRef={formRef}
          onDirtyChange={(isDirty) => {
            if (dialogIdRef.current) {
              update(dialogIdRef.current, { isConfirmDisabled: !isDirty })
            }
          }}
        />
      ),
      positiveText: 'Сохранить',
      negativeText: 'Отмена',
      size: 'm',
      onConfirm: async () => {
        const isValid = await formRef.current?.validate()

        if (!isValid) {
          throw new Error('Validation failed')
        }

        const formData = formRef.current?.getFieldsData()

        if (formData) {
          const success = await updateClass(formData)
          if (!success) {
            throw new Error('Failed to update class')
          }
        }
      },
    })
    dialogIdRef.current = id
  }

  return { showDialog }
}
