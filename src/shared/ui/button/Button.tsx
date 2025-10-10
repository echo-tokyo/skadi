interface IProps {
  text?: string
  onClick?: () => void
}

const Button = (props: IProps) => {
  const { text, onClick } = props
  return <button onClick={onClick}>{text}</button>
}

export default Button
