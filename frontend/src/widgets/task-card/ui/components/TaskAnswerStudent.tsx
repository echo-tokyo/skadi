import { FileField, Text, Textarea } from '@/shared/ui'
import styles from '../styles.module.scss'
import { Controller, useController, useFormContext } from 'react-hook-form'
import { TSolutionStudentSchema } from '@/entities/solution'
import { TFile } from '@/shared/model'

interface ITaskAnswerStudentProps {
  serverFiles: TFile[]
}

const TaskAnswerStudent = (props: ITaskAnswerStudentProps) => {
  const { serverFiles } = props
  const { control } = useFormContext<TSolutionStudentSchema>()

  const { field: deletedField, fieldState: deletedFieldState } = useController({
    control,
    name: 'deleted_file_ids',
  })

  return (
    <div className={styles.card}>
      <Text size='20' weight='600'>
        Ответ
      </Text>
      <div className={styles.cardAnswerFields}>
        <Controller
          control={control}
          name='answer'
          render={({ field, fieldState }) => (
            <Textarea
              label='Письменный ответ'
              fluid
              value={field.value}
              isValid={!fieldState.error}
              description={fieldState.error?.message}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name='file_answer'
          render={({ field, fieldState }) => (
            <FileField
              label='Файлы'
              fluid
              multiple
              isValid={!fieldState.error && !deletedFieldState.error}
              description={
                fieldState.error?.message ??
                (Array.isArray(deletedFieldState.error)
                  ? deletedFieldState.error[0]?.message
                  : deletedFieldState.error?.message)
              }
              attachments={serverFiles
                .filter((f) => !deletedField.value.includes(f.id))
                .map((f) => ({ id: f.id, name: f.name, size: f.size }))}
              onRemoveAttachment={(id) =>
                deletedField.onChange([...deletedField.value, id])
              }
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  )
}

export default TaskAnswerStudent
