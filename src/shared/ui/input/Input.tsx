import { ReactNode, ChangeEvent } from 'react'

interface IProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
}

const Input = (props: IProps): ReactNode => {
  const { placeholder, value, onChange } = props

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value)
  }

  return (
    <input value={value} onChange={handleChange} placeholder={placeholder} />
  )
}

export default Input
