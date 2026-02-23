import { ReactNode, useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { createPortal } from 'react-dom'
import Text from '../text/Text'
import Button from '../button/Button'

const ANIMATION_DURATION = 150

interface IProps {
  title?: string
  children: ReactNode
  positiveText?: string
  negativeText?: string
  onConfirm: () => void
  onClose: () => void
}

const Dialog = (props: IProps): ReactNode => {
  const {
    children,
    title = 'Модальное окно',
    onClose,
    onConfirm,
    positiveText = 'Сохранить',
    negativeText = 'Отменить',
  } = props

  const [isClosing, setIsClosing] = useState(false)

  const handleClose = (): void => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, ANIMATION_DURATION)
  }

  const handleConfirm = (): void => {
    setIsClosing(true)
    setTimeout(() => {
      onConfirm()
    }, ANIMATION_DURATION)
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      handleClose()
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
          <Button fluid color='secondary' onClick={handleClose}>
            {negativeText}
          </Button>
          <Button fluid onClick={handleConfirm}>
            {positiveText}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default Dialog
