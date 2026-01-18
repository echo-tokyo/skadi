import { Button, Input } from '@/shared/ui'
import { FC, FormEvent, ReactNode, useState } from 'react'
import styles from './styles.module.scss'
import { useSignIn } from '../lib/use-sign-in'

export const SignIn: FC = (): ReactNode => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { wrapper, auth } = styles
  const { signIn } = useSignIn()

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    signIn({ username, password })
  }

  return (
    <div className={wrapper}>
      <form className={auth} onSubmit={handleSubmit}>
        <Input
          title='test'
          fluid
          placeholder='login'
          value={username}
          onChange={setUsername}
        />
        <Input
          title='test'
          fluid
          placeholder='pass'
          value={password}
          onChange={setPassword}
        />
        <Button fluid type='submit'>
          Войти
        </Button>
      </form>
    </div>
  )
}
