import { ReactNode } from 'react'

interface IProps {
  children: string
  size?: '64' | '20' | '16' | '14' | '12'
  weight?: '900' | 'bold' | 'normal'
  color?: '--color-primary' | '--color-secondary'
}

const Text = (props: IProps): ReactNode => {
  const {
    children,
    size = '16',
    weight = 'normal',
    color = '--color-secondary',
  } = props

  return (
    <span
      style={{
        fontSize: size + 'px',
        fontWeight: weight,
        color: `var(${color})`,
      }}
    >
      {children}
    </span>
  )
}

export default Text
