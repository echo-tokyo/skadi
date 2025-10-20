import { ReactNode } from 'react'

interface IProps {
  children: ReactNode
  onClick?: () => void
}

const Button = (props: IProps): ReactNode => {
  const { children, onClick } = props
  return <button onClick={onClick}>{children}</button>
}

export default Button
