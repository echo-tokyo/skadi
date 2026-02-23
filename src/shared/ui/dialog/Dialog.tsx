import { memo, ReactNode, useEffect } from 'react'
import styles from './styles.module.scss'
import { createPortal } from 'react-dom'
import Text from '../text/Text'
import Button from '../button/Button'

interface IProps {
  title?: string
  children: ReactNode
  positiveText?: string
  negativeText?: string
  onConfirm: () => void
  onClose: () => void
  isClosing: boolean
  isConfirmDisabled?: boolean
  isConfirmLoading?: boolean
}

const Dialog = (props: IProps): ReactNode => {
  const {
    children,
    title = 'Модальное окно',
    onClose,
    onConfirm,
    positiveText = 'Сохранить',
    negativeText = 'Отменить',
    isClosing,
    isConfirmDisabled = false,
    isConfirmLoading = false,
  } = props

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return (): void => {
      document.body.style.overflow = ''
    }
  }, [])

  const wrapperClass = `${styles.wrapper} ${isClosing ? styles.closing : ''}`

  return createPortal(
    <div className={wrapperClass} onClick={handleOverlayClick}>
      <div className={styles.dialog}>
        <Text size='20' weight='bold'>
          {title}
        </Text>
        <div className={styles.content}>{children}</div>
        <div className={styles.actions}>
          <Button fluid color='secondary' onClick={onClose}>
            {negativeText}
          </Button>
          <Button
            fluid
            onClick={onConfirm}
            disabled={isConfirmDisabled && isConfirmLoading}
          >
            {positiveText}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default memo(Dialog)
