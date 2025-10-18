import { ReactNode } from 'react'

interface IProps {
  text?: string
  onClick?: () => void
}

const Button = (props: IProps): ReactNode => {
  const { text, onClick } = props
  return <button onClick={onClick}>{text}</button>
}

export default Button
