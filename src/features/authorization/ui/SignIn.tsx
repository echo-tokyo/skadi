import { Button, Input } from '@/shared/ui'
import { FC, ReactNode, useState } from 'react'
import { useSignIn } from '@/features/authorization'
import styles from './styles.module.scss'

export const SignIn: FC = (): ReactNode => {
  const [login, setLogin] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { signIn } = useSignIn()
  const { wrapper, auth } = styles

  const handleSignInClick = (): void => {
    signIn({ login, password })
  }

  return (
    <div className={wrapper}>
      <form action='' className={auth}>
        <Input
          title='test'
          fluid
          placeholder='login'
          value={login}
          onChange={setLogin}
        />
        <Input
          title='test'
          fluid
          placeholder='pass'
          value={password}
          onChange={setPassword}
        />
        <Button fluid onClick={handleSignInClick}>
          Войти
        </Button>
      </form>
    </div>
  )
}
